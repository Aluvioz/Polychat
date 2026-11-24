# Issue #93 — Relatório de execução manual (23/11/2026)

**PR:** https://github.com/Aluvioz/Polychat/pull/143  
**Executor:** `ponde-web` (resultados declarados em sessão de acompanhamento)  
**Ambiente declarado:** Windows, Google Chrome, DevTools para simulação de tamanhos de tela, Narrador do Windows; galeria HTML standalone utilizada em verificações anteriores.  
**Dados não recolhidos:** versões exatas do Windows/Chrome/Narrador, dimensões de janela em todas as etapas, e vídeo/gravação da narração; os retestes M-04 informaram altura 780px e abertura local da galeria standalone.  
**Caráter da evidência:** registro rastreável de teste humano **autodeclarado**, com capturas disponibilizadas também no comentário de evidências do GitHub; a aprovação SQA permanece independente. Não deve ser confundido com testes executados pelo CI, com auditoria independente da SQA nem com homologação dos ambientes móveis de produção.

## Matriz de resultados reportados

| ID | Teste / passos executados | Observação do executor | Resultado |
|---|---|---|---|
| M-01 | Navegar usando Tab; repetir Shift+Tab de volta ao início, observando foco | Foco laranja visível; `Shift + Tab` retorna um controle por vez; retorno até “Pular para o conteúdo principal” sem ficar preso | **PASS (relato)** |
| M-02 | Zoom 200% no Chrome e leitura/inspeção do conteúdo | “legível sem cortes” | **PASS (relato)** |
| M-03 | Zoom 400% no Chrome e leitura/inspeção do conteúdo | “legível sem cortes” | **PASS (relato)** |
| M-04 | Chrome DevTools modo dispositivo, larguras 320/390/768/1280px | Defeito do logotipo observado e corrigido; após atualização foram fornecidos E10–E13 do topo e E14/E15 de botões/formulários a 320px; outras seções não verificadas integralmente | **PASS visual parcial pós-correção nas áreas registradas** |
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
- **Foram anexadas 20 imagens à conversa do PR**, incluindo foco, zoom parcial, responsividade e estados de 320px, no [comentário de evidências](https://github.com/Aluvioz/Polychat/pull/143#issuecomment-7113613570). Os links E12/E13 foram reconstruídos a partir de fragmentos originais; sua carga HTTP e correspondência visual precisam de confirmação externa. As imagens não comprovam áudio/narração real ou exploração integral da página. Detalhes no [registro de auditoria](./issue-93-auditoria-contraste-e-pendencias-2026-11-23.md).

## Roteiro de reexecução por SQA (reproduzível)

1. Baixar `docs/ux/issue-93-galeria-standalone.html` do branch `docs/ponde-issue-93-design-system` e abrir no Chrome em Windows; anotar versões e se a página foi aberta via `file://` ou URL.
2. M-01: do início do documento, avançar com Tab até o último elemento; fazer todo o percurso inverso com Shift+Tab; verificar foco perceptível, ordem e ausência de bloqueio.
3. M-02/03: aplicar zoom 200%/400% e percorrer toda a página; registrar qualquer corte, sobreposição, rolagem lateral indevida ou conteúdo inacessível, incluindo dimensões da janela.
4. M-04: no modo Device Toolbar, testar 320/390/768/1280px com inspeção do conteúdo completo e captura de cada largura; executar posteriormente em navegadores/dispositivos homologados para regressão #129.
5. M-05: ativar Narrador do Windows (`Ctrl + Windows + Enter`), ler títulos, campos, erro de anexo e avisos de sucesso/erro/atenção. Registrar leitura de avisos **estáticos**; não afirmar que alertas inseridos dinamicamente foram testados.
6. M-06: avaliar CSS **renderizado** com ferramenta apropriada para cores/estados e documentar elementos não textuais essenciais; atenção à borda padrão atual `#64748B` sobre branco (4,76:1 por cálculo). Também medir estados hover, foco e pares específicos.
7. SQA: assinar revisão independente e relacionar bugs e correções; Tech Lead: decidir biblioteca/licença de ícones e aprovação do PR.

## Pendências para conclusão

- **Evidências:** 20 referências publicadas no GitHub; E12/E13 demandam confirmação de carga real. Não há prova gravada da narração, da sequência completa de teclado, de todos os estados renderizados ou da execução em aparelhos físicos. Referências não substituem a SQA independente.
- **Cobertura ainda insuficiente:** contraste não textual dos componentes renderizados, navegadores/dispositivos homologados, estados funcionais da aplicação (galeria não é aplicativo de produção), regressão.
- **Decisões externas:** biblioteca de ícones e licença (Tech Lead); ativos oficiais Ford (cliente/Comunicação); acesso ao preview Vercel protegido e disponibilidade do serviço.
- **Revisão:** PR ainda Draft e revisão `CHANGES_REQUESTED` até manifestação dos responsáveis.

> **Critério de integridade:** este relatório torna verificáveis os passos e registros de execução relatados, mas não cria uma prova de áudio, imagem, dispositivo físico ou aprovação SQA que ainda não existe.


## Atualização de rastreabilidade — 23/11/2026, após parecer SQA

- [Comentário GitHub com as 20 referências de imagens](https://github.com/Aluvioz/Polychat/pull/143#issuecomment-7113613570); URLs E12 e E13 reconstruídas dos fragmentos originais, ainda não comprovadas por inspeção da resposta HTTP; não há comprovação de incorporação binária na branch (anexos da Discussion).
- [Auditoria ampliada de contraste textual/não textual de tokens](./issue-93-auditoria-contraste-e-pendencias-2026-11-23.md), contemplando hover destrutivo com cor explícita, demais botões, campos, bordas, focos, badges e avisos. Trata-se de medição de valores CSS, **não análise da árvore renderizada**.
- **Ambiente conhecido:** Windows + Chrome + Narrador do Windows, galeria HTML standalone local via `file://`, Chrome DevTools para emulação 320/390/768/1280px e capturas com altura de 780px nos retestes pós-correção. **Versões exatas: NÃO INFORMADAS** (Windows: não informado; Chrome: não informado; Narrador: não informado). Não inferir versão do navegador a partir da sessão atual.
- **Vercel:** consulta do projeto `polyford` na equipe `polychat1` bloqueada com erro 403 de autorização. Tentativa de consentimento retornou 404 na conexão. **Preview remoto e renderização da galeria publicados: não validados**, demandam permissão do workspace/projeto.
- **Regressão/CI:** testes estáticos foram ampliados; execução CI e inspeção independente devem ser conferidas separadamente no head do PR. A execução não modifica runtime funcional, mas também não representa end-to-end.
- **Parecer SQA:** NÃO APROVAR NESTE MOMENTO; Tech Lead: `CHANGES_REQUESTED`. Manter PR Draft. Próximas ações dependentes: auditoria renderizada e SQA independente por Dante, decisão de ícones por Luiz, URL Preview habilitada pelo responsável Vercel.
