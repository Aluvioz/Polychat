/* Issue #94 — testes reais no navegador Chromium com Playwright.
   Execução independente de npm test: instalar playwright e navegador via workflow.
   Apenas HTML local e dados fictícios. Não equivale a sessão com usuários reais. */
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';

const appUrl = new URL('../../public/prototipos/issue-94/index.html', import.meta.url).href;
const shots = new URL('../../artifacts/ux94/', import.meta.url);
const axeSource = readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
let browser;

before(async () => {
  browser = await chromium.launch({ headless: true });
  mkdirSync(new URL('.', shots), { recursive: true });
});
after(async () => {
  if (browser) await browser.close();
});

async function open(viewport = { width: 390, height: 844 }) {
  const page = await browser.newPage({ viewport });
  const unexpectedNetwork = [];
  page.on('request', req => {
    if (!req.url().startsWith('file:')) unexpectedNetwork.push(req.url());
  });
  const scriptErrors = [];
  page.on('pageerror', err => scriptErrors.push(err.message));
  await page.goto(appUrl);
  assert.equal(await page.locator('[data-screen="start"]').isVisible(), true);
  return { page, unexpectedNetwork, scriptErrors };
}
async function assertMobileTask(page, id, screen) {
  const section = page.locator('[data-screen="' + screen + '"]');
  assert.equal(await section.isVisible(), true, 'Tela não está visível: ' + screen);
  assert.equal(await section.getAttribute('data-task'), id, 'Rastreabilidade divergente para ' + id);
  assert.match(await section.locator('.eyebrow').first().innerText(), new RegExp('^' + id + ' ·'));
}
async function mobileLogin(page) {
  await page.locator('[data-screen="start"] [data-go="u-login"]').click();
  await assertMobileTask(page, 'U-01', 'u-login');
  await page.locator('[data-screen="u-login"] [data-go="u-monitor"]').click();
  assert.equal(await page.locator('[data-screen="u-monitor"]').isVisible(), true);
  assert.equal(await page.locator('[data-screen="u-monitor"]').getAttribute('data-task'), null);
  await page.locator('[data-screen="u-monitor"] [data-go="u-conversations"]').click();
  await assertMobileTask(page, 'U-02', 'u-conversations');
}
async function assertTiTask(page, id, screen) {
  const section = page.locator('[data-screen="' + screen + '"]');
  assert.equal(await section.isVisible(), true, 'Tela não está visível: ' + screen);
  assert.equal(await section.getAttribute('data-task'), id, 'Rastreabilidade incorreta de ' + id);
  assert.match(await section.locator('.eyebrow').innerText(), new RegExp('^' + id + ' ·'));
}
async function tiLogin(page) {
  await page.locator('[data-screen="start"] [data-go="t-login"]').click();
  await assertTiTask(page, 'T-01', 't-login');
  await page.locator('[data-screen="t-login"] [data-go="t-dashboard"]').click();
  assert.equal(await page.locator('[data-screen="t-dashboard"]').isVisible(), true);
  assert.equal(await page.locator('[data-screen="t-dashboard"]').getAttribute('data-task'), null);
}
async function verifyNoErrors(ctx) {
  assert.deepEqual(ctx.scriptErrors, [], 'Erros de JavaScript na página');
  assert.deepEqual(ctx.unexpectedNetwork, [], 'A demonstração não deve usar rede externa');
}

test('U-01/U-02: login fictício, erro genérico, aviso e conversas recentes', async () => {
  const ctx = await open();
  try {
    const { page } = ctx;
    await page.locator('[data-screen="start"] [data-go="u-login"]').click();
    await assertMobileTask(page, 'U-01', 'u-login');
    await page.locator('[data-action="bad-login"]').click();
    assert.match(await page.locator('#feedback').innerText(), /Não foi possível entrar/);
    await page.locator('[data-screen="u-login"] [data-go="u-monitor"]').click();
    assert.equal(await page.locator('[data-screen="u-monitor"]').getAttribute('data-task'), null);
    assert.match(await page.locator('[data-screen="u-monitor"]').innerText(), /aviso de monitoramento/i);
    await page.locator('[data-screen="u-monitor"] [data-go="u-conversations"]').click();
    await assertMobileTask(page, 'U-02', 'u-conversations');
    assert.match(await page.locator('[data-screen="u-conversations"]').innerText(), /2 mensagens não lidas|Conversas recentes/i);
    await page.screenshot({ path: new URL('mobile-conversas-390.png', shots).pathname, fullPage: true });
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});

test('U-03/U-04: busca, ausência de resultados, contatos corretos e grupo isolado', async () => {
  const ctx = await open();
  try {
    const { page } = ctx;
    await mobileLogin(page);
    await page.locator('[data-screen="u-conversations"] [data-go="u-contacts"]').click();
    await assertMobileTask(page, 'U-03', 'u-contacts');
    await page.locator('#contact-search').fill('inexistente');
    assert.equal(await page.locator('#contacts-empty').isVisible(), true);
    await page.locator('#contact-search').fill('Rafael');
    assert.equal(await page.locator('#contacts-empty').isVisible(), false);
    await page.locator('#contacts-list [data-user="Rafael (exemplo)"]').click();
    assert.equal(await page.locator('#u-chat-title').innerText(), 'Rafael (exemplo)');
    assert.match(await page.locator('#chat-messages').innerText(), /verificar os arquivos/);
    await page.locator('[data-screen="u-chat"] [data-go="u-conversations"]').click();
    await page.locator('[data-screen="u-conversations"] [data-chat="group"]').click();
    assert.equal(await page.locator('#u-chat-title').innerText(), 'Equipe técnica (exemplo)');
    assert.match(await page.locator('#chat-messages').innerText(), /Atualização de plantão/);
    assert.doesNotMatch(await page.locator('#chat-messages').innerText(), /verificar os arquivos/);
    await page.locator('#group-info-link').click();
    await assertMobileTask(page, 'U-04', 'u-group');
    assert.match(await page.locator('[data-screen="u-group"]').innerText(), /Somente a TI/);
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});

test('U-05/U-08: envio sem servidor, offline, falha e recuperação simulada', async () => {
  const ctx = await open();
  try {
    const { page } = ctx;
    await mobileLogin(page);
    await page.locator('[data-action="offline"]').click();
    assert.match(await page.locator('#feedback').innerText(), /Sem conexão/);
    await page.locator('[data-screen="u-conversations"] [data-chat="individual"]').click();
    await assertMobileTask(page, 'U-05', 'u-chat');
    assert.equal(await page.locator('#offline-indicator').isVisible(), true);
    await page.locator('[data-action="fail-message"]').click();
    await page.locator('[data-action="retry-message"]').click();
    assert.match(await page.locator('#feedback').innerText(), /Ainda sem conexão/);
    await page.locator('[data-screen="u-chat"] [data-go="u-conversations"]').click();
    await page.locator('[data-action="offline"]').click();
    await page.locator('[data-screen="u-conversations"] [data-chat="individual"]').click();
    await page.locator('[data-action="retry-message"]').click();
    assert.match(await page.locator('#feedback').innerText(), /Nenhuma mensagem foi transmitida/);
    await page.locator('#message-text').fill('Mensagem inteiramente fictícia');
    await page.locator('#message-form [type="submit"]').click();
    assert.match(await page.locator('#chat-messages').innerText(), /Mensagem inteiramente fictícia/);
    assert.match(await page.locator('#feedback').innerText(), /apenas simulado/);
    await page.locator('[data-screen="u-chat"] [data-go="u-conversations"]').click();
    await page.locator('[data-screen="u-conversations"] [data-go="u-session"]').click();
    await assertMobileTask(page, 'U-08', 'u-session');
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});

test('U-06/U-07: tipos, tamanho, quantidade, PDF com senha e scanner', async () => {
  const ctx = await open({ width: 320, height: 700 });
  try {
    const { page } = ctx;
    await mobileLogin(page);
    await page.locator('[data-screen="u-conversations"] [data-chat="individual"]').click();
    await page.locator('[data-screen="u-chat"] [data-go="u-attach"]').click();
    await assertMobileTask(page, 'U-06', 'u-attach');
    assert.match(await page.locator('[data-task="U-07"]').innerText(), /U-07 · ERROS E RECUPERAÇÃO DE ANEXOS/);
    for (const [action, expected] of [
      ['attach-invalid', /apenas PDF e JPEG/],
      ['attach-over-limit', /excede 10 MB/],
      ['attach-too-many', /até 5 anexos/],
      ['attach-protected', /protegido por senha/],
      ['attach-scanner-offline', /scanner indisponível/i],
      ['attach-blocked', /bloqueado/],
      ['attach-error', /Não foi possível enviar/],
      ['attach-retry', /Nenhum arquivo foi selecionado/]
    ]) {
      await page.locator('[data-action="' + action + '"]').click();
      assert.match(await page.locator('#feedback').innerText(), expected, action);
    }
    await page.screenshot({ path: new URL('mobile-anexos-320.png', shots).pathname, fullPage: true });
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});

test('T-01 acesso, T-02 contas e T-03 grupos (dashboard auxiliar): confirmação e foco', async () => {
  const ctx = await open({ width: 1280, height: 800 });
  try {
    const { page } = ctx;
    await tiLogin(page);
    await page.screenshot({ path: new URL('ti-dashboard-1280.png', shots).pathname, fullPage: true });
    await page.locator('#ti-menu [data-go="t-users"]').click();
    await assertTiTask(page, 'T-02', 't-users');
    await page.locator('#ti-user-search').fill('nada');
    assert.equal(await page.locator('#ti-users-empty').isVisible(), true);
    await page.locator('#ti-user-search').fill('');
    const disable = page.locator('[data-screen="t-users"] [data-confirm]');
    await disable.click();
    assert.equal(await page.locator('#confirm-dialog').isVisible(), true);
    await page.locator('#cancel-dialog').click();
    assert.equal(await page.locator('#confirm-dialog').isVisible(), false);
    assert.equal(await disable.evaluate(el => document.activeElement === el), true);
    await page.locator('#ti-menu [data-go="t-groups"]').click();
    await assertTiTask(page, 'T-03', 't-groups');
    await page.locator('[data-screen="t-groups"] [data-confirm]').click();
    assert.match(await page.locator('#dialog-description').innerText(), /revoga acesso imediato/i);
    await page.locator('#accept-dialog').click();
    assert.match(await page.locator('#feedback').innerText(), /Nenhum registro foi alterado/);
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});

test('T-04 consulta, T-05 alertas e T-06 configurações (auditoria auxiliar)', async () => {
  const ctx = await open({ width: 1280, height: 800 });
  try {
    const { page } = ctx;
    await tiLogin(page);
    await page.locator('#ti-menu [data-go="t-consult"]').click();
    await assertTiTask(page, 'T-04', 't-consult');
    assert.match(await page.locator('[data-screen="t-consult"]').innerText(), /sem justificativa ou segunda aprovação/);
    await page.locator('[data-action="view-chat"]').click();
    assert.match(await page.locator('#feedback').innerText(), /Consulta simulada/);
    await page.locator('#ti-menu [data-go="t-alerts"]').click();
    await assertTiTask(page, 'T-05', 't-alerts');
    assert.match(await page.locator('[data-screen="t-alerts"]').innerText(), /até 1 dia útil/);
    await page.locator('#ti-menu [data-go="t-settings"]').click();
    await assertTiTask(page, 'T-06', 't-settings');
    assert.match(await page.locator('[data-screen="t-settings"]').innerText(), /Termos e regras/);
    await page.locator('#ti-menu [data-go="t-audit"]').click();
    assert.equal(await page.locator('[data-screen="t-audit"]').getAttribute('data-task'), null);
    assert.match(await page.locator('[data-screen="t-audit"]').innerText(), /Simulação, não log/);
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});

test('teclado, foco de tela e ausência de overflow horizontal mobile 320/390', async () => {
  for (const width of [320, 390]) {
    const ctx = await open({ width, height: 700 });
    try {
      const { page } = ctx;
      await page.locator('.skip').focus();
      assert.equal(await page.locator('.skip').evaluate(el => document.activeElement === el), true);
      await page.locator('.skip').press('Enter');
      assert.equal(await page.locator('main').evaluate(el => document.activeElement === el), true);
      await mobileLogin(page);
      const mobile = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      assert.ok(mobile.scrollWidth <= mobile.viewport + 1, 'Overflow em ' + width + ': ' + JSON.stringify(mobile));
      assert.equal(await page.locator('[data-screen="u-conversations"] h1').evaluate(el => document.activeElement === el), true);
      await verifyNoErrors(ctx);
    } finally { await ctx.page.close(); }
  }
});

test('axe-core: WCAG 2.1 A/AA sem violações nas telas representativas', async () => {
  const ctx = await open({ width: 390, height: 844 });
  try {
    const { page } = ctx;
    await page.addScriptTag({ content: axeSource });
    async function audit(name) {
      const results = await page.evaluate(async () => window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
      }));
      const issues = results.violations.map(v => ({
        id: v.id, impact: v.impact, description: v.description,
        targets: v.nodes.map(n => n.target.join(' ')).slice(0, 8)
      }));
      assert.deepEqual(issues, [], 'axe WCAG em ' + name + ': ' + JSON.stringify(issues));
    }
    await audit('início');
    await mobileLogin(page);
    await audit('conversas');
    await page.locator('[data-screen="u-conversations"] [data-chat="individual"]').click();
    await audit('chat');
    await page.locator('[data-screen="u-chat"] [data-go="u-attach"]').click();
    await audit('anexos');
    await page.locator('[data-go="start"]').first().click();
    await tiLogin(page);
    await audit('TI dashboard');
    await page.locator('#ti-menu [data-go="t-users"]').click();
    await audit('TI usuários');
    await verifyNoErrors(ctx);
  } finally { await ctx.page.close(); }
});
