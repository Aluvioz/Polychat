import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../docs/ux/issue-93-galeria-standalone.html', import.meta.url), 'utf8');
const demo = readFileSync(new URL('../docs/ux/issue-93-galeria.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../docs/ux/issue-93-design-tokens.css', import.meta.url), 'utf8');
const publicHtml = readFileSync(new URL('../public/design-system/issue-93-galeria.html', import.meta.url), 'utf8');
const publicCss = readFileSync(new URL('../public/design-system/issue-93-design-tokens.css', import.meta.url), 'utf8');

test('HTML tem idioma, viewport e main identificável', () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<main[^>]*id="conteudo"/);
  assert.match(html, /href="#conteudo"/);
});
test('todos os campos demonstrativos estão associados aos rótulos', () => {
  const inputs = [...html.matchAll(/<input\b[^>]*\bid="([^"]+)"/g)].map(x => x[1]);
  assert.ok(inputs.length >= 3);
  for (const id of inputs) assert.ok(html.includes('for="' + id + '"'), 'label ausente: ' + id);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="fileerror"/);
  assert.match(html, /id="fileerror"/);
});
test('mensagens de erro/status e foco visível têm representação textual', () => {
  assert.match(html, /role="alert"/);
  assert.match(html, /role="status"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.pc-skip-link:focus/);
});
test('demo de confirmação não simula uma ação de segurança funcional', () => {
  const section = html.match(/<div class="pc-modal-demo"[\s\S]*?<\/div>/)?.[0];
  assert.ok(section, 'demo de confirmação ausente');
  assert.doesNotMatch(section, /<button\b/);
  assert.match(section, /não funcional/);
});
test('tamanhos responsivos e modo de contraste forçado estão especificados', () => {
  assert.match(css, /min-height:44px/);
  assert.match(css, /max-width:860px/);
  assert.match(css, /max-width:560px/);
  assert.match(css, /max-width:420px/);
  assert.match(css, /forced-colors:active/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
test('galeria independente inclui CSS, e página pública tem CSS correspondente', () => {
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /<link[^>]*rel="stylesheet"/);
  assert.match(demo, /issue-93-design-tokens\.css/);
  assert.match(publicHtml, /issue-93-design-tokens\.css/);
  assert.equal(publicCss, css, 'tokens públicos devem corresponder ao CSS documentado');
});
function luminance(hex) {
  const channels = hex.replace('#', '').match(/.{2}/g).map(v => {
    const x = parseInt(v,16) / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055)/1.055)**2.4;
  });
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(fg,bg) {
  const a=luminance(fg), b=luminance(bg);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
test('pares textuais demonstrativos possuem contraste WCAG AA normal', () => {
  for (const [fg,bg] of [
    ['#003478','#ffffff'],['#001f4d','#ffffff'],['#1769aa','#ffffff'],
    ['#10243e','#ffffff'],['#64748b','#ffffff'],['#475569','#ffffff'],
    ['#027a48','#ffffff'],['#b42318','#ffffff']
  ]) assert.ok(contrast(fg,bg) >= 4.5, fg + '/' + bg + ' = ' + contrast(fg,bg).toFixed(2));
});
// LIMITAÇÃO: são verificações estáticas. Não substituem navegação por teclado
// no navegador, zoom/reflow, leitores de tela, nem contraste não textual.

test('bordas essenciais, foco e erro cumprem contraste nao textual minimo 3:1', () => {
  const border = css.match(/--pc-border:\s*(#[0-9a-f]{6})/i)?.[1];
  const focus = css.match(/--pc-focus:\s*(#[0-9a-f]{6})/i)?.[1];
  const error = css.match(/--pc-error:\s*(#[0-9a-f]{6})/i)?.[1];
  assert.ok(border && focus && error, 'tokens de contraste não encontrados');
  for (const [name, fg, bg] of [
    ['borda input sobre branco', border, '#ffffff'],
    ['foco sobre branco', focus, '#ffffff'],
    ['foco sobre fundo cinza', focus, '#f0f0f0'],
    ['borda de erro sobre branco', error, '#ffffff'],
    ['borda de erro em aviso', error, '#fef3f2'],
  ]) assert.ok(contrast(fg,bg) >= 3, name + ': ' + contrast(fg,bg).toFixed(2) + ':1');
});
