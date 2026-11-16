# ADR-007 — Mensageria e comunicação em tempo real

- **Número:** ADR-007
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
O produto oferece conversas individuais e grupos criados/administrados por TI. Mensagens são texto; anexos PDF/JPEG são tratados pela ADR-008. Segurança tem prioridade sobre velocidade. Monitoramento pode exigir análise server-side, conforme ADR-010.

## Problema
Definir entrega consistente, ordenação, reconexão e privacidade sem perda de mensagens nem exposição a participantes não autorizados.

## Requisitos relacionados
RF-007–RF-016; RNF-003, RNF-004, RNF-009–RNF-013, RNF-019; Q-003, Q-016, Q-024, Q-025.

## Alternativas consideradas
1. Polling periódico: simples, previsível, maior latência e tráfego.
2. WebSocket/Realtime gerenciado: baixa latência, exige autenticação, autorização por canal, reconexão e controle de presença.
3. SSE: adequado para fluxo servidor-cliente, mas envio continua por HTTP e pode não cobrir todos os requisitos bidirecionais.

## Decisão proposta
Persistir cada mensagem no banco antes de confirmar envio e distribuir evento. Usar transporte em tempo real autenticado (WebSocket/Realtime ou SSE conforme prova de conceito); o canal é mecanismo de notificação, não fonte de verdade. Cada reconexão consulta mensagens desde cursor/sequence persistido. Ordenação definida por timestamp/sequence gerado no servidor; clientes tratam duplicatas por idempotency key. Autorização de leitura/escrita é validada no backend e no acesso ao canal; remoção de membro revoga acesso futuro. Não transmitir conteúdo em canais públicos nem confiar em filtros do cliente.

## Justificativa
Persistência antes da distribuição prioriza consistência e recuperabilidade; eventos podem ser repetidos sem corromper histórico.

## Consequências
**Positivas:** recuperação após desconexão e histórico confiável. **Negativas:** latência adicional por persistência e necessidade de lidar com duplicação/ordenação.

## Riscos
Vazamento em canais; corrida entre remoção e envio; mensagens duplicadas; indisponibilidade de realtime; metadados expostos; backpressure.

## Questões pendentes
Concorrência simultânea, volume, latência aceitável, status de entrega/leitura, edição/exclusão, presença/typing indicators e regra de participação em grupo.

## Referências
POLY-REQ-001 v0.3; RF-007–RF-016; RNF-003/004/009–013; Q-003, Q-016, Q-024/025; ADR-005, ADR-006 e ADR-010.
