# Issue #118 — Console TI: dashboard e navegação

## Escopo entregue nesta branch

- Cria a área /ti com layout administrativo desktop e navegação persistente.
- Implementa o Dashboard TI como página inicial para contas com perfil ti.
- Exibe o catálogo T-02 a T-08 definido em docs/ux/decisoes-produto-q018-q019.md.
- Mantém Usuários, Grupos, Consulta de conversas, Alertas, Auditoria e Configurações sem ações ou links falsos enquanto suas implementações não estiverem disponíveis.
- Não apresenta contagens, indicadores, nomes ou eventos fictícios.
- Adiciona estados de carregamento, erro, acesso negado, sessão expirada e indisponibilidade de validação.
- Direciona o login de usuários TI para /ti; os demais perfis continuam no destino atual /.

## Segurança e dependências

A branch parte de feat/issue-105-next-authorization, que contém a integração do adaptador da PR #175. O novo helper src/auth/ti-console.mjs restringe o adaptador existente a allowedRoles ["ti"]; não cria nova validação Supabase nem consulta papel informado pelo navegador.

O src/proxy.ts protege /ti/:path* no servidor. A sessão, o papel e o estado da conta continuam validados pelo serviço existente. O adaptador também aplica a matriz RN-015/RF-017/RF-018 antes de liberar o console: TI somente em computador com navegador homologado; a mensagem de incompatibilidade é distinta da negação por perfil. A rotação de cookies HttpOnly retornada pelo serviço é preservada. Falhas de autenticação redirecionam ao login; perfil sem autorização vai para a página de acesso negado; falhas do provedor resultam em indisponibilidade, sem liberar a área.

A checagem de perfil não substitui RLS. A ADR-006 cobre somente o módulo/perfis e a migration correspondente; não existem policies de domínio que autorizem operações de conversas, grupos ou anexos.

## Interface e limites de produto

- A navegação segue os nomes e códigos da decisão POLY-UX-DEC-001.
- A paleta Ford provisória Q-019 é aplicada apenas como direção cromática; não é incorporado Ford Oval nem outro ativo de marca.
- A documentação UX da Issue #92 é uma proposta sem aprovação formal e não foi tratada como protótipo aprovado.
- As áreas T-03 a T-08 são apresentadas como indisponíveis nesta entrega, sem implementar operações pertencentes às Issues #117, #119 ou #120 e sem antecipar consulta de conversas, alertas, auditoria ou configurações.

## Testes

Foi adicionado tests/ti-console-authorization.test.mjs para cobrir:
- TI ativo autorizado;
- usuário comum negado, mesmo com tentativa de sobrescrever a role nas opções;
- sessão ausente/expirada negada;
- falha do validador sem concessão de acesso.

Os testes, lint, typecheck, format check e build precisam ser executados pelo CI desta PR. Nenhum resultado de execução local é declarado neste documento. Testes unitários simulados não substituem integração Supabase real ou homologação de produção.

## Dependência de revisão

Esta é uma PR empilhada sobre a PR #175 (Issue #105), pois a autorização Next.js reutilizada ainda está nessa branch. Após a integração da #175, a PR desta issue deverá ser retargeted para main e validada novamente.

## Fora do escopo

Gestão de usuários/credenciais (#119), gestão de grupos (#120), limites e antimalware de anexos (#117), consulta administrativa de conversas, revisão de alertas, operações de auditoria e alteração de configurações.
