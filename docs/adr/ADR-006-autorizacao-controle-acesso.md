# ADR-006 — Autorização e controle de acesso

- **Número:** ADR-006
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
Existem somente dois perfis. TI possui funções administrativas; Usuário representa todos os demais cargos e tem permissões de comunicação equivalentes. TI cria/desativa contas, cria/gerencia grupos, administra medidas de segurança e pode consultar conversas sob governança.

## Problema
Impedir escalada de privilégio e acesso indevido mesmo quando endpoints são chamados diretamente, frontend é manipulado ou tokens são adulterados.

## Requisitos relacionados
RF-005–RF-020; RNF-007–RNF-013, RNF-017; RN-022, RN-024, RN-026; Q-002, Q-009, Q-027, Q-032.

## Alternativas consideradas
1. Controle apenas no frontend: simples, mas inseguro; não impede chamadas diretas.
2. RBAC server-side com políticas de linha (RLS): valida papel e contexto no backend e no banco; exige revisão de políticas.
3. ABAC amplo: flexível, porém desnecessário para dois perfis e maior complexidade.

## Decisão proposta
Adotar RBAC estrito com papéis TI e USER, enforced em cada endpoint e operação de banco. Negar por padrão (deny-by-default). O servidor deriva o papel de fonte confiável; nunca aceita role/status enviado pelo cliente. Usuário só acessa conversas das quais participa e só envia mensagens conforme política do grupo. TI executa operações administrativas explicitamente autorizadas; acesso a conteúdo de conversas deve seguir ADR-010 e gerar auditoria imutável. RLS deve ser habilitada nas tabelas expostas, com testes positivos e negativos; service-role/credenciais administrativas nunca chegam ao navegador. O papel não deve refletir cargo, senioridade ou nível organizacional.

## Justificativa
RBAC atende o modelo simples sem fragmentar permissões por cargo; enforcement em múltiplas camadas reduz impacto de falha isolada.

## Consequências
**Positivas:** regra uniforme e testável. **Negativas:** maior trabalho de políticas e testes; risco de duplicar regra entre API e banco.

## Riscos
Falha de autorização horizontal (IDOR), RLS permissiva, cache de papel desatualizado, endpoint administrativo esquecido e abuso de privilégios TI.

## Questões pendentes
Quem pode criar/desativar contas TI; se todos os TIs têm poderes iguais; permissões de usuário em grupos; revisão periódica de acessos; fluxo de break-glass.

## Referências
POLY-REQ-001 v0.3; RF-005–RF-020; RN-022; Q-002, Q-003, Q-009, Q-027; PR #132; ADR-004 e ADR-010.
