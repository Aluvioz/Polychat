/* Issue #94 — Simulação local de usabilidade. Nunca executa ações reais.
   Todos os registros existem apenas na memória desta aba e desaparecem no reload. */
(() => {
  'use strict';

  const validScreens = new Map(
    Array.from(document.querySelectorAll('[data-screen]')).map(node => [node.dataset.screen, node])
  );
  const main = document.getElementById('conteudo');
  const tiMenu = document.getElementById('ti-menu');
  const feedback = document.getElementById('feedback');
  const dialog = document.getElementById('confirm-dialog');
  const dialogText = document.getElementById('dialog-description');
  const cancelDialog = document.getElementById('cancel-dialog');
  const acceptDialog = document.getElementById('accept-dialog');

  let current = 'start';
  let chatKind = 'individual';
  let offline = false;
  let confirmOrigin = null;
  let pendingMessage = null;
  let feedbackTimer = null;

  function flash(message) {
    window.clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.hidden = false;
    feedbackTimer = window.setTimeout(() => {
      feedback.hidden = true;
    }, 12000);
  }

  function screenMode(id) {
    if (id.startsWith('u-')) return 'mobile';
    if (id.startsWith('t-')) return 'ti';
    return 'start';
  }

  function activate(id) {
    if (!validScreens.has(id)) return;
    current = id;
    for (const [key, screen] of validScreens) screen.hidden = key !== id;

    const mode = screenMode(id);
    document.body.dataset.mode = mode;
    tiMenu.hidden = mode !== 'ti' || id === 't-login';
    for (const button of tiMenu.querySelectorAll('[data-go]')) {
      if (button.dataset.go === id) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
    if (id === 'u-chat') updateChatHeader();

    feedback.hidden = true;
    window.clearTimeout(feedbackTimer);
    const title = validScreens.get(id).querySelector('h1');
    if (title) {
      document.title = title.textContent + ' — Polychat UX #94';
      title.setAttribute('tabindex', '-1');
      title.focus();
    } else main.focus();
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  function updateChatHeader() {
    const name = chatKind === 'group' ? 'Equipe técnica (exemplo)' : 'Marina (exemplo)';
    document.getElementById('u-chat-title').textContent = name;
    document.getElementById('chat-kind').textContent =
      chatKind === 'group' ? 'Grupo fictício · autorizado aos membros' : 'Conversa individual · dados fictícios';
    document.getElementById('group-info-link').hidden = chatKind !== 'group';
  }

  function appendMessage(text, failed = false) {
    const paragraph = document.createElement('p');
    paragraph.className = 'bubble outgoing' + (failed ? ' failed' : '');
    paragraph.textContent = text;
    const label = document.createElement('small');
    label.textContent = failed ? 'Não enviado · simulação' : 'Exemplo de mensagem · não entregue';
    paragraph.appendChild(label);
    const list = document.getElementById('chat-messages');
    list.appendChild(paragraph);
    list.scrollTop = list.scrollHeight;
  }

  const messages = {
    'bad-login': 'Não foi possível entrar. Verifique os dados e tente novamente. Erro fictício; não houve autenticação.',
    'attach-valid': 'Arquivo permitido neste exemplo. Nenhum arquivo foi acessado, carregado ou enviado.',
    'attach-invalid': 'Arquivo inválido: apenas PDF e JPEG são permitidos. Nenhum upload foi iniciado.',
    'attach-error': 'Não foi possível enviar o arquivo fictício. A pessoa pode tentar novamente; nada foi enviado.',
    'attach-blocked': 'Anexo fictício bloqueado na verificação. O usuário não pode liberá-lo pela interface.',
    'reset-user': 'Etapa de redefinição simulada. Nenhuma credencial foi alterada.',
    'create-user': 'Provisionamento simulado. Nenhuma conta foi criada.',
    'add-member': 'Inclusão simulada. Nenhuma permissão foi concedida.',
    'create-group': 'Criação simulada. Nenhum grupo foi criado.',
    'view-chat': 'Consulta simulada. No produto real, ela seria autorizada e auditada no servidor.',
    'export-chat': 'Exportação simulada. Nenhum arquivo ou dado real foi produzido.',
    'edit-message': 'Edição administrativa simulada. Nenhuma mensagem real foi alterada.',
    'review-alert': 'Contexto fictício disponível; revisão humana não causa bloqueio automático.',
    'terms': 'Alteração de lista de termos simulada. Nenhuma configuração foi salva.',
    'access-denied': 'Acesso negado (exemplo). Solicite orientação à TI. Não foi avaliada autorização real.'
  };

  function runAction(action) {
    if (action === 'offline') {
      offline = !offline;
      flash(offline
        ? 'Sem conexão (exemplo). O histórico permanece visível; mensagens não podem ser confirmadas.'
        : 'Conexão demonstrativa restaurada. Não houve comunicação com servidor.');
      return;
    }
    if (action === 'fail-message') {
      pendingMessage = 'Mensagem não confirmada (exemplo)';
      appendMessage(pendingMessage, true);
      flash('Falha simulada no envio. Tente novamente apenas em uma demonstração; não há entrega real.');
      return;
    }
    if (Object.prototype.hasOwnProperty.call(messages, action)) {
      flash(messages[action]);
    }
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.chat === 'group' || button.dataset.chat === 'individual') {
      chatKind = button.dataset.chat;
    }
    if (button.dataset.go) {
      activate(button.dataset.go);
      return;
    }
    if (button.dataset.action) {
      runAction(button.dataset.action);
      return;
    }
    if (button.dataset.confirm) {
      confirmOrigin = button;
      dialogText.textContent = button.dataset.confirm;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else flash('Confirmação demonstrativa indisponível neste navegador.');
    }
  });

  cancelDialog.addEventListener('click', () => dialog.close('cancel'));
  acceptDialog.addEventListener('click', () => {
    dialog.close('confirm');
    flash('Confirmação demonstrativa concluída. Nenhum registro foi alterado e nenhuma operação foi enviada.');
  });
  dialog.addEventListener('close', () => {
    if (confirmOrigin && document.contains(confirmOrigin)) confirmOrigin.focus();
    confirmOrigin = null;
  });

  document.getElementById('message-form').addEventListener('submit', event => {
    event.preventDefault();
    const field = document.getElementById('message-text');
    const text = field.value.trim();
    if (!text) {
      flash('Escreva uma mensagem fictícia para testar o campo.');
      field.focus();
      return;
    }
    appendMessage(text, offline);
    field.value = '';
    flash(offline
      ? 'Sem conexão. Mensagem fictícia não confirmada; no produto real exigiria recuperação.'
      : 'Envio apenas simulado. Nenhuma mensagem foi transmitida, gravada ou entregue.');
  });

  document.getElementById('contact-search').addEventListener('input', event => {
    const query = event.target.value.trim().toLocaleLowerCase('pt-BR');
    for (const li of document.querySelectorAll('#contacts-list li')) {
      li.hidden = !li.textContent.toLocaleLowerCase('pt-BR').includes(query);
    }
  });

  document.getElementById('ti-user-search').addEventListener('input', event => {
    const q = event.target.value.trim().toLocaleLowerCase('pt-BR');
    for (const tr of document.querySelectorAll('[data-screen="t-users"] tbody tr')) {
      tr.hidden = !tr.textContent.toLocaleLowerCase('pt-BR').includes(q);
    }
  });

  activate('start');
})();
