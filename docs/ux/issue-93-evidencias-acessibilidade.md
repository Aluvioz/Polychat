# Issue #93 — evidências e roteiro de verificação de acessibilidade

Data: 18/11/2026  
Branch: `docs/ponde-issue-93-design-system`  
PR: https://github.com/Aluvioz/Polychat/pull/143  
Revisão do Tech Lead: **CHANGES_REQUESTED** em 17/11/2026.

## 1. Correções realizadas nesta revisão

- Adicionado link **Pular para o conteúdo principal** visível ao receber foco.
- Adicionado destino `main#conteudo` e tratamento de foco.
- Adicionada quebra de conteúdo para reduzir estouro em larguras estreitas e zoom alto.
- Adicionados ajustes responsivos para largura até 420px.
- Adicionado tratamento `forced-colors: active` para bordas e foco.
- Exemplo de confirmação crítica deixou de apresentar botões falsamente acionáveis: controles viraram elementos demonstrativos estáticos, descritos como **não funcionais**. **Não equivale a um modal acessível implementado**.
- Mantidos e revisados rótulos, mensagens de erro, estados `role="alert"/"status"`, `:focus-visible` e `prefers-reduced-motion`.
- Criados os testes `tests/issue-93-a11y.test.mjs`, integráveis ao script existente `npm test` (`node --test tests/*.test.mjs`).

## 2. Evidências de inspeção estática — realizadas

| Verificação por leitura dos arquivos | Resultado | Evidência |
|---|---|---|
| `lang="pt-BR"` e meta viewport | Presente | `docs/ux/issue-93-galeria-standalone.html` |
| Âncora de salto para `main#conteudo` | Presente | HTML/CSS do UI Kit |
| 3 inputs com `label for=` correspondente | Presente | HTML; ids `identifier`, `password`, `filetype` |
| Campo inválido e texto de erro associado | Presente | `aria-invalid` e `aria-describedby` |
| Mensagens com papéis `alert`/`status` | Presente | HTML |
| Estilos de foco visível | Presente | `:focus-visible` |
| Responsividade declarada | Presente | Media queries 860/560/420px |
| Redução de movimento | Presente | `prefers-reduced-motion` |
| Contraste forçado | Presente | `forced-colors` |
| Não apresentar modal simulado como funcional | Corrigido | Confirmação demonstrativa sem botões interativos |

**IMPORTANTE:** “presente” significa inspeção de código, **não** que o comportamento visual/acessível tenha sido validado no navegador. Os testes automatizados no repositório precisam ter execução de CI confirmada separadamente.

## 3. Matriz de contraste textual — cálculo sRGB

| Cor de texto | Fundo | Razão calculada | WCAG AA normal (4,5:1) |
|---|---|---:|---|
| #003478 | #FFFFFF | 11,92:1 | Passa |
| #001F4D | #FFFFFF | 16,11:1 | Passa |
| #1769AA | #FFFFFF | 5,77:1 | Passa |
| #10243E | #FFFFFF | 15,63:1 | Passa |
| #64748B | #FFFFFF | 4,76:1 | Passa, margem pequena |
| #475569 | #FFFFFF | 7,58:1 | Passa |
| #027A48 | #FFFFFF | 5,41:1 | Passa |
| #B42318 | #FFFFFF | 6,57:1 | Passa |

**Não testado:** combinações não textuais, estados hover, placeholder, contraste do foco, ícones e bordas nos fundos reais. Estes pares também não comprovam acessibilidade total.

## 4. Roteiro manual reprodutível — execução parcial relatada em 23/11/2026

A galeria autocontida pode ser obtida no PR como `docs/ux/issue-93-galeria-standalone.html` em **Raw / Download raw file**, salva como `.html` e aberta no navegador. Não requer Vercel. O deployment Preview do grupo `polychat1` está protegido e não deve ser listado como prova de acesso público.

**Teclado:** navegar exclusivamente com Tab e Shift+Tab. Conferir foco visível em todos os botões e inputs, sem bloqueio de teclado; acionar controles que realmente implementem ação. O exemplo visual de confirmação NÃO implementa diálogo nem operações.

**Zoom/reflow:** testar a galeria em Chrome/Edge/Firefox, em largura de 1280px (100%, 200% e 400%) e nos tamanhos de referência 320px, 390px e 768px. Registrar se há rolagem horizontal indevida, cortes de texto e controles não alcançáveis. Especificar navegador, versão e viewport.

**Leitor de tela:** com NVDA (Windows), VoiceOver (macOS/iOS) ou TalkBack (Android), verificar título da página, sequência de seções, nomes de campos, indicação de erro e leitura de alertas; registrar leitor e versão.

**Contraste não textual:** conferir bordas de inputs, estados de foco, ícones e controles com ferramenta de análise de contraste ou axe DevTools, e corrigir achados com captura/URL do elemento.

**Relatório:** para cada caso, registrar ID, ambiente, passos, esperado, observado, PASS/FAIL, screenshot (quando aplicável), problema, correção/PR e responsável. Sem executar manualmente, manter status `NOT RUN`.

| ID | Caso | Status |
|---|---|---|
| M-01 | Tab/Shift+Tab em todos os controles e foco visível | PASS por relato para percurso direto/reverso e foco visível no Chrome; cobertura da galeria estática, sem certificação independente |
| M-02 | Zoom 200% com reflow e leitura preservados | PASS (relato do executor; cobertura/viewport não documentados) |
| M-03 | Zoom 400% com reflow e leitura preservados | PASS (relato do executor; cobertura/viewport não documentados) |
| M-04 | Larguras 320/390/768 e 1280px | RETESTE VISUAL PASS PARCIAL — prints atualizados confirmam cabeçalho/logo e cards iniciais em 320/390/768/1280px; demais seções/dispositivos não cobertos |
| M-05 | Leitor de tela com títulos, rótulos, erros e alertas | PASS por relato do executor com Narrador Windows/Chrome — títulos, rótulos, erro e 3 avisos; sem homologação independente |
| M-06 | Contraste não textual e estados de foco | PARTIAL — inspeção visual PASS por relato; borda padrão falhou 1,48:1 e foi corrigida para 4,76:1; cálculos CSS, não auditoria renderizada completa |
| M-07 | Teclado em modal funcional real (quando existir) | NOT APPLICABLE / PENDENTE DE IMPLEMENTAÇÃO |
| M-08 | Homologação institucional da marca e dos tokens oficiais pela Ford (não exigida para referência ilustrativa) | PENDING APPROVAL |

## 5. Critérios de aceite da #93 após esta revisão

- **Biblioteca e documentação:** entregues como proposta; revisão pendente.
- **Contraste textual:** pares principais calculados; cobertura completa pendente.
- **Acessibilidade:** melhorias no código e roteiro documentados; **testes manuais não executados**.
- **CI:** verificação estática adicionada; resultado do CI deve ser conferido no PR.
- **Homologação institucional de marca Q-019:** pendente da FORD; a galeria demonstrativa inclui referência do Ford Oval da Wikimedia Commons com atribuição e ressalva, sem alegação de aprovação oficial.
- **Aprovação PR:** ainda pendente; manter Draft enquanto o Tech Lead solicitar mudanças.
- **Sem regressão:** não demonstrado integralmente; os arquivos continuam isolados, sem mudança no runtime principal.

Não marcar “aprovado” ou “homologado” somente com estas evidências.


## 6. Referência visual Ford Oval — decisão do PO

A galeria apresenta a imagem publicada em [Wikimedia Commons — File:Ford logo.svg](https://commons.wikimedia.org/wiki/File:Ford_logo.svg) como referência visual da proposta. A origem classifica o desenho como domínio público para fins de copyright nos EUA, mas registra possível proteção marcária em determinadas jurisdições. O uso no protótipo não equivale a autorização da Ford, afiliação, patrocínio, endosso ou aprovação institucional. O caso M-08 permanece `PENDING APPROVAL` para qualquer homologação oficial de marca; a referência visual permanece acompanhada de fonte e ressalva.


## 7. Registro incremental de testes humanos — 23/11/2026

**Origem:** execução reportada pelo autor `ponde-web` em conversa de acompanhamento, com capturas de tela apresentadas na conversa (ainda **não** anexadas como arquivos à PR). **Ambiente:** Windows, Google Chrome, galeria HTML autocontida aberta localmente por `file://`; versão exata do navegador, resolução e dimensões da janela não informadas. **Avaliação:** autorrelato e inspeção visual parcial das capturas, não auditoria independente nem homologação SQA.

| Caso | Passos informados / evidência observada | Resultado e limitação |
|---|---|---|
| M-01 — foco e teclado | Autor percorreu controles usando Tab; capturas mostraram foco destacado por contorno nos campos Usuário/Anexo e no link “Pular para o conteúdo principal”. | **PASS por relato da navegação sequencial e reversa**: em 23/11/2026, autor confirmou que Shift+Tab repetido retorna até o link inicial, preservando foco visível e sem bloqueios. A galeria contém controles demonstrativos não funcionais; operação de ações funcionais e revisão independente permanecem fora do escopo confirmado. |
| M-02 — zoom 200% | Autor declarou: “200% — legível sem cortes” após orientação para ampliar o zoom no Chrome. | **PASS (relato)**: não houve relato de corte; sem vídeo, dimensões de viewport, versão ou confirmação independente de reflow/rolagem horizontal em todas as seções. |
| M-03 — zoom 400% | Autor declarou: “400% — legível sem cortes”. | **PASS (relato)**: mesma limitação do caso M-02; registrar screenshots no PR para elevar rastreabilidade. |
| M-04 — múltiplos viewports/navegadores | Em 23/11/2026, executor relatou emulação de viewport no Chrome em 320px, 390px, 768px e 1280px, todos sem cortes/sobreposições. | **PASS por relato nas quatro larguras Chrome**. Não foram verificadas outras engines/navegadores ou aparelhos físicos; screenshots e versões pendentes. |
| M-05 — leitor de tela | Em 23/11/2026, autor ativou Narrador do Windows no Chrome e relatou navegação/leitura correta dos títulos, dos campos Usuário, Senha, Anexo e da mensagem de erro do anexo. | **PASS por relato nos elementos verificados** (títulos, campos, erro e avisos; ver seção 7.2). Falta anexar evidências auditáveis. Teste com Narrador não demonstra comportamento do NVDA. |
| M-06 — contraste não textual | Executor relatou bordas, foco e botões distinguíveis; observou vermelho do erro parecido, mas legível. Cálculo sRGB mostrou borda padrão 1,48:1 (falha), corrigida no token para 4,76:1; erro 6,57:1. | **PARTIAL** — erro encontrado e corrigido no código, falta reteste renderizado, itens secundários e evidências. |
| M-07 — modal funcional | A galeria demonstra confirmação estática, sem foco modal, Escape e retorno. | **N/A para a galeria estática**; validar quando o componente funcional existir. |
| M-08 — identidade visual | PO definiu paleta de referência provisória em Q-019; pacote autorizado e regras corporativas permanecem ausentes. | **PARCIAL / PENDING APPROVAL**: não confundir decisão do PO para proposta com homologação da marca. |

### Evidências para anexar e próxima rodada

1. **Autor:** anexar capturas originais dos passos Tab, zoom 200% e 400% à PR ou criar arquivo de evidências com data, browser/versão, dimensão viewport e resultado observado. O presente registro **não afirma** que as capturas foram anexadas no GitHub.
2. **SQA + autor:** executar Shift+Tab completo, larguras 320/390/768px, testes de leitor de tela (identificar produto/versão), bordas/estados/indicador de foco e registrar PASS/FAIL com imagens ou vídeo. Não marcar sem executar.
3. **Tech Lead:** definir tecnologia/família/licença de ícones; o `package.json` desta branch atualmente não contém dependência de ícones. **Sugestão a avaliar:** Lucide (pacote React, ícones SVG com rótulos semânticos quando necessários), sujeita à confirmação técnica e da licença antes de registrar como decisão final. Não se adicionou dependência ao runtime.
4. **Responsável Vercel:** validar preview protegido com acesso autorizado. O acesso local `file://` **não** comprova deploy; comentários recentes do bot Vercel apontaram limite do plano gratuito (mais de 100 deploys/dia), exigindo nova checagem quando a cota permitir.
5. **Revisores:** nova avaliação após evidências; solicitação `CHANGES_REQUESTED` permanece até reavaliação do Tech Lead.

**Nota de rastreabilidade:** este registro documenta relatos existentes; não transforma relato sem anexos em teste independente e não altera o resultado de revisão SQA.


### 7.1 Complemento de leitor de tela — 23/11/2026

O executor confirmou que o Narrador do Windows foi ativado no Chrome com `Ctrl + Windows + Enter` e anunciou títulos de seção corretamente ao navegar com o recurso de cabeçalhos. Em seguida reportou resultados `pass` para os três campos identificados como **Usuário**, **Senha** e **Anexo**, além da **mensagem de erro do anexo**. Nenhuma observação adversa foi relatada. O ambiente de teste informado é Windows + Chrome, sem versões exatas; a URL/instância exata (local versus publicada) dessa etapa não foi confirmada.

**Classificação:** M-05 **PASS por relato nos subcasos executados**, incluindo avisos conforme seção 7.2. Captura da narração, vídeo, versões de software e aprovação independente SQA permanecem pendentes. Não tratar como homologação geral de acessibilidade.


### 7.2 Avaliação dos três avisos com Narrador — 23/11/2026

O executor informou que, no teste M-05 utilizando **Narrador do Windows no Chrome**, conseguiu **ler corretamente os três avisos** da seção “Feedback e estados”: sucesso (“Mensagem enviada com sucesso.”), erro (“Não foi possível concluir. Tente novamente.”) e atenção (“Sessão expirada. Faça login novamente.”). **Resultado: PASS por relato para leitura dos três avisos estáticos**. A inspeção do HTML também confirmou os atributos `role="status"` (sucesso e atenção) e `role="alert"` (erro). A leitura de conteúdo estático não demonstra anúncio automático quando uma mensagem é inserida dinamicamente; esta galeria não implementa tal interação.

**Limitações:** a versão do Narrador/Chrome, a URL exata aberta, gravação de voz e evidência auditável anexada ao GitHub não foram fornecidas. O resultado não equivale a certificação geral de acessibilidade nem substitui revisão SQA.


### 7.3 Responsividade — Chrome emulação de viewport, 23/11/2026

O executor reportou o caso M-04 com a ferramenta de visualização responsiva do Chrome (F12, modo dispositivo), observando em quatro larguras **320px, 390px, 768px e 1280px** ausência de cortes de texto e de sobreposições. Todos os quatro subcasos foram reportados **PASS**. É uma execução manual baseada no relato do autor, **não teste automatizado**, e não equivale a homologação em Android/iOS ou Edge/Firefox. Versão exata do Chrome, altura do viewport, rolagem lateral em toda a página e capturas de evidência não foram informadas ou anexadas ao PR. Registrar quando disponíveis. A avaliação SQA permanece independente.


### 7.4 Contraste não textual — inspeção e correção, 23/11/2026

O executor reportou inspeção visual **PASS** para bordas, foco e estados dos botões no Chrome, acrescentando que o vermelho do campo “Exemplo de erro” parecia semelhante a outros tons mas era claramente distinguível. **A inspeção visual não substitui medição WCAG.** A análise estática dos tokens CSS encontrou um problema que o teste visual não detectou: borda padrão `--pc-border: #CBD5E1` contra branco com **1,48:1**, inferior à referência WCAG 2.2 AA 1.4.11 para informação visual essencial de componentes (3:1). Corrigimos o token em ambas as folhas CSS e na galeria independente para `#64748B`, que mede **4,76:1** contra branco. O texto e a borda de erro `#B42318` contra branco medem **6,57:1**, portanto o tom vermelho observado não falha nesses pares.

| Par de contraste, cálculo sRGB | Razão | Referência | Resultado |
|---|---:|---:|---|
| Borda padrão antes `#CBD5E1` / branco | 1,48:1 | 3:1 | FAIL antes da correção |
| Borda padrão atual `#64748B` / branco | 4,76:1 | 3:1 | PASS calculado |
| Borda vermelha inválida `#B42318` / branco | 6,57:1 | 3:1 | PASS calculado |
| Texto de erro `#B42318` / branco | 6,57:1 | 4,5:1 | PASS calculado |
| Anel de foco `#B45309` / branco | 5,02:1 | 3:1 | PASS calculado |
| Anel de foco `#B45309` / fundo `#F0F0F0` | 4,41:1 | 3:1 | PASS calculado |
| Texto de botão desabilitado `#475569` / `#E2E8F0` | 6,15:1 | não exigido para controle inativo | Informativo |
| Borda do aviso de erro `#B42318` / `#FEF3F2` | 6,05:1 | 3:1 | PASS calculado |
| Borda do aviso de sucesso `#027A48` / `#EAF7F0` | 4,91:1 | 3:1 | PASS calculado |
| Borda do aviso de atenção `#854D0E` / `#FEF9C3` | 6,38:1 | 3:1 | PASS calculado |

**Cuidados:** itens inativos têm exceção específica em WCAG 1.4.11; cartões e divisórias puramente decorativas não exigem automaticamente 3:1. A mudança no token também escurece divisórias decorativas por reutilização, aceitável como proposta mas sujeita à revisão de UX. Um teste novo em `tests/issue-93-a11y.test.mjs` garante um subconjunto dos pares essenciais. Este cálculo é feito para cores especificadas, não comprova opacidade, anti-aliasing, temas, todos os hover/foco e combinação renderizada em navegador. O reteste visual **após a correção** foi reportado como PASS pelo executor em 23/11/2026; evidências de execução do CI e auditoria SQA independente ainda precisam ser confirmadas antes de encerrar integralmente M-06.


### 7.5 Reteste visual de bordas após correção — 23/11/2026

Após baixar a galeria independente atualizada e inspecionar a seção de formulários no Chrome, o executor informou: **“as bordas estão mais nítidas e sem problemas”**. Registro **PASS por relato** para o reteste visual da borda padrão corrigida (`--pc-border` de `#CBD5E1` para `#64748B`). O contraste calculado do novo token sobre branco é **4,76:1**, acima de 3:1; o reteste visual complementa, mas não substitui, a medição numérica. Não foi fornecida captura de tela do reteste nem versão exata do Chrome. M-06 continua com escopo mais amplo parcialmente pendente (demais estados, contraste de ícones e componentes renderizados, revisão SQA).


### 7.6 Complemento M-01 — percurso reverso com Shift + Tab (23/11/2026)

Após orientar que Shift + Tab retorna **um elemento por vez** (e não diretamente ao topo), o executor confirmou **sim** às duas perguntas: (1) Shift + Tab repetido permitiu voltar pelos elementos ao link “Pular para o conteúdo principal”; (2) a indicação visual de foco permaneceu visível e não houve bloqueio/armadilha de teclado percebido. **Resultado: PASS por relato para avanço com Tab e retorno com Shift + Tab na galeria estática em Chrome/Windows.** Não houve gravação do percurso nem versão exata de Chrome informada; isso não valida interações de um modal funcional nem substitui revisão SQA.


### 7.7 Reavaliação M-04 — defeito real identificado em novas capturas (23/11/2026)

O executor enviou capturas de **390×780, 768×780 e 1280×780 px** usando modo Responsivo do Chrome DevTools. As capturas mostraram **Ford Oval desproporcionalmente grande**, cortado à direita no viewport de 390px, e ocupando área excessiva em 768px e 1280px. Portanto, o resultado anterior M-04 `PASS por relato` **não pode ser usado como validação global**. O escopo está **REOPENED/FAIL observado nas capturas antigas**. As capturas devem ser preservadas como **evidência de defeito pré-correção**, não como aprovação. O print de 320px mostrou seção de cards mas não todo o cabeçalho.

**Causa raiz no código:** a galeria autocontida `docs/ux/issue-93-galeria-standalone.html` continha `<img class="pc-ford-mark">` sem as regras `.pc-ford-mark` e `.pc-brand-lockup` presentes em `docs/ux/issue-93-design-tokens.css`. Em consequência, o navegador renderizou o SVG/PNG do logotipo sem dimensão limitada no HTML standalone. **Correção commit `f9bcc801d3bfa0b5d8afbe45e819afbaea038c8f`:** sincronizamos o bloco `<style>` da galeria standalone com a folha CSS documentada, incluindo `width:104px`, `height:auto`, `max-height:42px` e estilos da marca; o CSS principal já continha esses limites. **Teste estático de regressão:** `tests/issue-93-a11y.test.mjs` atualizado para exigir as regras da imagem e do lockup também no standalone.

**Status correto:** **FIXED IN SOURCE / RETEST PENDING**. Fazer download **novo** do HTML atualizado e repetir as dimensões 320/390/768/1280px; verificar cabeçalho, cards e ausência de rolagem horizontal. Somente depois registrar `PASS` para a correção. Não alegar que o bug foi validado em dispositivo físico ou que passou em CI sem conferir workflows.


### 7.8 Reteste após correção do logotipo — 23/11/2026

O executor enviou novas capturas do Chrome DevTools após baixar a galeria standalone com CSS sincronizado. **390×780 px:** logotipo reduzido e íntegro, cabeçalho em duas linhas, cartões em uma coluna. **320×780 px:** logotipo proporcional, texto e cartão inicial sem corte perceptível na região exibida. **768×780 px:** cabeçalho compacto e paleta organizada em duas colunas. **1280×780 px:** cabeçalho compacto e paleta em quatro colunas. **Resultado: PASS visual no trecho fotografado das quatro larguras, confirmando a correção do logo.** Comparar com os prints de falha pré-correção mantidos no histórico. As capturas e o ZIP consolidado foram montados na conversa do executor, mas **não foram anexados ao GitHub neste commit**. Ainda não comprova percurso integral da página, outros navegadores ou dispositivos físicos; SQA deve avaliar se exige as capturas das seções 03 e 04 em cada dimensão.
