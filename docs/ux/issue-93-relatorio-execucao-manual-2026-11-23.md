# Issue #93 — Relatório de execução manual (23/11/2026)

**PR:** https://github.com/Aluvioz/Polychat/pull/143  
**Executor:** `ponde-web` (resultados declarados em sessão de acompanhamento)  
**Ambiente declarado:** Windows, Google Chrome, DevTools para simulação de tamanhos de tela, Narrador do Windows; galeria HTML standalone utilizada em verificações anteriores.  
**Dados não recolhidos:** versão exata do Windows/Chrome/Narrador, altura de viewport, URL/instância usada em cada etapa e vídeo/gravação da narração.  
**Caráter da evidência:** registro rastreável de teste humano **autodeclarado**, com capturas de foco compartilhadas em conversa externa ao GitHub. Não deve ser confundido com testes executados pelo CI, com auditoria independente da SQA nem com homologação dos ambientes móveis de produção.

## Matriz de resultados reportados

| ID | Teste / passos executados | Observação do executor | Resultado |
|---|---|---|---|
| M-01 | Navegar usando Tab; repetir Shift+Tab de volta ao início, observando foco | Foco laranja visível; `Shift + Tab` retorna um controle por vez; retorno até “Pular para o conteúdo principal” sem ficar preso | **PASS (relato)** |
| M-02 | Zoom 200% no Chrome e leitura/inspeção do conteúdo | “legível sem cortes” | **PASS (relato)** |
| M-03 | Zoom 400% no Chrome e leitura/inspeção do conteúdo | “legível sem cortes” | **PASS (relato)** |
| M-04 | Chrome DevTools modo dispositivo: larguras 320, 390, 768 e 1280 px | “sem cortes ou sobreposições” nos quatro tamanhos | **PASS (relato, Chrome emulado)** |
| M-05a | Narrador do Windows: títulos da página | “anunciou os títulos corretamente”, leitura normal | **PASS (relato)** |
| M-05b | Narrador: rótulos Usuário/Senha/Anexo e erro de anexo | Todos reportados `pass` | **PASS (relato)** |
| M-05c | Narrador: leitura de avisos estáticos de sucesso, erro e atenção | “todos foram lidos corretamente” | **PASS (relato)** |
| M-06a | Inspeção visual de bordas, foco e estados de botões | Todos `pass`; observação de vermelho semelhante, mas distinguível | **PASS visual (relato)** |
| M-06b | Cálculo sRGB do token de borda padrão | Borda antiga `#CBD5E1` / `#FFFFFF`: **1,48:1**, abaixo de 3:1; substituída por `#64748B`: **4,76:1**, acima de 3:1 | **FAIL encontrado e corrigido no código** |
| M-06c | Reteste visual após baixar galeria corrigida | “as bordas estão mais nítidas e sem problemas” | **PASS (relato)** |
| M-07 | Teclado em modal real (Escape, contenção de foco e retorno) | Galeria só possui confirmação demonstrativa, sem modal funcional | **N/A para galeria estática** |
| M-08 | Identidade institucional Ford | PO aprovou direção cromática provisória Q-019; pacote oficial de marca não é parte desta entrega | **PENDING APPROVAL** |

## Evidência documental já disponível

- Arquivo de acompanhamento com métodos, limitações, cálculos e histórico: [`issue-93-evidencias-acessibilidade.md`](./issue-93-evidencias-acessibilidade.md).
- Galeria verificada: [`issue-93-galeria-standalone.html`](./issue-93-galeria-standalone.html).
- Tokens CSS corrigidos: [`issue-93-design-tokens.css`](./issue-93-design-tokens.css).
- Testes estáticos: [`tests/issue-93-a11y.test.mjs`](../../tests/issue-93-a11y.test.mjs).
- Os prints originais de Tab/foco, fornecidos pelo executor durante o acompanhamento, **ainda precisam ser anexados à conversa do PR**. Não existem, neste commit, arquivos de imagens que comprovem o zoom 200/400%, leitura de voz, ou cada largura simulada. Não utilizar screenshots de foco para afirmar comprovação dessas outras etapas.

## Roteiro de reexecução por SQA (reproduzível)

1. Baixar `docs/ux/issue-93-galeria-standalone.html` do branch `docs/ponde-issue-93-design-system` e abrir no Chrome em Windows; anotar versões e se a página foi aberta via `file://` ou URL.
2. M-01: do início do documento, avançar com Tab até o último elemento; fazer todo o percurso inverso com Shift+Tab; verificar foco perceptível, ordem e ausência de bloqueio.
3. M-02/03: aplicar zoom 200%/400% e percorrer toda a página; registrar qualquer corte, sobreposição, rolagem lateral indevida ou conteúdo inacessível, incluindo dimensões da janela.
4. M-04: no modo Device Toolbar, testar 320/390/768/1280px com inspeção do conteúdo completo e captura de cada largura; executar posteriormente em navegadores/dispositivos homologados para regressão #129.
5. M-05: ativar Narrador do Windows (`Ctrl + Windows + Enter`), ler títulos, campos, erro de anexo e avisos de sucesso/erro/atenção. Registrar leitura de avisos **estáticos**; não afirmar que alertas inseridos dinamicamente foram testados.
6. M-06: avaliar CSS **renderizado** com ferramenta apropriada para cores/estados e documentar elementos não textuais essenciais; atenção à borda padrão atual `#64748B` sobre branco (4,76:1 por cálculo). Também medir estados hover, foco e pares específicos.
7. SQA: assinar revisão independente e relacionar bugs e correções; Tech Lead: decidir biblioteca/licença de ícones e aprovação do PR.

## Pendências para conclusão

- **Anexos de evidência original:** prints já compartilhados precisam ser enviados ao GitHub. Falta screenshot específico do reteste M-06, zoom, larguras e, se solicitado, vídeo ou registro do leitor de tela.
- **Cobertura ainda insuficiente:** contraste não textual dos componentes renderizados, navegadores/dispositivos homologados, estados funcionais da aplicação (galeria não é aplicativo de produção), regressão.
- **Decisões externas:** biblioteca de ícones e licença (Tech Lead); ativos oficiais Ford (cliente/Comunicação); acesso ao preview Vercel protegido e disponibilidade do serviço.
- **Revisão:** PR ainda Draft e revisão `CHANGES_REQUESTED` até manifestação dos responsáveis.

> **Critério de integridade:** este relatório torna verificáveis os passos e registros de execução relatados, mas não cria uma prova de áudio, imagem, dispositivo físico ou aprovação SQA que ainda não existe.
