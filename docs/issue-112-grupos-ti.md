# Issue #112 — Criação e edição de grupos pela TI

## Escopo implementado

A API administrativa permite que uma conta TI autenticada e ativa crie grupos e altere o nome de grupos existentes, usando `public.conversations` com `kind = 'group'`.

- `POST /api/ti/groups`: recebe somente `name`.
- `PATCH /api/ti/groups/:groupId`: recebe somente `name`.
- O ator é obtido de `authorizeNextRequest` após validação da sessão; identificadores e papéis enviados pelo cliente não são aceitos.
- A criação grava `created_by_profile_id` com a identidade TI validada e usa o estado inicial `active` definido pelo schema.
- A edição altera somente `name` e `updated_at`; não altera tipo, criador, participantes, memberships, mensagens ou status.
- Não é criada membership automaticamente. A gestão de integrantes permanece na Issue #113.
- O ciclo de vida `disabled/closed` não integra esta issue.

## Decisão formal do PO — campo `description`

O parecer formal do PO registrado na PR #178 em 27/11/2026 (comentário [#7227002631](https://github.com/Aluvioz/Polychat/pull/178#issuecomment-7227002631)) delimitou o escopo desta entrega:

- Criação de grupos com definição de nome.
- Edição do nome de grupos existentes.
- Preservação das regras de autorização, integridade e auditoria.

**O campo `description` (descrição complementar do grupo) está fora do escopo desta entrega.** RF-005 e o modelo de dados vigente definem a identificação do grupo pelo nome; não há contrato funcional aprovado nem estrutura de persistência para descrição. Portanto, não será incluída coluna, migration, teste ou alteração de rota para esse campo nesta PR. Uma eventual descrição complementar deverá ser tratada como requisito futuro separado.

O parecer do PO delimita o escopo funcional; não substitui a revisão do SQA, não representa aprovação integral da PR e não autoriza merge.

## Autorização, persistência e auditoria

As rotas usam `authorizeNextRequest` com `allowedRoles: ["ti"]` e `enforceDeviceCompatibility: true`. A sessão, o perfil e o estado da conta são validados no servidor.

O módulo `src/groups/group-admin.mjs` usa `SUPABASE_SECRET_KEY` exclusivamente no servidor para invocar RPCs. A identidade passada às RPCs vem da sessão validada; o banco também confirma que o perfil é TI e está ativo.

As RPCs administrativas executam mutação e auditoria na mesma transação PostgreSQL, reutilizando `public.write_privileged_audit_event` para `group.created` e `group.updated`. Se a gravação da auditoria falhar, a mutação é revertida. As policies RLS existentes não foram alteradas. As RPCs privilegiadas são restritas a `service_role`, com validação independente do perfil TI ativo no banco.

Metadados de auditoria são mínimos; conteúdo de mensagens, credenciais e dados pessoais não são enviados.

## Testes e evidências no HEAD atual

HEAD da PR #178: `396b1682c2425073fdf1fb45c4eb41ba7653c1ec`  
Base da PR: `main` — base SHA `dd53c7f3684319fb2f0a0a91abe5a564701d606e`.

### CI

No HEAD acima, concluíram com sucesso:

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Smoke test do Next.js

Execução: [GitHub Actions — CI #46058621518](https://github.com/Aluvioz/Polychat/actions/runs/46058621518).

### Instalação limpa Supabase

O workflow iniciou uma stack Supabase local descartável, aplicou todas as migrations em banco vazio, executou `supabase/tests/issue_112_group_admin.integration.sql`, verificou o histórico e encerrou a stack.

Execução: [GitHub Actions — clean install #46058621588](https://github.com/Aluvioz/Polychat/actions/runs/46058621588).

Essa execução local não substitui a validação no projeto Supabase hospedado de homologação.

### Homologação no projeto hospedado Polyfordtest

O ambiente correto de homologação é **Polyfordtest** (projeto Supabase `rferhswvesmoyaqvkoet`). **Polyford** (`oixifpdfvrenlhvycszy`) é produção e não deve ser usado para esta homologação.

Em 27/11/2026, a consulta ao histórico do projeto Polyfordtest confirmou as 19 migrations do repositório aplicadas, incluindo `20261127181145_issue_112_group_admin` (registrada no histórico como versão `20261127193633`).

O roteiro `supabase/tests/issue_112_group_admin.integration.sql` foi enviado para execução no Polyfordtest em uma transação que termina em `ROLLBACK`. A chamada retornou sem erro SQL. A verificação posterior confirmou:
- zero usuários de fixture em `auth.users`;
- zero conversas de fixture;
- zero triggers temporários do roteiro;
- migration da Issue #112 presente no histórico.

A execução não deixou dados sintéticos persistidos. O resultado comprova a execução SQL sem erro reportado e a limpeza da fixture; não equivale a um teste HTTP autenticado com uma conta TI real, que não foi realizado nesta etapa.

### Esclarecimento sobre registro anterior em Polyford

O comentário [#7225495638](https://github.com/Aluvioz/Polychat/pull/178#issuecomment-7225495638) relatou uma execução no projeto **Polyford**. Esse projeto é produção, não o ambiente de homologação. Portanto, aquele registro não é usado como evidência de homologação em Polyfordtest. O histórico do comentário é mantido; este esclarecimento corrige explicitamente a identificação do ambiente. Nenhuma nova alteração foi realizada em Polyford para esta validação.

## Estado da revisão e próximos critérios

- Tech Lead: aprovação técnica registrada nos comentários da PR.
- PO: escopo funcional formalmente delimitado; `description` fora do escopo.
- CI e instalação limpa: aprovados no HEAD informado acima.
- Homologação SQL hospedada: executada em Polyfordtest, sem erro SQL reportado e com verificação de rollback/ausência de fixtures.
- SQA: último parecer registrado em [#7226910611](https://github.com/Aluvioz/Polychat/pull/178#issuecomment-7226910611) ainda não aprovou integralmente a PR; solicitou comprovação da homologação no projeto autorizado e atualização desta documentação.

A PR #178 permanece aberta e não mesclada. A Issue #112 não deve ser encerrada até que o SQA registre aprovação integral. Esta documentação e as evidências não constituem autorização de merge.
