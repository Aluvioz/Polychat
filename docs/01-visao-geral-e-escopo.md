# 01 - Visão geral e escopo

## 1.1 Contexto do problema

O cliente pretende disponibilizar à FORD uma aplicação própria de comunicação corporativa, para reduzir a dependência de aplicativos de mensagens de terceiros e manter sob gestão da organização as contas, os grupos e o acesso às conversas. A motivação relatada foi a preocupação com situações de exposição de mensagens e dados quando a comunicação ocorre em plataformas externas.

A existência de uma aplicação própria, por si só, não impede o cumprimento de ordens judiciais ou solicitações legalmente válidas dirigidas à FORD ou a fornecedores de infraestrutura. Também não garante que a organização seja previamente notificada sobre toda solicitação. Essa expectativa precisa ser revista com as áreas jurídica, de segurança e de infraestrutura e não é tratada como resultado garantido do software.

## 1.2 Propósito deste documento

Registrar uma linha de base inicial, clara e verificável, para orientar descoberta, planejamento, desenvolvimento e testes do Polychat. A versão separa informações confirmadas, detalhamentos derivados, recomendações e decisões ainda pendentes. Não substitui validação do cliente, análise jurídica, arquitetura de segurança ou planejamento de projeto.

## 1.3 Visão do produto

Polychat é uma aplicação web de comunicação interna da FORD. A experiência dos usuários deve ser simples, com autenticação e uma área de conversas recentes, em modelo de interação semelhante a aplicativos conhecidos de mensagens. O uso inicial foi informado para 25 pessoas do nível técnico da organização. O acesso será segmentado por dois perfis: **Usuário** e **TI**.

## 1.4 Público-alvo e atores

| Ator / stakeholder | Descrição | Necessidades conhecidas |
|---|---|---|
| Usuário | Funcionário da FORD fora da área de TI, independentemente do cargo corporativo. | Conversar com qualquer outro usuário ativo; utilizar grupos dos quais participe. |
| TI | Pessoa alocada à área de TI e com perfil administrativo. | Criar/desativar contas, criar grupos, adicionar usuários, administrar segurança, receber alertas e consultar conversas. |
| Patrocinador / representante do cliente | Representante da FORD ainda não identificado. | Aprovar escopo, política de monitoramento, riscos e critérios de aceite. |
| Product Owner | Papel da equipe de projeto. Responsável nominal a definir. | Ordenar o backlog e validar a especificação com o cliente. |
| Líder técnico e equipe de desenvolvimento | Papéis técnicos previstos no contexto acadêmico. | Definir arquitetura e implementar requisitos aprovados. |
| QA | Responsável por verificação e testes, a definir. | Transformar critérios de aceitação em casos de teste. |

## 1.5 Escopo previsto para a primeira versão

### Incluído, conforme informações recebidas

- Aplicação web destinada ao uso interno da FORD.
- Público inicial de 25 pessoas do nível técnico; a distribuição entre os perfis Usuário e TI ainda não foi informada.
- Dois perfis: Usuário e TI. Não há diferenciação de permissões entre cargos corporativos dentro do perfil Usuário.
- Autenticação por identificador de usuário e senha criados pelo TI.
- Administração centralizada pelo TI: criação e desativação de contas, criação de grupos e inclusão de pessoas em grupos.
- Conversas individuais entre usuários ativos e conversas em grupo, sujeitas à confirmação do fluxo de mensagens em grupos.
- Listagem de conversas recentes e interface simples.
- Mensagens de texto e anexos PDF/JPEG.
- Análise automática de mensagens consideradas suspeitas e alerta ao TI.
- Possibilidade de o TI consultar qualquer conversa.
- Acesso do perfil Usuário por celular e do perfil TI por computador.
- Identidade visual alinhada à Ford, com predominância de azul e branco; códigos oficiais de cor ainda não foram fornecidos.

### Fora do escopo informado para a primeira versão

- Uso por fornecedores, parceiros, agentes externos ou público geral.
- Cadastro aberto, convite de novos participantes ou autoatendimento de criação de conta.
- Integrações com outros aplicativos ou serviços externos.
- Chamadas de áudio/vídeo e gravação de áudio/vídeo.
- Uso do perfil Usuário em computador e uso do perfil TI em celular.
- Expansão para os demais funcionários da organização sem nova decisão de escopo.

A política de captura de fotos precisa de esclarecimento porque JPEG foi permitido como formato de anexo, mas o cliente também declarou que não deseja permitir tirar fotos dentro da aplicação.

## 1.6 Premissas e restrições

### Informações tratadas como confirmadas

1. A aplicação será web e destinada somente à FORD.
2. O primeiro público informado é de 25 pessoas do nível técnico, dentro de uma organização com cerca de 900 funcionários.
3. Existem apenas dois perfis de aplicação: Usuário e TI.
4. O TI é responsável pela administração e os usuários comuns apenas utilizam os recursos de comunicação.
5. Não haverá integrações com outros aplicativos nesta versão.
6. Segurança tem prioridade sobre velocidade.
7. O orçamento informado foi de R$ 450.000,00. Não foi esclarecido se é teto aprovado, estimativa ou orçamento global do projeto.

### Restrições

- Não oferecer convites nem cadastro realizado pelo usuário.
- Não oferecer funções de captura/gravação de áudio e vídeo.
- Aceitar somente PDF e JPEG como formatos de arquivo informados.
- Restringir o tipo de dispositivo conforme o perfil.
- Não introduzir hierarquia de permissões baseada no cargo corporativo do usuário comum.

### Premissas de trabalho a validar

- O sistema deve permitir mensagens em grupos aos membros incluídos pelo TI; essa permissão é coerente com a criação de grupos, mas o fluxo não foi descrito integralmente.
- A aplicação deve apresentar os alertas dentro da área administrativa do TI, evitando pressupor integração externa; o canal e a urgência dos alertas ainda precisam ser aprovados.
- O número 25 representa o público inicial total, mas não está confirmado se inclui ou não os administradores de TI.

## 1.7 Dependências

- Identificação do patrocinador/representante da FORD e dos responsáveis de TI.
- Definição da infraestrutura de hospedagem, operação, backup e recuperação.
- Definição de política de segurança, retenção, auditoria e acesso administrativo às conversas.
- Definição de critérios de detecção de conteúdo suspeito e tratamento de alertas.
- Validação das regras de tratamento de dados e monitoramento pelas áreas competentes da FORD.
- Definição dos dispositivos, sistemas operacionais e navegadores homologados.

## 1.8 Riscos relevantes

| ID | Risco | Consequência possível | Tratamento recomendado / validação |
|---|---|---|---|
| RSK-01 | “Segurança máxima” não possui definição mensurável. | Expectativas impossíveis de testar ou garantir. | Aprovar modelo de ameaças, controles, critérios de aceite e testes de segurança. |
| RSK-02 | Aplicação própria pode ser confundida com imunidade a ordens legais. | Expectativa de confidencialidade ou notificação que a solução não pode garantir. | Revisão jurídica e contratual; explicitar limites de infraestrutura e solicitações legais. |
| RSK-03 | TI pode consultar todas as conversas sem política de acesso definida. | Acesso excessivo, uso indevido e risco de exposição interna. | Aprovar finalidade, autorização, registro de acesso, revisão e política de transparência. |
| RSK-04 | Detecção de palavrões/conteúdo suspeito pode gerar falsos positivos. | Alertas excessivos ou tratamento inadequado de mensagens. | Definir vocabulário, contexto, níveis de severidade, revisão humana e fluxo de resposta. |
| RSK-05 | Envio de senha inicial por canal não definido. | Comprometimento de credenciais. | Aprovar canal seguro, senha temporária, expiração e troca no primeiro acesso. |
| RSK-06 | Bloqueio por tipo de dispositivo pode ser contornado por identificação superficial do navegador. | Usuário pode acessar ambiente incompatível com o perfil. | Definir política de detecção e controles de autorização no servidor; testar evasões. |
| RSK-07 | Limite/tamanho de anexos e retenção não definidos. | Custos, indisponibilidade ou armazenamento excessivo. | Definir limites, quotas, retenção, backup e descarte. |
| RSK-08 | Capacidade simultânea não está definida. | Desempenho inadequado em uso concorrente. | Definir número de sessões simultâneas e testes de carga. |

## 1.9 Limites da especificação

Esta versão não define arquitetura, linguagem, banco de dados, algoritmo criptográfico, provedor de hospedagem, prazo, estimativa de esforço ou solução de detecção automática. Tais decisões dependem de validação e análise técnica posteriores.
