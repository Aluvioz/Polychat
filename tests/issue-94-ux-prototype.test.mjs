import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html = readFileSync(new URL('../public/prototipos/issue-94/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/prototipos/issue-94/app.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../public/prototipos/issue-94/app.js', import.meta.url), 'utf8');

const screens = [...html.matchAll(/data-screen="([^"]+)"/g)].map(match => match[1]);
const destinations = [...html.matchAll(/data-go="([^"]+)"/g)].map(match => match[1]);
const actions = [...html.matchAll(/data-action="([^"]+)"/g)].map(match => match[1]);

test('o protótipo contém as áreas previstas para mobile e TI, sem telas extras', () => {
  assert.equal(new Set(screens).size, screens.length, 'IDs de telas duplicados');
  assert.deepEqual(screens, [
    'start', 'u-login', 'u-monitor', 'u-conversations', 'u-contacts',
    'u-chat', 'u-group', 'u-attach', 'u-empty', 'u-session',
    't-login', 't-dashboard', 't-users', 't-groups', 't-consult',
    't-alerts', 't-audit', 't-settings',
  ]);
});

test('cada destino de navegação aponta para uma tela existente', () => {
  const screenSet = new Set(screens);
  for (const destination of destinations) {
    assert.ok(screenSet.has(destination), 'Destino inexistente: ' + destination);
  }
  for (const id of screens) {
    assert.ok(id === 'start' || destinations.includes(id), 'Tela inatingível: ' + id);
  }
});

test('apenas a tela inicial é visível antes do JavaScript', () => {
  for (const id of screens) {
    const tag = html.match(new RegExp('<section\\b[^>]*data-screen="' + id + '"[^>]*>'))?.[0];
    assert.ok(tag, 'section ausente: ' + id);
    if (id === 'start') assert.doesNotMatch(tag, /\shidden(?:\s|>)/);
    else assert.match(tag, /\shidden(?:\s|>)/, 'tela ' + id + ' deve iniciar oculta');
  }
});

test('ações declaradas têm tratamento explícito', () => {
  const actionsSet = new Set([...js.matchAll(/'([a-z]+(?:-[a-z]+)*)':\s*'/g)].map(x => x[1]));
  actionsSet.add('offline');
  actionsSet.add('fail-message');
  for (const action of actions) assert.ok(actionsSet.has(action), 'Ação sem tratamento: ' + action);
});

test('rótulos e feedback de acessibilidade estão presentes', () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /href="#conteudo"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /<dialog\b/);
  assert.match(html, /<main id="conteudo"/);
  assert.match(css, /focus-visible/);
  assert.match(css, /forced-colors:active/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(js, /\.focus\(\)/);
});

test('avisa que não existe autenticação ou envio real', () => {
  assert.match(html, /Não há autenticação, servidor, envio real/);
  assert.match(html, /dados inventados/);
  assert.match(html, /Nenhuma alteração real será executada/);
  assert.doesNotMatch(js, /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\blocalStorage\b|\bsessionStorage\b/);
});

test('regras fundamentais de produto estão rastreáveis no protótipo', () => {
  for (const snippet of [
    'Sem cadastro público', 'Sem câmera', '10 MB por arquivo',
    '5 arquivos por mensagem', 'sem justificativa ou segunda aprovação',
    'revoga acesso imediato', 'até 1 hora', 'até 1 dia útil',
    'até 3 dias úteis', 'sem bloqueio automático'
  ]) assert.ok(html.toLocaleLowerCase('pt-BR').includes(snippet.toLocaleLowerCase('pt-BR')), snippet);
});
