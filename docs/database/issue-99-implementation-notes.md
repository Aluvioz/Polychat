# Issue #99 — registro de implementação e lacunas

## Auditoria do estado inicial

- A Issue #99 solicita modelar profiles, conversations, memberships, messages, attachments, audit_events e configurações.
- A PR #160 está aberta em Draft e contém a versão 0.3 de `docs/database/modelo-de-dados.md`. O parecer do PO valida o escopo funcional conceitual, mas não aprova DDL, schema físico, migrations ou RLS.
- A migration existente `202611160001_profiles_roles_and_account_status.sql` cria `profiles`, integra `auth.users`, limita `role` a `user`/ `ti`, mantém `is_active` e ativa RLS.
- Na `main`, foi identificada somente essa migration em `supabase/migrations`.
- A ADR-005 permanece Proposed e a Q-025 continua aberta para compatibilidade operacional da stack Supabase + Vercel com as restrições FORD.

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

Os nomes e campos físicos das três estruturas de configuração são uma proposta mínima derivada do inventário funcional, não uma aprovação de DDL. Permanecem sujeitos à revisão do Tech Lead.

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

A Q-025 e a ADR-005 Proposed continuam sendo referências pendentes para a homologação operacional da stack.

## Validação

No head da PR `2550112050d9da95fe8c1bfa34ed045f62dda1ca`, os dois workflows CI associados concluíram com sucesso:

- CI run [#270](https://github.com/Aluvioz/Polychat/actions/runs/45407652543) — `success`.
- CI run [#340](https://github.com/Aluvioz/Polychat/actions/runs/45407652398) — `success`.

O status do Preview Vercel também retornou `success`. Esses resultados validam os checks de aplicação/build configurados, mas não substituem testes automatizados de integração SQL, RLS ou dos fluxos transacionais no Supabase.

A revisão do Tech Lead `luizme7` está registrada como **APPROVED** para a baseline inicial do schema, com as ressalvas descritas nesta nota. A revisão SQA mais recente de `Dante-Davi` solicita a sincronização destas evidências documentais e da descrição da PR; a confirmação formal final do SQA permanece pendente.
