# ADR-006 — Autorização server-side e RLS

- **Status:** Accepted
- **Escopo do aceite:** contrato de perfis/sessões integrado pelas PRs #174 e #175 e policies RLS de domínio entregues pela PR #172 e testadas no Supabase de desenvolvimento. Não representa homologação de produção, autenticação positiva com usuário real nem integração ponta a ponta de todos os recursos/handlers do chat.
- **Data:** 17/11/2026
- **Issue:** #89 · **Implementação relacionada:** #105

## Contexto

A baseline prevê dois perfis: Usuário e TI. Os endpoints de autenticação/sessão em `src/app/api/auth/` usam Supabase Auth e validam papel/estado atual em `profiles`; a rota de sessão rejeita perfil ausente/inativo e tenta revogar a sessão. A PR #172 complementou o controle com policies RLS para conversas, memberships, mensagens, anexos, leituras, alertas e configurações, além do hardening dos grants.

## Relação com a ADR-003

Esta decisão Accepted mantém o contrato de perfis e registra a extensão de RLS de domínio entregue pela #101 (PR #172). Os testes de integração SQL foram executados em Polyford, com 16/16 cenários aprovados e teste separado de criação de conversa direta. O resultado comprova o escopo testado no ambiente de desenvolvimento; não equivale à homologação de produção nem à integração de todos os handlers do App Router. A ADR-003 continua sendo a decisão vigente da stack Supabase + Vercel.

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
- Nas rotas Next.js, `authorizeNextRequest` reutiliza a validação de sessão e aplica a lista mínima de perfis autorizados; o middleware `requireAuthenticatedUser`/`requireRole` permanece para handlers Express.

## Justificativa

A verificação server-side reduz dependência da UI. RLS fornece uma segunda fronteira no banco e limita o impacto de um endpoint ou cliente mal implementado.

## Consequências

**Positivas:** regra de perfil centralizada e testável; falha fechada; bloqueio de escrita privilegiada direta.

**Negativas:** exige sincronização entre autorização server-side e RLS; requer testes de políticas no banco real e integração de middleware em todos os handlers protegidos.

## Limite explícito do aceite

O contrato de perfis/sessões e as policies RLS de domínio foram implementados e testados no projeto Supabase de desenvolvimento Polyford. Os 16/16 cenários SQL da #101 e o teste separado de criação de conversa direta passaram com transações revertidas. Isso não comprova homologação de produção, autenticação positiva com usuário real nem integração uniforme de todos os handlers/rotas de negócio.

A rota de sessão do Next.js utiliza `authorizeNextRequest`, mas os handlers de negócio ainda precisam integrar a autorização apropriada antes de executar operações protegidas. A RLS de metadados de anexos não substitui políticas de objetos no Storage. O bucket privado e o endpoint server-side de upload PDF/JPEG foram incorporados à `main` pelas entregas #181 e #185; isso não comprova download/URL assinada, scanner antimalware, quotas efetivas, backup dos objetos ou fluxo ponta a ponta de anexos. Esses itens permanecem nas issues de anexos #115/#116/#117 e operação #130, conforme seus escopos. Auditoria genérica e retenção seguem a #102; auditoria privilegiada segue a #124.

## Evidências e testes

- Endpoints `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`, `src/app/api/auth/session/route.ts` e `src/auth/supabase-session.mjs`.
- Migration de perfis e migrations da #101 (`20261125231700`, `20261125232036`, `20261125232106`, `20261125234105`).
- `supabase/tests/issue_101_rls.integration.sql`: 16/16 cenários aprovados em Polyford, com rollback de identidades/dados sintéticos.
- `supabase/tests/issue_101_direct_conversation_creation.sql`: `direct_conversation_visible_after_membership=true`, com transação revertida.
- Testes unitários de sessão usam Supabase simulado; não houve login positivo com perfil real no ambiente consultado.
- Workflows CI associados às PRs #172, #174 e #175 concluíram com sucesso.

## Próxima extensão

Integrar autenticação/autorização a todos os handlers reais de conversas, grupos, mensagens e anexos; completar testes ponta a ponta e homologação; implementar policies de objetos no Storage pela #117; manter revisão de grants e regressão após alterações. Requer revisão de Tech Lead, Desenvolvimento, TI e SQA.
