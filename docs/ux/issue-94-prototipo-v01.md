# Issue #94 — Protótipo navegável exploratório v0.1

**Proposta:** UX/UI, branch feat/ponde-issue-94-prototipo-ux  
**Estado:** demonstração pronta para revisão; sessões com participantes NÃO realizadas  
**Issue:** https://github.com/Aluvioz/Polychat/issues/94  
**Plano-base aprovado:** PR #152, `docs/ux/issue-94-plano-validacao-ux.md`, v0.3 (24/11/2026), aprovado documentalmente por PO/SQA e integrado à `main`  
**Base:** #91 (mobile), #92 (TI), POLY-UX-DEC-001 (Q-018/Q-019)

## 1. Abrir

- Arquivo principal: [index.html](../../public/prototipos/issue-94/index.html).
- Dependências locais: [app.css](../../public/prototipos/issue-94/app.css) e [app.js](../../public/prototipos/issue-94/app.js). Manter os **três arquivos juntos**.
- No servidor Next.js local: executar npm install e npm run dev; visitar http://localhost:3000/prototipos/issue-94/index.html.
- Fora do servidor: baixar os três arquivos da mesma versão e abrir index.html localmente (file://). Baixar apenas HTML não é suficiente.
- Em preview autorizado, a rota poderá ser aberta no ambiente correspondente; **não foi verificada uma publicação remota**.
- Clicar em Usuário mobile ou TI desktop. A opção Escolher perfil reinicia a jornada.

**Não inserir credenciais, informações pessoais, arquivos reais ou dados da FORD.** O protótipo usa dados inventados, não faz chamadas HTTP, não autentica, não grava mensagens, não envia arquivos e não executa ações administrativas.

## 2. Objetivo e limites

Este é um artefato **adicional** aos wireframes Miro de baixa fidelidade aceitos nas #91/#92, voltado à inspeção de navegação, rótulos e feedback. O plano v0.3 da PR #152 mantém os **wireframes estáticos como instrumento principal**. Em review formal de 26/11/2026, o PO autorizou o protótipo clicável somente como **complemento opcional**, após a tarefa estática e com registros separados. A reavaliação independente do SQA continua pendente; até sua manifestação, não presumir aprovação SQA para uso em sessões. Consultar o [registro de decisão](./issue-94-decisao-metodologica-proposta.md). **Interação de demonstrador não equivale a função pronta**.

Paleta provisória Q-019 (azuis Ford e neutros), **sem Ford Oval** ou fontes proprietárias. Sem Supabase, Vercel API, autenticação, sessão, autorização/RLS, auditoria real, upload, antimalware, Realtime, persistência ou E2E. A restrição mobile/desktop é mostrada visualmente, não aplicada como controle de dispositivo ou segurança.

## 3. Rastreabilidade com as tarefas da PR #152

| Tarefa | Telas/fluxo exploratório | Critério de observação |
|---|---|---|
| U-01: iniciar acesso | start → u-login | Entrada e rótulos |
| U-02: localizar conversa recente | u-conversations (após u-monitor auxiliar) | Lista, não lidas e reconhecimento da conversa |
| U-03: iniciar conversa individual | u-conversations → u-contacts → u-chat compartilhado | Busca contextual, sem aba Contatos |
| U-04: localizar grupo | u-conversations → u-chat (grupo) → u-group | Identificação de grupo, consulta e participantes |
| U-05: envio/feedback | u-chat | Entendimento de sucesso/falha **simulados** |
| U-06: anexo | u-chat → u-attach | PDF/JPEG, até 10 MiB (10.485.760 bytes) por arquivo, até 5 anexos |
| U-07: anexo inválido ou falha | bloco de estados de erro com `data-task=U-07` em u-attach | Diferenciar inválido, falha, bloqueio e recuperação |
| U-08: sessão expirada ou desconexão | u-session e ação offline em u-conversations/u-chat | Recuperação e limites sem prometer entrega |
| T-01: acessar console TI | start → t-login → t-dashboard (apoio) | Acesso e localização da área de trabalho |
| T-02: localizar conta | t-users | Buscar conta e distinguir consulta/alteração simuladas |
| T-03: criar grupo e incluir participantes | t-groups | Identificar fluxo e participantes; exemplos de gestão simulada |
| T-04: consulta administrativa de conversa | t-consult | Consulta por TI sem justificativa/segunda aprovação, com auditoria prevista |
| T-05: revisar alerta | t-alerts | Severidade, prazo e revisão sem bloqueio automático |
| T-06: localizar configurações | t-settings | Apenas termos/regras e quotas de anexos |

O `t-dashboard` é **etapa de apoio a T-01**, e `t-audit` é **tela auxiliar de governança**: nenhuma dessas telas cria novas tarefas T-07 ou T-08 no roteiro aprovado. Permanecem também estados vazios e de sessão expirada. O catálogo é subordinado à Q-018; não amplia o produto.

## 4. Pré-condições para recrutar ou coletar

A PR #152, com o plano v0.3, **foi aprovada documentalmente por PO/SQA e integrada à `main`**. O PO também registrou decisão específica favorável ao uso complementar e opcional do clicável, mantendo os wireframes como instrumento principal; a reavaliação independente do SQA permanece pendente. Distinguir duas atividades:

**Simulação interna por papéis:** aceite limitado do PO registrado; requer voluntários, informação e consentimento, dados exclusivamente fictícios, acesso restrito e armazenamento controlado. Não apresentar voluntários como funcionários FORD, não usar dados corporativos e não gravar por padrão. Seguir os gates do [kit de registros](./issue-94-kit-registros-sessoes.md) e aguardar a manifestação independente do SQA sobre o protocolo.

**Pesquisa institucional com funcionários ou dados FORD:** não enviar convites nem coletar dados até documentar:

1. autorização FORD para recrutamento/coleta, escopo e responsável;
2. quem recruta, facilita, observa e guarda registros;
3. armazenamento autorizado, acesso e prazo/critério de retenção;
4. informação/consentimento e gravação somente se expressamente autorizada;
5. versão fixa de protótipo, roteiro e instrumento de registro.

Amostras planejadas na PR #152: **P-U, 5–8 pessoas do universo de 25 usuários finais do setor técnico, incluindo pré-testes**; **P-TI, aproximadamente 2–3 administradores TI elegíveis/disponíveis**, incluindo eventuais pré-testes, sem completar 5–8 artificialmente. As trilhas são separadas. Até o momento **nenhuma sessão foi executada por esta entrega**.

## 5. Registros e achados

Preencher o [kit de registros](./issue-94-kit-registros-sessoes.md) apenas após autorização e execução real. Por tarefa: resultado sem/com ajuda/não concluída, erros, hesitações, ajuda, facilidade percebida (1–7) e compreensão do feedback; notas anonimizadas. Classificar S1 (crítico), S2 (alto), S3 (médio), S4 (baixo); riscos S1 devem ser escalados imediatamente. Separar fato observado, interpretação e sugestão.

Para ajustes posteriores: ID do achado, tela, versão antes/depois, justificativa, autor da mudança e parecer registrado. Não inventar resultados ou contagens de participantes.

## 6. Verificação e revisão

- Testes estáticos: [tests/issue-94-ux-prototype.test.mjs](../../tests/issue-94-ux-prototype.test.mjs), executáveis via npm test; validam telas, destinos, ações simuladas e avisos, não comportamento real de navegador.
- QA humano: abrir o HTML, testar sequência Tab/Shift+Tab, mobile 320/390px e desktop, foco, diálogos, zoom e leitor de tela. Registrar navegador, versão e observações reais. Não presumir PASS.
- Decisões do PO sobre escopo, uso complementar do clicável e simulação interna por papéis estão registradas na PR #164 em 26/11/2026. Não solicitar nova deliberação PO sobre os mesmos pontos sem fato novo.
- Revisão independente pendente: Dante/SQA (método, evidências e inspeção humana); UI/UX deve executar a inspeção do checklist. Tech Lead somente se uma correção alterar aspectos técnicos relevantes. Conformidade funcional e acessibilidade de produção pertencem às issues de implementação/#129.
- A aprovação documental do plano v0.3 não equivale, isoladamente, à aprovação técnica deste protótipo; o aceite técnico restrito do Tech Lead e a decisão do PO estão registrados, mas a aprovação SQA permanece pendente.

## 7. Aceite da #94 — posição atual

| Critério | Situação |
|---|---|
| Protótipo clicável de duas trilhas | **Entregue para revisão** |
| Plano | PR #152, v0.3 **aprovado documentalmente por PO/SQA e integrado à `main`** |
| Decisão do PO | **REGISTRADA** em 26/11/2026: clicável opcional como complemento; simulação interna por papéis aceita como evidência limitada |
| Reavaliação metodológica SQA | **PENDENTE**; wireframes estáticos permanecem baseline aprovada até a manifestação independente |
| Governança/autorização de coleta | **PENDENTE FORD** |
| Sessões com participantes | **NÃO REALIZADAS** |
| Achados reais e priorização | **NÃO DISPONÍVEIS** |
| Protótipo modificado a partir de achados | **PENDENTE** |
| Aprovações e revisão PR | **PENDENTES** |
| Ausência de regressão | **Verificações estáticas/CI ainda a conferir; avaliação independente pendente** |

Não fechar a issue #94, prometer homologação nem retirar o Draft apenas pela existência dos artefatos.

## 8. Complemento de QA automatizado e governança FORD v2

Esta versão de revisão incorpora:

- [Matriz de aderência do protótipo ao questionário FORD v2](./issue-94-matriz-aderencia-ford-v2.md): Q1–Q34, representação no protótipo, lacunas e limites.
- [Checklist de inspeção manual por UX/SQA](./issue-94-checklist-inspecao-manual.md): navegação, confirmação, foco, zoom, navegadores e leitores de tela; inicialmente sem execução registrada.
- [Minuta de autorização institucional](./issue-94-minuta-autorizacao-institucional.md): **não enviada** e sem aprovação presumida.
- [Testes reais de navegação em Chromium](../../tests/browser/issue-94-browser.test.mjs), executados pelo [workflow de browser](../../.github/workflows/issue-94-browser.yml) quando a PR é atualizada. Ao contrário dos testes estáticos, esses navegam via Playwright em HTML real, verificam erros JS/rede, mensagens de feedback, confirmação e reflow em 320/390px. **Apenas o resultado do job registrado no GitHub comprova execução; não inferir PASS a partir do código.**
- Capturas de tela geradas pelo job (somente dados fictícios), publicadas como artefato de Actions, quando o job executar com sucesso. São capturas automáticas do protótipo, **não evidências de participantes**.

**Ajustes realizados antes de validação humana:** preservar nome/histórico corretos ao alternar entre Marina, Rafael e o grupo; distinguir erro de limite excedido de 10 MiB (10.485.760 bytes), mais de 5 arquivos, PDF com senha e scanner indisponível (apenas texto demonstrativo). Estes ajustes tratam divergências observadas em inspeção da fonte e não devem ser atribuídos a entrevistas.

**Limite:** Chromium em CI não substitui Android/iOS reais, Safari/Edge/Firefox, leitor de tela, validação de pixels/contraste completo nem pesquisa com pessoas. O formulário da FORD não contém autorização operacional para coleta da pesquisa #94, e sua declaração sobre privacidade/LGPD não afasta obrigações legais aplicáveis.


## 9. Rastreabilidade canônica após revisão SQA da PR #164

O [plano v0.3 aprovado na PR #152](https://github.com/Aluvioz/Polychat/pull/152) é a fonte da numeração. **Somente seis telas de tarefa TI exibem `data-task`**; os identificadores `data-screen` não mudam porque são âncoras técnicas de navegação. `t-dashboard` e `t-audit` continuam acessíveis apenas como apoio, sem nova tarefa identificada no protocolo.

| Código do plano | Tela `data-screen` | Rótulo visível | Teste de navegação |
|---|---|---|---|
| T-01 | `t-login` | T-01 · Acesso ao console | `tiLogin` verifica `data-task=T-01` |
| T-02 | `t-users` | T-02 · Consulta de contas | Verificação de busca e diálogo |
| T-03 | `t-groups` | T-03 · Criação e gestão de grupos | Verificação de grupo e remoção |
| T-04 | `t-consult` | T-04 · Consulta administrativa | Verificação de consulta |
| T-05 | `t-alerts` | T-05 · Revisão de alertas | Verificação de alertas |
| T-06 | `t-settings` | T-06 · Configurações | Verificação de configurações |

Os testes estáticos e Playwright verificam correspondência entre **rótulo, tela e tarefa**, sem afirmar conclusão da pesquisa. A decisão do PO sobre uso complementar foi registrada em 26/11/2026; a manifestação independente do SQA continua pendente. Até essa reavaliação, a baseline aprovada é o instrumento estático da PR #152 e não se deve presumir autorização SQA para o clicável.


## 10. Rastreabilidade canônica mobile após revisão SQA da PR #164

A tarefa oficial prevalece sobre a posição da tela no fluxo. **O aviso inicial de monitoramento (`u-monitor`) e o estado vazio (`u-empty`) são telas auxiliares**, sem códigos U-01 a U-08 próprios. A conversa `u-chat` é uma tela reutilizada pelas tarefas U-03/U-04, mas seu marcador principal U-05 indica o teste de envio e feedback — não renumera essas tarefas.

| Código do plano v0.3 | Tela/estado canônico | Rótulo no HTML | Observação |
|---|---|---|---|
| U-01 | `u-login` | U-01 · Acesso | O aviso `u-monitor` é etapa auxiliar |
| U-02 | `u-conversations` | U-02 · Localizar conversa recente | Encontrar conversa existente |
| U-03 | `u-contacts` | U-03 · Iniciar conversa individual | Abre `u-chat` compartilhado |
| U-04 | `u-group` | U-04 · Consultar grupo | Acesso via `u-chat` em modo grupo |
| U-05 | `u-chat` | U-05 · Mensagem e feedback | Simula envio, sem servidor |
| U-06 | `u-attach` | U-06 · Anexar PDF ou JPEG | Seletor fictício |
| U-07 | Seção de erros dentro de `u-attach` | U-07 · Erros e recuperação de anexos | Marcador único no bloco de erros, sem criar tela nova |
| U-08 | `u-session` + simulação offline em `u-conversations`/`u-chat` | U-08 · Sessão expirada ou desconectada | Estado de sessão e perda de conexão |

Os testes estáticos verificam oito marcadores canônicos sem duplicação; os testes Chromium confirmam a navegação e a correspondência real dos códigos. **Esses resultados são automatizados, não observações de usuários representativos da FORD.** O PO autorizou o uso complementar opcional do clicável; a reavaliação independente do SQA permanece pendente.
