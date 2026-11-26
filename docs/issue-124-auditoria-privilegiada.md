# Issue #124 — Auditoria de ações privilegiadas

## Implementação incluída

A migration `202611250001_issue_124_privileged_audit.sql` cria uma trilha própria em `public.privileged_action_audit`; ela não depende de outra tabela de auditoria. A tabela:

- registra ator, tipo do evento, recurso, instante gerado pelo banco, resultado e metadados;
- possui índices por data, evento, ator e recurso para pesquisa;
- mantém RLS habilitado e não concede acesso a `anon` ou `authenticated`;
- concede leitura/inserção apenas a `service_role` e impede `UPDATE`/`DELETE` para essa role;
- recebe eventos por `write_privileged_audit_event`, que valida o catálogo, exige ator TI ativo (exceto falha de login sem identidade validada) e remove recursivamente chaves de credenciais dos metadados.

O módulo `src/audit/privileged-audit.mjs` oferece `recordPrivilegedAuditEvent` e `searchPrivilegedAuditEvents`. As duas funções exigem cliente Supabase server-side; a pesquisa exige ator TI ativo e aceita filtros exatos por evento, ator, recurso, resultado e intervalo de data, com paginação limitada a 100 registros.

## Catálogo de eventos

- `admin.login.succeeded` / `admin.login.failed`
- `account.created` / `account.updated` / `account.deactivated`
- `group.created` / `group.updated` / `group.member_added` / `group.member_removed`
- `sensitive.consultation` / `sensitive.change`

## Regras de uso seguro

1. Obter o ator exclusivamente de `req.authUser` após `requireAuthenticatedUser` e `requireRole("ti")`; nunca aceitar `actor_profile_id` do corpo/query do cliente.
2. Usar a chave `service_role` somente em ambiente server-side. Nunca expor essa chave ao navegador nem usar prefixo `NEXT_PUBLIC_`.
3. Metadados devem conter somente identificadores e contexto operacional mínimo. Não registrar senhas, tokens, cookies, cabeçalhos de autorização, conteúdo de mensagens, anexos ou dados pessoais desnecessários. A sanitização remove chaves com nomes de credenciais, mas não substitui a obrigação de não enviar segredos dentro de valores genéricos.
4. Para manter a mutação e seu evento indivisíveis, os futuros handlers de conta/grupo devem executar a mutação e a inserção de auditoria na mesma transação PostgreSQL/RPC. Não tratar uma chamada de auditoria posterior como prova de atomicidade.
5. Consultas administrativas de conteúdo só podem ser instrumentadas quando a finalidade, justificativa, escopo, período, transparência e governança forem aprovados. Esta implementação não cria nem habilita endpoint de consulta de conversas.

## Limites de integração no estado atual do repositório

O README informa que autenticação, conversas, grupos, mensagens e administração ainda não estão implementados de ponta a ponta. Portanto, esta entrega disponibiliza o armazenamento, o catálogo, o writer e a pesquisa, mas não declara que eventos reais já estejam sendo emitidos por fluxos funcionais de login, gestão de contas/grupos ou consulta sensível. A integração desses call sites depende da implementação dos respectivos handlers; a consulta de conteúdo também depende das aprovações registradas na ADR-010.

## Evidência de teste

`node --test tests/privileged-audit.test.mjs` cobre catálogo, sanitização recursiva, validação de ator, falha de persistência, autorização de pesquisa, filtros e paginação. Esses testes são unitários com Supabase simulado; não comprovam integração/homologação do projeto remoto.
