# Polychat Design System — proposta v0.1 (Issue #93)

> **Estado:** proposta de UX/UI v0.1; revisão documental preliminar do PO realizada em 19/11/2026. Não constitui aprovação final da FORD, validação SQA/Tech Lead nem homologação de acessibilidade.  
> **Issue:** https://github.com/Aluvioz/Polychat/issues/93  
> **Autor da branch:** conta GitHub `ponde-web`, colaboração prevista com `Dante-Davi`.  
> **Data:** 17/11/2026.  
> **Escopo:** dois perfis independentes — **Usuário web mobile** (#91) e **TI desktop** (#92). Não altera a aplicação atual.

## 1. Artefatos entregues

- [Tokens e componentes demonstrativos CSS](./issue-93-design-tokens.css) — arquivo isolado em `docs/ux`; não é importado pela aplicação.
- [Galeria de componentes HTML](./issue-93-galeria.html) — demonstração estática com estados, controles e padrões do produto. Abrir o HTML localmente com o CSS no mesmo diretório para visualização. Botões não realizam operações reais.
- Este documento — linguagem visual, princípios, catálogo, acessibilidade, responsividade, critérios de revisão e pendências.

A paleta de referência do Design System foi atualizada para a direção cromática provisória definida pelo PO em Q-019: Ford Blue `#00095B`, Ford Twilight `#00142E`, Ford Skyview `#066FEF`, branco `#FFFFFF`, cinza claro `#F0F0F0` e preto suave `#0F0F0F`. Os códigos orientam a proposta visual, mas não substituem o pacote de marca fornecido/autorizado pela FORD. **Não utilizar nem reconstruir o Ford Oval sem arquivo oficial autorizado**. Até lá, identificar o produto apenas pelo nome textual Polychat.

## 2. Princípios de UX

1. **Simplicidade:** operações de mensagem e leitura devem ser reconhecíveis; não adicionar recursos fora do escopo confirmado.
2. **Perfis separados:** Usuário em celular; TI em computador. A restrição visual/dispositivo **não substitui permissão e autorização no servidor**.
3. **Ação segura:** operações administrativas críticas devem deixar clara a consequência e permitir confirmação explícita. A confirmação visual não altera as permissões já definidas para o TI nem cria exigência de justificativa ou segunda aprovação.
4. **Feedback inequívoco:** distinguir sucesso, erro, carregamento, sem dados, sem conexão e sessão expirada, sempre com texto além da cor.
5. **Acessibilidade:** projetar teclado, foco, contraste, rótulos e ordem de leitura desde a biblioteca. A FORD não definiu requisitos adicionais específicos para o programa inicial (Q-020 resolvida); obrigações legais ou corporativas aplicáveis continuam válidas.

## 3. Tokens propostos

| Token CSS | Valor | Uso | Fonte |
|---|---|---|---|
| `--pc-brand-700` | `#00095B` | Ford Blue: botões primários, navegação e elementos de marca do produto | Paleta provisória Q-019 |
| `--pc-brand-900` | `#00142E` | Ford Twilight: cabeçalhos e superfícies azuis profundas | Paleta provisória Q-019 |
| `--pc-brand-600` | `#066FEF` | Ford Skyview: links e acentos; branco em texto de botão exige contraste validado | Paleta provisória Q-019 |
| `--pc-brand-050` | `#F0F0F0` | Fundo neutro claro e separadores | Token neutro do produto |
| `--pc-ink` | `#0F0F0F` | Texto principal sobre superfícies claras | Token neutro do produto |
| `--pc-text-secondary` | `#475569` | Texto secundário | Proposta |
| `--pc-text-muted` | `#64748B` | Metadados em fundo branco | Existente |
| `--pc-surface` | `#FFFFFF` | Cards/formulários | Existente |
| `--pc-background` | `#F0F0F0` | Fundo neutro da aplicação | Token neutro da paleta provisória |
| `--pc-border` | `#CBD5E1` | Delimitadores, entradas | Proposta |
| `--pc-success` | `#027A48` | Sucesso textual em fundo branco | Proposta |
| `--pc-error` | `#B42318` | Erro e ação destrutiva | Proposta |
| `--pc-warning-text` | `#854D0E` | Texto de cautela | Proposta |
| `--pc-focus` | `#B45309` | Anel de foco de 3px, deslocamento 3px | Proposta |
| `--pc-space-*` | 4, 8, 12, 16, 24, 32, 48px | Escala de espaçamento | Proposta |
| `--pc-radius-*` | 6, 10, 16px | Bordas | Proposta |
| `--pc-font` | Arial, Helvetica, sans-serif | Substituto até manual de marca | Proposta |

**Tipografia:** base 16px/entrelinha 1,5; apoio 14px; títulos de componente 20px; título de seção 28px; título principal responsivo. Pesos 400, 700 e 800, conforme necessidade; evitar variações sem propósito. Textos de erro nunca menores que 14px.

**Espaçamento:** adotar escala em múltiplos de 4px, com toques e controles de pelo menos 44px de altura na galeria. Não depender apenas de área colorida para indicar clique.

## 4. Contraste — verificação numérica preliminar

Razões calculadas com luminância relativa sRGB e fórmula `(L_clara + 0,05) / (L_escura + 0,05)`. **Avaliadas apenas nestes pares exatos**, não como homologação de todas as combinações ou estados da interface.

| Primeiro plano / fundo | Razão | WCAG 2.2 AA texto normal (≥ 4,5:1) |
|---|---:|---|
| `#00095B` / `#FFFFFF` | 17,64:1 | Passa |
| `#FFFFFF` / `#00095B` | 17,64:1 | Passa |
| `#00142E` / `#FFFFFF` | 18,43:1 | Passa |
| `#FFFFFF` / `#066FEF` | 4,64:1 | Passa, margem estreita |
| `#0F0F0F` / `#FFFFFF` | 19,17:1 | Passa |
| `#64748B` / `#FFFFFF` | 4,76:1 | Passa, margem estreita |
| `#475569` / `#FFFFFF` | 7,58:1 | Passa |
| `#B42318` / `#FFFFFF` | 6,57:1 | Passa |
| `#027A48` / `#FFFFFF` | 5,41:1 | Passa |
| `#00095B` / `#F0F0F0` | 15,48:1 | Passa |

**Restrições da evidência:** não foi feito teste automatizado de navegador, imagem renderizada, zoom, inversão de cor, contraste não textual, leitor de tela, mobile ou navegação completa por teclado. O par `#64748B` tem pouca margem e deve ser reavaliado se houver mudança de fundo/opacity. Não use códigos sem conferir o fundo efetivo.

## 5. Catálogo de componentes e contratos

| Componente | Variantes/estados mínimos | Comportamento esperado |
|---|---|---|
| Botão | Primário, secundário, destrutivo; normal, hover, foco, desabilitado, carregando | Ação explícita; foco visível; desabilitar ação duplicada durante processamento quando necessário |
| Input / select / textarea | Padrão, foco, inválido, desabilitado, ajuda | Rótulo associado; erro em texto junto ao campo, associado via `aria-describedby` |
| Lista de conversas | Com conteúdo, vazio, carregando, erro, offline | Exibir título/participante e resumo, navegação por teclado, sem revelar conversas não autorizadas |
| Tela de mensagem | Própria/recebida, enviando, enviada, falha, anexo | Ordenação e distinção textual; PDF/JPEG apenas; sem áudio, vídeo ou câmera embutida |
| Badges | Neutro, sucesso, pendente | Sempre incluir texto, não codificar status só com cor |
| Aviso / feedback | Sucesso, erro, cautela, informação | Mensagem compreensível com solução quando houver; usar `role=status`/`alert` adequadamente |
| Estado vazio | Conversas, grupos, alertas, busca | Explicar ausência de dados, sem ação não autorizada |
| Modal de confirmação | Desativação de conta e outras ações críticas aprovadas | Consequência clara, botão Cancelar, confirmação separada; em implementação, gerir foco e retorno ao acionador |
| Navegação | Mobile Usuário, desktop TI | Mostrar funções permitidas; controle real de permissões obrigatoriamente no servidor |
| Alertas de TI | Pendente, em revisão, encaminhado **se política permitir** | Não presumir bloqueio ou punição automática |
| Consulta/auditoria TI | Permissão, ausência de registros, erro | Visibilidade, rastreabilidade e retenção dependem de governança aprovada |
| Anexo | PDF, JPEG, inválido, excedente | Aceitar somente PDF/JPEG; até 10 MB por arquivo e até 5 arquivos por mensagem; quotas individuais e capacidade total definidas pelo TI; PDF protegido por senha deve ser recusado; falha/inconclusão antimalware mantém o arquivo bloqueado no fluxo normal |

### Uso correto por perfil

- **Usuário mobile:** login por credenciais fornecidas pela TI, lista de conversas, chat individual e de grupo, anexos PDF/JPEG, estados offline e sessão expirada. **Não incluir cadastro aberto, criação de grupos ou convite de participantes.**
- **TI desktop:** login, dashboard, criação/alteração/desativação/reativação de contas, criação e gestão de grupos, inclusão/remoção de participantes, consulta e exportação de conversas, alertas, auditoria e configurações sob sua responsabilidade. Todos os administradores TI possuem poderes equivalentes; não há administrador principal nem segunda aprovação. TI pode editar/excluir mensagens e encerrar alertas sem justificativa obrigatória.

## 6. Layout, responsividade e navegação

Proposta de **breakpoints de desenvolvimento**, não homologação de dispositivos:
- Até 560px: uma coluna, controles largos, espaçamento reduzido e navegação mobile clara.
- Entre 561 e 860px: duas colunas quando houver espaço e conteúdo.
- Acima de 860px: até três colunas de componentes, com largura de conteúdo limitada a 1120px.

A galeria inclui media queries para os pontos acima. **Não usar apenas viewport para decidir se alguém é Usuário ou TI**; RF-017 e RF-018 exigem regra específica, e a validação de perfis precisa ocorrer no servidor.

Iconografia: recomendar uma única família de ícones vetoriais para toda interface; tamanho 20–24px, traço regular, rótulo acessível quando a ação for representada só por ícone. Nenhuma biblioteca ou licença de ícones foi selecionada nesta proposta.

## 7. Checklist de acessibilidade para revisão

| Critério de design | Situação / evidência |
|---|---|
| Contraste texto/tema principal | **Amostras calculadas** na seção 4 |
| Label ligado a input | **Exemplo presente** no HTML com `for/id` |
| Erro comunicado por texto | **Exemplo presente** via `aria-invalid`/`aria-describedby` |
| Foco visível | **CSS definido** com `:focus-visible`, ainda sem validação em navegador |
| Alvo de controle 44px | **CSS definido** em botões e campos de formulário |
| Mensagens não dependem só de cor | **Exemplos presentes** com rótulos |
| Movimento reduzido | **CSS definido** via `prefers-reduced-motion` |
| Sequência de Tab/Shift+Tab | **Pendente de teste manual** |
| Modal funcional, escape e retorno de foco | **Pendente de implementação e teste** — galeria é apenas estática |
| Leitor de tela, zoom 200%/400%, reflow | **Pendente** |
| Contraste de bordas/indicadores e estados desabilitados | **Pendente de verificação completa** |
| QA em navegadores/dispositivos homologados | **Matriz definida pela FORD (Q-012 resolvida); execução/homologação pendente na #129** |

### Plano mínimo para teste humano (não executado)

1. Abrir `issue-93-galeria.html` com o CSS no mesmo diretório e percorrer botões/inputs usando **Tab**, **Shift+Tab** e **Enter/Espaço** quando aplicáveis.
2. Conferir a visibilidade do foco, o vínculo de rótulos e leitura de erros.
3. Testar viewport 320px, 390px, 768px e 1280px, além de zoom 200%/400%, observando rolagem lateral e quebra de layout.
4. Executar axe/Lighthouse e leitor de tela, registrar evidências e defeitos; corrigir antes da aprovação.
5. Para o modal de produção, validar foco inicial, contenção, Escape e retorno ao elemento acionador.

## 8. Decisões pendentes e dependências

| Ponto | Referência | Dono sugerido |
|---|---|---|
| Arquivo autorizado do Ford Oval e regras específicas de aplicação/tipografia, se existentes | Q-019; POLY-UX-DEC-001 | FORD / Comunicação |
| Evidências de acessibilidade/homologação | #129; obrigações aplicáveis, sem requisito adicional específico da FORD (Q-020 resolvida) | PO / SQA / UX |
| Matriz de navegadores e dispositivos | Q-012 resolvida: Usuário em Android/iOS com Chrome/Safari móveis atuais; TI em computador com Chrome/Edge/Firefox atuais; tablets não permitidos | TI / SQA |
| Arquitetura da informação e catálogo de telas | Q-018 resolvida; decisões registradas em POLY-UX-DEC-001 | PO / UX |
| Regras de câmera/JPEG e limites de anexos | Q-004 e Q-011 resolvidas; implementação e testes permanecem pendentes | Desenvolvimento / SQA |
| Remoção de integrantes e edição/exclusão de mensagens | Q-003 e Q-024 resolvidas; TI executa ações, com revogação de acesso/auditoria conforme baseline | Desenvolvimento / SQA |
| Regras de detecção, alertas e consulta administrativa | Q-007, Q-008 e Q-009 resolvidas; implementar fila, severidades/prazos e auditoria conforme baseline | Desenvolvimento / SQA / TI |
| Username, senha inicial e recuperação | Q-005 e Q-006 resolvidas; implementar provisionamento e recuperação pelo TI | Desenvolvimento / TI |
| Escolha definitiva de biblioteca de ícones e tecnologia dos componentes | Arquitetura/ADR pendente | Tech Lead |

## 9. Critérios de aceite da #93 — situação honesta

| Critério | Estado |
|---|---|
| Biblioteca e documentação entregues | **Proposta entregue** como HTML + CSS + este documento |
| Contraste avaliado | **Amostras numéricas verificadas**; testes amplos pendentes |
| Teclado avaliado | **Checklist e estilos preparados**, teste manual pendente |
| Testes relevantes automatizados ou evidência documentada | **Evidência documental parcial**, testes de navegador não executados |
| Revisão por PR concluída | **Pendente** |
| Ausência de regressões | **Não demonstrada**; arquivos ficam isolados em `docs/ux`, sem alterar produção |

**O que falta antes de fechar:** revisão por Tech Lead/SQA/PO e execução das verificações de acessibilidade pertinentes, com evidências. A paleta provisória de Q-019 já está definida e pode orientar a proposta; permanece pendente somente o arquivo oficial autorizado do Ford Oval e eventuais regras corporativas específicas de aplicação/tipografia. A matriz de dispositivos Q-012 e o escopo de acessibilidade adicional Q-020 não são pendências de requisitos. Referência à Epic #78. Não fechar a issue sem satisfazer os critérios.

*Esta biblioteca não contém permissões funcionais ou sistemas reais e não deve ser vendida como implementação pronta do design system de produção.*


## 10. Parecer de produto — revisão PO de 19/11/2026

### 10.1 Decisão sobre a versão 0.1

O PO considera a versão 0.1 **adequada como proposta de trabalho e referência para continuidade do design**, pois reúne tokens, padrões de componentes, exemplos por perfil, estados de feedback, responsividade e um roteiro inicial de acessibilidade.

Este parecer é **favorável à continuidade da revisão**, não à homologação final do Design System. A versão atual ainda não deve ser tratada como identidade visual oficial da FORD, biblioteca aprovada para produção ou evidência de conformidade completa. A implementação funcional do Polychat ainda não começou; os arquivos desta PR são demonstrações estáticas e não componentes integrados ao runtime.

### 10.2 O que pode ser considerado aceito nesta etapa

- A separação de experiência entre Usuário mobile e TI desktop, mantendo as restrições funcionais já registradas nas Issues #91 e #92.
- A organização dos tokens em nomes semânticos, com valores provisórios isolados dos estilos da aplicação.
- O catálogo inicial de botões, campos, listas, avisos, estados vazios e confirmações demonstrativas.
- A orientação de feedback textual, foco visível, rótulos de formulário, movimento reduzido e alvos de interação ampliados como princípios de design.
- As regras de negócio atuais por perfil: Usuário mobile e TI desktop, incluindo remoção de participantes, consulta/exportação, alertas, auditoria e gestão de mensagens pelo TI.
- A distinção explícita entre galeria estática e funcionalidades reais do produto.

Esses pontos podem orientar a próxima rodada de revisão e refinamento, sem autorizar importação dos arquivos de demonstração para o runtime.

### 10.3 O que continua sem aprovação

| Tema | Situação | Condição para aprovação |
|---|---|---|
| Paleta provisória Ford | Definida pelo PO em Q-019 e refletida nos tokens | Usar nos protótipos e na documentação; não declarar como aprovação integral do manual corporativo |
| Ford Oval e regras específicas de tipografia/aplicação | Arquivo oficial/autorizado ainda não fornecido | Aplicar somente após recebimento dos ativos e orientações autorizados pela FORD |
| Critérios de acessibilidade aplicáveis | Q-020 resolvida: FORD não definiu exigências adicionais para o programa inicial | Manter obrigações legais/corporativas aplicáveis e concluir testes/evidências de acessibilidade pertinentes |
| Contraste de todos os componentes e estados | Parcial; cálculos cobrem pares selecionados | Medir texto, bordas, ícones, foco, hover, desabilitado e fundos efetivamente renderizados |
| Navegação por teclado | Testes manuais pendentes | Executar Tab/Shift+Tab e validar ordem, foco e operação dos controles |
| Zoom e reflow | Testes manuais pendentes | Validar 200%/400% e larguras de referência, sem perda de conteúdo ou funcionalidade |
| Leitor de tela | Teste pendente | Executar e registrar leitor, versão, ambiente, resultados e problemas |
| Biblioteca de ícones | Não selecionada | Tech Lead definir família, versão, licença e convenção de uso |
| Navegadores e dispositivos | Q-012 resolvida; matriz definida pela FORD | Executar homologação e registrar versões efetivamente testadas na Issue #129 |
| Publicação da galeria | Arquivos versionados; acesso hospedado precisa de confirmação manual | Abrir a URL do Preview e registrar resultado, ambiente e data |
| Aplicação no runtime | Não autorizada por esta proposta | Revisão técnica, acessibilidade, design/brand e aceite da etapa concluídos |

### 10.4 Ações para reavaliação

1. **UX/UI:** corrigir inconsistências visuais e documentar variantes/estados que ainda não estejam demonstrados na galeria.
2. **FORD/Comunicação:** fornecer o arquivo autorizado do Ford Oval e eventuais regras específicas de tipografia/aplicação; a paleta cromática provisória já foi definida pelo PO e registrada em POLY-UX-DEC-001.
3. **Tech Lead:** selecionar a biblioteca de ícones e revisar a estratégia de manutenção dos tokens e componentes.
4. **QA/SQA:** executar os casos manuais M-01 a M-08 aplicáveis no documento \`issue-93-evidencias-acessibilidade.md\`, anexando evidência reproduzível. Casos não executados devem permanecer \`NOT RUN\` ou \`PENDING\`.
5. **QA/SQA:** complementar a avaliação de contraste para estados e componentes efetivamente renderizados, incluindo foco, bordas e controles desabilitados.
6. **Responsável pelo deployment:** confirmar que a galeria publicada abre corretamente no Preview e registrar URL, navegador, data e resultado.
7. **Revisores:** atender aos apontamentos \`CHANGES_REQUESTED\` do Tech Lead e ao parecer SQA antes de solicitar nova avaliação independente.

### 10.5 Critério de decisão para a Issue #93

A Issue #93 deve permanecer aberta e a PR #143 deve permanecer em Draft até que:

- a documentação e a biblioteca demonstrativa estejam revisadas;
- a paleta provisória Ford esteja formalmente registrada (concluído em Q-019), mantendo o uso do Ford Oval condicionado ao arquivo autorizado;
- os testes de teclado, zoom/reflow, leitor de tela e contraste aplicáveis tenham evidências;
- a seleção de ícones e sua licença estejam documentadas;
- a galeria hospedada tenha sido verificada;
- Tech Lead e SQA concluam nova revisão;
- os checks e a avaliação de regressão aplicáveis estejam registrados.

**Conclusão do PO:** a versão 0.1 pode ser usada como base de discussão e refinamento. Não está aprovada para produção, não substitui homologação de acessibilidade e não autoriza fechar a Issue #93.



## Atualização de decisões de produto — 20/11/2026

Q-018 foi resolvida pelo PO: o mapa de telas e a navegação por perfil estão registrados em [POLY-UX-DEC-001](./decisoes-produto-q018-q019.md). Q-019 possui paleta cromática provisória definida (`#00095B`, `#00142E`, `#066FEF`, branco e neutros); o arquivo autorizado do Ford Oval e eventuais regras corporativas específicas permanecem pendentes. A galeria e os tokens desta PR refletem a paleta provisória, sem alterar o runtime.
