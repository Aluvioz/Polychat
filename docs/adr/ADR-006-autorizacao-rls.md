# ADR-006 — Autorização server-side e RLS

- **Status:** Accepted
- **Escopo do aceite:** contrato implementado para autenticação/autorização de perfis no módulo e na migration existentes. Não cobre recursos de chat ainda inexistentes.
- **Data:** 17/11/2026
- **Issue:** #89 · **Implementação relacionada:** #105

## Contexto

A baseline prevê dois perfis: Usuário e TI. A camada de autorização versionada valida a identidade pelo Supabase Auth, carrega papel e estado da tabela `profiles`, bloqueia papéis desconhecidos e contas inativas e falha fechada quando não consegue validar. A migration habilita RLS em `profiles` e impede escrita direta de clientes sobre dados privilegiados.

## Relação com a ADR-003

Esta decisão Accepted cobre somente o módulo e a migration de perfis descritos nesta ADR. Ela não amplia o aceite para RLS de domínio nem comprova integração/homologação de produção. O escopo limitado não nega nem substitui a decisão da ADR-003, que mantém Supabase + Vercel como stack adotada e obrigatória.

## Problema

Impedir que o cliente escolha seu próprio papel, contorne permissões alterando a interface ou leia/altere dados de perfil de outras contas sem autorização.

## Alternativas consideradas

1. Controle apenas na interface.
2. RBAC validado no servidor, complementado por RLS no banco.
3. Modelo ABAC mais amplo, com atributos e políticas adicionais.

## Decisão

Manter RBAC estrito com os papéis `user` e `ti`, com os seguintes controles no escopo atualmente implementado:

- O servidor valida o JWT por `supabase.auth.getUser(token)`.
- O papel e o estado são lidos de `public.profiles`; body, query ou metadados controlados pelo cliente não são fonte de autorização.
- Somente os papéis `user` e `ti` são aceitos.
- Conta ausente, perfil ausente, papel desconhecido ou conta inativa não recebe autorização.
- Falha de infraestrutura/consulta retorna erro genérico e não concede acesso.
- `requireRole` verifica o papel depois do middleware de autenticação.
- RLS de `profiles` permite leitura do próprio perfil ou por TI ativo; escrita direta por `anon` e `authenticated` é revogada.
- Alterações de papel/status exigem contexto confiável no servidor. Chaves privilegiadas não podem ser entregues ao browser.

## Justificativa

A verificação server-side reduz dependência da UI. RLS fornece uma segunda fronteira no banco e limita o impacto de um endpoint ou cliente mal implementado.

## Consequências

**Positivas:** regra de perfil centralizada e testável; falha fechada; bloqueio de escrita privilegiada direta.

**Negativas:** exige sincronização entre autorização server-side e RLS; requer testes de políticas no banco real e integração de middleware em todos os handlers protegidos.

## Limite explícito do aceite

O aceite cobre somente o módulo de autorização e a tabela `profiles`. A migration ainda não comprova aplicação em projeto Supabase hospedado. A sessão do Next.js App Router é integrada por `src/auth/next-authorization.mjs`, consumido por `GET /api/auth/session`. O middleware Express permanece disponível para handlers que usem Bearer. Ainda não existem handlers de recursos de negócio que consumam permissões específicas de User/TI; eles deverão usar o adaptador antes de executar operações protegidas. A existência de autorização de perfil não substitui as políticas RLS de domínio, que devem ser verificadas por recurso.

## Evidências e testes

- `src/auth/authorization.mjs` e `src/auth/next-authorization.mjs`
- `src/auth/supabase-session.mjs` e `src/app/api/auth/session/route.ts`
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`
- `tests/authorization.test.mjs`: 11 casos unitários do middleware Bearer.
- `tests/next-authorization.test.mjs`: casos do adaptador Next.js para cookies, sessão inválida, restrição TI, perfil User e falha fechada.
- `tests/supabase-session.test.mjs`: validação de sessão, bloqueio de conta inativa e renovação/revogação de tokens.
- O workflow CI executa `npm test`, ESLint, TypeScript e build.

## Próxima extensão

Para liberar recursos de domínio, criar políticas RLS específicas para cada tabela, validar participação em conversa/grupo, testar isolamento entre usuários no Supabase real e integrar autenticação/autorização aos handlers Next.js. Requer revisão do Tech Lead, Dev backend e TI.
