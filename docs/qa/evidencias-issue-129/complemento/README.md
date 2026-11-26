# Complemento — execução real 26/11/2026

Commit testado `ff5a5d20cdfed5d0f448e1a34abb586270e4988f`. [Workflow](https://github.com/Aluvioz/Polychat/actions/runs/45833887030) e [ZIP completo](https://github.com/Aluvioz/Polychat/actions/runs/45833887030/artifacts/15123781727), 27 PNGs + 2 logs. Sete capturas complementares e results.log preservados aqui; SHA dos blobs conferido com originais.

8/8 PASS: 5 regressões anteriores, reflow equivalente 200% (640 CSS px) e 400% (320 CSS px), contraste forçado em Chromium. Foco de 3px, sem overflow horizontal; botão alcançável. Contorno computado no modo forçado rgba(5,0,73,0.8) sobre branco. A função de contraste do teste lê RGB; conferência complementar com composição alfa sobre branco resulta rgb(55,51,109.4), razão aproximada 11,30:1, acima de 3:1. Não é zoom nativo/Windows físico. A captura mostra botão sem contorno quando não focado no modo forçado; registrar como oportunidade de clareza, sem atribuir falha de conformidade apenas por esse aspecto.

- `reflow-200/400-login`: página inteira.
- `reflow-200/400-submit`: scroll e foco em Entrar.
- `forced-colors-login/focus/submit`: inicial, Tab até usuário e Tab até botão.

Nenhuma conta real, leitor de tela ou homologação geral. Aguardando SQA independente.
