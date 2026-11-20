# ADR-007 — Mensageria e atualizações em tempo real

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89

## Contexto

O MVP prevê conversas individuais e em grupo. A entrega de mensagens deve preservar histórico e respeitar participantes autorizados. A direção de backend é Supabase, mas não há serviço de mensageria, tabela de mensagens, canal Realtime ou fluxo de chat implementado na `main`.

## Problema

Definir como notificar participantes sobre mensagens novas sem tratar um evento realtime como prova de persistência ou como substituto de autorização.

## Alternativas consideradas

1. Polling periódico do histórico.
2. Supabase Realtime ou transporte WebSocket autenticado.
3. Server-Sent Events, com envio por HTTP.

## Decisão proposta

Adotar Supabase Realtime como transporte preferencial da stack oficial, condicionado a prova de conceito técnica, validação de políticas/canais e autorização por conversa. O banco deve permanecer como fonte de verdade:

1. Validar identidade, participação e permissão de envio no servidor/banco.
2. Persistir a mensagem com identificador e timestamp gerados no servidor.
3. Somente após persistência confirmada, disponibilizar evento aos participantes autorizados.
4. Em reconexão, buscar mensagens persistidas a partir de cursor/identificador conhecido.
5. Tratar duplicatas e reordenação no cliente sem perder o registro persistido.
6. Proteger canais e assinaturas com autenticação e políticas; nunca usar canal público ou filtro controlado pelo cliente como autorização.

O protocolo, presença, status de entrega/leitura, indicadores de digitação e limites de latência não estão decididos nesta ADR.

## Justificativa

Separar persistência de notificação permite recuperar histórico após desconexão e reduz risco de mensagem exibida sem ter sido gravada.

## Consequências

**Positivas:** sincronização mais consistente; recuperação por histórico; possibilidade de baixa latência.

**Negativas:** mais complexidade de autorização de canais, reconexão, duplicatas e monitoramento de falhas.

## Riscos

Vazamento entre canais, envio após remoção de participante, duplicidade, perda de eventos, excesso de conexões e dependência do serviço realtime.

## Evidências atuais

Não há tabelas de conversa/mensagem, canais realtime, subscriptions ou testes de mensageria no repositório. Esta ADR não declara funcionalidade implementada.

## Pendências para Accepted

Prova de conceito, escolha formal do transporte, políticas de canal, modelo de sequência/idempotência, comportamento de reconexão e testes de isolamento. Revisão por Tech Lead, Dev backend, TI e SQA. Resolver regras de grupo e status de mensagem aplicáveis (Q-003 e Q-024).
