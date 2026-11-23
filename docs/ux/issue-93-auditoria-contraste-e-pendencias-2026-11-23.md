# Issue #93 — Auditoria estática de contraste e pendências SQA

**Data:** 23/11/2026  
**PR:** https://github.com/Aluvioz/Polychat/pull/143  
**Escopo:** tokens e classes demonstrativas da galeria, não aplicação funcional em produção.  
**Método:** leitura dos CSS `docs/ux/issue-93-design-tokens.css` e `public/design-system/issue-93-design-tokens.css` e do CSS embutido na galeria standalone. Cálculo de contraste sRGB segundo a fórmula WCAG para pares de cores explícitos, arredondado a duas casas. **Não é auditoria de pixels renderizados ou teste independente da SQA.**

## 1. Matriz de contraste

| Elemento / estado | Primeiro plano | Fundo | Contraste | Critério considerado | Resultado |
|---|---|---|---:|---|---|
| Texto principal | #0F0F0F | #FFFFFF | 19,17:1 | 4,5:1 | PASS calculado |
| Texto secundário | #475569 | #FFFFFF | 7,58:1 | 4,5:1 | PASS calculado |
| Texto muted | #64748B | #FFFFFF | 4,76:1 | 4,5:1 | PASS calculado |
| Botão primário | #FFFFFF | #00095B | 17,64:1 | 4,5:1 | PASS calculado |
| Botão primário hover | #FFFFFF | #00142E | 18,43:1 | 4,5:1 | PASS calculado |
| Botão secundário | #00095B | #FFFFFF | 17,64:1 | 4,5:1 | PASS calculado |
| Botão secundário hover | #00095B | #F0F0F0 | 15,48:1 | 4,5:1 | PASS calculado |
| Botão destrutivo | #FFFFFF | #B42318 | 6,57:1 | 4,5:1 | PASS calculado |
| Texto informativo em aviso sucesso | #475569 | #EAF7F0 | 6,88:1 | 4,5:1 | PASS calculado |
| Texto informativo em aviso erro | #475569 | #FEF3F2 | 6,97:1 | 4,5:1 | PASS calculado |
| Texto informativo em aviso atenção | #475569 | #FEF9C3 | 7,06:1 | 4,5:1 | PASS calculado |
| Badge sucesso / texto | #027A48 | #FFFFFF | 5,41:1 | 4,5:1 | PASS calculado |
| Badge pendente / texto | #854D0E | #FEF9C3 | 6,38:1 | 4,5:1 | PASS calculado |
| Token Skyview / texto branco, par de referência | #FFFFFF | #066FEF | 4,64:1 | 4,5:1 | PASS calculado, margem estreita |
| Borda de campo padrão | #64748B | #FFFFFF | 4,76:1 | 3:1 não textual | PASS calculado |
| Borda de campo inválido | #B42318 | #FFFFFF | 6,57:1 | 3:1 não textual | PASS calculado |
| Borda de botão secundário | #00095B | #FFFFFF | 17,64:1 | 3:1 não textual | PASS calculado |
| Foco sobre branco | #B45309 | #FFFFFF | 5,02:1 | 3:1 não textual | PASS calculado |
| Foco sobre cinza | #B45309 | #F0F0F0 | 4,41:1 | 3:1 não textual | PASS calculado |
| Foco sobre botão primário azul | #B45309 | #00095B | 3,51:1 | 3:1 não textual | PASS calculado |
| Borda do aviso sucesso | #027A48 | #EAF7F0 | 4,91:1 | 3:1 não textual | PASS calculado |
| Borda do aviso erro | #B42318 | #FEF3F2 | 6,05:1 | 3:1 não textual | PASS calculado |
| Borda do aviso atenção | #854D0E | #FEF9C3 | 6,38:1 | 3:1 não textual | PASS calculado |
| Borda de badge padrão | #64748B | #FFFFFF | 4,76:1 | 3:1 não textual (se essencial) | PASS calculado |
| Texto desabilitado | #475569 | #E2E8F0 | 6,15:1 | **Isento WCAG 1.4.3 e 1.4.11**, valor informativo | NÃO APLICÁVEL para mínimo |

**Interpretação:** esta matriz amplia substancialmente a lista de cores avaliadas e cobre estados `hover`, indicadores, bordas e estados definidos pelos tokens. Algumas bordas e indicadores são decorativos, portanto 3:1 não é sempre obrigatório; apresentar a razão calculada não implica obrigação de conformidade se o elemento não transmite informação. O texto em estados desabilitados está isento pelos critérios citados. O `filter:brightness(.85)` do botão destrutivo em hover altera a cor percebida: **não é medido nesta matriz**, pois requer obter a cor efetiva ou o estado renderizado.

## 2. Cobertura e limitações

- **Coberto por cálculo:** principais cores textuais, fundos da galeria, botões normal/hover quando a cor é explicitamente declarada, campos, foco, badges e avisos.
- **Coberto por testes de fonte:** paridade entre CSS documentado, público e standalone, verificações de pares explícitos e tokens em `tests/issue-93-a11y.test.mjs`; **execução completa no CI precisa ser verificada**.
- **Ainda não coberto:** pixels e estados renderizados por navegador (incluindo o filtro de hover destrutivo), imagens/ícones se forem semanticamente essenciais, estilos computados com media queries/forced-colors, tecnologias assistivas, modais funcionais, contraste de conteúdo real do runtime, e avaliação independente.
- **Sem falsa declaração:** não foram inventados nomes ou versões de navegador, Windows ou Narrador; ambiente conhecido é Windows + Chrome + Narrador, DevTools emulado, `file://` para a galeria local. Falta coletar números de versão para reprodutibilidade completa.
- **Regressão:** a galeria demonstrativa não muda o runtime; verificações estáticas não substituem testes de fluxos funcionais.
- **Revisão:** Tech Lead continua `CHANGES_REQUESTED` até revisão; SQA deve inspecionar o que foi calculado e executar validações próprias.

## 3. Evidências E12/E13

- A captura **E12** (768px, pós-correção) existe com **70.098 bytes** no ZIP original reanexado pelo usuário, e **E13** (1280px, pós-correção) com **69.912 bytes**. Ambas possuem cabeçalhos PNG e passaram no teste de integridade do ZIP.
- Os fragmentos de identificadores do comentário foram recompostos na [publicação com 20 tags HTML](https://github.com/Aluvioz/Polychat/pull/143#issuecomment-7113613570):
  - E12: `https://github.com/user-attachments/assets/f87d4839-63a3-44c1-84f0-dd748088473f`
  - E13: `https://github.com/user-attachments/assets/64951df7-4afe-46a8-86fa-1929f47d9fc2`
- **Não verificado:** disponibilidade HTTP e identidade das imagens servidas pelos links. Um PNG íntegro no ZIP e uma URL sintaticamente correta **não provam** que o anexo remoto existe. Se o navegador não carregar, reenviar E12/E13.

## 4. Dependência Vercel

- Projeto previsto: `polyford`, equipe `polychat1`.
- Consulta autenticada de projeto e deployments retornou **HTTP 403**: a conexão atual não está autorizada para a equipe `polychat1`. A tentativa de gerar autorização para o ID informado retornou `404 Team not found` nesta conexão. Nenhuma validação de preview foi concluída; não há URL confirmada de publicação da galeria.
- **Próxima ação:** mantenedor do workspace deve conceder acesso ao projeto/equipe ou publicar um link de preview acessível e informar a rota exata da galeria, para teste em browser autorizado. Não criar novo deploy/alterar produção sem necessidade.

## 5. SQA e Tech Lead — próximos critérios de aceite

1. **SQA (Dante):** confirmar E12/E13 visualmente e executar avaliação independente, incluindo CSS renderizado e regressão pertinente.
2. **Executor:** complementar versões do Windows, Chrome e Narrador somente quando obtidas da máquina usada nos testes; não preencher retroativamente com suposições.
3. **Responsável Vercel:** providenciar URL acessível e prova manual de abertura de galeria publicada.
4. **Tech Lead (Luiz):** decidir família e licença de ícones; reavaliar alterações e solicitar/autorizar retirada do Draft quando critérios técnicos forem satisfeitos.

Este documento é **evidência de auditoria estática de código e diagnóstico**, não parecer SQA nem aprovação do PR.
