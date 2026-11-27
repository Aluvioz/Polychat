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
| Anexo | Arquivo enviado em conversa. Os formatos permitidos são PDF e JPEG, com limite de 10 MiB (10.485.760 bytes) por arquivo e até 5 arquivos por mensagem, conforme retificação do PO em 26/11/2026. |
| Antimalware | Solução executada dentro da infraestrutura da FORD para analisar anexos antes da disponibilização. |
| Identificador de acesso | Nome de usuário único na organização, definido e alterável exclusivamente pelo TI. |
| Auditoria | Registro de eventos administrativos e de segurança, consultado e gerenciado pelo TI conforme as regras da FORD. |
| E2EE | Criptografia ponta a ponta. Não faz parte do modelo aprovado: o Polychat utiliza criptografia em trânsito e em repouso, mantendo acesso server-side ao conteúdo para monitoramento e administração. |
| RPO | Ponto de recuperação: perda máxima de dados admitida em cenário de desastre ou falha de infraestrutura. No Polychat, até 24 horas; não se aplica à reconexão normal do usuário. |
| RTO | Tempo objetivo para recuperação do serviço após interrupção. No Polychat, até 24 horas. |
| Primary Key | Chave primária interna que identifica um registro no banco de dados; não é necessariamente o nome de usuário informado no login. |
| Infraestrutura sob controle operacional aprovado pela FORD | Hospedagem, banco, autenticação, armazenamento, antimalware, monitoramento, segredos e operação sujeitos aos requisitos, controles e responsabilidades aprovados pela FORD. No Polychat, Supabase e Vercel são provedores nomeados e expressamente autorizados pela Q-025, concluída em 24/11/2026, para os serviços e o modelo de utilização registrados na arquitetura. Essa aprovação específica não autoriza outros fornecedores, subprocessadores ou serviços externos a acessar, armazenar ou processar dados da FORD sem aprovação própria. A expressão indica governança e controle operacional aprovados, não propriedade ou operação física direta de todos os recursos pela FORD. |
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
| Q-011 | Arquivos | PDF e JPEG; até 10 MiB (10.485.760 bytes) por arquivo; até 5 arquivos por mensagem; limites individuais e capacidade total definidos pelo TI; sem limite específico por conversa. PDF protegido por senha é recusado. Antimalware dentro da infraestrutura FORD; falha/inconclusão mantém anexo bloqueado. Liberação excepcional pelo TI somente por ação autenticada e auditada, preservando o resultado do scanner; usuário não contorna a análise. | Resolvida |
| Q-012 | Dispositivos | Usuário: celulares Android/iOS, Chrome e Safari móveis atuais. TI: computadores, Chrome, Edge e Firefox atuais. Tablets não são permitidos. | Resolvida |
| Q-013 | Segurança técnica | Criptografia em trânsito e em repouso, sem E2EE. Chaves administradas pelo servidor sob responsabilidade do TI. Proteção de credenciais e gestão de chaves alinhadas com Desenvolvimento. Os administradores TI possuem poderes iguais; a confiança e os riscos do modelo foram considerados avaliados pelo projeto. | Resolvida como decisão de produto e alinhamento técnico |
| Q-014 | Infraestrutura e jurisdição | Hospedagem e infraestrutura sob controle operacional aprovado pela FORD, preferencialmente no Brasil. Supabase e Vercel são provedores nomeados e expressamente aprovados na Q-025 para os serviços previstos na stack do Polychat; outros terceiros não podem acessar, armazenar ou processar dados da FORD sem aprovação específica. Bibliotecas e atualizações sem acesso aos dados são permitidas. Ambientes de desenvolvimento, homologação e produção permanecem isolados conforme o modelo aprovado. | Regra e exceção de provedores aprovadas; Q-025 concluída em 24/11/2026 |
| Q-015 | Solicitações legais | Solicitações legais dirigidas à FORD ou a fornecedores de infraestrutura são tratadas pela própria FORD. A FORD espera ser informada quando isso for juridicamente permitido. | Resolvida |
| Q-016 | Carga e desempenho | Capacidade inicial de até 25 conexões simultâneas de usuários finais, além dos administradores TI. Volume esperado de mensagens e anexos baixo/ocasional. Metas de desempenho alinhadas com Desenvolvimento e consideradas completas. | Resolvida |
| Q-017 | Disponibilidade e recuperação | Disponibilidade mensal de 99%; RPO de até 24 horas em desastre/falha de infraestrutura; RTO de até 24 horas; backups diários de banco e anexos com retenção de 12 meses; manutenção fora do horário comercial com aviso prévio; suporte em horário comercial. | Resolvida |
| Q-018 | Arquitetura da informação e telas | Catálogo e navegação por perfil consolidados: Usuário mobile com Conversas recentes como área principal, fluxo de nova conversa individual e chat individual/grupo; TI desktop com Dashboard, Usuários, Grupos, Consulta de conversas, Alertas, Auditoria e Configurações restritas aos controles definidos. | Resolvida em 20/11/2026; ver [decisões de produto Q-018/Q-019](ux/decisoes-produto-q018-q019.md) |
| Q-019 | Identidade visual | Paleta provisória definida: Ford Blue `#00095B`, Ford Twilight `#00142E`, Ford Skyview `#066FEF`, branco `#FFFFFF` e neutros `#F0F0F0`/`#0F0F0F`. O Ford Oval só será aplicado a partir de arquivo oficial autorizado. | Parcialmente aberta — direção cromática provisória definida; permanecem pendentes somente os ativos oficiais de marca |
| Q-020 | Acessibilidade | A FORD não definiu requisitos adicionais de acessibilidade para o programa inicial. Obrigações legais ou corporativas aplicáveis continuam válidas. | Resolvida como decisão de escopo |
| Q-021 | Prazo e concorrência | Não há data limite definida nem marco corporativo condicionando o lançamento. O prazo será combinado conforme o planejamento das sprints. | Resolvida; planejamento de sprint é operacional |
| Q-022 | Orçamento | R$ 450.000,00 é referência comercial global e inclui implantação. Não inclui infraestrutura, licenças, suporte, manutenção ou treinamento; custos recorrentes ficam com a FORD. O valor não foi declarado teto aprovado. | Resolvida quanto às condições informadas |
| Q-023 | Idioma e notificações | Interface exclusivamente em português. Não haverá notificações push nem notificações do navegador. O indicador de mensagens não lidas aparece dentro do aplicativo. | Resolvida |
| Q-024 | Edição e exclusão de mensagens | Usuários comuns não podem editar nem excluir mensagens. TI pode editar e excluir a qualquer momento; operações administrativas geram auditoria. | Resolvida |

### Classificação vigente — alinhamento com a baseline POLY-REQ-001 v0.5

A classificação abaixo é a referência consolidada para a seção 8 da baseline. Q-018 está resolvida, Q-019 permanece parcialmente aberta e Q-025 está concluída.

| Questão | Classificação vigente | Escopo/status |
|---|---|---|
| Q-018 | **Resolvida — 20/11/2026** | Arquitetura da informação e catálogo de telas definidos; decisão registrada em `docs/ux/decisoes-produto-q018-q019.md`. |
| Q-019 | **Parcialmente aberta** | Paleta provisória definida; permanece pendente somente a confirmação/entrega dos ativos oficiais de marca, sobretudo o arquivo autorizado do Ford Oval e eventuais regras de aplicação/tipografia. |
| Q-025 | **Concluída — 24/11/2026** | Compatibilidade e modelo de utilização de Supabase + Vercel aprovados pela TI e pela FORD, dentro dos limites, controles e responsabilidades registrados. A decisão não equivale à conclusão de todas as integrações ou à homologação de produção. |

## 8.3 Questões que permanecem abertas

Somente Q-019 exige ação de definição de produto. Os limites e as evidências da conclusão de Q-025 permanecem detalhados na seção 8.4. As frentes técnicas alinhadas com Desenvolvimento não reabrem as decisões registradas nem constituem pendências de definição de produto.

| ID | Tema | Ação necessária | Motivo | Responsável sugerido |
|---|---|---|---|---|

| Q-019 | Ativos oficiais de marca | Receber/confirmar o arquivo autorizado do Ford Oval e eventuais regras corporativas específicas de aplicação/tipografia. A paleta provisória não depende desses arquivos. | A direção cromática provisória foi definida pelo PO; resta somente a confirmação dos ativos oficiais para uso do logotipo e identidade final. | FORD / responsável pela marca |


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

### Q-025 — Compatibilidade da stack Supabase + Vercel

**Status: CONCLUÍDA — 24/11/2026**

**Decisão:** a TI e a FORD aprovam a configuração e o modelo de utilização da stack Supabase + Vercel para o Polychat, conforme a ADR-003 — Accepted. A aprovação confirma a compatibilidade da arquitetura adotada com os requisitos de infraestrutura, hospedagem, localização, acesso, armazenamento, processamento e operação definidos para o produto. Não há incompatibilidade impeditiva que exija substituir a stack.

**Exceção expressamente aprovada:** Supabase e Vercel são os provedores nomeados e autorizados para os serviços definidos na arquitetura do Polychat. A restrição geral a terceiros permanece aplicável a qualquer outro fornecedor ou serviço que não esteja expressamente aprovado. Novos subprocessadores, scanners externos ou serviços que recebam dados do produto dependem de decisão formal.

**Evidências e decisões consolidadas:**

| Dimensão | Registro considerado | Decisão |
|---|---|---|
| Stack e responsabilidade | ADR-003 — Accepted | Supabase + Vercel aprovados como stack obrigatória. |
| Ambiente Supabase de desenvolvimento | Projeto Polyford, região `sa-east-1`, PostgreSQL `17.11.0.019`, estado observado `ACTIVE_HEALTHY`; notas da #99 | Ambiente de desenvolvimento reconhecido e aprovado no modelo de ambientes. |
| Ambientes e deploy | Issues #96 e #98 encerradas; auditoria #96 e runbook #98 | Configuração operacional, segregação por estágio, deploy, domínio/HTTPS, smoke test e rollback aceitos no escopo das respectivas issues. |
| Banco de dados | Migrations #99 e registro de aplicação no Polyford; PR #172 (#101) | Schema e invariantes iniciais aprovados; policies RLS de domínio/configuração integradas e testadas em desenvolvimento. A integração funcional uniforme dos handlers permanece nas issues correspondentes. |
| Storage e anexos | ADR-008, Issue #117 e baseline POLY-REQ-001 v0.5 | Supabase Storage aprovado como capacidade de armazenamento privado da stack; scanner permanece interno, sob responsabilidade operacional da TI. |
| Dados e provedores | ADR-003, ADR-008 e ADR-009 | Fluxos entre aplicação Vercel e serviços Supabase aprovados; não autoriza compartilhamento com outros provedores. |
| Segredos e acesso | Auditoria da #96, ADR-009 e baseline | Uso de variáveis segregadas por ambiente, privilégio mínimo e secrets fora do código, cliente e logs aprovado. Valores secretos não são reproduzidos na documentação. |
| Continuidade | Baseline v0.5, ADR-005 e plano da #130 | Backups diários, retenção de 12 meses, disponibilidade mensal de 99%, RPO de 24 horas e RTO de 24 horas aprovados como parâmetros operacionais. A execução periódica e os ensaios são acompanhados no plano de operação. |
| Responsabilidades | ADR-009 e plano da #130 | TI responde pela operação, acessos, segredos, monitoramento, continuidade e incidentes; Tech Lead pela arquitetura e controles técnicos; Desenvolvimento pelas integrações; SQA pela verificação das evidências; PO pela rastreabilidade e escopo. |

**Registro de aprovação:** compatibilidade da stack e modelo de utilização aprovados pela TI e pela FORD em 24/11/2026. O registro é referente à decisão de arquitetura e operação da Q-025; não declara que toda integração funcional, policy RLS, bucket, scanner, backup ou teste de recuperação já esteja implementado ou executado.

**Limites de escopo:** a Q-025 está concluída quanto à compatibilidade e à aprovação do modelo de uso. As implementações de RLS (#101) e auditoria/retenção de eventos (#102) foram integradas à main pelas PRs #172 e #173 e testadas no ambiente de desenvolvimento, sem equivaler à homologação de produção. Continuam pendentes a integração dos handlers/callsites de negócio (#105/#124), Storage/scanner (#115/#116/#117), quotas efetivas e backup/restore (#130), conforme os critérios de cada issue. Essas entregas não reabrem a decisão de stack nem a aprovação da Q-025.

## 8.5 Decisões arquiteturais e limites

- A restrição da FORD a terceiros permanece como regra geral; a Q-025 registra a aprovação expressa de Supabase e Vercel como provedores nomeados da stack do Polychat. Outros serviços ou subprocessadores não estão automaticamente autorizados.
- A ADR-003 mantém Supabase + Vercel como stack tecnológica adotada; não classificar essas tecnologias como Deprecated, obsoletas ou substituídas sem decisão formal posterior.
- A existência de código, migrations, credenciais de exemplo, previews ou workflows não comprova, por si só, integração funcional, compatibilidade com os requisitos da FORD ou homologação para produção.
- A Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD para a configuração e o modelo de utilização da stack adotada. A aprovação não substitui a execução das integrações, controles e testes que permanecem atribuídos às issues de implementação.
- A aprovação de uma decisão técnica não deve ser confundida com evidência de implantação ou teste.

## 8.6 Histórico e rastreabilidade

- Q-001 a Q-024 são identificadores históricos preservados das versões anteriores.
- Q-025 foi concluída em 24/11/2026; a aprovação da compatibilidade operacional de Supabase + Vercel está registrada na seção 8.4 e nas ADRs relacionadas.
- Questões resolvidas permanecem documentadas para preservar a origem e a decisão.
- Q-018 foi concluída pelo PO em 20/11/2026; a arquitetura da informação está registrada em `docs/ux/decisoes-produto-q018-q019.md`.
- Q-019 possui paleta provisória definida pelo PO em 20/11/2026; a obtenção do arquivo oficial do logotipo continua como pendência específica.
- Q-025 teve sua compatibilidade aprovada pela TI e pela FORD em 24/11/2026; não há pendência de decisão ou substituição da stack.
- Quando uma questão parcial for concluída, atualizar seu status e vincular o artefato de UX ou a decisão correspondente.
- Não reutilizar identificadores encerrados para assuntos diferentes.
