# Issue #115 — implementação do upload privado PDF/JPEG

## Escopo entregue nesta branch

- Endpoint server-side `POST /api/attachments/upload`.
- Sessão validada pelos cookies HTTP-only existentes.
- Mensagem consultada com o JWT do usuário; RLS filtra mensagens não acessíveis.
- Upload permitido somente quando o usuário autenticado é o remetente da mensagem, em alinhamento com a policy `attachments_insert_member` da #101.
- Bucket `attachments` usado como privado; a chave secreta permanece exclusivamente no servidor.
- Validação de extensão, MIME declarado e assinatura binária PDF/JPEG.
- Limite de 10 MiB aplicado antes do upload.
- Registro dos metadados em `public.attachments` usando o JWT do usuário, preservando o enforcement RLS.
- Remoção compensatória do objeto Storage se o registro do metadado falhar.
- Testes unitários da validação de arquivo.

## Limites preservados

Esta entrega não implementa nem declara:
- download, URL assinada ou autorização de download (Issue #116);
- scanner antimalware, quarentena, EXIF/GPS, PDF protegido por senha ou liberação de arquivo (Issue #117);
- quotas individuais ou capacidade total (Issue #117);
- backup de anexos e retenção de cópias (Issue #130);
- fluxo de criação de mensagem com anexos na mesma transação.

O endpoint recebe um `messageId` existente e só aceita anexos em mensagem criada pelo próprio usuário autenticado. A validação binária confirma marcadores de formato; não é parser completo, verificação estrutural profunda nem análise antimalware. O objeto permanece em bucket privado e nenhum link público ou temporário é emitido por esta rota.

## Dependência de infraestrutura

A migration que provisiona o bucket privado está na PR #181 e já foi aplicada ao projeto de desenvolvimento Polyford. Esta PR contém somente a camada de upload; a integração deve respeitar a ordem de revisão/merge da PR #181. Não executar `db push` nem alterar o histórico remoto de migrations nesta entrega.

## Testes

O arquivo `tests/attachment-validation.test.mjs` cobre os casos positivos PDF/JPEG e rejeições de MIME, extensão, assinatura, arquivo vazio e tamanho acima do limite. Os resultados de CI, lint, typecheck e build devem ser confirmados no head desta PR antes de aprovação.

