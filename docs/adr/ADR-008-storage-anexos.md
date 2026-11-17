# ADR-008 — Storage e anexos

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89

## Contexto

A baseline permite anexos PDF e JPEG, exige validar o conteúdo real e não inclui captura de fotos pela aplicação. O armazenamento e o fluxo de download precisam respeitar a participação na conversa e as permissões administrativas. Não há bucket, integração Storage ou fluxo de anexos implementado na `main`.

## Problema

Armazenar e entregar arquivos sem expor buckets publicamente, confiar apenas em extensão/nome ou permitir que uma URL temporária substitua a autorização.

## Alternativas consideradas

1. Supabase Storage privado.
2. Object storage privado compatível com S3 e administrado pela organização.
3. Armazenar os bytes diretamente nas tabelas do banco.

## Decisão proposta

Usar Supabase Storage privado como opção de implementação, condicionado à validação técnica e de TI. Não criar buckets públicos. O servidor deve autorizar o upload e cada download conforme usuário, conversa e finalidade de acesso. URLs assinadas, caso usadas, devem ter curta validade e ser emitidas somente após autorização.

A implementação deverá validar extensão, MIME detectado e assinatura do arquivo (magic bytes), além de limites de tamanho definidos antes do desenvolvimento. Avaliar quarentena/antimalware antes de disponibilizar o arquivo. Falha do scanner, formato divergente, arquivo corrompido ou arquivo que não possa ser analisado não deve resultar em liberação automática.

O requisito de JPEG não resolve a questão Q-004: permanece pendente se o usuário poderá selecionar fotos já existentes na galeria, sem oferecer captura pela câmera.

## Justificativa

Storage privado separa arquivos do banco e permite controlar ciclo de vida, tamanho e acesso. A validação de conteúdo reduz risco de spoofing de tipo, mas não garante detecção de todo arquivo malicioso.

## Consequências

**Positivas:** controle de acesso por conversa; separação de metadados e bytes; escalabilidade.

**Negativas:** pipeline de upload/download e varredura; custo adicional; necessidade de definir retenção e descarte.

## Riscos

URL vazada, arquivo polyglot, parser vulnerável, malware não detectado, bucket público por engano, backup retendo arquivo excluído e scanner indisponível.

## Evidências atuais

Não há bucket Supabase, função de upload/download ou política de storage versionada na `main`. Apenas os formatos PDF/JPEG e a necessidade de validação constam na baseline.

## Pendências para Accepted

Definir tamanho/quantidade, scanner, tratamento de PDF protegido, metadados EXIF, retenção, exclusão, resposta a indisponibilidade do scanner e exceções administrativas (Q-004, Q-010 e Q-011). Revisão por Tech Lead, Dev backend, TI e Segurança.
