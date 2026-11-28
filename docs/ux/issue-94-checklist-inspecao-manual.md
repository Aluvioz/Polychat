# Issue #94 — Checklist de inspeção manual do protótipo

**Uso:** revisão UI/UX e SQA da interface demonstrativa, **sem pessoas recrutadas**.  
**Estado inicial:** itens `PENDENTE` até o responsável registrar evidência real. Este checklist não é execução nem homologação.

**Versões a registrar antes do teste:** commit exato da PR #164; HTML/CSS/JS da mesma versão; URL e ambiente (file://, Next local ou preview), navegador+versão, sistema+versão, dimensões do viewport, zoom, teclado/leitor de tela (se usado), testador, data. Nunca preencher com suposições.

## 1. Navegação e tarefas prioritárias

| ID | Ação e verificação observável | Resultado | Evidência |
|---|---|---|---|
| M94-01 | Abrir index.html, sem erro no console; escolher Usuário mobile | PENDENTE | — |
| M94-02 | U-01: erro de login genérico, sem revelar conta; entrar ficticiamente | PENDENTE | — |
| M94-03 | U-02: localizar conversa recente e não lidas; aviso de monitoramento é etapa auxiliar, sem código de tarefa | PENDENTE | — |
| M94-04 | U-03: iniciar conversa individual pela busca contextual; Rafael correto e busca sem resultado | PENDENTE | — |
| M94-05 | U-04: localizar grupo, consultar participantes e distinguir histórico do grupo do individual | PENDENTE | — |
| M94-06 | U-05: enviar mensagem fictícia; status avisa que não houve envio real | PENDENTE | — |
| M94-07 | U-06: selecionar PDF/JPEG; U-07: entender erros de arquivo, tamanho, quantidade, PDF com senha, scanner indisponível e recuperação | PENDENTE | — |
| M94-08 | U-08: sessão expirada ou offline; reconhecer estado e próximo passo, sem confirmação de entrega real | PENDENTE | — |
| M94-09 | T-01: login demonstrativo; dashboard TI é tela auxiliar, não outra tarefa | PENDENTE | — |
| M94-10 | T-02: busca de conta e vazio; desativação Cancelar/Confirmar e foco restaurado | PENDENTE | — |
| M94-11 | T-03: grupo, confirmação de remoção e texto sobre revogação imediata | PENDENTE | — |
| M94-12 | T-04: consulta/exportação/edição fictícias e informação da auditoria | PENDENTE | — |
| M94-13 | T-05: alertas baixa/média/alta, prazos e ausência de bloqueio automático | PENDENTE | — |
| M94-14 | T-06: somente lista de termos e quotas; nenhuma configuração genérica extra | PENDENTE | — |
| M94-15 | Abrir Auditoria TI (tela auxiliar sem código T-07), perceber que eventos são fictícios e não persistidos | PENDENTE | — |

## 2. Acessibilidade/compatibilidade

| ID | Procedimento | Resultado | Evidência |
|---|---|---|---|
| A94-01 | Usar somente Tab/Shift+Tab, Enter e espaço em botões, buscando ausência de armadilha | PENDENTE | — |
| A94-02 | Ativar Pular para o conteúdo; foco vai ao main | PENDENTE | — |
| A94-03 | Trocar de tela e confirmar foco no título da nova tela | PENDENTE | — |
| A94-04 | Abrir diálogo; Escape e Cancelar fecham; foco volta ao disparador | PENDENTE | — |
| A94-05 | Testar zoom 200% e 400%, inspecionar reflow real, sem perda de informação | PENDENTE | — |
| A94-06 | Mobile 320 e 390 CSS px, Android Chrome e iOS Safari conforme disponibilidade | PENDENTE | — |
| A94-07 | TI desktop Chrome, Edge e Firefox atuais; sem suposição de cobertura por 1 Chromium | PENDENTE | — |
| A94-08 | Leitor de tela, nome/estado de campos, feedback, títulos e diálogo | PENDENTE | — |
| A94-09 | Inspecionar contraste textual e não textual do CSS efetivamente renderizado | PENDENTE | — |
| A94-10 | Confirmar que página estática não transmite dados externos ou corporativos reais | PENDENTE | — |

## 3. Critério de registro

Por cada linha, substituir PENDENTE por PASS/FAIL/NÃO EXECUTADO/NÃO APLICÁVEL **após a ação de fato**, informando por que e com que evidência. Anotar defeitos com passos, esperado, observado, ambiente, severidade proposta e link para evidência. **CI em Chromium** fornece evidência separada de teste automatizado e não marca automaticamente itens de Safari, Edge, Firefox, leitor de tela, 200%/400% ou usabilidade como PASS.

Usar [matriz FORD v2](./issue-94-matriz-aderencia-ford-v2.md) para verificar aderência de textos e fluxos às perguntas Q1–Q34. Não iniciar pesquisa com funcionários FORD ou com dados corporativos até o [gate institucional](./issue-94-kit-registros-sessoes.md) estar autorizado. A simulação interna por papéis aceita pelo PO é atividade distinta e deve seguir os gates específicos do kit, incluindo a reavaliação independente do SQA.


## 4. Revisão visual documental das capturas automatizadas — 26/11/2026

**Escopo:** análise visual das três capturas produzidas pelo workflow Playwright/Chromium no commit `fb398c2d31e328844b5a60fd0f97a4f672824ffa`. [Execução UX #45916050608 e artefato #15162546926](https://github.com/Aluvioz/Polychat/actions/runs/45916050608/artifacts/15162546926).

Esta revisão das imagens não equivale a percorrer manualmente os fluxos no navegador e não é a inspeção independente do SQA/UI/UX. Os itens M94-01 a M94-15 e A94-01 a A94-10 permanecem pendentes até que seus procedimentos sejam executados por responsável identificado, com ambiente e evidências próprios.

| Captura | Observação visual | Limite da evidência |
|---|---|---|
| `mobile-conversas-390.png` | A tela exibe o marcador U-02, a lista de conversas e os elementos principais no viewport de 390 px; não há corte horizontal aparente na imagem. | Não demonstra que uma pessoa concluiu a tarefa nem valida outros navegadores/dispositivos. |
| `mobile-anexos-320.png` | Os marcadores U-06/U-07 e os controles de exemplo aparecem no viewport de 320 px; o limite está atualizado para 10 MiB (10.485.760 bytes), e os rótulos quebram linha sem corte horizontal aparente. Uma notificação fixa ocupa a parte inferior e sobrepõe conteúdo/rodapé na captura. | A duração da notificação e o impacto após a interação não podem ser avaliados por uma imagem isolada; confirmar em inspeção interativa antes de classificar como defeito. |
| `ti-dashboard-1280.png` | O dashboard TI está identificado visualmente como etapa auxiliar; navegação e cartões aparecem no viewport de 1280 px, sem corte aparente na imagem. | Não demonstra execução das tarefas T-01 a T-06 nem compatibilidade fora do Chromium. |

**Execução automatizada associada:** o workflow UX #45916050608 concluiu **8 testes PASS, 0 FAIL e 0 SKIPPED** no commit `fb398c2d31e328844b5a60fd0f97a4f672824ffa`, cobrindo as jornadas e telas selecionadas em Chromium, inclusive axe-core nas telas representativas. [Log da execução](https://github.com/Aluvioz/Polychat/actions/runs/45916050608).

**Conclusão desta revisão visual limitada:** a nova captura confirma a apresentação de 10 MiB (10.485.760 bytes) na tela de anexos. Não foi confirmado defeito de código apenas pelas imagens. O comportamento da notificação fixa permanece como observação a confirmar interativamente. As imagens e os testes automatizados oferecem evidência pontual de renderização e navegação, mas não substituem a inspeção humana completa nem autorizam marcar itens do checklist como PASS.

**Versão da evidência:** as capturas correspondem à versão do protótipo após a harmonização para 10 MiB. Os itens M94-01 a M94-15 e A94-01 a A94-10 continuam pendentes de execução humana por responsável identificado.

## 5. Trilha de execução (em branco)

- Data/hora:
- Testador:
- Versão do protótipo/commit:
- Origem/URL:
- Sistema e versão:
- Navegador e versão:
- Dispositivo e viewport:
- Leitor de tela e versão (se aplicável):
- Execução automática de Chromium (link do Actions):
- Achados:
- Encaminhamento ao PO/SQA:


## 6. Verificação interativa assistida por IA — 27/11/2026

Execução de navegador real (Playwright, Chromium 141.0.7390.37, Ubuntu 24.04, Linux 7.0.0-1018-aws, file://, 320/390 × 720/844 e 1280 × 900), commit `a19ef02593523ae727f47c8233697e9749a8cf0b`. HTML/CSS/JS inalterados desde `3bc2c2e`. [Workflow e log](https://github.com/Aluvioz/Polychat/actions/runs/46036069268) · [ZIP com PNGs e results.json](https://github.com/Aluvioz/Polychat/actions/runs/46036069268/artifacts/15217375376) (retenção até 11/12). Testador: agente IA a pedido de UX, sem sessão com pessoa. Nenhum resultado abaixo substitui a inspeção humana, que continua PENDENTE na tabela principal. 22 verificações automatizadas PASS, das quais algumas parciais em relação ao procedimento integral; 3 não executadas. Não houve erros JavaScript. A primeira execução válida teve falha de seletor do próprio teste A94-01; seletor corrigido e reteste PASS.

| ID | Resultado técnico | Observação | PNG no ZIP |
|---|---|---|---|
| M94-01 | PASS (assistido) | Perfil mobile; sem pageerror | evidence/M94-01.png |
| M94-02 | PASS (assistido) | Erro genérico; acesso fictício | evidence/M94-02.png |
| M94-03 | PASS (assistido) | Recentes e não lidas | evidence/M94-03.png |
| M94-04 | PASS (assistido) | Busca vazia, Rafael e histórico próprio | evidence/M94-04.png |
| M94-05 | PASS (assistido) | Grupo, histórico e participantes | evidence/M94-05.png |
| M94-06 | PASS (assistido) | Envio e status não entregue | evidence/M94-06.png |
| M94-07 | PASS (assistido) | PDF/JPEG e nove ações de erro/recuperação | evidence/M94-07.png |
| M94-08 | PASS (assistido) | Offline e sessão expirada | evidence/M94-08.png |
| M94-09 | PASS (assistido) | TI e dashboard auxiliar | evidence/M94-09.png |
| M94-10 | PASS (assistido) | Busca vazia, Cancelar/Confirmar e foco | evidence/M94-10.png |
| M94-11 | PASS (assistido) | Remoção e revogação informada | evidence/M94-11.png |
| M94-12 | PASS (assistido) | Consulta, exportação e edição fictícias | evidence/M94-12.png |
| M94-13 | PASS (assistido) | Severidades/prazos e sem bloqueio automático | evidence/M94-13.png |
| M94-14 | PASS (assistido) | Somente termos e quotas | evidence/M94-14.png |
| M94-15 | PASS (assistido) | Auditoria auxiliar, não log | evidence/M94-15.png |
| A94-01 | PARCIAL | Teclado em trajetos selecionados; não integral | evidence/A94-01.png |
| A94-02 | PASS (assistido) | Link de salto; main recebe foco | evidence/A94-02.png |
| A94-03 | PARCIAL | Foco no H1 na navegação start/login | evidence/A94-03.png |
| A94-04 | PASS (assistido) | Escape/Cancelar devolvem foco | evidence/A94-04.png |
| A94-05 | NÃO EXECUTADO | Zoom nativo não executado | — |
| A94-06 | PARCIAL | 320/390 CSS px no login; sem dispositivos físicos | evidence/A94-06.png |
| A94-07 | NÃO EXECUTADO | Sem Edge/Firefox desktop nesta execução | — |
| A94-08 | NÃO EXECUTADO | Sem leitor de tela | — |
| A94-09 | PARCIAL | Cores computadas do input; contraste completo não aferido | evidence/A94-09.png |
| A94-10 | PASS (assistido) | Nenhuma requisição externa observada nos trajetos | evidence/A94-10.png |

### Notificação mobile
No viewport 320 × 720, clique no exemplo de scanner indisponível, scroll ao fim da página, captura com notificação (`toast-320-before.png`) e após 12,1 s (`toast-320-after.png`). O teste geométrico retornou lista vazia de interseções entre toast e botões nessa posição; não confirmou obstrução dos controles nesse cenário. Não elimina sobreposição de outros conteúdos ou em posições/ambientes diferentes; confirmar visualmente por pessoa. Nenhum defeito de produto declarado com base nesse teste isolado.

### Limites e próximos passos
A inspeção humana completa, wireframes estáticos como instrumento principal, sessões com voluntários autorizadas e registros individualizados continuam pendentes. Não houve usuário FORD, dados reais, login real ou homologação. Vercel apresentava limite diário na última consulta; execução local estática via CI não comprova acesso publicado. Solicitar avaliação SQA da evidência complementar, sem merge ou encerramento da issue.
