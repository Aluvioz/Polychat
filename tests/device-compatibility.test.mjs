import test from "node:test";
import assert from "node:assert/strict";
import { evaluateDeviceCompatibility } from "../src/auth/device-compatibility.mjs";

const userAgents = {
  androidChrome: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  iosSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  iosChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.0.0 Mobile/15E148 Safari/604.1",
  desktopChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  desktopEdge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
  desktopFirefox: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
  androidTablet: "Mozilla/5.0 (Linux; Android 14; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  ipad: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
};

test("permite User em Android com Chrome", () => {
  const result = evaluateDeviceCompatibility({ role: "user", userAgent: userAgents.androidChrome });
  assert.equal(result.compatible, true);
  assert.equal(result.device, "mobile");
  assert.equal(result.browser, "chrome");
  assert.equal(result.browserMajorVersion, 130);
});

test("permite User em iPhone com Safari ou Chrome", () => {
  for (const userAgent of [userAgents.iosSafari, userAgents.iosChrome]) {
    assert.equal(evaluateDeviceCompatibility({ role: "user", userAgent }).compatible, true);
  }
});

test("nega User em computador com a mensagem funcional exigida", () => {
  const result = evaluateDeviceCompatibility({ role: "user", userAgent: userAgents.desktopChrome });
  assert.equal(result.compatible, false);
  assert.equal(result.reason, "DEVICE_NOT_SUPPORTED");
  assert.equal(result.message, "só pode ser usado em celular");
});

test("permite TI em computador com Chrome, Edge ou Firefox", () => {
  for (const userAgent of [userAgents.desktopChrome, userAgents.desktopEdge, userAgents.desktopFirefox]) {
    assert.equal(evaluateDeviceCompatibility({ role: "ti", userAgent }).compatible, true);
  }
});

test("nega TI em celular", () => {
  const result = evaluateDeviceCompatibility({ role: "ti", userAgent: userAgents.androidChrome });
  assert.equal(result.compatible, false);
  assert.equal(result.reason, "DEVICE_NOT_SUPPORTED");
  assert.match(result.message, /computador/);
});

test("nega tablets para ambos os perfis", () => {
  for (const role of ["user", "ti"]) {
    const result = evaluateDeviceCompatibility({ role, userAgent: userAgents.androidTablet });
    assert.equal(result.compatible, false);
    assert.equal(result.reason, "TABLET_NOT_SUPPORTED");
  }
  assert.equal(evaluateDeviceCompatibility({ role: "user", userAgent: userAgents.ipad }).reason, "TABLET_NOT_SUPPORTED");
});

test("nega navegadores fora da lista homologada", () => {
  const firefoxMobile = "Mozilla/5.0 (Android 14; Mobile; rv:132.0) Gecko/132.0 Firefox/132.0";
  const safariDesktop = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15";
  assert.equal(evaluateDeviceCompatibility({ role: "user", userAgent: firefoxMobile }).reason, "BROWSER_NOT_SUPPORTED");
  assert.equal(evaluateDeviceCompatibility({ role: "ti", userAgent: safariDesktop }).reason, "BROWSER_NOT_SUPPORTED");
});

test("falha de forma compreensível para User-Agent ausente ou desconhecido", () => {
  const result = evaluateDeviceCompatibility({ role: "user", userAgent: "" });
  assert.equal(result.compatible, false);
  assert.equal(result.reason, "DEVICE_NOT_SUPPORTED");
  assert.match(result.message, /identificar/);
});

test("não aceita perfil desconhecido", () => {
  const result = evaluateDeviceCompatibility({ role: "admin", userAgent: userAgents.desktopChrome });
  assert.equal(result.compatible, false);
  assert.equal(result.reason, "INVALID_ROLE");
});
