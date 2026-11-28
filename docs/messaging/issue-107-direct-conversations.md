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

- Não há alteração nas policies RLS nem nos grants de tabela para viabilizar esta entrega.
- A RPC de busca expõe somente o conjunto mínimo de campos necessário ao fluxo U-04 da decisão Q-018 e RN-006: identificador e username de outros perfis ativos.
- A RPC só é executável por `authenticated`, exige chamador ativo que não seja TI, usa prefixo de username e limita a 25 resultados.
- Nenhuma chave `service_role` é usada nas rotas de conversas.

## Evidências automatizadas

No HEAD `e05ee6b00a57aed75b7e3f3917ca5cf65a564c6c`, os workflows associados foram concluídos com sucesso:

- CI #706: sucesso.
- CI #636: sucesso.
- Supabase clean migration install #191: sucesso.

O workflow de instalação limpa aplica as migrations em Supabase local descartável e executa os testes SQL de integração:

- `issue_107_direct_conversation_rpc.integration.sql`: criação/reutilização e rejeições da RPC de abertura.
- `issue_107_active_profile_search.integration.sql`: retorno mínimo, exclusão do próprio usuário/contas inativas, limite e negação de execução anônima.
- `issue_107_recent_conversations.integration.sql`: RPC de listagem sob JWT autenticado, prévia da última mensagem e contador de não lidas.

Os resultados devem ser reconsultados no HEAD mais recente após qualquer novo commit.

## Validação no Supabase hospedado — Polyford (produção)

Em 28/11/2026, o estado atual do projeto Supabase `Polyford` (`oixifpdfvrenlhvycszy`) foi consultado diretamente:

- Projeto em estado `ACTIVE_HEALTHY`.
- As três migrations desta entrega constam no histórico do banco:
  - `20261128125507` — `issue_107_open_direct_conversation`;
  - `20261128125511` — `issue_107_recent_conversations`;
  - `20261128125514` — `issue_107_active_profile_search`.
- As três funções existem no schema `public`.
- `open_direct_conversation(uuid)` e `list_recent_conversations()` estão como `SECURITY INVOKER`; `search_active_profiles(text)` está como `SECURITY DEFINER`.
- A consulta de privilégios confirmou `anon_exec = false` e `auth_exec = true` para as três funções.

**Nota de histórico:** as migrations foram aplicadas ao projeto hospedado por operações administrativas do Supabase, e os identificadores de versão registrados no banco são os três valores acima. Eles não correspondem aos prefixos de timestamp dos arquivos SQL versionados nesta branch. Portanto, esta validação confirma o estado funcional registrado no banco, mas não afirma que o histórico remoto e os nomes/timestamps locais estejam sincronizados para um futuro `supabase db push`. Essa reconciliação de histórico deve ser tratada separadamente; não executar novo push como parte desta validação.

O projeto `Polyfordtest` (`rferhswvesmoyaqvkoet`) não contém essas três migrations/RPCs e não foi o ambiente usado para a validação manual descrita abaixo.

## Smoke test manual na interface

Após a aplicação das migrations no projeto de produção Polyford, o responsável pela validação confirmou nesta conversa que a correção funcionou e que conseguiu utilizar o fluxo pela interface. Esse é um relato explícito de validação manual no ambiente Polyford/produção.

Limite da evidência disponível: não há nesta documentação captura de tela, gravação, log de sessão autenticada ou relatório automatizado anexado que permita a um terceiro reproduzir/verificar independentemente cada passo do smoke test. O status Ready de um Preview Vercel, isoladamente, não é usado como evidência de smoke test. Assim, o registro distingue a confirmação manual reportada pelo usuário da verificação independente por artefato.

O registro anterior de 28/11 que dizia que nenhuma migration havia sido aplicada e que o smoke test estava bloqueado descrevia o estado anterior à correção. Ele foi supersedido pela aplicação das migrations e pela confirmação posterior do usuário; não deve ser interpretado como estado atual.

## Estado da revisão

- PR está em Ready for review, não em Draft.
- Aprovação técnica do Tech Lead `luizme7` registrada em comentário na PR.
- O parecer SQA mais recente solicitou conciliação documental e evidências correspondentes. Esta atualização documenta o estado real consultado no Supabase e identifica explicitamente o limite da evidência manual.
- A aprovação formal SQA ainda precisa ser registrada após reavaliação.
- Não realizar merge nem fechar a Issue #107 sem as aprovações exigidas.
