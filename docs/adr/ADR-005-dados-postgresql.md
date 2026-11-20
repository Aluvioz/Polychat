# ADR-005 — Banco de dados e modelo de dados

- **Status:** Proposed
- **Data de revisão:** 19/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.4

## Contexto

O Polychat precisa persistir perfis e contas, conversas individuais e em grupo, participantes, mensagens, anexos, alertas e eventos de auditoria. O produto atende uma única organização (FORD); a baseline não prevê operação multi-tenant.

Supabase é uma plataforma oficial do Polychat, conforme ADR-003. PostgreSQL por meio do Supabase Database é a direção de persistência do projeto. A configuração deve atender à proteção de dados, ao isolamento dos ambientes, às políticas de acesso e às necessidades de backup/recuperação da FORD. A validação das regiões e dos projetos por ambiente permanece na Q-025.

O único artefato SQL versionado é uma migration de scaffold para `public.profiles`, ligada ao Supabase Auth. Não há schema de domínio funcional integrado nem migrations para conversas, participantes, mensagens, anexos, alertas ou auditoria. A implementação física do banco de produto ainda não começou.

## Problema

Definir uma direção de persistência que preserve integridade referencial, rastreabilidade e isolamento de acesso, distinguindo o schema parcial existente do modelo de domínio completo.

## Alternativas consideradas

1. **PostgreSQL via Supabase Database:** plataforma oficial escolhida para persistência, sujeita à validação de schema, RLS, região, backup e homologação.
2. **Outro banco relacional:** alternativa descartada na direção atual, salvo decisão formal posterior que substitua a ADR-003.
3. **Outro banco/serviço de terceiros:** não aprovado para o projeto sem decisão explícita e avaliação própria.
4. **Banco documental:** não selecionado nesta proposta, pois as relações entre conversas, participantes, autoria, mensagens e auditoria exigem integridade relacional.

## Decisão proposta

Adotar **PostgreSQL por meio do Supabase Database** como plataforma oficial de persistência. Schema, migrations, políticas RLS, backups, monitoramento e recuperação devem ser implementados e validados conforme os requisitos da FORD.

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

O domínio é composto por relações explícitas entre contas, conversas, participantes, mensagens, anexos e registros administrativos. Um banco relacional oferece integridade referencial e transações adequadas a essas relações. A administração dos projetos, permissões, políticas e dados permanece sob governança da FORD; a operação utiliza o Supabase Database como plataforma oficial.

## Consequências

**Positivas:**
- Integridade referencial e transações para o domínio de comunicação.
- Dependência do serviço oficial Supabase Database, que deve ser considerada na análise de continuidade, portabilidade e custos.
- Possibilidade de aplicar controle de acesso no servidor e no próprio banco.
- Rastreabilidade de operações administrativas e regras de retenção.

**Negativas e cuidados:**
- A FORD/equipe deverá administrar projetos, usuários, papéis, permissões, políticas, migrations, backups e recuperação do banco conforme as capacidades e limites do Supabase Database; a operação da infraestrutura gerenciada segue o serviço contratado.
- Migrations, índices, backup/restore e testes de autorização precisam ser validados no ambiente homologado.
- A migration isolada de scaffold deverá ser revisada/evoluída quando a implementação física do modelo de domínio começar.

## Riscos

Modelo de domínio incompleto; políticas de acesso permissivas; perda de histórico; exclusões em cascata incompatíveis; divergência entre autorização da aplicação e do banco; backup sem restauração testada; exposição de dados em logs; acesso administrativo sem auditoria.

## Evidências atuais

- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` cria `profiles`, limita os papéis a `user` e `ti`, define estado da conta e habilita RLS. Trata-se de migration de scaffold, não schema de produto implementado nem comprovação de aplicação nos ambientes oficiais.
- Não há migrations versionadas para conversas, participantes, mensagens, anexos, alertas ou eventos de auditoria.
- A baseline POLY-REQ-001 v0.4 consolida as regras de acesso, leitura, retenção, auditoria, exclusão e continuidade.

## Pendências para Accepted

- Confirmar projetos/regiões Supabase por ambiente, aplicar migrations de forma controlada e validar RLS, backup e restauração (Q-025).
- Revisar o modelo físico, migrations, índices, políticas de autorização e estratégia de backup/restore no ambiente de homologação.
- Registrar a decisão técnica, aprovadores e evidências de teste.

Os parâmetros de armazenamento, retenção, desempenho, backup, RPO/RTO, gestão de chaves e isolamento dos ambientes já alinhados com Desenvolvimento são requisitos consolidados; não são reabertos como pendências de produto por esta ADR.
