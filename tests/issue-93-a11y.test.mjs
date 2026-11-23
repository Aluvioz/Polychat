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
    ['#00095b','#ffffff'],['#00142e','#ffffff'],['#ffffff','#066fef'],
    ['#0f0f0f','#ffffff'],['#64748b','#ffffff'],['#475569','#ffffff'],
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

test('logo Ford standalone usa limite responsivo e CSS sincronizado', () => {
  assert.match(html, /\.pc-ford-mark\s*\{/);
  assert.match(html, /width:104px;height:auto;max-height:42px/);
  assert.match(html, /\.pc-brand-lockup\s*\{/);
  assert.match(css, /\.pc-ford-mark\s*\{/);
});

 
// Auditoria estatica incremental: cores efetivamente declaradas nas classes e tokens da galeria.
// NAO substitui inspecao renderizada, zoom, tecnologias assistivas ou QA independente.
function token(name) {
  const value = css.match(new RegExp('--' + name + ':\\s*(#[0-9a-f]{6})\\b', 'i'))?.[1];
  assert.ok(value, 'Token não encontrado: ' + name);
  return value;
}
function classRule(name) {
  const escaped = name.replaceAll('-', '\\-');
  const match = css.match(new RegExp('\\.' + escaped + '\\s*\\{([^}]+)\\}'));
  assert.ok(match, 'Classe não encontrada: ' + name);
  return match[1];
}
test('tokens e estilos de cada galeria permanecem sincronizados', () => {
  const embedded = html.match(/<style>\s*([\s\S]*?)\s*<\/style>/)?.[1];
  assert.ok(embedded, 'CSS standalone ausente');
  assert.equal(embedded.trim(), css.trim(), 'CSS standalone diferente da fonte');
  assert.equal(publicCss, css, 'CSS público diferente da fonte');
});
test('contraste textual das variantes presentes, inclusive hover, atende 4,5:1', () => {
  for (const [name, fore, back] of [
    ['texto principal', token('pc-ink'), token('pc-surface')],
    ['texto secundário', token('pc-text-secondary'), token('pc-surface')],
    ['texto muted', token('pc-text-muted'), token('pc-surface')],
    ['primário', '#ffffff', token('pc-brand-700')],
    ['primário hover', '#ffffff', token('pc-brand-900')],
    ['secundário', token('pc-brand-700'), '#ffffff'],
    ['secundário hover', token('pc-brand-700'), token('pc-brand-050')],
    ['perigo', '#ffffff', token('pc-error')],
    ['aviso sucesso', token('pc-text-secondary'), '#eaf7f0'],
    ['aviso erro', token('pc-text-secondary'), '#fef3f2'],
    ['aviso atenção', token('pc-text-secondary'), token('pc-warning-bg')],
    ['badge sucesso', token('pc-success'), '#ffffff'],
    ['badge pendente', token('pc-warning-text'), token('pc-warning-bg')],
    ['Skyview com branco (referência)', '#ffffff', token('pc-brand-600')],
  ]) assert.ok(contrast(fore,back) >= 4.5, name + ': ' + contrast(fore,back).toFixed(2));
  assert.match(classRule('pc-button-primary'), /background:var\(--pc-brand-700\);color:white/);
  assert.match(classRule('pc-button-secondary'), /color:var\(--pc-brand-700\)/);
  assert.match(classRule('pc-button-danger'), /background:var\(--pc-error\);color:white/);
});
test('contraste não textual de controles essenciais, foco e estados, mínimo 3:1', () => {
  for (const [name, fore, back] of [
    ['input', token('pc-border'), '#ffffff'],
    ['input inválido', token('pc-error'), '#ffffff'],
    ['foco sobre branco', token('pc-focus'), '#ffffff'],
    ['foco sobre cinza', token('pc-focus'), token('pc-background')],
    ['foco em botão primário', token('pc-focus'), token('pc-brand-700')],
    ['borda secundária', token('pc-brand-700'), '#ffffff'],
    ['aviso sucesso', token('pc-success'), '#eaf7f0'],
    ['aviso erro', token('pc-error'), '#fef3f2'],
    ['aviso atenção', token('pc-warning-text'), token('pc-warning-bg')],
    ['badge padrão', token('pc-border'), '#ffffff'],
  ]) assert.ok(contrast(fore,back) >= 3, name + ': ' + contrast(fore,back).toFixed(2));
  assert.match(css, /:focus-visible\{outline:3px solid var\(--pc-focus\)/);
  assert.match(classRule('pc-button'), /min-height:44px/);
  assert.match(css, /\.pc-field input,\.pc-field select,\.pc-field textarea\{/);
});
test('controle desativado é exceção de contraste e não deve criar falso FAIL', () => {
  assert.match(css, /\.pc-button:disabled\{background:var\(--pc-disabled-bg\);color:var\(--pc-disabled-ink\)/);
  assert.ok(contrast(token('pc-disabled-ink'), token('pc-disabled-bg')) >= 1);
});
