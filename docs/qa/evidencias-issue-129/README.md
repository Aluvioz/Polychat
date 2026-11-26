# Evidências #129 — execução de 26/11/2026

Capturas originais do workflow [45832806600](https://github.com/Aluvioz/Polychat/actions/runs/45832806600), commit testado `e85d85506e321955dc67294764e4b6d1a59c7660`. [ZIP completo (20 PNGs + 2 logs)](https://github.com/Aluvioz/Polychat/actions/runs/45832806600/artifacts/15122614721), expira em 10/12/2026. Seis capturas e log preservados aqui, SHA dos blobs conferido contra os arquivos originais.

- 01: clique em Entrar na página inicial, renderização de /login.
- 02: Tab no link de retorno e no campo de usuário; foco destacado.
- 03: preenchimento fictício e clique Entrar; botão desabilitado durante resposta simulada.
- 04: HTTP 401 interceptado e mensagem de erro apresentada.

5/5 PASS, 10 varreduras axe sem violações ou itens incompletos nos conjuntos selecionados. Chromium 143.0.7499.4, WebKit 26.0, Firefox 144.0.2; Linux Ubuntu 24.04, Node 22, Next 16.4.6. Contraste computado 4,76:1 em todos os perfis. Sem homologação real, sem teste backend de login.
