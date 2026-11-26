import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import test from "node:test";
import { chromium, firefox, webkit } from "playwright";
import axe from "axe-core";

const base = process.env.POLYCHAT_TEST_URL ?? "http://127.0.0.1:3000";
const output = "artifacts/ux129";
const cases = [
  { name: "chromium-mobile-320", engine: chromium, width: 320, height: 720, mobile: true },
  { name: "chromium-mobile-390", engine: chromium, width: 390, height: 844, mobile: true },
  { name: "webkit-mobile-390", engine: webkit, width: 390, height: 844, mobile: true },
  { name: "chromium-desktop-1280", engine: chromium, width: 1280, height: 900, mobile: false },
  { name: "firefox-desktop-1280", engine: firefox, width: 1280, height: 900, mobile: false },
];

function luminance(rgb) {
  const values = rgb.match(/\d+/g).slice(0, 3).map(Number).map((value) => {
    const n = value / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

await mkdir(output, { recursive: true });

for (const entry of cases) {
  test(`129-${entry.name}: navigation, layout, keyboard, contrast and mocked login error`, async () => {
    const browser = await entry.engine.launch();
    let page;
    try {
      page = await browser.newPage({
        viewport: { width: entry.width, height: entry.height },
        ...(entry.mobile ? { isMobile: true, hasTouch: true } : {}),
      });
      console.log(`${entry.name}: browser ${browser.version()}, viewport ${entry.width}x${entry.height}`);
      await page.goto(base, { waitUntil: "networkidle" });
      await page.getByRole("link", { name: "Entrar", exact: true }).click();
      await page.waitForURL("**/login");
      const heading = page.getByRole("heading", { name: "Entrar no Polychat" });
      const username = page.getByLabel("Nome de usuário", { exact: true });
      const password = page.getByLabel("Senha", { exact: true });
      const submit = page.getByRole("button", { name: "Entrar", exact: true });
      await heading.waitFor();
      await page.screenshot({ path: `${output}/${entry.name}-01-login.png`, fullPage: true });
      assert.equal(await page.locator("html").getAttribute("lang"), "pt-BR");
      assert.equal(await username.getAttribute("autocomplete"), "username");
      assert.equal(await password.getAttribute("autocomplete"), "current-password");
      assert.equal(await password.getAttribute("type"), "password");
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "horizontal overflow");
      for (const element of [username, password, submit]) {
        const box = await element.boundingBox();
        assert.ok(box && box.width >= 24 && box.height >= 24, "target too small");
      }

      const colors = await username.evaluate((element) => ({
        border: getComputedStyle(element).borderTopColor,
        background: getComputedStyle(element.closest(".login-card")).backgroundColor,
      }));
      const borderRatio = contrast(colors.border, colors.background);
      console.log(`${entry.name}: input border contrast ${borderRatio.toFixed(2)}:1`);
      assert.ok(borderRatio >= 3, "input border contrast below 3:1");

      // Reload so the keyboard starts before the first focusable control.
      await page.reload({ waitUntil: "networkidle" });
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Voltar ao início");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.id), "username");
      const focus = await username.evaluate((element) => ({
        color: getComputedStyle(element).outlineColor,
        style: getComputedStyle(element).outlineStyle,
        width: parseFloat(getComputedStyle(element).outlineWidth),
        background: getComputedStyle(element.closest(".login-card")).backgroundColor,
      }));
      assert.ok(focus.style !== "none" && focus.width >= 2);
      assert.ok(contrast(focus.color, focus.background) >= 3);
      await page.screenshot({ path: `${output}/${entry.name}-02-keyboard-focus.png`, fullPage: true });
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.id), "password");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.tagName), "BUTTON");
      await page.keyboard.press("Shift+Tab");
      assert.equal(await page.evaluate(() => document.activeElement.id), "password");

      await page.addScriptTag({ content: axe.source });
      const scan = async () => page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        });
        return { violations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map((n) => n.target) })), incomplete: result.incomplete.map(({ id }) => id) };
      });
      const initial = await scan();
      console.log(`${entry.name}: initial axe ${JSON.stringify(initial)}`);

      // No genuine account or backend request: explicitly intercept the synthetic submission.
      let release;
      const gate = new Promise((resolve) => { release = resolve; });
      let requests = 0;
      await page.route("**/api/auth/login", async (route) => {
        requests++;
        assert.equal(route.request().method(), "POST");
        await gate;
        await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "Usuário ou senha inválidos." }) });
      });
      await username.fill("qa_sintetico");
      await password.fill("senha-ficticia");
      await submit.click();
      try {
        const loading = page.getByRole("button", { name: "Validando..." });
        await loading.waitFor();
        assert.ok(await loading.isDisabled());
        await page.screenshot({ path: `${output}/${entry.name}-03-loading-mock.png`, fullPage: true });
      } finally {
        release();
      }
      const alert = page.getByRole("alert").filter({ hasText: "Usuário ou senha inválidos." });
      await alert.waitFor();
      assert.equal(requests, 1);
      assert.ok(await submit.isEnabled());
      await page.screenshot({ path: `${output}/${entry.name}-04-error-mock.png`, fullPage: true });
      const errorScan = await scan();
      console.log(`${entry.name}: error axe ${JSON.stringify(errorScan)}`);
      assert.deepEqual(initial.violations, []);
      assert.deepEqual(errorScan.violations, []);
    } catch (error) {
      if (page) await page.screenshot({ path: `${output}/${entry.name}-FAIL.png`, fullPage: true }).catch(() => {});
      throw error;
    } finally {
      await browser.close();
    }
  });
}
