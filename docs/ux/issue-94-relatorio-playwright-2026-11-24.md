# Issue #94 — Relatório de execução automatizada em Chromium

**Data da execução:** 24/11/2026  
**Branch:** `feat/ponde-issue-94-prototipo-ux`  
**Commits testados:** `c68a8be2468b72d25f1e782b8a80760fd27e3c8d` (7 cenários) e `a6cfbc5046c53bfede1b9833ffee55fec884eea0` (8 cenários, incluída axe-core)  
**Suite:** [tests/browser/issue-94-browser.test.mjs](../../tests/browser/issue-94-browser.test.mjs)  
**Workflow:** [issue-94-browser.yml](../../.github/workflows/issue-94-browser.yml)  
**Execução GitHub Actions definitiva desta rodada:** https://github.com/Aluvioz/Polychat/actions/runs/45400409724  
**Ambiente:** GitHub-hosted Ubuntu 24.04, Node.js 22, Playwright 1.57.0, axe-core 4.10.3, Chromium headless instalado pelo workflow. A versão exata do executável Chromium não foi registrada no relatório; não inferir Chrome/Safari móvel ou testes em aparelhos físicos.

## Resultado objetivo

**8 testes executados, 8 passaram, 0 falharam, 0 ignorados**. O job concluiu com `success`. O CI convencional da branch também concluiu com sucesso no mesmo commit.

| Teste automatizado | Resultado | Evidência |
|---|---|---|
| U-01/U-02: acesso demonstrativo, erro genérico, aviso e lista de conversas | PASS Chromium | Log do workflow e captura mobile 390 |
| U-03/U-04: busca sem resultados, Rafael correto e conversa em grupo com histórico distinto | PASS Chromium | Log do workflow |
| U-05/U-08: mensagem fictícia, simulação offline, falha e nova tentativa | PASS Chromium | Log do workflow |
| U-06/U-07: formatos, 10 MB, cinco anexos, PDF com senha, scanner indisponível | PASS Chromium | Log do workflow e captura mobile 320 |
| T-01 (acesso), T-02 (contas) e T-03 (grupos); dashboard como tela auxiliar; busca, confirmação e foco | PASS Chromium no commit informado | Log do workflow e captura TI 1280 |
| T-04 (consulta), T-05 (alertas) e T-06 (configurações); auditoria como tela auxiliar | PASS Chromium no commit informado | Log do workflow |
| Skip link, foco na mudança de tela, reflow em 320 e 390px | PASS Chromium | Log do workflow |
| axe-core WCAG 2.1 A/AA nas telas selecionadas (início, conversas, chat, anexos, dashboard e usuários TI) | PASS automatizado, sem violações encontradas nessas verificações | Log do workflow |

O teste também verifica ausência de erros não tratados de JavaScript e de requisições externas durante as tarefas cobertas. **Isso vale somente para o HTML fictício inspecionado**, não para o produto Polychat conectado a serviços reais.

## Capturas e integridade

O job publicou **três PNGs** na [coleção de artefatos do Actions](https://github.com/Aluvioz/Polychat/actions/runs/45400409724/artifacts/14922618767), nome `ux94-chromium-screenshots`:

- `mobile-conversas-390.png`
- `mobile-anexos-320.png`
- `ti-dashboard-1280.png`

GitHub registrou o artifact ID **14922618767**, tamanho **310.504 bytes**, SHA-256 do ZIP `d1b24e92e17a3af74997fa297a0499d3583069f65188e9c6845a33e6f92c15e5`. São capturas automáticas **de exemplos inventados**, não depoimentos ou provas de sessões. A retenção configurada no workflow é de 7 dias, com vencimento atual previsto em 01/12/2026; baixar/arquivar conforme governança se for necessário manter prova além disso. **Não realizei inspeção visual independente dos pixels das capturas neste registro.**

## Falha de infraestrutura encontrada e corrigida

A primeira rodada do job de navegador falhou **antes dos testes**: Playwright 1.57.0 não conseguiu instalar Chromium no runner `ubuntu-latest`, que havia resolvido para Ubuntu 26.04. O workflow foi ajustado para `runs-on: ubuntu-24.04`, permitindo instalação e execução. A falha inicial **não foi defeito de navegação do protótipo**.

## Escopo de cobertura e exclusões

O sucesso em Chromium comprova somente os cenários automatizados listados, sobre o código e as dimensões testadas. **Não comprova**:

- compatibilidade em Android Chrome ou iOS Safari reais;
- Edge/Firefox, leitores de tela, navegação integral por teclado, foco em todos os estados;
- zoom 200%/400%, contraste WCAG de cada componente renderizado ou usabilidade com pessoas;
- autenticação, RLS, persistência, links temporários, restrições de dispositivo, antimalware real, logs, acesso administrativo real e proteção de dados;
- aprovação do PO/SQA, autorização institucional de pesquisa ou homologação funcional do produto.

**Próximo gate de qualidade:** UI/UX e SQA devem fazer inspeção humana do [checklist](./issue-94-checklist-inspecao-manual.md), e o PO deve confirmar o uso do protótipo clicável em sessões planejadas na PR #152. **A próxima etapa de pesquisa depende de autorização formal FORD**, conforme [minuta](./issue-94-minuta-autorizacao-institucional.md). Não marcar a issue #94 como concluída por estes testes.

## Complemento WCAG automatizado

A suíte também injeta a biblioteca local `axe-core@4.10.3` (sem CDN) e executa regras com tags `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa` nas seis telas selecionadas. **Resultado: zero violações reportadas nessas execuções específicas**, o que não garante ausência de defeitos em telas não cobertas, interações, leitura humana ou tecnologias assistivas. Resultado comprovado no [job 45400409724](https://github.com/Aluvioz/Polychat/actions/runs/45400409724).
