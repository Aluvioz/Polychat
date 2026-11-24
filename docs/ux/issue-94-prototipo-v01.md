# Issue #94 — Protótipo navegável exploratório v0.1

**Proposta:** UX/UI, branch feat/ponde-issue-94-prototipo-ux  
**Estado:** demonstração pronta para revisão; sessões com participantes NÃO realizadas  
**Issue:** https://github.com/Aluvioz/Polychat/issues/94  
**Plano do PO:** PR #152, docs/ux/issue-94-plano-validacao-ux.md, v0.3 (24/11/2026)  
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

Este é um artefato **adicional** aos wireframes Miro de baixa fidelidade aceitos nas #91/#92, voltado à inspeção de navegação, rótulos e feedback. O plano da PR #152 descreve avaliação moderada de **wireframes estáticos**; substituir a base estática por este protótipo clicável numa sessão requer confirmação prévia de PO/SQA, controle de versão do roteiro e consistência do método. **Interação de demonstrador não equivale a função pronta**.

Paleta provisória Q-019 (azuis Ford e neutros), **sem Ford Oval** ou fontes proprietárias. Sem Supabase, Vercel API, autenticação, sessão, autorização/RLS, auditoria real, upload, antimalware, Realtime, persistência ou E2E. A restrição mobile/desktop é mostrada visualmente, não aplicada como controle de dispositivo ou segurança.

## 3. Rastreabilidade com as tarefas da PR #152

| Tarefa | Telas/fluxo exploratório | Critério de observação |
|---|---|---|
| U-01: iniciar acesso | start → u-login | Entrada e rótulos |
| U-02: localizar conversa | u-login → u-monitor → u-conversations | Aviso, lista, não lidas |
| U-03: iniciar 1:1 | u-conversations → u-contacts → u-chat | Busca contextual, sem aba Contatos |
| U-04: localizar grupo | u-conversations → u-chat (grupo) → u-group | Contexto e participantes |
| U-05: envio/feedback | u-chat | Entendimento de sucesso/falha **simulados** |
| U-06: anexo | u-chat → u-attach | PDF/JPEG, até 10 MB, até 5 anexos |
| U-07: erros | u-attach e u-chat | Inválido, falha, bloqueio distintos |
| U-08: indisponibilidade | u-conversations, offline e u-session | Recuperação e limites |
| T-01: acesso TI | start → t-login → t-dashboard | Encontrar área inicial |
| T-02: contas | t-users | Busca, desativação e reset simulados |
| T-03: grupos | t-groups | Gestão e revogação de acesso representadas |
| T-04: consulta | t-consult | Consulta por TI sem segunda aprovação, com auditoria prevista |
| T-05: alertas | t-alerts | Severidade, prazo, revisão sem punição automática |
| T-06: parâmetros | t-settings | Apenas termos/regras e quotas de anexos |

Incluído também t-audit e estados vazios/sessão expiradas. O catálogo é subordinado à Q-018; não amplia o produto.

## 4. Pré-condições para recrutar ou coletar

A PR #152 está em Draft. O PO **aprovou o plano e o público**, mas **não concedeu autorização operacional institucional**. Não enviar convites nem coletar dados até documentar:

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
- Revisão requerida: Berthed/PO (escopo, adequação do clicável e tarefas), Dante/SQA (método/evidências), UI/UX e Tech Lead quando necessário. Conformidade funcional e acessibilidade de produção pertencem às issues de implementação/#129.
- A aprovação do plano v0.3 por PO **não é aprovação deste novo protótipo**.

## 7. Aceite da #94 — posição atual

| Critério | Situação |
|---|---|
| Protótipo clicável de duas trilhas | **Entregue para revisão** |
| Plano | Existente na PR #152, v0.3 e ainda Draft |
| Governança/autorização de coleta | **PENDENTE FORD** |
| Sessões com participantes | **NÃO REALIZADAS** |
| Achados reais e priorização | **NÃO DISPONÍVEIS** |
| Protótipo modificado a partir de achados | **PENDENTE** |
| Aprovações e revisão PR | **PENDENTES** |
| Ausência de regressão | **Verificações estáticas/CI ainda a conferir; avaliação independente pendente** |

Não fechar a issue #94, prometer homologação nem retirar o Draft apenas pela existência dos artefatos.
