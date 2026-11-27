# Issue #115 — implementação do upload privado PDF/JPEG

## Escopo entregue nesta branch

- Endpoint server-side `POST /api/attachments/upload` prepara um token de upload assinado para um caminho único no bucket privado. O navegador envia os bytes diretamente ao Supabase Storage; o arquivo não atravessa o corpo de requisição da Function Vercel.
- Endpoint `PUT /api/attachments/upload` finaliza o fluxo: revalida a sessão e a autoria da mensagem, lê o objeto no Storage pelo servidor, valida os bytes efetivos e só então registra os metadados com o JWT do usuário.
- Sessão validada pelos cookies HTTP-only existentes.
- Mensagem consultada com o JWT do usuário; RLS filtra mensagens não acessíveis.
- Upload permitido somente quando o usuário autenticado é o remetente da mensagem, em alinhamento com a policy `attachments_insert_member` da #101.
- Bucket `attachments` usado como privado; a chave secreta permanece exclusivamente no servidor.
- Validação de extensão, MIME declarado e assinatura binária PDF/JPEG.
- Limite de 10 MiB aplicado antes do upload.
- Registro dos metadados em `public.attachments` usando o JWT do usuário, preservando o enforcement RLS.
- Remoção compensatória do objeto Storage se o registro do metadado falhar.
- Testes unitários da validação de arquivo, incluindo aceitação explícita de exatamente 10.485.760 bytes e rejeição de 10.485.761 bytes.

## Contrato de upload em duas fases

1. O cliente envia JSON para `POST /api/attachments/upload` com `messageId`, `filename`, `mimeType` e `sizeBytes`. A API valida sessão, remetente e metadados e responde com `upload.signedUrl`, `upload.path`, `upload.token` e `upload.contentType`.
2. O cliente envia os bytes diretamente para `upload.signedUrl` usando HTTP PUT e o Content-Type retornado.
3. Após o upload, o cliente envia os mesmos metadados e `path` para `PUT /api/attachments/upload`. A API lê o objeto privado, compara o tamanho real com o informado, valida o conteúdo e registra o metadado. Se a validação ou o registro falhar, tenta remover o objeto.

O token de upload assinado do Supabase é válido por até duas horas e autoriza somente o objeto/caminho emitido. Não é um link de download. A existência do token não registra nem libera o anexo: o registro só ocorre após a finalização server-side.

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

