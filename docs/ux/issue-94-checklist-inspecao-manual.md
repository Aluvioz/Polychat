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

**Escopo:** análise visual das três capturas produzidas pelo workflow Playwright/Chromium no commit `9f226667686cbb115b9613032103d6fbad040995`. [Execução UX #45834039735 e artefato #15123311900](https://github.com/Aluvioz/Polychat/actions/runs/45834039735/artifacts/15123311900).

Esta revisão das imagens não equivale a percorrer manualmente os fluxos no navegador e não é a inspeção independente do SQA/UI/UX. Os itens M94-01 a M94-15 e A94-01 a A94-10 permanecem pendentes até que seus procedimentos sejam executados por responsável identificado, com ambiente e evidências próprios.

| Captura | Observação visual | Limite da evidência |
|---|---|---|
| `mobile-conversas-390.png` | A tela exibe o marcador U-02, a lista de conversas e os elementos principais no viewport de 390 px; não há corte horizontal aparente na imagem. | Não demonstra que uma pessoa concluiu a tarefa nem valida outros navegadores/dispositivos. |
| `mobile-anexos-320.png` | Os marcadores U-06/U-07 e os controles de exemplo aparecem no viewport de 320 px; os rótulos quebram linha sem corte horizontal aparente. Uma notificação fixa ocupa a parte inferior e sobrepõe conteúdo/rodapé na captura. | A duração da notificação e o impacto após a interação não podem ser avaliados por uma imagem isolada; confirmar em inspeção interativa antes de classificar como defeito. |
| `ti-dashboard-1280.png` | O dashboard TI está identificado visualmente como etapa auxiliar; navegação e cartões aparecem no viewport de 1280 px, sem corte aparente na imagem. | Não demonstra execução das tarefas T-01 a T-06 nem compatibilidade fora do Chromium. |

**Conclusão desta revisão limitada:** não foi confirmado defeito que justifique alteração de HTML/CSS/JS apenas com base nas capturas. O comportamento da notificação fixa fica registrado para confirmação interativa. As imagens oferecem evidência visual pontual de renderização, não substituem a inspeção humana completa nem autorizam marcar itens do checklist como PASS.

**Defasagem de versão:** as três capturas citadas foram geradas no commit `9f226667686cbb115b9613032103d6fbad040995`, anterior à harmonização do limite de anexos para 10 MiB no commit `fb398c2d31e328844b5a60fd0f97a4f672824ffa`. Portanto, não usar a captura de anexos como evidência da apresentação atual desse limite; a nova execução Playwright da versão corrigida deve produzir capturas atualizadas.

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
