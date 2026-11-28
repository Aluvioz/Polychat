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
  actionsSet.add('retry-message');
  actionsSet.add('attach-retry');
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
    'Sem cadastro público', 'Sem câmera', '10 MiB (10.485.760 bytes) por arquivo',
    '5 arquivos por mensagem', 'sem justificativa ou segunda aprovação',
    'revoga acesso imediato', 'até 1 hora', 'até 1 dia útil',
    'até 3 dias úteis', 'sem bloqueio automático'
  ]) assert.ok(html.toLocaleLowerCase('pt-BR').includes(snippet.toLocaleLowerCase('pt-BR')), snippet);
});

test('estados de erro têm recuperação e busca sem resultados no código', () => {
  assert.match(html, /id="contacts-empty"/);
  assert.match(html, /id="ti-users-empty"/);
  assert.match(html, /id="offline-indicator"/);
  assert.match(html, /data-action="retry-message"/);
  assert.match(html, /data-action="attach-retry"/);
  assert.match(js, /pendingMessage = null/);
  assert.match(js, /contacts-empty'\)\.hidden/);
  assert.match(js, /ti-users-empty'\)\.hidden/);
});


test('rastreabilidade canônica TI T-01..T-06 acompanha o plano v0.3 da PR #152', () => {
  const canonical = [
    ['T-01', 't-login', 'ACESSO AO CONSOLE'],
    ['T-02', 't-users', 'CONSULTA DE CONTAS'],
    ['T-03', 't-groups', 'CRIAÇÃO E GESTÃO DE GRUPOS'],
    ['T-04', 't-consult', 'CONSULTA ADMINISTRATIVA'],
    ['T-05', 't-alerts', 'REVISÃO DE ALERTAS'],
    ['T-06', 't-settings', 'CONFIGURAÇÕES']
  ];
  const taskElements = [...html.matchAll(/<section\b[^>]*\bdata-screen="([^"]+)"[^>]*\bdata-task="(T-\d{2})"[^>]*>([\s\S]*?)(?=<\/section>)/g)]
    .map(([, screen, task, body]) => ({ screen, task, body }));
  assert.equal(taskElements.length, canonical.length, 'Exatamente seis telas canônicas, sem IDs extras ou duplicados');
  for (const [task, screen, label] of canonical) {
    const match = taskElements.find(item => item.task === task);
    assert.ok(match, 'Tarefa sem data-task: ' + task);
    assert.equal(match.screen, screen, 'Tela divergente para ' + task);
    assert.ok(match.body.includes(task + ' · ' + label), 'Rótulo divergente para ' + task);
  }
  for (const auxiliary of ['t-dashboard', 't-audit']) {
    assert.ok(!taskElements.some(item => item.screen === auxiliary), 'Apoio não pode criar tarefa T-07/T-08');
  }
});


test('rastreabilidade canônica mobile U-01..U-08 segue tarefas do plano #152', () => {
  const canonical = [
    ['U-01', 'u-login', 'ACESSO'],
    ['U-02', 'u-conversations', 'LOCALIZAR CONVERSA RECENTE'],
    ['U-03', 'u-contacts', 'INICIAR CONVERSA INDIVIDUAL'],
    ['U-04', 'u-group', 'CONSULTAR GRUPO'],
    ['U-05', 'u-chat', 'MENSAGEM E FEEDBACK'],
    ['U-06', 'u-attach', 'ANEXAR PDF OU JPEG'],
    ['U-08', 'u-session', 'SESSÃO EXPIRADA OU DESCONECTADA']
  ];
  const screensWithTask = [...html.matchAll(/<section\b[^>]*\bdata-screen="([^"]+)"[^>]*\bdata-task="(U-\d{2})"[^>]*>([\s\S]*?)(?=<\/section>)/g)]
    .map(([, screen, task, body]) => ({ screen, task, body }));
  assert.equal(screensWithTask.length, canonical.length, 'Sete telas canônicas: U-07 é um estado de erro dentro de U-06');
  for (const [task, screen, label] of canonical) {
    const match = screensWithTask.find(item => item.task === task);
    assert.ok(match, 'Tarefa mobile não encontrada: ' + task);
    assert.equal(match.screen, screen, 'Mapeamento de tela divergente: ' + task);
    assert.ok(match.body.includes(task + ' · ' + label), 'Rótulo visível divergente: ' + task);
  }
  for (const auxiliary of ['u-monitor', 'u-empty']) {
    assert.ok(!screensWithTask.some(item => item.screen === auxiliary), 'Auxiliar não pode consumir código U-01..08');
  }
  const u07 = html.match(/<p\b[^>]*\bdata-task="U-07"[^>]*>([^<]+)<\/p>/g) || [];
  assert.equal(u07.length, 1, 'U-07 deve identificar uma única seção de erros no seletor de anexos');
  assert.match(u07[0], /U-07 · ERROS E RECUPERAÇÃO DE ANEXOS/);
  assert.equal((html.match(/data-task="U-\d{2}"/g) || []).length, 8, 'Exatamente 8 marcadores de tarefa mobile');
});
