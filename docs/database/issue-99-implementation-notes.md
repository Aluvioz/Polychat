# Issue #99 — registro de implementação e lacunas

## Auditoria do estado inicial

- A Issue #99 solicita modelar perfis, conversas, memberships, mensagens, anexos, auditoria e configurações.
- A PR #160 está aberta em Draft e contém a versão 0.3 de `docs/database/modelo-de-dados.md`. O parecer do PO de 20/11/2026 valida o escopo funcional conceitual, mas declara expressamente que não aprova DDL, schema físico, migrations ou RLS.
- A migration existente `202611160001_profiles_roles_and_account_status.sql` cria `profiles`, integra `auth.users`, limita `role` a `user`/ `ti`, mantém `is_active` e ativa RLS. Ela não contém `username`.
- Na branch `main`, foi identificada somente essa migration em `supabase/migrations`.
- A ADR-005 permanece Proposed e contém texto de direção operacional PostgreSQL sob controle da FORD, enquanto a PR #160 e o parecer complementar registram Supabase + Vercel como stack do projeto e mantêm Q-025 para compatibilidade com as restrições FORD. Essa tensão não é resolvida por esta migration.

## Implementado nesta branch

A migration `202611240001_issue_99_initial_domain_schema.sql` acrescenta:

- `profiles.username` como coluna nullable, com índice único parcial para não atribuir usernames fictícios a contas já existentes.
- `conversations`, com tipos `direct`/ `group`, estados `active`/ `disabled`/ `closed` e par canônico para unicidade de conversa individual.
- `memberships`, preservando períodos distintos e impedindo dois períodos vigentes para o mesmo perfil/conversa.
- `messages`, com autoria, ordenação temporal e metadados de edição/exclusão administrativa.
- `attachments`, com referência privada opaca, nome original, MIME PDF/JPEG, limite de 10 MiB e metadados de análise.
- `message_reads`, com chave por mensagem/leitor e instante da leitura.
- `security_alerts`, com referência de regra, severidade e estado/revisão conforme POLY-REQ-001 v0.5.
- Índices para os relacionamentos e consultas descritos no modelo conceitual.

As FKs de domínio usam `ON DELETE RESTRICT` para evitar remoção em cascata do histórico. As tabelas novas têm RLS habilitada e não recebem policies nesta entrega; o acesso permanece fechado até a matriz e as políticas das Issues #100/#101.

## Lacunas deliberadamente reservadas

### Issue #102 — auditoria e retenção

O modelo conceitual identifica `audit_events`, mas vincula explicitamente sua estrutura técnica detalhada à Issue #102. Esta entrega não cria a tabela nem catálogo, privilégios, imutabilidade, retenção, descarte ou backup de auditoria. A Issue #102 deve implementar e testar esses itens conforme seu escopo original.

### Configurações persistentes

O inventário funcional está definido (lista/regras de detecção, quota individual e capacidade total), mas a forma física de persistência e os atributos das estruturas não estão especificados como DDL no documento conceitual. Não foi criada tabela genérica `configs`, nem foram inventados campos/valores. Requer detalhamento técnico no contexto da Issue #99 antes de declarar persistência concluída.

### Username de perfis já existentes

A migration não infere username a partir de e-mail ou outro atributo. A coluna permanece nullable e a unicidade é aplicada aos valores informados. Para tornar o campo obrigatório, é necessário definir e executar uma carga de dados confiável para contas preexistentes antes de adicionar NOT NULL.

### Integridade entre mensagens e anexos

O requisito “texto não vazio ou ao menos um anexo” atravessa duas tabelas. Esta migration impede texto vazio quando informado, mas não implementa trigger cross-table para rejeitar mensagem sem texto e sem anexo. A validação transacional/server-side precisa ser completada e testada antes de considerar esse invariante integralmente atendido. O limite de cinco anexos por mensagem também precisa de validação transacional; não é seguro simulá-lo com CHECK simples.

### Dependência de ambiente

A migration foi versionada no repositório, mas não foi aplicada a uma instância PostgreSQL/Supabase real. A Q-025 e o estado Proposed da ADR-005 devem ser considerados antes de qualquer homologação operacional.

## Validação

Nenhum comando de teste, lint, typecheck, Supabase CLI ou aplicação de migration foi executado nesta entrega remota. A PR deve permanecer aberta para revisão e execução de validações no ambiente de desenvolvimento.
