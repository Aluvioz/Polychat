/**
 * Device compatibility policy for the User/TI experience.
 *
 * User-Agent is client-controlled and may be reduced or spoofed. This module
 * provides compatibility guidance only; it must never grant identity,
 * permissions, or access to protected data.
 */

const USER_BROWSERS = new Set(["chrome", "safari"]);
const TI_BROWSERS = new Set(["chrome", "edge", "firefox"]);

function detectDevice(userAgent) {
  if (/(iPad|Tablet|PlayBook|Silk)/i.test(userAgent) ||
      (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))) {
    return "tablet";
  }

  if (/(iPhone|iPod|Android.*Mobile|Mobile.*Android)/i.test(userAgent)) {
    return "mobile";
  }

  if (/(Windows NT|Macintosh|Mac OS X|X11|Linux x86_64|CrOS)/i.test(userAgent)) {
    return "desktop";
  }

  return "unknown";
}

function detectBrowser(userAgent) {
  // Samsung Internet includes Chrome in its User-Agent. Identify it first so
  // it cannot be mistaken for the explicitly homologated Google Chrome.
  const samsungInternet = userAgent.match(/SamsungBrowser\/([0-9]+)/i);
  if (samsungInternet) {
    return { name: "samsung-internet", majorVersion: Number(samsungInternet[1]) };
  }

  const patterns = [
    ["edge", /Edg(?:A|iOS)?\/([0-9]+)/i],
    ["firefox", /(?:Firefox|FxiOS)\/([0-9]+)/i],
    ["chrome", /(?:Chrome|CriOS)\/([0-9]+)/i],
    ["safari", /Version\/([0-9]+).*Safari/i],
  ];

  for (const [name, pattern] of patterns) {
    const match = userAgent.match(pattern);
    if (match) return { name, majorVersion: Number(match[1]) };
  }

  return { name: "unknown", majorVersion: null };
}

function messageFor({ role, device, browser }) {
  if (device === "tablet") {
    return "O Polychat não permite acesso por tablets. Use celular no perfil Usuário ou computador no perfil TI.";
  }

  if (role === "user" && device === "desktop") {
    return "só pode ser usado em celular";
  }

  if (role === "ti" && device === "mobile") {
    return "O console de TI só pode ser usado em computador.";
  }

  if (device === "unknown") {
    return "Não foi possível identificar o tipo de dispositivo. Acesse pelo dispositivo permitido para seu perfil.";
  }

  if (browser === "unknown") {
    return role === "user"
      ? "Navegador não homologado. Use Chrome ou Safari móvel atualizado."
      : "Navegador não homologado. Use Chrome, Edge ou Firefox atualizado no computador.";
  }

  return role === "user"
    ? "Navegador não homologado. Use Chrome ou Safari móvel atualizado."
    : "Navegador não homologado. Use Chrome, Edge ou Firefox atualizado no computador.";
}

/**
 * Evaluates the documented RN-015 compatibility rules for an authenticated
 * profile. No minimum browser version is enforced because the repository does
 * not define a numeric support floor; callers should communicate 'atualizado'.
 */
export function evaluateDeviceCompatibility({ role, userAgent }) {
  if (!["user", "ti"].includes(role)) {
    return {
      compatible: false,
      device: "unknown",
      browser: "unknown",
      browserMajorVersion: null,
      reason: "INVALID_ROLE",
      message: "Perfil sem autorização.",
    };
  }

  const normalizedUserAgent = typeof userAgent === "string" ? userAgent : "";
  const device = detectDevice(normalizedUserAgent);
  const browser = detectBrowser(normalizedUserAgent).name;
  const browserMajorVersion = detectBrowser(normalizedUserAgent).majorVersion;
  const allowedBrowsers = role === "user" ? USER_BROWSERS : TI_BROWSERS;
  const expectedDevice = role === "user" ? "mobile" : "desktop";

  let reason = null;
  if (device === "tablet") reason = "TABLET_NOT_SUPPORTED";
  else if (device !== expectedDevice) reason = "DEVICE_NOT_SUPPORTED";
  else if (!allowedBrowsers.has(browser)) reason = "BROWSER_NOT_SUPPORTED";

  const result = {
    compatible: reason === null,
    device,
    browser,
    browserMajorVersion,
    reason: reason ?? "SUPPORTED",
  };

  if (!result.compatible) {
    result.message = messageFor({ role, device, browser });
  }

  return result;
}
