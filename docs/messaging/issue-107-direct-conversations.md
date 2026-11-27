# Issue #107 — conversas 1:1 e lista recente

## Entregas nesta branch

- Abertura/reutilização atômica de conversas diretas por public.open_direct_conversation(uuid) (SECURITY INVOKER), usando o JWT do chamador.
- Listagem recente por última atividade e contador de não lidas por public.list_recent_conversations() (SECURITY INVOKER), respeitando memberships, RLS e message_reads.
- Endpoint autenticado GET /api/conversations e tela mobile-first /conversations com loading, vazio e erro.
- Busca/seleção de usuários ativos por /conversations/new, com endpoint GET /api/conversations/users e RPC public.search_active_profiles(text).
- A busca retorna somente profile_id e username, exclui o próprio usuário e contas inativas, limita resultados a 25 e exige sessão de perfil Usuário. A função SQL usa SECURITY DEFINER estritamente para contornar a política de leitura de perfis sem conceder SELECT geral: não retorna e-mail, papel, estado da conta ou outros atributos.
- A seleção chama POST /api/conversations/direct; a identidade do solicitante continua derivada da sessão, nunca do payload.
- A implementação de histórico paginado/recibos que já consta nesta branch permanece separada do envio de mensagens, que não é incluído nesta entrega.

## Segurança e limites

- Não há alteração nas policies RLS nem nos grants de tabela.
- A RPC de busca expõe somente o conjunto mínimo de campos necessário ao fluxo U-04 da decisão Q-018 e RN-006: identificador e username de outros perfis ativos.
- A RPC só é executável por authenticated, exige chamador ativo que não seja TI, usa prefixo de username e limita a 25 resultados.
- Nenhuma chave service_role é usada nas rotas de conversas.
- Nenhuma alteração é aplicada diretamente ao projeto Supabase hospedado/Polyford nesta branch.

## Validação pendente

- Testes unitários do serviço de busca adicionados em tests/active-profile-search-service.test.mjs.
- A validação de instalação limpa da migration e a execução integrada da RPC de abertura ainda precisam passar. A PR #194 registrou uma falha RLS no INSERT INTO public.conversations; essa causa não deve ser contornada ampliando policies ou grants.
- Revisão SQA/Tech Lead e Preview Vercel permanecem necessários antes de considerar a issue concluída.
