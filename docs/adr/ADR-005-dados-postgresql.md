# ADR-005 — Banco de dados e modelo de dados

- **Status:** Accepted
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

O Polychat precisa persistir perfis e contas, conversas individuais e em grupo, participantes, mensagens, anexos, alertas e eventos de auditoria. O produto atende uma única organização (FORD); a baseline não prevê operação multi-tenant.

A ADR-003 estabelece Supabase + Vercel como stack adotada e obrigatória. Em 24/11/2026, TI e FORD aprovaram na Q-025 a compatibilidade da configuração e do modelo de utilização dessa stack com os requisitos de infraestrutura. Supabase Database/PostgreSQL fica aprovado como componente de persistência no contexto da stack, sem alteração da ADR-003.

PostgreSQL permanece como tecnologia relacional adotada no Supabase, conforme ADR-003 e Q-025 — Concluída. A operação aprovada utiliza ambientes segregados, controle de acesso, credenciais por estágio e responsabilidades operacionais definidas nas ADRs 003 e 009.

O schema versionado inclui `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts`, introduzidos pelas migrations #99. As estruturas `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity` também estão versionadas. As policies RLS de domínio foram integradas e testadas em desenvolvimento pela #101 (PR #172). A trilha `audit_events` e os controles de retenção de eventos foram integrados pela #102 (PR #173); callsites adicionais e backup/restore permanecem pendentes.

## Problema

Definir a persistência de dados relacionais no contexto da stack adotada, preservando integridade referencial, rastreabilidade e isolamento de acesso, sem confundir o esquema parcial existente com o modelo de domínio completo.

## Alternativas consideradas

1. **PostgreSQL no Supabase:** tecnologia relacional adotada na stack Supabase + Vercel, com compatibilidade operacional aprovada na Q-025 e implementação sujeita aos critérios das issues de domínio.
2. **Outro banco relacional operado sob controle da FORD:** alternativa possível caso a infraestrutura e os padrões corporativos indiquem tecnologia diferente.
3. **Banco de dados gerenciado por fornecedor não aprovado:** não permitido. O Supabase é a exceção expressamente aprovada pela FORD como provedor nomeado da stack do Polychat, sob os controles e limites registrados na Q-025.
4. **Banco documental:** não selecionado nesta proposta, pois as relações entre conversas, participantes, autoria, mensagens e auditoria exigem integridade relacional.

## Decisão

Adotar **PostgreSQL no Supabase Database como tecnologia relacional do Polychat**, dentro da stack Supabase + Vercel estabelecida pela ADR-003. A Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD para a compatibilidade do modelo de utilização, da localização e operação por ambientes, dos acessos, da gestão de segredos e das responsabilidades. A stack não pode ser substituída por inferência.

### Registro de aprovação

**Aprovadores funcionais:** TI e representante da FORD.  
**Data:** 24/11/2026.  
**Referência:** Q-025 — Compatibilidade da stack Supabase + Vercel, concluída.  
**Resultado:** PostgreSQL/Supabase Database aprovado para persistência de perfis e domínio do Polychat, sob a arquitetura e os controles de operação registrados nas ADRs 003 e 009.

O aceite desta ADR aprova a decisão tecnológica e seu modelo operacional. Não declara que todas as tabelas, policies RLS, integrações transacionais, backups ou testes de recuperação já estejam implementados; essas entregas permanecem nas issues correspondentes.

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

O domínio é composto por relações explícitas entre contas, conversas, participantes, mensagens, anexos e registros administrativos. Um banco relacional oferece integridade referencial e transações adequadas a essas relações. A operação sob controle da FORD atende à restrição de infraestrutura, independentemente do fornecedor de software utilizado para o mecanismo de banco.

## Consequências

**Positivas:**
- Integridade referencial e transações para o domínio de comunicação.
- Independência de um serviço externo específico de banco de dados.
- Possibilidade de aplicar controle de acesso no servidor e no próprio banco.
- Rastreabilidade de operações administrativas e regras de retenção.

**Negativas e cuidados:**
- A operação, o monitoramento, a atualização, a proteção e a recuperação da instância ficam sob responsabilidade operacional da TI, conforme o modelo aprovado.
- Migrations, índices, backup/restore e testes de autorização precisam ser validados no ambiente homologado.
- O esquema parcial vinculado ao Supabase deverá ser revisado e ampliado para cobrir o domínio, mantendo rastreabilidade e compatibilidade com a stack adotada.

## Riscos

Modelo de domínio incompleto; políticas de acesso permissivas; perda de histórico; exclusões em cascata incompatíveis; divergência entre autorização da aplicação e do banco; backup sem restauração testada; exposição de dados em logs; acesso administrativo sem auditoria.

## Evidências atuais

- `202611160001_profiles_roles_and_account_status.sql` estabelece `profiles`, papéis e estado da conta.
- `202611240001_issue_99_initial_domain_schema.sql` cria as tabelas principais do domínio e habilita RLS sem policies de domínio.
- `202611240002_issue_99_integrity_and_configuration.sql` implementa invariantes de mensagem/anexos e estruturas específicas de configuração.
- **Schema — PR #165:** as migrations iniciais de domínio foram integradas e revisadas no escopo da entrega; as estruturas `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `message_reads` e `security_alerts` permanecem versionadas.
- **Índices — PR #168:** migration aditiva com índices de cobertura de FKs integrada; a verificação posterior em `pg_indexes` confirmou sua persistência no Polyford de desenvolvimento.
- As notas da Issue #99 registram a aplicação e inspeção dessas migrations no projeto Supabase Polyford de desenvolvimento, região `sa-east-1`.
- As policies RLS de domínio foram integradas pela PR #172 e os testes de isolamento passaram em Polyford; a evidência não equivale à homologação de produção ou cobertura de todos os handlers.
- A trilha `audit_events`, `retention_holds` e descarte controlado de eventos foram integrados pela PR #173 e testados em Polyford; retenção física de mensagens/anexos, backup/restore e callsites para todas as operações continuam pendentes.
- A infraestrutura separada `privileged_action_audit` foi integrada pela PR #170 para a #124; handlers/callsites de negócio ainda precisam ser instrumentados.
- **Histórico de migrations — PR #180 e PR #181:** a sequência local contém 18 migrations, incluindo a migration do bucket privado. A instalação limpa no workflow da #180 aplicou 18 migrations em PostgreSQL local descartável e confirmou 18/18 entradas em `supabase migration list --local`. Essa evidência não altera o histórico remoto nem representa aplicação de DDL no Polyford.
- **Storage e upload — PRs #181 e #185:** a PR #181 provisionou o bucket privado `attachments` no Polyford, com allowlist PDF/JPEG e limite de 10.485.760 bytes (10 MiB); a PR #185 integrou o endpoint inicial server-side de upload, com validação de sessão/autoria, extensão/MIME/assinatura, limite de 10 MiB e metadados sob RLS. Não comprova download, links temporários, scanner/quarentena, quotas, backup de objetos ou fluxo ponta a ponta.
- O histórico remoto consultado após a PR #181 registrou 18 versões correspondentes à sequência consolidada. Não foram executados `db push`, `migration repair` ou reset no Polyford remoto.
- A baseline POLY-REQ-001 v0.5 consolida as regras de acesso, leitura, retenção, auditoria, exclusão e continuidade.

## Trabalho de implementação remanescente

- Integrar autenticação/autorização de forma uniforme aos handlers reais de conversas, grupos, mensagens e anexos.
- Concluir os fluxos server-side/transacionais de mensagens e anexos e aplicar políticas de objetos no Storage.
- Instrumentar callsites restantes de `audit_events` e `privileged_action_audit`, incluindo consultas/exportações e operações administrativas previstas.
- Configurar e comprovar quotas individuais/globais, Storage privado e scanner interno.
- Executar e registrar testes de backup/restauração, retenção física, autorização ponta a ponta e continuidade previstos nas issues de implementação e operação.

Os parâmetros de armazenamento, retenção, desempenho, backup, RPO/RTO, gestão de chaves e isolamento dos ambientes já alinhados com Desenvolvimento são requisitos consolidados; não são reabertos como pendências de produto por esta ADR.
