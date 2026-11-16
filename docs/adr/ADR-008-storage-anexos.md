# ADR-008 — Storage e anexos

- **Número:** ADR-008
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
São permitidos somente PDF e JPEG. A aplicação não oferece captura própria; o seletor nativo pode apresentar opções controladas pelo sistema operacional. O conteúdo deve ser acessível apenas a participantes autorizados e a consultas administrativas governadas.

## Problema
Armazenar arquivos com validação robusta e impedir acesso público, conteúdo malicioso, falsificação de tipo e URLs reutilizáveis.

## Requisitos relacionados
RF-013–RF-016; RNF-010, RNF-011, RNF-018, RNF-020; RN-023, RN-024; Q-004, Q-011, Q-025, Q-029.

## Alternativas consideradas
1. Storage privado gerenciado: integração simples, mas requer validação de ACL, região, criptografia, retenção e logs do provedor.
2. Object storage corporativo/S3-compatible: portabilidade e políticas maduras; requer operação e integração.
3. Arquivos no banco: simplifica transações, mas aumenta custo, backup e carga do banco; não recomendado.

## Decisão proposta
Usar object storage privado, sem bucket público. Upload via API ou URL pré-assinada de curta duração, emitida após autorização e vinculada a usuário/conversa. Validar tamanho (limite ainda pendente), extensão, MIME detectado e assinatura/magic bytes; decodificar/reprocessar JPEG e validar estrutura PDF. Rejeitar arquivos divergentes, corrompidos, criptografados quando não analisáveis ou com conteúdo ativo conforme política. Executar antimalware/sandbox antes de liberar download; armazenar em quarentena até resultado seguro. Gerar nome interno aleatório, remover metadados EXIF de imagens quando aplicável, limitar download e registrar eventos. URLs temporárias não substituem autorização. Criptografar em repouso e em trânsito; política de retenção/exclusão segue ADR-010.

## Justificativa
Storage privado desacopla bytes do banco e permite controles específicos de arquivo. A análise reduz risco, mas não garante detecção de todo malware.

## Consequências
**Positivas:** isolamento, escalabilidade e URLs temporárias. **Negativas:** pipeline assíncrono e custo de varredura; arquivo pode ficar pendente.

## Riscos
Polyglot files, parser exploit, malware desconhecido, URL vazada, excesso de tamanho, falha de scanner e cópias residuais em backups.

## Questões pendentes
Tamanho máximo por arquivo/usuário/conversa; scanner e SLA; tratamento de PDF protegido; retenção; formatos JPEG exatos (JPEG/JPG); comportamento quando scanner indisponível.

## Referências
POLY-REQ-001 v0.3; RF-013–RF-016; RNF-010/011/018/020; Q-004, Q-011, Q-029; ADR-005, ADR-006 e ADR-010.
