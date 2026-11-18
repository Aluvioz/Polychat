# Issue #93 — evidências e roteiro de verificação de acessibilidade

Data: 18/11/2026  
Branch: `docs/ponde-issue-93-design-system`  
PR: https://github.com/Aluvioz/Polychat/pull/143  
Revisão do Tech Lead: **CHANGES_REQUESTED** em 17/11/2026.

## 1. Correções realizadas nesta revisão

- Adicionado link **Pular para o conteúdo principal** visível ao receber foco.
- Adicionado destino `main#conteudo` e tratamento de foco.
- Adicionada quebra de conteúdo para reduzir estouro em larguras estreitas e zoom alto.
- Adicionados ajustes responsivos para largura até 420px.
- Adicionado tratamento `forced-colors: active` para bordas e foco.
- Exemplo de confirmação crítica deixou de apresentar botões falsamente acionáveis: controles viraram elementos demonstrativos estáticos, descritos como **não funcionais**. **Não equivale a um modal acessível implementado**.
- Mantidos e revisados rótulos, mensagens de erro, estados `role="alert"/"status"`, `:focus-visible` e `prefers-reduced-motion`.
- Criados os testes `tests/issue-93-a11y.test.mjs`, integráveis ao script existente `npm test` (`node --test tests/*.test.mjs`).

## 2. Evidências de inspeção estática — realizadas

| Verificação por leitura dos arquivos | Resultado | Evidência |
|---|---|---|
| `lang="pt-BR"` e meta viewport | Presente | `docs/ux/issue-93-galeria-standalone.html` |
| Âncora de salto para `main#conteudo` | Presente | HTML/CSS do UI Kit |
| 3 inputs com `label for=` correspondente | Presente | HTML; ids `identifier`, `password`, `filetype` |
| Campo inválido e texto de erro associado | Presente | `aria-invalid` e `aria-describedby` |
| Mensagens com papéis `alert`/`status` | Presente | HTML |
| Estilos de foco visível | Presente | `:focus-visible` |
| Responsividade declarada | Presente | Media queries 860/560/420px |
| Redução de movimento | Presente | `prefers-reduced-motion` |
| Contraste forçado | Presente | `forced-colors` |
| Não apresentar modal simulado como funcional | Corrigido | Confirmação demonstrativa sem botões interativos |

**IMPORTANTE:** “presente” significa inspeção de código, **não** que o comportamento visual/acessível tenha sido validado no navegador. Os testes automatizados no repositório precisam ter execução de CI confirmada separadamente.

## 3. Matriz de contraste textual — cálculo sRGB

| Cor de texto | Fundo | Razão calculada | WCAG AA normal (4,5:1) |
|---|---|---:|---|
| #003478 | #FFFFFF | 11,92:1 | Passa |
| #001F4D | #FFFFFF | 16,11:1 | Passa |
| #1769AA | #FFFFFF | 5,77:1 | Passa |
| #10243E | #FFFFFF | 15,63:1 | Passa |
| #64748B | #FFFFFF | 4,76:1 | Passa, margem pequena |
| #475569 | #FFFFFF | 7,58:1 | Passa |
| #027A48 | #FFFFFF | 5,41:1 | Passa |
| #B42318 | #FFFFFF | 6,57:1 | Passa |

**Não testado:** combinações não textuais, estados hover, placeholder, contraste do foco, ícones e bordas nos fundos reais. Estes pares também não comprovam acessibilidade total.

## 4. Roteiro manual reprodutível — execução pendente

A galeria autocontida pode ser obtida no PR como `docs/ux/issue-93-galeria-standalone.html` em **Raw / Download raw file**, salva como `.html` e aberta no navegador. Não requer Vercel. O deployment Preview do grupo `polychat1` está protegido e não deve ser listado como prova de acesso público.

**Teclado:** navegar exclusivamente com Tab e Shift+Tab. Conferir foco visível em todos os botões e inputs, sem bloqueio de teclado; acionar controles que realmente implementem ação. O exemplo visual de confirmação NÃO implementa diálogo nem operações.

**Zoom/reflow:** testar a galeria em Chrome/Edge/Firefox, em largura de 1280px (100%, 200% e 400%) e nos tamanhos de referência 320px, 390px e 768px. Registrar se há rolagem horizontal indevida, cortes de texto e controles não alcançáveis. Especificar navegador, versão e viewport.

**Leitor de tela:** com NVDA (Windows), VoiceOver (macOS/iOS) ou TalkBack (Android), verificar título da página, sequência de seções, nomes de campos, indicação de erro e leitura de alertas; registrar leitor e versão.

**Contraste não textual:** conferir bordas de inputs, estados de foco, ícones e controles com ferramenta de análise de contraste ou axe DevTools, e corrigir achados com captura/URL do elemento.

**Relatório:** para cada caso, registrar ID, ambiente, passos, esperado, observado, PASS/FAIL, screenshot (quando aplicável), problema, correção/PR e responsável. Sem executar manualmente, manter status `NOT RUN`.

| ID | Caso | Status |
|---|---|---|
| M-01 | Tab/Shift+Tab em todos os controles e foco visível | NOT RUN |
| M-02 | Zoom 200% com reflow e leitura preservados | NOT RUN |
| M-03 | Zoom 400% com reflow e leitura preservados | NOT RUN |
| M-04 | Larguras 320/390/768 e 1280px | NOT RUN |
| M-05 | Leitor de tela com títulos, rótulos, erros e alertas | NOT RUN |
| M-06 | Contraste não textual e estados de foco | NOT RUN |
| M-07 | Teclado em modal funcional real (quando existir) | NOT APPLICABLE / PENDENTE DE IMPLEMENTAÇÃO |
| M-08 | Aprovação de marca e tokens oficiais pela Ford | PENDING APPROVAL |

## 5. Critérios de aceite da #93 após esta revisão

- **Biblioteca e documentação:** entregues como proposta; revisão pendente.
- **Contraste textual:** pares principais calculados; cobertura completa pendente.
- **Acessibilidade:** melhorias no código e roteiro documentados; **testes manuais não executados**.
- **CI:** verificação estática adicionada; resultado do CI deve ser conferido no PR.
- **Validação de marca Q-019:** pendente do cliente/PO.
- **Aprovação PR:** ainda pendente; manter Draft enquanto o Tech Lead solicitar mudanças.
- **Sem regressão:** não demonstrado integralmente; os arquivos continuam isolados, sem mudança no runtime principal.

Não marcar “aprovado” ou “homologado” somente com estas evidências.
