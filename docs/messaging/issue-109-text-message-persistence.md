# Issue #109 — envio e persistência de mensagens textuais

## Implementação nesta branch

- Endpoint server-side `POST /api/messages`.
- Reutiliza `authorizeNextRequest` e a sessão existente; não cria fluxo de login ou autorização paralelo.
- Valida JSON, UUID da conversa e corpo textual não vazio.
- Persiste em `public.messages` usando o JWT do usuário, a chave publicável e as políticas RLS existentes.
- O perfil remetente é obtido da sessão validada, nunca do payload do cliente.
- A resposta de sucesso só é emitida depois que o banco retorna a linha persistida.
- Erros de sessão, permissão, transporte e resposta inesperada falham sem expor detalhes internos.
- Testes unitários cobrem validação, uso do JWT, confirmação da persistência e falhas.

## Limite que impede declarar a issue concluída

A migration/RLS atual concede INSERT apenas nas colunas `conversation_id`, `sender_profile_id` e `body`; não existe campo de chave de idempotência nem contrato documentado para identificar uma repetição de envio. Portanto, esta implementação não inventa uma chave, não altera a migration de domínio e não promete deduplicação de retries. Um retry após timeout pode resultar em uma segunda mensagem caso o primeiro INSERT tenha sido confirmado pelo banco e a resposta não tenha chegado ao cliente.

Para concluir o critério de duplicidade/retry, é necessária uma decisão de produto/arquitetura sobre o identificador idempotente e sua persistência única/transacional, seguida de migration e testes de concorrência. Até lá, a PR permanece Draft e a Issue #109 não deve ser fechada.

## Fora do escopo desta branch

- Publicação ou assinatura Realtime (ADR-007 Proposed; Issue #110).
- Histórico paginado e recibos de leitura.
- Alterações no login, sessão, cookies ou helpers de autenticação.
- Alterações nas policies RLS existentes.
- Interface de chat, que permanece fora do endpoint de persistência.

## Verificação

Os testes adicionados usam respostas HTTP simuladas e validam o contrato do serviço. Eles não comprovam integração com projeto Supabase real, aplicação das migrations no Polyford ou comportamento de concorrência/idempotência. CI deve executar testes, lint, typecheck e build no head da PR.
