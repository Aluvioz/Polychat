# Decisões de produto — Q-018 e Q-019

**Identificador:** POLY-UX-DEC-001  
**Versão:** 1.0  
**Data:** 20/11/2026  
**Responsável pela decisão:** Product Owner  
**Estado:** Q-018 resolvida; Q-019 definida provisoriamente quanto à paleta, com obtenção do arquivo oficial de marca ainda pendente.

Este documento consolida as decisões de produto sobre arquitetura da informação e identidade visual do Polychat. Ele complementa a baseline POLY-REQ-001 e prevalece sobre propostas de navegação ou cores anteriores que conflitem com as decisões abaixo. Não declara telas implementadas nem homologação de marca ou acessibilidade.

## 1. Q-018 — Arquitetura da informação e catálogo de telas

### 1.1 Princípios de navegação

- A experiência é separada por perfil: **Usuário em celular** e **TI em computador**.
- Após autenticação, cada perfil é encaminhado à sua área inicial permitida.
- A navegação apresenta somente funções previstas nos requisitos confirmados; não criar páginas ou configurações sem necessidade de produto.
- A interface é exclusivamente em português.
- A navegação e a visibilidade dos controles não substituem autorização server-side.
- Estados de carregamento, vazio, erro, sessão expirada, conexão indisponível e acesso negado fazem parte das telas correspondentes; não são novas áreas de navegação.

### 1.2 Usuário — aplicação web mobile

**Destino inicial:** Conversas recentes.

| Código | Tela / área | Conteúdo e responsabilidade |
|---|---|---|
| U-01 | Login | Nome de usuário, senha, ação de entrar e mensagens genéricas de autenticação. Sem cadastro público ou recuperação pelo usuário. |
| U-02 | Aviso de monitoramento | Aviso apresentado no primeiro acesso, conforme RF-023. Sua exibição não deve ser confundida com uma nova etapa de consentimento não prevista. |
| U-03 | Conversas recentes | Lista unificada de conversas individuais e grupos aos quais o usuário tem acesso, ordenada pelas mais recentes, com indicadores e quantidade de mensagens não lidas. É a única área principal de navegação do perfil. |
| U-04 | Selecionar usuário | Busca/seleção de usuário ativo para iniciar conversa individual. É um fluxo acionado a partir de Conversas, não uma aba permanente de Contatos. |
| U-05 | Conversa | Tela reutilizável para conversa individual ou em grupo: identificação do interlocutor/grupo, histórico paginado, mensagens, confirmação de leitura, campo de composição e envio. |
| U-06 | Selecionar anexos | Seletor contextual acionado dentro da conversa. Aceita PDF/JPEG conforme limites; JPEG deve ser escolhido de arquivo existente na galeria, sem captura pela aplicação. |
| U-07 | Informações do grupo | Informações necessárias para identificar o grupo e seus participantes, em visualização. Usuário não administra participantes, não cria grupos e não altera configurações do grupo. |

**Estrutura de navegação do Usuário**

1. Login.
2. Na primeira entrada, exibir o aviso de monitoramento; depois, encaminhar a Conversas recentes.
3. Em Conversas recentes, abrir uma conversa existente ou acionar a busca de usuário ativo para iniciar uma conversa individual.
4. A partir de uma conversa, consultar o histórico, enviar mensagens, ver os indicadores de leitura e abrir o seletor de anexos.
5. Ao sair da conversa, retornar à lista de Conversas recentes.

Não serão criadas, nesta versão, abas principais permanentes de **Contatos** ou **Perfil**, painel de preferências, configurações pessoais, notificações push ou notificações do navegador. Grupos e participantes são administrados pelo TI.

**Estados transversais do Usuário:** carregando; lista vazia; busca sem resultados; offline/sem conexão; sessão expirada; acesso negado; envio pendente/falhou; arquivo inválido; upload em análise, bloqueado ou indisponível. A indicação visual deve sempre ser acompanhada de texto ou ícone compreensível.

**Restrições de uso:** smartphone Android/iOS, navegadores móveis atuais Chrome/Safari. Computadores e tablets não são dispositivos permitidos para esse perfil.

### 1.3 TI — console web desktop

**Destino inicial:** Dashboard TI.

| Código | Tela / área | Conteúdo e responsabilidade |
|---|---|---|
| T-01 | Login | Autenticação e encaminhamento conforme o perfil e o dispositivo permitido. |
| T-02 | Dashboard | Página inicial com atalhos para áreas administrativas e informações operacionais disponíveis. Não inventar indicadores ou métricas sem fonte. |
| T-03 | Usuários | Pesquisar, criar/provisionar, alterar, desativar e reativar contas; administrar usernames e credenciais conforme as regras aprovadas. |
| T-04 | Grupos | Pesquisar, criar, encerrar, desativar/reativar grupos e incluir/remover participantes. A remoção revoga imediatamente o acesso ao histórico e anexos anteriores. |
| T-05 | Consulta de conversas | Pesquisar e consultar conversas individuais ou em grupo, inclusive sem o TI ser participante; exportar quando aplicável. Edição/exclusão administrativa de mensagens fica disponível no contexto da conversa e gera auditoria. |
| T-06 | Alertas | Fila de mensagens sinalizadas, filtros por severidade, visualização do contexto e revisão/encerramento pelo TI. Não há bloqueio, punição ou suspensão automática. |
| T-07 | Auditoria | Consultar e gerenciar registros administrativos e de segurança, restrito ao perfil TI. |
| T-08 | Configurações | Somente controles já previstos: lista de termos/regras de detecção mantida pelo TI e quotas individuais/capacidade total de anexos. Não incluir configurações genéricas adicionais sem requisito aprovado. |

**Estrutura de navegação do TI**

- Navegação persistente em desktop para: Dashboard, Usuários, Grupos, Consulta de conversas, Alertas, Auditoria e Configurações.
- Listas levam a detalhes e formulários contextuais; confirmações são exigidas para ações críticas já previstas.
- Qualquer administrador TI possui os mesmos poderes. Não criar níveis hierárquicos, administrador principal, exigência de justificativa ou segunda aprovação.
- Consultas, exportações, alterações administrativas e demais eventos previstos devem ser auditados.

**Estados transversais do TI:** carregando; lista/fila vazia; busca sem resultados; erro/indisponibilidade; sessão expirada; acesso negado; confirmação de ação crítica; operação concluída ou falha. Nenhuma tela deve apresentar sucesso antes da confirmação da operação.

**Restrições de uso:** computador, navegadores atuais Chrome/Edge/Firefox. Smartphone e tablet não são dispositivos permitidos para esse perfil.

### 1.4 Itens fora do catálogo nesta decisão

Não fazem parte da arquitetura aprovada: cadastro aberto, gestão de perfil pelo Usuário, agenda ou diretório corporativo autônomo, chamadas, áudio/vídeo, notificações push/browser, administração de grupos pelo Usuário, configurações sem requisito e novos papéis administrativos.

### 1.5 Decisão e limite

**Q-018 está resolvida em 20/11/2026** no nível de produto: catálogo de páginas, navegação primária, fluxos entre áreas e limites por perfil estão definidos neste documento. Detalhes de layout, componentes, protótipo, validação de usabilidade, testes de acessibilidade e implementação continuam nos respectivos trabalhos de UX, SQA e Desenvolvimento; não reabrem Q-018.

Referências: Issues [#91](https://github.com/Aluvioz/Polychat/issues/91), [#92](https://github.com/Aluvioz/Polychat/issues/92), [#93](https://github.com/Aluvioz/Polychat/issues/93), [#94](https://github.com/Aluvioz/Polychat/issues/94).

## 2. Q-019 — Identidade visual provisória

### 2.1 Direção visual

A identidade provisória do Polychat seguirá a família cromática Ford: azul corporativo predominante, azul profundo de apoio, azul digital para destaques, branco e neutros para superfícies e conteúdo. A paleta abaixo é uma referência de trabalho para UX/UI e documentação até a disponibilização do pacote de marca autorizado pela FORD.

| Token | Cor | HEX | Uso |
|---|---|---|---|
| `--pc-ford-blue` | Ford Blue | `#00095B` | Cor primária: navegação, botões principais, títulos e elementos de marca do produto. |
| `--pc-ford-twilight` | Ford Twilight | `#00142E` | Azul profundo para cabeçalhos, áreas de navegação e estados escuros. |
| `--pc-ford-skyview` | Ford Skyview / azul digital | `#066FEF` | Links, indicadores e ações de destaque; usar texto branco quando aplicado como fundo de controle. |
| `--pc-white` | Branco | `#FFFFFF` | Superfícies principais, cartões, campos e texto sobre fundos azuis. |
| `--pc-neutral-light` | Cinza claro | `#F0F0F0` | Fundo secundário e separação suave de áreas. |
| `--pc-neutral-dark` | Preto suave | `#0F0F0F` | Texto principal sobre superfícies claras. |

### 2.2 Regras de aplicação

1. Ford Blue é a cor de marca predominante. O azul profundo dá hierarquia sem competir com o primário; o azul digital é usado com moderação para ações e links.
2. Branco e cinza claro formam as superfícies de leitura. O texto principal usa preto suave ou azul Ford escuro.
3. A paleta de marca não substitui cores semânticas de sucesso, alerta e erro. Estados devem combinar texto, ícone e contraste; nunca depender apenas da cor.
4. Em fundo `#066FEF`, usar texto branco; não reduzir opacidade a ponto de perder contraste.
5. Manter foco de teclado visível, rótulos, hierarquia e contraste em todos os estados. A verificação abaixo cobre apenas pares definidos, não substitui auditoria completa.
6. Não criar gradientes, sombras ou cores suplementares como elementos de marca sem necessidade e revisão de UX.

### 2.3 Contraste preliminar dos pares principais

Razões calculadas pela fórmula de luminância relativa sRGB. Os valores abaixo se referem somente aos pares indicados.

| Primeiro plano / fundo | Contraste | Referência |
|---|---:|---|
| Ford Blue `#00095B` / branco `#FFFFFF` | 17,64:1 | Acima do mínimo WCAG AA de 4,5:1 para texto normal |
| Ford Twilight `#00142E` / branco `#FFFFFF` | 18,43:1 | Acima do mínimo WCAG AA de 4,5:1 para texto normal |
| Branco `#FFFFFF` / Ford Skyview `#066FEF` | 4,64:1 | Acima do mínimo WCAG AA de 4,5:1 para texto normal |
| Preto suave `#0F0F0F` / branco `#FFFFFF` | 19,17:1 | Acima do mínimo WCAG AA de 4,5:1 para texto normal |

Os resultados são uma checagem matemática inicial de combinações escolhidas. Contraste de bordas, ícones, foco, estados desabilitados, fundos reais, zoom, teclado e leitores de tela ainda exigem validação nas entregas de UX/SQA.

### 2.4 Logotipo e tipografia

- O logotipo oficial Ford só poderá ser aplicado a partir do arquivo fornecido/autorizado pela FORD, preservando proporções, cores, área de respiro e variantes oficiais.
- Não redesenhar, vetorizar, reconstruir ou alterar o Ford Oval a partir de imagens encontradas na internet.
- Até o recebimento do arquivo autorizado, utilizar apenas o nome **Polychat** em texto, sem imitar o lettering Ford e sem placeholder que possa ser confundido com marca oficial.
- Até a confirmação de tipografia corporativa aplicável, utilizar pilha sans-serif de sistema (por exemplo, Arial/Helvetica/system-ui). Não incorporar fonte proprietária sem disponibilização e licença.

### 2.5 Fontes e ressalvas

A referência pública consultada identifica Ford Blue `#00095B`, Ford Twilight `#00142E` e o azul digital `#066FEF`; a documentação pública de referência também orienta a preservar os arquivos oficiais do Ford Oval sem distorção ou alteração. As fontes consultadas são referências públicas de apoio e não substituem o manual/kit de marca formalmente entregue pela FORD:

- [Ford brand guidelines — referência pública de cores e elementos digitais](https://www.rainbrand.com/brand-guidelines/ford/) (material de terceiros baseado em conteúdo público de ford.com; não é guia oficial da FORD).
- [Ford Brand Identity Guidelines R05 — cópia pública hospedada por terceiro](https://www.scribd.com/document/1011475715/Ford-Brand-Identity-Guidelines-R05) (referência para Ford Blue, Ford Twilight, Ford Skyview e neutros; a hospedagem em terceiro não comprova que seja o manual vigente e autorizado para este projeto).
- [Ford Motor Company — brand integrity / uso do Ford Oval em guidelines de 2025](https://performance.ford.com/content/dam/fordPerformance/motorsport/mustang-cup/2025_01_08-Issue-2.0.-Mustang-Cup-Brand-Guidelines-2025.pdf).

### 2.6 Decisão e pendência residual

**A direção cromática provisória de Q-019 está definida em 20/11/2026** e pode orientar o Design System e os protótipos. Q-019 permanece parcialmente aberta somente para receber/confirmar os ativos oficiais autorizados — sobretudo arquivo do Ford Oval e eventuais regras específicas de aplicação/tipografia. A ausência desses arquivos não impede o uso da paleta provisória documentada.

## 3. Rastreabilidade e limites

- Q-018: resolvida; referência normativa de produto para navegação e páginas.
- Q-019: paleta provisória estabelecida; ativos oficiais de marca ainda pendentes.
- Q-025: permanece aberta e independente; trata da compatibilização arquitetural com a infraestrutura sob controle da FORD.
- Esta decisão não altera RFs, não autoriza serviços externos, não declara implementação no runtime nem substitui validação de UX, acessibilidade, SQA ou homologação.

*Documento de decisão do Product Owner, 20/11/2026.*
