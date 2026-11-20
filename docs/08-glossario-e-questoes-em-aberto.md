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
| Antimalware | Solução executada dentro da infraestrutura da FORD para analisar anexos antes da disponibilização. |
| Identificador de acesso | Nome de usuário único na organização, definido e alterável exclusivamente pelo TI. |
| Auditoria | Registro de eventos administrativos e de segurança, consultado e gerenciado pelo TI conforme as regras da FORD. |
| E2EE | Criptografia ponta a ponta. Não faz parte do modelo aprovado: o Polychat utiliza criptografia em trânsito e em repouso, mantendo acesso server-side ao conteúdo para monitoramento e administração. |
| RPO | Ponto de recuperação: perda máxima de dados admitida em cenário de desastre ou falha de infraestrutura. No Polychat, até 24 horas; não se aplica à reconexão normal do usuário. |
| RTO | Tempo objetivo para recuperação do serviço após interrupção. No Polychat, até 24 horas. |
| Primary Key | Chave primária interna que identifica um registro no banco de dados; não é necessariamente o nome de usuário informado no login. |
| Infraestrutura sob controle da FORD | Hospedagem, banco, autenticação, armazenamento, antimalware, monitoramento, segredos e operação sob administração da FORD, sem terceiro acessando, armazenando ou processando seus dados. |
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
| Q-011 | Arquivos | PDF e JPEG; até 10 MB por arquivo; até 5 arquivos por mensagem; limites individuais e capacidade total definidos pelo TI; sem limite específico por conversa. PDF protegido por senha é recusado. Antimalware dentro da infraestrutura FORD; falha/inconclusão mantém anexo bloqueado. TI pode liberar qualquer arquivo; usuário não contorna o scanner. | Resolvida |
| Q-012 | Dispositivos | Usuário: celulares Android/iOS, Chrome e Safari móveis atuais. TI: computadores, Chrome, Edge e Firefox atuais. Tablets não são permitidos. | Resolvida |
| Q-013 | Segurança técnica | Criptografia em trânsito e em repouso, sem E2EE. Chaves administradas pelo servidor sob responsabilidade do TI. Proteção de credenciais e gestão de chaves alinhadas com Desenvolvimento. Os administradores TI possuem poderes iguais; a confiança e os riscos do modelo foram considerados avaliados pelo projeto. | Resolvida como decisão de produto e alinhamento técnico |
| Q-014 | Infraestrutura e jurisdição | Hospedagem e infraestrutura sob controle da FORD, preferencialmente no Brasil. Nenhum terceiro pode acessar, armazenar ou processar dados da FORD. Bibliotecas e atualizações sem acesso aos dados são permitidas. Ambientes de desenvolvimento, homologação e produção isolados conforme alinhamento com Desenvolvimento. | Resolvida quanto à regra do cliente; compatibilização da arquitetura registrada em Q-025 |
| Q-015 | Solicitações legais | Solicitações legais dirigidas à FORD ou a fornecedores de infraestrutura são tratadas pela própria FORD. A FORD espera ser informada quando isso for juridicamente permitido. | Resolvida |
| Q-016 | Carga e desempenho | Capacidade inicial de até 25 conexões simultâneas de usuários finais, além dos administradores TI. Volume esperado de mensagens e anexos baixo/ocasional. Metas de desempenho alinhadas com Desenvolvimento e consideradas completas. | Resolvida |
| Q-017 | Disponibilidade e recuperação | Disponibilidade mensal de 99%; RPO de até 24 horas em desastre/falha de infraestrutura; RTO de até 24 horas; backups diários de banco e anexos com retenção de 12 meses; manutenção fora do horário comercial com aviso prévio; suporte em horário comercial. | Resolvida |
| Q-018 | Arquitetura da informação e telas | Catálogo e navegação por perfil consolidados: Usuário mobile com Conversas recentes como área principal, fluxo de nova conversa individual e chat individual/grupo; TI desktop com Dashboard, Usuários, Grupos, Consulta de conversas, Alertas, Auditoria e Configurações restritas aos controles definidos. | Resolvida em 20/11/2026; ver [decisões de produto Q-018/Q-019](ux/decisoes-produto-q018-q019.md) |
| Q-019 | Identidade visual | Paleta provisória definida: Ford Blue `#00095B`, Ford Twilight `#00142E`, Ford Skyview `#066FEF`, branco `#FFFFFF` e neutros `#F0F0F0`/`#0F0F0F`. O Ford Oval só será aplicado a partir de arquivo oficial autorizado. | Direção cromática provisória resolvida; ativos oficiais de marca ainda pendentes |
| Q-020 | Acessibilidade | A FORD não definiu requisitos adicionais de acessibilidade para o programa inicial. Obrigações legais ou corporativas aplicáveis continuam válidas. | Resolvida como decisão de escopo |
| Q-021 | Prazo e concorrência | Não há data limite definida nem marco corporativo condicionando o lançamento. O prazo será combinado conforme o planejamento das sprints. | Resolvida; planejamento de sprint é operacional |
| Q-022 | Orçamento | R$ 450.000,00 é referência comercial global e inclui implantação. Não inclui infraestrutura, licenças, suporte, manutenção ou treinamento; custos recorrentes ficam com a FORD. O valor não foi declarado teto aprovado. | Resolvida quanto às condições informadas |
| Q-023 | Idioma e notificações | Interface exclusivamente em português. Não haverá notificações push nem notificações do navegador. O indicador de mensagens não lidas aparece dentro do aplicativo. | Resolvida |
| Q-024 | Edição e exclusão de mensagens | Usuários comuns não podem editar nem excluir mensagens. TI pode editar e excluir a qualquer momento; operações administrativas geram auditoria. | Resolvida |

## 8.3 Questões que permanecem abertas

Somente os itens abaixo continuam exigindo ação. Q-018 foi encerrada como decisão de produto; Q-019 está parcialmente concluída e só mantém a obtenção dos ativos oficiais de marca. As frentes técnicas alinhadas com Desenvolvimento não são pendências de definição de produto.

| ID | Tema | Ação necessária | Motivo | Responsável sugerido |
|---|---|---|---|---|

| Q-019 | Ativos oficiais de marca | Receber/confirmar o arquivo autorizado do Ford Oval e eventuais regras corporativas específicas de aplicação/tipografia. A paleta provisória não depende desses arquivos. | A direção cromática provisória foi definida pelo PO; resta somente a confirmação dos ativos oficiais para uso do logotipo e identidade final. | FORD / responsável pela marca |
| Q-025 | Compatibilização da arquitetura com a infraestrutura FORD | Revisar as ADRs e decisões técnicas que ainda pressupõem serviços gerenciados Supabase/Vercel. Definir arquitetura que mantenha hospedagem e processamento de dados sob controle da FORD, sem terceiro acessando, armazenando ou processando dados. Preservar tecnologias de aplicação apenas se forem compatíveis com essa restrição. | A documentação e a Issue #88 registram Supabase + Vercel como direção anterior, enquanto a FORD v2 impõe infraestrutura sob seu controle. A exigência do cliente está definida; a solução arquitetural precisa ser reconciliada e documentada. | Tech Lead / Desenvolvimento / TI da FORD / PO |

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

- A restrição da FORD de não permitir que terceiros acessem, armazenem ou processem seus dados é uma decisão de cliente confirmada.
- A existência de Next.js, Vercel, Supabase, migrations ou ADRs no repositório não constitui, por si só, aprovação dessas plataformas para produção sob a restrição atual.
- A direção Supabase/Vercel anterior deve ser revisada e formalmente reconciliada; não deve prevalecer automaticamente sobre a decisão mais recente da FORD.
- A tecnologia definitiva deve ser registrada em ADR revisada, mantendo a distinção entre requisito de negócio, decisão arquitetural, implementação e homologação.
- A aprovação de uma decisão técnica não deve ser confundida com evidência de implantação ou teste.

## 8.6 Histórico e rastreabilidade

- Q-001 a Q-024 são identificadores históricos preservados das versões anteriores.
- Q-025 foi criado para registrar a reconciliação técnica necessária após a restrição de infraestrutura informada na FORD v2.
- Questões resolvidas permanecem documentadas para preservar a origem e a decisão.
- Q-018 foi concluída pelo PO em 20/11/2026; a arquitetura da informação está registrada em `docs/ux/decisoes-produto-q018-q019.md`.
- Q-019 possui paleta provisória definida pelo PO em 20/11/2026; a obtenção do arquivo oficial do logotipo continua como pendência específica.
- Quando uma questão parcial for concluída, atualizar seu status e vincular o artefato de UX ou a decisão correspondente.
- Não reutilizar identificadores encerrados para assuntos diferentes.
