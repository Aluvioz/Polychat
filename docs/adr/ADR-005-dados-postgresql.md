# ADR-005 — Banco de dados e modelo de dados

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

O Polychat precisa persistir perfis e contas, conversas individuais e em grupo, participantes, mensagens, anexos, alertas e eventos de auditoria. O produto atende uma única organização (FORD); a baseline não prevê operação multi-tenant.

A ADR-003 estabelece Supabase + Vercel como stack adotada e obrigatória. A FORD v2 mantém requisitos sobre controle de hospedagem, armazenamento e processamento; a compatibilidade da configuração e do modelo de uso do Supabase Database com esses requisitos deve ser avaliada na Q-025. Uma preocupação ou incompatibilidade identificada deve ser registrada e encaminhada para decisão formal, sem retirar ou depreciar a ADR-003 por inferência.

PostgreSQL é a tecnologia relacional prevista no contexto do Supabase Database, componente da plataforma Supabase adotada na ADR-003. Esta ADR detalha o modelo lógico/físico e a configuração do banco; a Q-025 registra as evidências e condições operacionais da configuração, sem reabrir a escolha da stack.

A fotografia inicial desta ADR foi superada por entregas técnicas posteriores já integradas à `main`. A PR #165 incorporou o schema inicial de domínio; a #168 adicionou índices de cobertura; a #172 implementou policies RLS e hardening de privilégios; a #173 integrou estruturas e controles de auditoria/retenção; e a #180 reconciliou a sequência local de migrations. A PR #181 provisionou o bucket privado de anexos e a #185 acrescentou o endpoint inicial server-side de upload. Essas entregas ampliaram a implementação, mas não representam a conclusão de todos os fluxos funcionais, da operação nem da homologação pela FORD.

## Problema

Definir a persistência de dados relacionais no contexto da stack adotada, preservando integridade referencial, rastreabilidade e isolamento de acesso, sem confundir o esquema parcial existente com o modelo de domínio completo.

## Alternativas consideradas

1. **PostgreSQL por meio do Supabase Database:** tecnologia relacional prevista no contexto da plataforma Supabase adotada pela ADR-003 e direção considerada para esta proposta. Configuração, modelo, controles e operação permanecem sujeitos ao detalhamento técnico desta ADR.
2. **PostgreSQL autogerenciado ou outro banco relacional:** não é a direção atual. Sua adoção exigiria justificativa, avaliação de impacto e decisão formal de mudança arquitetural; não decorre automaticamente dos requisitos de infraestrutura.
3. **Outro serviço de banco gerenciado fora da stack adotada:** não selecionado nesta decisão. Eventual inclusão dependeria de necessidade demonstrada e aprovação formal, sem constituir proibição genérica aos serviços gerenciados.
4. **Banco documental:** não selecionado nesta proposta, pois as relações entre conversas, participantes, autoria, mensagens e auditoria exigem integridade relacional.

## Decisão proposta

Manter **PostgreSQL por meio do Supabase Database** como tecnologia de banco relacional prevista no contexto da stack adotada pela ADR-003. Esta ADR permanece Proposed até a revisão do modelo e da configuração técnica. A configuração do projeto, backups, administração, monitoramento, recuperação, acessos e responsabilidades devem ser detalhados nesta ADR e avaliados operacionalmente na Q-025. A proposta não autoriza trocar a stack nem declara a implantação homologada.

O modelo lógico deve contemplar, no mínimo:

- **Contas e perfis:** identidade interna estável, nome de usuário único e papel/estado da conta. O nome de usuário não deve ser confundido com a chave primária interna.
- **Conversas:** identificação e tipo de conversa individual ou em grupo.
- **Participantes:** vínculo entre conta e conversa, com controle do ciclo de participação.
- **Mensagens:** autoria, conteúdo, conversa, registro temporal e dados necessários à confirmação de leitura e contador de não lidas.
- **Anexos:** metadados, localização de armazenamento privado, tipo, tamanho, estado da análise antimalware e controle de acesso.
- **Alertas:** regra que originou o alerta, severidade, estado e tratamento pelo TI.
- **Auditoria:** operador, ação, objeto afetado e instante do evento, incluindo consultas administrativas, exportações, downloads e operações administrativas de mensagens.

As operações e relações devem preservar as regras da baseline: Usuários não editam ou excluem mensagens; TI pode editar/excluir com auditoria; participantes removidos perdem imediatamente acesso às mensagens e anexos do grupo; mensagens confirmadas pelo servidor são persistidas e recuperáveis após reconexão normal.

### Integridade, autorização e retenção

- Chaves internas devem ser estáveis; relações de autoria e participação devem ser verificadas no servidor.
- O acesso às linhas deve aplicar autorização server-side e políticas no banco, incluindo RLS quando suportada e adequada à implantação escolhida.
- Não confiar em identificadores de usuário, papel ou participação enviados pelo cliente sem validação.
- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não sofrem exclusão automática enquanto o sistema operar.
- Exclusões dependem de autorização do TI; dados podem ser preservados durante investigações conforme decisão administrativa.
- Backups diários são retidos por 12 meses. Após exclusão autorizada, os dados deixam as cópias de backup ao final do ciclo definido, com descarte registrado em auditoria.
- A operação deve cumprir os parâmetros de disponibilidade, RPO, RTO, recuperação e gestão de chaves já consolidados nos requisitos não funcionais.

Não introduzir deleções em cascata ou expiração automática que contrariem a política de retenção e revogação de acesso definida pela FORD.

## Justificativa

O domínio é composto por relações explícitas entre contas, conversas, participantes, mensagens, anexos e registros administrativos. PostgreSQL, disponibilizado pelo Supabase Database no contexto da stack adotada, oferece modelo relacional, integridade referencial e transações adequadas a essas relações. A configuração e os controles de acesso, backup, recuperação e operação devem ser detalhados e evidenciados conforme esta ADR e a Q-025.

## Consequências

**Positivas:**
- Integridade referencial e transações para o domínio de comunicação.
- Integração do banco relacional à plataforma Supabase adotada, mantendo o modelo de domínio e os controles documentados.
- Possibilidade de aplicar controle de acesso no servidor e no próprio banco.
- Rastreabilidade de operações administrativas e regras de retenção.

**Negativas e cuidados:**
- A equipe do projeto/FORD deverá administrar o modelo de dados, as permissões, as configurações disponíveis, a observabilidade e os procedimentos de backup/recuperação, respeitando a divisão de responsabilidades do serviço gerenciado Supabase.
- Migrations, índices, backup/restore e testes de autorização precisam ser validados no ambiente homologado.
- O schema inicial e as estruturas centrais de domínio já estão versionados; permanecem a validação técnica contínua, os fluxos funcionais ainda não integrados, a homologação e a comprovação operacional de backup/restore e recuperação.

## Riscos

Modelo de domínio incompleto; políticas de acesso permissivas; perda de histórico; exclusões em cascata incompatíveis; divergência entre autorização da aplicação e do banco; backup sem restauração testada; exposição de dados em logs; acesso administrativo sem auditoria.

## Evidências atuais

- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` cria `profiles`, limita os papéis a `user` e `ti`, define estado da conta e habilita RLS. A migration é um artefato versionado da stack Supabase adotada, mas não comprova sua aplicação no projeto gerenciado nem a homologação operacional.
- Não há migrations versionadas para conversas, participantes, mensagens, anexos, alertas ou eventos de auditoria.
- A baseline POLY-REQ-001 v0.5 consolida as regras de acesso, leitura, retenção, auditoria, exclusão e continuidade.

## Pendências para Accepted

- Confirmar com Tech Lead e TI a configuração do PostgreSQL/Supabase Database na stack adotada, incluindo modelo, controles, backup, recuperação e responsabilidades; registrar as evidências operacionais correspondentes na Q-025.
- Revisar o modelo físico, migrations, índices, políticas de autorização e estratégia de backup/restore no ambiente de homologação.
- Registrar a decisão técnica, aprovadores e evidências de teste.

Os parâmetros de armazenamento, retenção, desempenho, backup, RPO/RTO, gestão de chaves e isolamento dos ambientes já alinhados com Desenvolvimento são requisitos consolidados; não são reabertos como pendências de produto por esta ADR.
