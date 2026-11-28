# Complemento #129 — reflow e contraste forçado

26/11/2026. Testes adicionais sobre runtime de login já compilado.

- Reflow equivalente a 200%: viewport 640 CSS px, deviceScaleFactor 2 (base 1280px). Reflow equivalente a 400%: 320 CSS px, deviceScaleFactor 4. Verifica ausência de overflow horizontal, controles dentro da largura e acesso ao botão após scroll. Não equivale ao zoom nativo do navegador ou ampliação do texto pelo sistema.
- Chromium com `forcedColors: active` verifica media query, foco por teclado, contraste computado do contorno e acesso aos campos/botão. Não equivale ao modo Alto Contraste em Windows físico.
## Execução concluída — 26/11/2026

**8/8 PASS**, no commit testado `ff5a5d20cdfed5d0f448e1a34abb586270e4988f`: cinco regressões anteriores e três casos complementares (reflow 200%, 400% e forced-colors). Sem overflow horizontal, botão alcançável após scroll e foco de 3px.

- [Workflow UX](https://github.com/Aluvioz/Polychat/actions/runs/45833887030) e [CI principal](https://github.com/Aluvioz/Polychat/actions/runs/45833887028).
- [Índice das evidências preservadas](evidencias-issue-129/complemento/README.md) e [log](evidencias-issue-129/complemento/results.log).
- Capturas: [200% — página](evidencias-issue-129/complemento/reflow-200-login.png), [botão](evidencias-issue-129/complemento/reflow-200-submit.png); [400% — página](evidencias-issue-129/complemento/reflow-400-login.png), [botão](evidencias-issue-129/complemento/reflow-400-submit.png); [contraste forçado — inicial](evidencias-issue-129/complemento/forced-colors-login.png), [foco no usuário](evidencias-issue-129/complemento/forced-colors-focus.png), [foco no botão](evidencias-issue-129/complemento/forced-colors-submit.png).
- [Artefato original](https://github.com/Aluvioz/Polychat/actions/runs/45833887030/artifacts/15123781727): 27 PNGs e 2 logs; sete capturas complementares preservadas no repositório.

Limites: resposta 401 simulada, sem login positivo real, leitor de tela, dispositivos físicos, zoom nativo ou Windows físico. Sem alteração de backend ou homologação geral. Aguardando nova avaliação independente do SQA; issue #129 permanece aberta.
