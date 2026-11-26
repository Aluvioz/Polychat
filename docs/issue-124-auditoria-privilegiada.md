# Issue #124 — Auditoria de ações privilegiadas

## Base de persistência

A migration `supabase/migrations/20261125222249_issue_124_privileged_audit.sql` cria a trilha independente `public.privileged_action_audit`. A tabela registra ator, tipo do evento, recurso, instante gerado pelo banco, resultado e metadados; possui índices para pesquisa; mantém RLS habilitado; não concede acesso a `anon` ou `authenticated`; e impede alteração/exclusão direta dos registros.

A função `write_privileged_audit_event` valida o catálogo e o ator TI ativo (com exceção de falha de login sem identidade autenticada), remove recursivamente campos de credenciais dos metadados e grava o evento. O módulo `src/audit/privileged-audit.mjs` contém as regras de validação e sanitização.

## Integrações realizadas nesta entrega

- O endpoint existente `POST /api/auth/login` registra login TI bem-sucedido.
- Tentativas de login TI com identidade conhecida e conta inativa, e falhas de autenticação após localizar o perfil TI, geram `admin.login.failed`. Usuários comuns não são classificados como tentativas de login administrativo.
- Se a gravação do evento de login TI falhar, a rota não entrega os cookies da sessão e retorna erro genérico.
- `GET /api/admin/audit` exige sessão válida de perfil TI ativo e disponibiliza pesquisa paginada, com filtros por evento, ator, recurso, resultado e intervalo de data. A chave privilegiada é utilizada exclusivamente no servidor.

## Catálogo de eventos disponível

- `admin.login.succeeded` / `admin.login.failed`
- `account.created` / `account.updated` / `account.deactivated`
- `group.created` / `group.updated` / `group.member_added` / `group.member_removed`
- `sensitive.consultation` / `sensitive.change`

## Limites funcionais verificados

O README e a árvore atual do repositório mostram que os fluxos de administração de contas/grupos, consulta de conversas/alertas, download de anexos, alterações de configuração, exportação e edição/exclusão administrativa de mensagens ainda não possuem handlers funcionais de ponta a ponta. Portanto, o catálogo e o writer suportam esses tipos de evento, mas não há operações existentes para instrumentar nesses fluxos. Esta entrega não inventa endpoints ou comportamentos de negócio para substituir funcionalidades ainda não implementadas.

A consulta administrativa de conteúdo não foi criada nem habilitada. A ADR-010 permanece `Proposed` e declara que consulta/monitoramento de conteúdo não podem ser ativados em produção antes das aprovações ali especificadas.

A atomicidade entre futuras mutações administrativas e seus eventos deve ser implementada na mesma transação PostgreSQL/RPC quando esses handlers forem desenvolvidos. Uma gravação posterior separada não é evidência de atomicidade.

## Evidências e limites de teste

Os testes unitários existentes usam respostas Supabase simuladas. Os novos testes cobrem o writer REST, sanitização, validação de ator, filtros e paginação. Eles não comprovam integração ponta a ponta no Polyford.

Na verificação do banco de desenvolvimento em 26/11/2026, as tabelas `profiles`, `conversations`, `memberships`, `messages`, `attachments`, `security_alerts` e `privileged_action_audit` estavam sem registros. Assim, não foi possível executar login TI real ou gerar evidência de eventos com usuários reais.
