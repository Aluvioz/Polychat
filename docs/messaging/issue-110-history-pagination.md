# Issue #110 — histórico paginado e Realtime

## Implementação incremental nesta branch

- Endpoint server-side `GET /api/conversations/:conversationId/messages`.
- Reutiliza `authorizeNextRequest` e a sessão existente.
- Consulta `public.messages` com o JWT do usuário, preservando as políticas RLS da Issue #101.
- Ordenação determinística por `created_at DESC, id DESC`.
- Paginação por cursor keyset composto por `created_at` e `id`, evitando deslocamentos de offset.
- Resposta inclui `messages`, `hasMore` e `nextCursor`.
- Testes unitários cobrem cursor, ordenação, limite, continuidade e negação de acesso.

O tamanho de página de 50 registros é um parâmetro técnico inicial desta implementação, não um requisito de produto documentado.

## Limite que impede declarar a issue concluída

A ADR-007 permanece Proposed. Ela exige prova de conceito comparando Postgres Changes e Broadcast privado, com validação de autorização e revogação imediata de assinaturas já abertas quando uma membership é encerrada. Não há decisão aprovada sobre o transporte nem evidência de que a revogação imediata funciona no ambiente Polyford.

Por isso, esta branch implementa somente o histórico persistido e paginado. Não cria subscriptions, canais, publicação, políticas no schema `realtime` nem afirma reconexão em tempo real. A parte Realtime deve aguardar a prova de conceito e a aprovação previstas na ADR-007.

## Segurança e limites

- O cliente não recebe autorização por informar um ID; a RLS decide quais linhas o JWT pode consultar.
- A resposta não inclui dados de participantes ou mensagens fora da visibilidade concedida pelo banco.
- Nenhuma chave secreta/service-role é usada nesta rota.
- Nenhum arquivo de login, sessão, cookie ou autorização foi alterado.

## Verificação

Os testes adicionados usam respostas HTTP simuladas; não comprovam a execução contra Supabase real, a configuração do projeto Polyford, a reconexão Realtime ou a revogação de uma assinatura ativa. CI deve executar testes, lint, typecheck e build no head da PR.
