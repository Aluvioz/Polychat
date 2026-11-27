# Issue #118 — Console TI: dashboard e navegação

## Escopo entregue nesta branch

- Cria a área /ti com layout administrativo desktop e navegação persistente.
- Implementa o Dashboard TI como página inicial para contas com perfil ti.
- Exibe o catálogo T-02 a T-08 definido em docs/ux/decisoes-produto-q018-q019.md.
- Mantém Usuários, Grupos, Consulta de conversas, Alertas, Auditoria e Configurações sem ações ou links falsos enquanto suas implementações não estiverem disponíveis.
- Não apresenta contagens, indicadores, nomes ou eventos fictícios.
- Adiciona estados de carregamento, erro, acesso negado, sessão expirada e indisponibilidade de validação.
- Direciona o login de usuários TI para /ti; os demais perfis continuam no destino atual /.

## Segurança e base de integração

As PRs #175 (Issue #105) e #176 (Issue #106) já foram integradas à `main`. A PR #177 foi atualizada para ter `main` como base. O helper `src/auth/ti-console.mjs` restringe o adaptador existente a `allowedRoles: ["ti"]`; não cria nova validação Supabase nem consulta papel informado pelo navegador.

O src/proxy.ts protege /ti/:path* no servidor. A sessão, o papel e o estado da conta continuam validados pelo serviço existente. O adaptador também aplica a matriz RN-015/RF-017/RF-018 antes de liberar o console: TI somente em computador com navegador homologado; a mensagem de incompatibilidade é distinta da negação por perfil. A rotação de cookies HttpOnly retornada pelo serviço é preservada. Falhas de autenticação redirecionam ao login; perfil sem autorização vai para a página de acesso negado; falhas do provedor resultam em indisponibilidade, sem liberar a área.

A checagem de perfil não substitui RLS. A ADR-006 cobre somente o módulo/perfis e a migration correspondente; não existem policies de domínio que autorizem operações de conversas, grupos ou anexos.

## Interface e limites de produto

- A navegação segue os nomes e códigos da decisão POLY-UX-DEC-001.
- A paleta Ford provisória Q-019 é aplicada apenas como direção cromática; não é incorporado Ford Oval nem outro ativo de marca.
- A documentação UX da Issue #92 é uma proposta sem aprovação formal e não foi tratada como protótipo aprovado.
- As áreas T-03 a T-08 são apresentadas como indisponíveis nesta entrega, sem implementar operações pertencentes às Issues #117, #119 ou #120 e sem antecipar consulta de conversas, alertas, auditoria ou configurações.

## Validação automatizada — base main

Execução local sobre a integração simulada de `main` com a branch da PR:

| Verificação | Resultado |
| --- | --- |
| `npm test` | PASS — 121 testes, 0 falhas |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — build Next.js concluído |
| `npm run format:check` | FAIL — Prettier reportou 103 arquivos fora do padrão no repositório; 9 arquivos do conjunto alterado também aparecem na lista |

A verificação de formatação foi executada sem aplicar `prettier --write` ao repositório, para evitar alterações em massa fora do escopo desta PR. O workflow CI do repositório não inclui atualmente `format:check`.

O GitHub Actions reportou dois runs de CI concluídos com sucesso para o commit `98bd340819d29c81c7c4e84cd36122fe3da13698` (runs 46062731208 e 46062730975). Esses resultados não substituem a pendência de formatação nem a homologação manual.

Testes unitários simulados não substituem integração Supabase real ou homologação com conta TI autorizada.

## Homologação manual

Pendente: validar em desktop, com sessão TI real autorizada, a navegação do Console TI e os estados de carregamento, erro, acesso negado, sessão expirada e indisponibilidade. Nenhuma homologação visual é declarada concluída neste documento até que haja evidência reproduzível no ambiente de preview autorizado.

## Fora do escopo

Gestão de usuários/credenciais (#119), gestão de grupos (#120), limites e antimalware de anexos (#117), consulta administrativa de conversas, revisão de alertas, operações de auditoria e alteração de configurações.
