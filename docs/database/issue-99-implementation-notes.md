# Issue #99 — registro de implementação e lacunas

## Auditoria do estado inicial — retrato histórico (19/11/2026)

- A Issue #99 solicita modelar profiles, conversations, memberships, messages, attachments, audit_events e configurações.
- A PR #160 está aberta em Draft e contém a versão 0.3 de `docs/database/modelo-de-dados.md`. O parecer do PO valida o escopo funcional conceitual, mas não aprova DDL, schema físico, migrations ou RLS.
- A migration existente `202611160001_profiles_roles_and_account_status.sql` cria `profiles`, integra `auth.users`, limita `role` a `user`/ `ti`, mantém `is_active` e ativa RLS.
- **Registro histórico de 19/11/2026:** naquela revisão inicial, foi identificada somente a migration de perfis. Esse retrato foi superado pela integração da PR #165 em 24/11/2026, que incorporou as duas migrations de domínio descritas abaixo.
- **Estado atualizado em 24/11/2026:** ADR-005 — Accepted. A Q-025 foi concluída com aprovação da TI e da FORD para a compatibilidade da stack Supabase + Vercel e do modelo de utilização com os requisitos de infraestrutura.

## Implementado nesta branch

### Migration `202611240001_issue_99_initial_domain_schema.sql`

- Acrescenta `profiles.username` nullable com índice único parcial, sem inferir usernames para contas existentes.
- Cria `conversations`, com tipos `direct`/ `group`, estados documentados e par canônico para unicidade de conversa individual.
- Cria `memberships`, preservando períodos e impedindo dois períodos vigentes por perfil/conversa.
- Cria `messages`, com autoria, ordenação temporal e metadados de edição/exclusão administrativa.
- Cria `attachments`, com referência privada, nome original, MIME PDF/JPEG, limite de 10 MiB e metadados de análise.
- Cria `message_reads` por mensagem/leitor/instante.
- Cria `security_alerts` com regra, severidade e estado/revisão.
- Define FKs restritivas para preservar histórico e índices para as relações/consultas modeladas.
- Habilita RLS nas tabelas novas sem policies de domínio; enforcement pertence à #101.

### Migration `202611240002_issue_99_integrity_and_configuration.sql`

- Trigger diferido valida no commit que cada mensagem tenha texto não vazio ou ao menos um anexo.
- Trigger serializa inserções/alterações por mensagem e impede mais de cinco anexos, conforme o modelo v0.3 e a Issue #117.
- Cria `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`, cobrindo somente o inventário aprovado pelo PO.
- Não cria tabela genérica `configs`, não semeia regras/quota/capacidade e não inventa valores padrão.
- Habilita RLS e revoga acesso de `anon`/`authenticated` às tabelas de configuração; policies e exposição pertencem à #101.

As estruturas específicas `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity` foram revisadas e aprovadas pelo Tech Lead `luizme7` como parte da baseline inicial do schema, conforme registrado nos comentários da PR. A aprovação não substitui a implementação de autorização/exposição, que permanece no escopo da Issue #101.

## Pendências e limites restantes

### Issue #102 — auditoria e retenção

A estrutura `audit_events`, seu catálogo, controles append-only e writer são tratados na PR separada #166, aberta contra `main`. Recomenda-se integrar a PR #166 após a PR #165 para preservar a sequência das migrations. A Issue #99 não deve ser considerada concluída apenas pela existência das migrations de domínio.

### Username de perfis existentes

A coluna permanece nullable. Para torná-la obrigatória, é necessária estratégia confiável de preenchimento para contas preexistentes antes de adicionar NOT NULL.

### Integração das invariantes transacionais

A constraint trigger diferida exige que a criação de mensagem somente com anexos e os respectivos metadados ocorra na mesma transação. O fluxo precisa usar operação server-side transacional (por exemplo, RPC); chamadas REST separadas não satisfazem essa atomicidade. A integração funcional ainda depende dos fluxos de mensagens/anexos.

### Autorização e integração das configurações

As tabelas de configuração permanecem sem policies e sem concessão de acesso aos papéis da API. A Issue #101 deve definir e testar o enforcement. Serviços/telas de configuração e consumo das regras permanecem nas issues funcionais correspondentes.

### Ambiente e validação SQL

As duas migrations desta PR foram aplicadas no projeto Supabase de desenvolvimento **Polyford** (`oixifpdfvrenlhvycszy`), localizado em `sa-east-1`. Na verificação mais recente, o projeto estava em estado `ACTIVE_HEALTHY`, com PostgreSQL `17.11.0.019`.

O histórico remoto de migrations contém os seguintes registros correspondentes às migrations de domínio desta PR:

- `20261124191114` — `issue_99_initial_domain_schema`
- `20261124191131` — `issue_99_integrity_and_configuration`

O histórico também contém a migration de baseline de perfis (`20261124191059`, `profiles_roles_and_account_status`) e, posteriormente, a migration de auditoria da Issue #102 aplicada no contexto da PR #166 (`20261124210245`, `issue_102_audit_events`).

**Observação de rastreabilidade:** as versões registradas pelo histórico remoto são os identificadores gerados no ambiente e não repetem literalmente os prefixos dos arquivos SQL versionados no Git. Essa diferença de identificadores deve ser considerada ao reconciliar o histórico de migrations; não significa que as migrations de domínio estejam ausentes do ambiente.

A consulta ao schema `public` confirmou as tabelas de domínio/configuração previstas pelas migrations desta PR: `conversations`, `memberships`, `messages`, `attachments`, `message_reads`, `security_alerts`, `detection_rules`, `attachment_user_quotas` e `attachment_storage_capacity`. A tabela `profiles` já existia na baseline. A RLS está habilitada nas tabelas criadas pela modelagem; as policies de domínio e configuração continuam atribuídas à Issue #101.

A aplicação e a inspeção do schema no Polyford comprovam a presença das migrations e estruturas no ambiente de desenvolvimento. **Não equivalem a um teste automatizado de integração SQL/PostgreSQL reproduzível no CI.** A integração server-side/RPC para criação atômica de mensagem e anexos continua pendente dos fluxos de produto correspondentes.

A Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD para a compatibilidade da configuração e do modelo de utilização Supabase + Vercel. A ADR-005 passou a Accepted. A conclusão refere-se à decisão de arquitetura e operação; não substitui a implementação e os testes de RLS, integração transacional, Storage, auditoria e continuidade que permanecem nas respectivas issues.

## Consolidação da Q-025 — aprovação da compatibilidade (24/11/2026)

A TI e a FORD aprovaram a utilização de Supabase + Vercel como stack do Polychat, incluindo o modelo de ambientes, fluxo de dados, banco PostgreSQL, Storage privado, gestão de segredos, responsabilidades operacionais e parâmetros de continuidade.

A aprovação considera as evidências reunidas neste documento e os registros das Issues #96 e #98:
- Polyford é o projeto Supabase oficial de desenvolvimento, na região `sa-east-1`, com PostgreSQL `17.11.0.019`; as migrations #99 foram aplicadas e o schema foi consultado.
- As Issues #96 e #98 foram encerradas com confirmação do responsável/Tech Lead quanto às configurações operacionais, deploy hospedado, smoke tests, domínio/HTTPS e ensaio de rollback em seus respectivos escopos.
- A PR #165 incorporou ao repositório as migrations de schema e integridade da #99. A presença dessas migrations e sua aplicação no desenvolvimento são evidências de estrutura; não substituem integração funcional ou testes de autorização.

**Decisão de compatibilidade:** Supabase e Vercel ficam aprovados como provedores nomeados da stack do Polychat, nos serviços e limites definidos pelas ADRs. A restrição geral a outros terceiros permanece vigente; qualquer novo fornecedor ou subprocessador que possa acessar, armazenar ou processar dados do produto depende de aprovação específica.

**Responsabilidades aprovadas:** TI responde por operação de ambientes, acessos, secrets, monitoramento, backup, recuperação e incidentes; Tech Lead responde pela arquitetura e controles técnicos; Desenvolvimento pela implementação das integrações; SQA pela verificação de testes e evidências; PO pela rastreabilidade e escopo.

**Parâmetros operacionais aprovados:** ambientes separados por estágio, credenciais de escopo mínimo, secrets fora de código/cliente/logs, backups diários com retenção de 12 meses, disponibilidade mensal de 99%, RPO de até 24 horas e RTO de até 24 horas. Os detalhes dos valores secretos e das configurações administrativas permanecem nos respectivos painéis, sem reprodução na documentação.

**Limite do aceite:** Q-025 concluída quanto à compatibilidade da stack e aprovação do modelo de uso. Não declara que policies RLS, fluxos de aplicação, bucket Storage, scanner, transações, backup/restore ou testes E2E já estejam implementados ou executados. Essas entregas permanecem rastreadas nas Issues #101, #102, #105, #115, #116, #117, #126 e #130 e não reabrem a decisão da Q-025.

## Validação

No commit documental `f46b7f64e5105c8ba7bd97e4c31fa2e9a20057c4`, os dois workflows CI associados concluíram com sucesso:

- CI run [#286](https://github.com/Aluvioz/Polychat/actions/runs/45489032173) — `success`.
- CI run [#356](https://github.com/Aluvioz/Polychat/actions/runs/45489032376) — `success`.

O status do Preview Vercel também retornou `success`. Esses resultados validam os checks de aplicação/build configurados, mas não substituem testes automatizados de integração SQL, RLS ou dos fluxos transacionais no Supabase.

No head então atual da PR, `ee031af1fd00c9f515a3669ba9337a89f914eca3`, os dois workflows CI também concluíram com sucesso:

- CI run [#359](https://github.com/Aluvioz/Polychat/actions/runs/45495416188) — `success`.
- CI run [#289](https://github.com/Aluvioz/Polychat/actions/runs/45495416126) — `success`.

O Preview Vercel associado a esse head também retornou `success`.

A revisão do Tech Lead `luizme7` está registrada como **APPROVED** para a baseline inicial do schema, incluindo as três estruturas específicas de configuração, com as ressalvas descritas nesta nota. A confirmação formal final do SQA permanece pendente.
