# 08 - Glossário e questões em aberto

Este documento registra a terminologia do Polychat, o histórico das questões levantadas nas versões anteriores e a situação após o questionário FORD v2 e os alinhamentos complementares do PO com Desenvolvimento.

As questões respondidas permanecem neste documento para preservar rastreabilidade, mas não devem continuar sendo tratadas como pendências. Somente os itens classificados como abertos na seção 8.3 exigem ação.

## 8.1 Glossário

| Termo | Definição neste projeto |
|---|---|
| Polychat | Aplicação web de comunicação interna da FORD. |
| FORD | Organização cliente, responsável pela operação e pela infraestrutura do produto. |
| Usuário | Perfil destinado aos 25 usuários finais do setor técnico no escopo inicial. |
| TI | Perfil administrativo destinado à equipe de TI da FORD, estimada em 2 a 3 administradores. Todos possuem os mesmos poderes administrativos. |
| Grupo | Conversa coletiva criada e administrada pelo TI, composta por contas incluídas pelo TI. |
| Conversa individual | Troca de mensagens entre dois usuários ativos. |
| Mensagem suspeita | Mensagem que corresponde a termo ou regra da lista mantida pelo TI, incluindo palavrões. A detecção inicial não utiliza análise contextual nem IA de terceiros. |
| Alerta | Registro gerado quando uma mensagem é sinalizada pelas regras de monitoramento, exibido na fila administrativa do TI e classificado por severidade baixa, média ou alta. |
| Anexo | Arquivo enviado em conversa. Os formatos permitidos são PDF e JPEG, com até 10 MB por arquivo e até 5 arquivos por mensagem. |
| Antimalware | Componente de análise integrado ao fluxo controlado do Polychat, na stack oficial Supabase/Vercel, que verifica anexos antes da disponibilização sem encaminhá-los a scanners externos não aprovados. |
| Identificador de acesso | Nome de usuário único na organização, definido e alterável exclusivamente pelo TI. |
| Auditoria | Registro de eventos administrativos e de segurança, consultado e gerenciado pelo TI conforme as regras da FORD. |
| E2EE | Criptografia ponta a ponta. Não faz parte do modelo aprovado: o Polychat utiliza criptografia em trânsito e em repouso, mantendo acesso server-side ao conteúdo para monitoramento e administração. |
| RPO | Ponto de recuperação: perda máxima de dados admitida em cenário de desastre ou falha de infraestrutura. No Polychat, até 24 horas; não se aplica à reconexão normal do usuário. |
| RTO | Tempo objetivo para recuperação do serviço após interrupção. No Polychat, até 24 horas. |
| Primary Key | Chave primária interna que identifica um registro no banco de dados; não é necessariamente o nome de usuário informado no login. |
| Plataformas oficiais | Supabase para backend e Vercel para hospedagem/deploy; escolha confirmada pelo PO e registrada na ADR-003. |
| Scrum | Framework ágil informado como contexto de trabalho da equipe. |
| UML | Linguagem de modelagem utilizada para representar aspectos estruturais e comportamentais do sistema. |

## 8.2 Histórico das questões levantadas — Q-001 a Q-024

A tabela mantém as perguntas da documentação anterior e registra a decisão obtida. Os itens marcados como resolvidos não devem ser reabertos como pendências de levantamento.

| ID | Tema | Decisão / resposta consolidada | Situação |
|---|---|---|---|
| Q-001 | Público inicial | São 25 usuários finais do setor técnico, além de aproximadamente 2 a 3 administradores TI. | Resolvida |
| Q-002 | Perfis e administração | Todos os TIs possuem poderes administrativos iguais. Não há administrador principal nem exigência de aprovação de segundo administrador. TI pode administrar outras contas TI. | Resolvida |
| Q-003 | Ciclo de vida de grupos | Somente TI cria, encerra, desativa e reativa grupos e inclui/remove integrantes. Usuários não podem sair voluntariamente. Remoção revoga imediatamente o acesso às mensagens e anexos anteriores. | Resolvida |
| Q-004 | JPEG e câmera | Usuários podem selecionar JPEG já existente na galeria do celular. A aplicação não oferece captura de foto, gravação de áudio ou vídeo. Metadados, incluindo GPS, são removidos. | Resolvida |
| Q-005 | Identificador de login | O identificador é um nome de usuário único na organização, definido pelo TI e alterável pelo TI a qualquer momento. | Resolvida |
| Q-006 | Senha inicial e recuperação | TI cria e envia individualmente a senha e o link de acesso. Não há troca obrigatória no primeiro acesso, expiração periódica ou MFA exigido pela FORD. Recuperação é exclusiva do TI. A proteção técnica das credenciais foi alinhada com Desenvolvimento. | Resolvida |
| Q-007 | Detecção de mensagens suspeitas | Detecção automática por regras e lista de termos mantida pelo TI, incluindo palavrões. Não há análise contextual nem IA de terceiros. Conteúdo não é enviado a serviços externos. | Resolvida |
| Q-008 | Resposta a alertas | Alertas aparecem em fila administrativa e possuem severidade baixa, média e alta. Alta: imediatamente, até 1 hora; média: até 1 dia útil; baixa: até 3 dias úteis. TI analisa e encerra sem justificativa obrigatória. A detecção não bloqueia automaticamente mensagens. | Resolvida |
| Q-009 | Governança da consulta administrativa | Qualquer TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou autorização prévia de outra pessoa. Exportação também é permitida. Consultas e exportações geram auditoria. Funcionários recebem aviso de monitoramento no primeiro acesso. | Resolvida |
| Q-010 | Retenção e exclusão | Não há exclusão automática de mensagens, anexos, alertas, logs de auditoria e registros administrativos enquanto o sistema operar. TI autoriza exclusões e decide preservação em investigações. Backups diários são retidos por 12 meses; após exclusão autorizada, os dados expiram dos backups ao fim do ciclo de retenção, com evidência em auditoria. Política detalhada alinhada com Desenvolvimento. | Resolvida |
| Q-011 | Arquivos | PDF e JPEG; até 10 MB por arquivo; até 5 arquivos por mensagem; limites individuais e capacidade total definidos pelo TI; sem limite específico por conversa. PDF protegido por senha é recusado. Scanner integrado ao fluxo controlado do Polychat na stack oficial; falha/inconclusão mantém anexo bloqueado. TI pode liberar qualquer arquivo; usuário não contorna o scanner. | Resolvida |
| Q-012 | Dispositivos | Usuário: celulares Android/iOS, Chrome e Safari móveis atuais. TI: computadores, Chrome, Edge e Firefox atuais. Tablets não são permitidos. | Resolvida |
| Q-013 | Segurança técnica | Criptografia em trânsito e em repouso, sem E2EE. Chaves administradas pelo servidor sob responsabilidade do TI. Proteção de credenciais e gestão de chaves alinhadas com Desenvolvimento. Os administradores TI possuem poderes iguais; a confiança e os riscos do modelo foram considerados avaliados pelo projeto. | Resolvida como decisão de produto e alinhamento técnico |
| Q-014 | Infraestrutura, plataformas e jurisdição | Supabase e Vercel são as plataformas oficiais do Polychat, conforme alinhamento complementar do PO com Desenvolvimento. Regiões, acessos e segregação dos ambientes devem ser validados; serviços externos adicionais exigem aprovação explícita. | Resolvida quanto à escolha das plataformas; validações operacionais em Q-025 |
| Q-015 | Solicitações legais | Solicitações legais dirigidas à FORD ou a fornecedores de infraestrutura são tratadas pela própria FORD. A FORD espera ser informada quando isso for juridicamente permitido. | Resolvida |
| Q-016 | Carga e desempenho | Capacidade inicial de até 25 conexões simultâneas de usuários finais, além dos administradores TI. Volume esperado de mensagens e anexos baixo/ocasional. Metas de desempenho alinhadas com Desenvolvimento e consideradas completas. | Resolvida |
| Q-017 | Disponibilidade e recuperação | Disponibilidade mensal de 99%; RPO de até 24 horas em desastre/falha de infraestrutura; RTO de até 24 horas; backups diários de banco e anexos com retenção de 12 meses; manutenção fora do horário comercial com aviso prévio; suporte em horário comercial. | Resolvida |
| Q-018 | Fluxo e páginas | O escopo prevê tela de conversas recentes e conversa para Usuário; console TI com gestão de usuários, grupos, consultas/exportação, alertas, configurações e auditoria. A arquitetura de informação detalhada, nomes finais de telas e wireframes devem ser consolidados pelo PO/UX a partir desse escopo. | Parcialmente resolvida; refinamento interno de UX |
| Q-019 | Identidade visual | Azul e branco, com logo da FORD. Os códigos exatos das cores e os ativos oficiais dependem do material de marca disponibilizado para o projeto. | Parcialmente resolvida; insumos de marca |
| Q-020 | Acessibilidade | A FORD não definiu requisitos adicionais de acessibilidade para o programa inicial. Obrigações legais ou corporativas aplicáveis continuam válidas. | Resolvida como decisão de escopo |
| Q-021 | Prazo e concorrência | Não há data limite definida nem marco corporativo condicionando o lançamento. O prazo será combinado conforme o planejamento das sprints. | Resolvida; planejamento de sprint é operacional |
| Q-022 | Orçamento | R$ 450.000,00 é referência comercial global e inclui implantação. Não inclui infraestrutura, licenças, suporte, manutenção ou treinamento; custos recorrentes ficam com a FORD. O valor não foi declarado teto aprovado. | Resolvida quanto às condições informadas |
| Q-023 | Idioma e notificações | Interface exclusivamente em português. Não haverá notificações push nem notificações do navegador. O indicador de mensagens não lidas aparece dentro do aplicativo. | Resolvida |
| Q-024 | Edição e exclusão de mensagens | Usuários comuns não podem editar nem excluir mensagens. TI pode editar e excluir a qualquer momento; operações administrativas geram auditoria. | Resolvida |

## 8.3 Questões que permanecem abertas

Somente os itens abaixo continuam exigindo ação. As oito frentes técnicas alinhadas com Desenvolvimento não são pendências.

| ID | Tema | Ação necessária | Motivo | Responsável sugerido |
|---|---|---|---|---|
| Q-018 | Arquitetura de informação e telas | Consolidar mapa definitivo de telas, navegação e wireframes para Usuário e console TI, respeitando as funcionalidades já definidas. | O escopo funcional está definido, mas a organização visual detalhada ainda depende de refinamento UX/PO. | PO / UX |
| Q-019 | Insumos de identidade visual | Obter logo, manual de marca e códigos oficiais de cores/tipografia, se ainda não estiverem disponíveis no projeto. | A direção azul/branco e o uso do logo estão definidos; faltam os arquivos oficiais e os valores exatos. | FORD / responsável pela marca / UX |
| Q-025 | Validação técnica da stack Supabase + Vercel | Consolidar em um inventário técnico as evidências disponíveis dos projetos/regiões Supabase e ambientes Vercel, seus vínculos, domínios, variáveis (nomes/escopos, nunca valores), acessos e integrações reais de Auth/Database/Storage/Realtime. Usar os aceites das Issues #96 e #98 como evidência dos escopos já concluídos; não repetir criação/configuração de ambientes, smoke tests ou ensaios de rollback já aceitos. Registrar somente lacunas objetivas que não estejam cobertas por esses aceites. | As plataformas oficiais estão escolhidas e alinhadas. A Q-025 é uma atividade de consolidação/checagem documental e de evidências específicas ainda ausentes; os escopos encerrados nas Issues #96 e #98 não devem ser reabertos ou repetidos. | Tech Lead / Desenvolvimento / TI da FORD |

## 8.4 Decisões consolidadas que não devem ser reabertas como pendência

- Limites de armazenamento.
- Regras e severidade dos alertas.
- Metas de desempenho.
- Proteção de credenciais.
- Gestão de chaves.
- Política detalhada de retenção.
- Critérios de homologação.
- Isolamento dos ambientes.
- Confiança e igualdade de poderes dos administradores TI.

Esses assuntos foram alinhados com Desenvolvimento e/ou avaliados pelo responsável do projeto, conforme a classificação aplicável. A documentação deve utilizá-los como requisitos completos.

## 8.5 Decisões arquiteturais e limites

- Supabase e Vercel são as plataformas oficiais do Polychat, confirmadas pelo PO após alinhamento com Desenvolvimento.
- A escolha da stack não equivale a comprovação de integração, configuração de produção ou homologação dos ambientes.
- Serviços adicionais que acessem ou processem dados exigem aprovação explícita do projeto.
- As regiões, permissões, segredos, backups e controles de cada ambiente oficial devem ser verificados.
- A escolha das plataformas Supabase/Vercel está registrada na ADR-003. ADRs específicas podem detalhar componentes e configurações, mantendo a distinção entre requisito de negócio, decisão arquitetural, implementação e homologação.
- A aprovação de uma decisão técnica não deve ser confundida com evidência de implantação ou teste.

## 8.6 Histórico e rastreabilidade

- Q-001 a Q-024 são identificadores históricos preservados das versões anteriores.
- Q-025 permanece aberto para concluir a validação técnica dos ambientes Supabase/Vercel; não representa uma pendência sobre a escolha das plataformas.
- Questões resolvidas permanecem documentadas para preservar a origem e a decisão.
- Quando uma questão parcial for concluída, atualizar seu status e vincular o artefato de UX ou a decisão correspondente.
- Não reutilizar identificadores encerrados para assuntos diferentes.
