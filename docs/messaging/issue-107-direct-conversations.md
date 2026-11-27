# Issue #107 — conversas 1:1 e lista recente

## Entregas nesta branch

- Abertura/reutilização atômica de conversas diretas por `public.open_direct_conversation(uuid)` (`SECURITY INVOKER`), usando o JWT do chamador.
- Listagem recente por última atividade e contador de não lidas por `public.list_recent_conversations()` (`SECURITY INVOKER`), respeitando memberships, RLS e `message_reads`.
- Endpoint autenticado `GET /api/conversations` e tela mobile-first `/conversations` com loading, vazio e erro.
- Busca/seleção de usuários ativos por `/conversations/new`, com endpoint `GET /api/conversations/users` e RPC `public.search_active_profiles(text)`.
- A busca retorna somente `profile_id` e `username`, exclui o próprio usuário e contas inativas, limita resultados a 25 e exige sessão de perfil Usuário. A função SQL usa `SECURITY DEFINER` estritamente para contornar a política de leitura de perfis sem conceder SELECT geral: não retorna e-mail, papel, estado da conta ou outros atributos.
- A seleção chama `POST /api/conversations/direct`; a identidade do solicitante continua derivada da sessão, nunca do payload.
- A implementação de histórico paginado/recibos que já consta nesta branch permanece separada do envio de mensagens, que não é incluído nesta entrega.

## Segurança e limites

- Não há alteração nas policies RLS nem nos grants de tabela.
- A RPC de busca expõe somente o conjunto mínimo de campos necessário ao fluxo U-04 da decisão Q-018 e RN-006: identificador e username de outros perfis ativos.
- A RPC só é executável por `authenticated`, exige chamador ativo que não seja TI, usa prefixo de username e limita a 25 resultados.
- Nenhuma chave `service_role` é usada nas rotas de conversas.
- Nenhuma migration desta branch foi aplicada diretamente ao projeto Supabase hospedado/Polyford.

## Evidências automatizadas

- Testes unitários dos serviços de busca, abertura/listagem de conversas e histórico estão na pasta `tests/`.
- A instalação limpa aplica as migrations em um Supabase local descartável e executa os testes SQL de integração listados em `.github/workflows/supabase-clean-install.yml`.
- `issue_107_direct_conversation_rpc.integration.sql` cobre criação/reutilização e rejeições da RPC de abertura.
- `issue_107_active_profile_search.integration.sql` cobre retorno mínimo, exclusão do próprio usuário/contas inativas, limite e negação de execução anônima.
- `issue_107_recent_conversations.integration.sql` cobre a RPC de listagem sob JWT autenticado, prévia da última mensagem e contador de não lidas.
- O resultado válido de cada execução deve ser consultado no check mais recente da PR; esta documentação não substitui o status publicado pelo GitHub.

## Validação manual ainda necessária

- Smoke test autenticado no Polyford (produção), com conta autorizada, para confirmar login, listagem, abertura/reutilização de conversa e carregamento do histórico. Não executar migrations nem alterar dados de produção para esse teste sem autorização específica.
- Preview Vercel continua sujeito ao limite diário do plano; falha por quota não equivale a falha de build. Nenhum upgrade de plano ou deploy de produção está autorizado por esta documentação.
- Revisão formal SQA e aprovação do Tech Lead permanecem necessárias. Manter a PR em Draft e não fechar a Issue #107 até a conclusão das validações e aprovações.
