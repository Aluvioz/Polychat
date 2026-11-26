# Complemento #129 — reflow e contraste forçado

26/11/2026. Testes adicionais sobre runtime de login já compilado.

- Reflow equivalente a 200%: viewport 640 CSS px, deviceScaleFactor 2 (base 1280px). Reflow equivalente a 400%: 320 CSS px, deviceScaleFactor 4. Verifica ausência de overflow horizontal, controles dentro da largura e acesso ao botão após scroll. Não equivale ao zoom nativo do navegador ou ampliação do texto pelo sistema.
- Chromium com `forcedColors: active` verifica media query, foco por teclado, contraste computado do contorno e acesso aos campos/botão. Não equivale ao modo Alto Contraste em Windows físico.
- Capturas reais serão geradas pelo workflow. Resultado pendente até execução. Sem contas reais, sem alteração de backend e sem homologação geral.
