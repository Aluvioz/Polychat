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

A estrutura `audit_events`, seu catálogo, controles append-only e writer são tratados na PR separada #166. A PR #166 deve ser revisada e integrada na sequência correta. A Issue #99 não deve ser considerada concluída apenas pela existência das migrations de domínio.

### Username de perfis existentes

A coluna permanece nullable. Para torná-la obrigatória, é necessária estratégia confiável de preenchimento para contas preexistentes antes de adicionar NOT NULL.

### Integração das invariantes transacionais

A constraint trigger diferida exige que a criação de mensagem somente com anexos e os respectivos metadados ocorra na mesma transação. O fluxo precisa usar operação server-side transacional (por exemplo, RPC); chamadas REST separadas não satisfazem essa atomicidade. A integração funcional ainda depende dos fluxos de mensagens/anexos.

### Autorização e integração das configurações

As tabelas de configuração permanecem sem policies e sem concessão de acesso aos papéis da API. A Issue #101 deve definir e testar o enforcement. Serviços/telas de configuração e consumo das regras permanecem nas issues funcionais correspondentes.

### Ambiente e validação SQL

As migrations foram versionadas, mas não foram aplicadas nem testadas em PostgreSQL/Supabase real. O projeto Supabase Polyford retornou status INACTIVE nesta execução. Não foi reativado. A Q-025 e a ADR-005 Proposed precisam ser consideradas antes da homologação operacional.

## Validação

O CI da PR #165 executou com sucesso os jobs de build e de lint/typecheck/testes/build no commit `9c0711dcb5e091f751f1070230d9f09db558947b`. O Preview Vercel reportado é validação de build/deploy da aplicação, não de SQL, RLS ou integração Supabase.

Os testes automatizados executados pelo CI cobrem os testes existentes em Node. Não há teste de integração SQL/PostgreSQL nesta branch; constraints e triggers ainda exigem validação em banco de desenvolvimento.
