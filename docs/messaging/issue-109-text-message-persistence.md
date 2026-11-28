# Issue #109 — envio e persistência de mensagens textuais

## Implementação nesta branch

- Endpoint server-side `POST /api/messages`.
- Reutiliza `authorizeNextRequest` e a sessão existente; não cria fluxo de login ou autorização paralelo.
- Valida JSON, UUID da mensagem, UUID da conversa e corpo textual não vazio.
- Persiste em `public.messages` usando o JWT do usuário, a chave publicável e as políticas RLS existentes.
- O perfil remetente é obtido da sessão validada, nunca do payload do cliente.
- A resposta de sucesso só é emitida depois que o banco confirma a linha persistida.
- Erros de sessão, permissão, transporte e resposta inesperada falham sem expor detalhes internos.

## Contrato de idempotência aprovado

- O cliente gera um UUID (por exemplo, `crypto.randomUUID()`) uma única vez para cada mensagem lógica.
- O cliente envia esse valor no campo `id` de `POST /api/messages` e deve reutilizar exatamente o mesmo UUID em todas as tentativas da mesma mensagem, inclusive após timeout ou falha de rede.
- O UUID é persistido em `public.messages.id`, cuja chave primária garante unicidade no banco.
- O INSERT usa resolução de conflito por ignorar duplicados; nunca atualiza/substitui a mensagem já persistida.
- Quando o INSERT não retorna uma linha, a API consulta a mensagem pelo mesmo ID usando o JWT do solicitante.
- A repetição retorna sucesso com a linha original somente se ID, conversa, remetente derivado da sessão e conteúdo forem iguais.
- Se o ID já estiver associado a outra conversa, remetente ou conteúdo, a API retorna HTTP 409 e preserva a linha original.
- Uma nova mensagem retorna HTTP 201; uma repetição idêntica retorna HTTP 200.
- O cliente não deve gerar um novo UUID ao repetir o envio de uma mesma mensagem lógica.

## Segurança e autorização

A API continua usando o JWT da sessão validada e a chave publicável. O remetente nunca é aceito do payload do cliente. A policy RLS de INSERT continua exigindo que o remetente seja `auth.uid()` e que o usuário seja membro ativo de uma conversa ativa. A migration concede ao papel `authenticated` INSERT na coluna `id`, sem ampliar as permissões de linha ou alterar as policies RLS.

## Interface de envio nesta branch

- A tela existente `/conversations/[conversationId]`, já integrada à listagem, abertura e histórico da Issue #107, agora inclui composição e envio de mensagens textuais.
- O formulário envia `id`, `conversationId` e `body` para `POST /api/messages`; o remetente continua sendo derivado exclusivamente da sessão no servidor.
- O UUID é mantido ao repetir a mesma mensagem após falha de rede, evitando duplicidade por retry; ao editar o rascunho, uma nova tentativa lógica recebe outro UUID.
- A interface apresenta estado de envio, bloqueio de envio vazio/duplo, retorno de erro, confirmação somente após resposta persistida, e atualização otimista apenas depois da confirmação da API.
- UX/UI: rótulo acessível, feedback anunciado por `role=alert`/`role=status`, foco devolvido ao campo após sucesso, Enter/Shift+Enter, layout responsivo e respeito a `prefers-reduced-motion`.
- Não foi introduzido limite de caracteres, recurso Realtime, anexos, edição ou exclusão de mensagens, pois não há regra/escopo confirmado nesta Issue para esses comportamentos.

## Verificação

- Testes unitários cobrem validação do ID, persistência, JWT, retry idêntico, conflito de conteúdo/remetente/conversa, resposta não confirmada e falhas de transporte.
- Teste SQL de integração cobre INSERT com ID explícito sob o papel `authenticated`, unicidade e preservação da linha diante de repetição/conflito.
- O teste SQL deve ser executado no workflow de instalação limpa do Supabase.
- Os testes simulados não substituem uma validação contra o projeto Supabase hospedado (Polyford).
- A interface ainda precisa de validação E2E autenticada no ambiente escolhido; build/Preview Ready não comprovam envio funcional contra o banco hospedado.
- CI deve executar testes, lint, typecheck e build no head da PR.

## Fora do escopo desta branch

- Publicação ou assinatura Realtime (ADR-007 Proposed; Issue #110).
- Histórico paginado e recibos de leitura.
- Alterações no login, sessão, cookies ou helpers de autenticação.
- Realtime, notificações e anexos.
