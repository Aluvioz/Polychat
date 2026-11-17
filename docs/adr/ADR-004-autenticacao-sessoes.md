# ADR-004 — Autenticação e sessões

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89

## Contexto

A baseline define autenticação por credenciais individuais criadas e entregues pelo TI, sem cadastro aberto, autoinscrição ou convites externos. A migration cria automaticamente um perfil `user` quando uma identidade é criada em `auth.users`. O módulo `src/auth/authorization.mjs` chama `supabase.auth.getUser(token)`, mas depende de um cliente Supabase server-side fornecido externamente. Não há fluxo de login implementado na interface nem SDK Supabase nas dependências do projeto.

## Problema

Escolher um fluxo de autenticação coerente com o provisionamento centralizado pelo TI, com validação server-side e controle do ciclo de vida da conta, sem criar implementação própria de primitivas criptográficas.

## Alternativas consideradas

1. Supabase Auth para identidade, credenciais e tokens.
2. Autenticação própria implementada pela aplicação.
3. SSO corporativo, que exigiria integração externa e decisão fora do escopo atual.

## Decisão proposta

Adotar Supabase Auth como provedor de identidade do MVP, condicionado à homologação técnica e de TI. Contas devem ser provisionadas por processo administrativo confiável; não deve existir fluxo de auto cadastro. O servidor valida o token com o provedor e consulta o perfil/estado no banco. O cliente não define nem altera seu próprio papel ou status.

A política de senha, senha inicial, primeiro acesso, recuperação, MFA, duração/renovação de sessão, revogação e rate limiting deve ser definida por TI e Segurança antes da homologação. Não se fixa nesta ADR um valor de timeout ou uma política de senha que não conste da baseline.

## Justificativa

O provedor gerenciado reduz a superfície de autenticação artesanal e se alinha à direção Supabase da Issue #88. A autorização continua sendo responsabilidade da aplicação e das políticas de banco.

## Consequências

**Positivas:** provedor especializado para identidade; validação de JWT centralizada; integração com perfil de aplicação.

**Negativas:** dependência do provedor e configuração; necessidade de testar revogação, recuperação, sessão e indisponibilidade.

## Riscos

Roubo de sessão, credenciais fracas/reutilizadas, recuperação indevida, conta TI comprometida, ausência de MFA, segredo privilegiado exposto e inconsistência entre estado Auth e `profiles.is_active`.

## Evidências atuais

O middleware valida o token por `auth.getUser`, mas não há login, logout, refresh, recuperação ou provisionamento integrado na aplicação. A migration cria perfil padrão, mas não comprova a criação administrativa das contas.

## Pendências para Accepted

TI e Tech Lead devem aprovar o fluxo de provisionamento, identificador de login (Q-005), entrega/expiração de credencial e recuperação (Q-006), política de MFA, sessão e revogação. Depois, implementar handlers e testes de integração no runtime real.
