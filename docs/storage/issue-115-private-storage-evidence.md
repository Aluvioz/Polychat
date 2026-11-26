# Issue #115 — provisionamento do Storage privado

Data: 26/11/2026  
Projeto: Polyford (`oixifpdfvrenlhvycszy`)  
Ambiente: desenvolvimento

## Migration aplicada

- Versão remota: `20261126131156`
- Nome: `issue_115_private_attachment_bucket`
- Arquivo versionado nesta PR: `supabase/migrations/20261126131156_issue_115_private_attachment_bucket.sql`

A migration provisiona/atualiza somente o bucket `attachments`:
- `public = false`;
- limite por objeto de 10.485.760 bytes (10 MiB);
- MIME permitido: `application/pdf` e `image/jpeg`.

## Verificação direta

Consulta realizada em `storage.buckets`, `storage.objects` e `pg_policies` após a aplicação:
- bucket `attachments` encontrado;
- privado (`public=false`);
- limite 10 MiB;
- allowlist PDF/JPEG;
- zero policies em `storage.objects`;
- zero objetos no bucket.

O teste SQL `supabase/tests/issue_115_private_bucket.integration.sql` executou no Polyford e concluiu sem exceção.

## Modelo de acesso e limite desta entrega

Nenhuma policy foi criada para `anon` ou `authenticated`. O bucket permanece sem acesso direto via Data API; operações deverão ocorrer por handler server-side autenticado/autorizado, usando `SUPABASE_SECRET_KEY` exclusivamente no servidor. A chave service/secret bypassa RLS e não pode ser enviada ao browser.

Esta entrega configura a fundação de Storage; **não implementa ainda**:
- endpoint de upload com validação real de assinatura/estrutura PDF/JPEG;
- registro transacional em `public.attachments`;
- autorização por membership;
- geração de signed URL após autorização;
- scanner antimalware FORD e estados de análise;
- quota individual/capacidade total administradas pelo TI;
- validação de PDF com senha ou remoção EXIF/GPS;
- backup dos objetos por 12 meses.

Os itens de scanner, quotas, tratamento completo de anexos, backup e liberação excepcional permanecem coordenados com #117. Não há objeto no bucket, portanto não foi realizado upload/download funcional. A Issue #115 permanece aberta para a implementação do handler e seus testes positivos/negativos.
