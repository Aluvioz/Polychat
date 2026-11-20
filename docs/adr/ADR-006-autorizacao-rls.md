# ADR-006 — Autorização server-side e RLS

- **Status:** Accepted
- **Escopo do aceite:** contrato de desenho de autorização para os perfis `user` e `ti`, com base em scaffold isolado. Não representa implementação funcional nem cobre recursos de chat.
- **Data:** 17/11/2026
- **Issue:** #89 · **Implementação relacionada:** #105

## Contexto

A baseline prevê dois perfis: Usuário e TI. O repositório contém um exemplo isolado de middleware e migration para `profiles`, mas eles não estão integrados ao runtime. A implementação funcional de autenticação e autorização ainda não começou. A decisão desta ADR define o contrato-alvo server-side/RLS.

## Problema

Impedir que o cliente escolha seu próprio papel, contorne permissões alterando a interface ou leia/altere dados de perfil de outras contas sem autorização.

## Alternativas consideradas

1. Controle apenas na interface.
2. RBAC validado no servidor, complementado por RLS no banco.
3. Modelo ABAC mais amplo, com atributos e políticas adicionais.

## Decisão

Manter RBAC estrito com os papéis `user` e `ti`, com os seguintes controles obrigatórios para a implementação-alvo:

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

Esta ADR aceita o contrato de desenho para perfis e autorização, não uma implementação. O middleware Express-compatible e a migration `profiles` são artefatos de scaffold não integrados ao Next.js e não comprovam aplicação em projeto Supabase hospedado. A implementação funcional ainda não começou; não há RLS de conversas, participantes, mensagens, anexos ou auditoria.

## Artefatos de scaffold e limites de evidência

- `src/auth/authorization.mjs`
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`
- `tests/authorization.test.mjs`: 11 casos unitários com Supabase simulado, incluindo token ausente/inválido, conta inativa, perfil ausente, falha de consulta, papel inválido e separação de papel TI/Usuário.
- O workflow CI executa testes unitários do módulo isolado, ESLint, TypeScript e build; não há testes de integração/RLS real nem implementação funcional.

## Próxima extensão

Quando a implementação funcional começar, criar políticas RLS específicas para cada tabela, validar participação em conversa/grupo, testar isolamento entre usuários no Supabase real e integrar autenticação/autorização aos handlers Next.js. Requer revisão do Tech Lead, Dev backend e TI.
