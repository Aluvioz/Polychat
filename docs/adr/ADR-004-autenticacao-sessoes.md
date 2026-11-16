# ADR-004 — Autenticação e sessões

- **Número:** ADR-004
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
Acesso por usuário e senha, sem auto cadastro, convites ou integração externa. TI provisiona e desativa contas. Há necessidade de expiração/revogação de sessão, recuperação segura e proteção contra ataques. Q-005/Q-006/Q-032 continuam pendentes quanto a identificador e política operacional.

## Problema
Garantir identidade e ciclo de vida de credenciais sem criar caminhos de autoinscrição ou permitir que o usuário eleve privilégios.

## Requisitos relacionados
RF-001–RF-004, RF-019, RF-020; RNF-001, RNF-002, RNF-007, RNF-008; Q-002, Q-005, Q-006, Q-032.

## Alternativas consideradas
1. Supabase Auth ou provedor gerenciado: delega hashing, emissão/renovação de tokens e fluxos base; exige configurar desativação, sessão e operações administrativas corretamente.
2. Autenticação própria: controle do fluxo; aumenta risco de implementação de hashing, reset, tokens, rate-limit e recuperação.
3. SSO corporativo: pode ser robusto, mas não foi solicitado e implicaria integração externa, explicitamente fora do escopo atual.

## Decisão proposta
Manter login local usuário/senha com contas criadas exclusivamente por TI. Preferir provedor maduro de autenticação (Supabase Auth é candidato, não aprovado) em vez de implementar primitivas criptográficas próprias. Senhas devem ser armazenadas somente como hash forte com salt via algoritmo atual recomendado pelo provedor; nunca texto puro ou reversivelmente cifradas. Credenciais iniciais devem ser temporárias/uso único e entregues por canal aprovado; forçar troca no primeiro acesso. Implementar rate limiting, atraso progressivo, mensagens de erro não enumeráveis, proteção contra credential stuffing, CSRF quando aplicável, cookies Secure/HttpOnly/SameSite ou armazenamento de tokens conforme threat model. Sessões devem ter duração máxima e inatividade configuráveis, rotação/renovação segura e revogação imediata após desativação, troca/reset de senha ou suspeita de comprometimento. MFA é recomendação a aprovar para TI e, preferencialmente, todos os usuários.

## Justificativa
Provedor consolidado reduz risco de autenticação artesanal; controles de ciclo de vida e provisionamento preservam requisito de gestão pelo TI.

## Consequências
**Positivas:** menor superfície de código sensível; revogação centralizada. **Negativas:** dependência do provedor e necessidade de integração/testes de ponta a ponta.

## Riscos
Roubo de sessão, phishing, senha fraca/reutilizada, recuperação socialmente manipulada, conta TI comprometida e sessão persistente em dispositivo perdido.

## Questões pendentes
Formato do login; canal de senha inicial; política de senha/MFA; tempos de sessão; recuperação; administrador principal de TI; procedimento de conta comprometida.

## Referências
POLY-REQ-001 v0.3; RF-001–RF-004; RNF-001/002/007/008; Q-002, Q-005, Q-006, Q-032; ADR-003 e ADR-006.
