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

| Verificação            | Resultado                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm test`             | PASS — 121 testes, 0 falhas                                                                                                   |
| `npm run lint`         | PASS                                                                                                                          |
| `npm run typecheck`    | PASS                                                                                                                          |
| `npm run build`        | PASS — build Next.js concluído                                                                                                |
| `npm run format:check` | FAIL — Prettier reportou 103 arquivos fora do padrão no repositório; 9 arquivos do conjunto alterado também aparecem na lista |

A verificação de formatação foi executada sem aplicar `prettier --write` ao repositório, para evitar alterações em massa fora do escopo desta PR. O workflow CI do repositório não inclui atualmente `format:check`.

O GitHub Actions reportou dois runs de CI concluídos com sucesso para o commit `f952a9087e08ea0862cd27b874349c8e58114b28` (runs 46062988880 e 46062988898). Ambos terminaram com conclusão `success`.

Testes unitários simulados não substituem integração Supabase real ou homologação com conta TI autorizada.

## Homologação desktop — execução parcial

Foi executada uma verificação automatizada de interface em Chromium com viewport desktop de 1440×900, sobre o build local resultante da integração com `main`:

| Cenário acessível sem conta TI      | Resultado                                                     |
| ----------------------------------- | ------------------------------------------------------------- |
| Login com `?motivo=sessao-expirada` | PASS — aviso de sessão expirada exibido                       |
| Página `/acesso-negado`             | PASS — título de acesso não autorizado exibido                |
| Página `/indisponivel`              | PASS — mensagem de indisponibilidade exibida                  |
| Acesso não autenticado a `/ti`      | PASS — redirecionado para login com motivo de sessão expirada |

**Limitações ainda pendentes:** não foi possível autenticar uma conta TI real; portanto, navegação interna autenticada, menu e Dashboard, carregamento real do console e os fluxos de erro do servidor/provedor não foram homologados. Os estados de loading e error boundary não foram forçados nesta execução. Essa verificação parcial não equivale à homologação manual integral solicitada pelo SQA.

## Fora do escopo

Gestão de usuários/credenciais (#119), gestão de grupos (#120), limites e antimalware de anexos (#117), consulta administrativa de conversas, revisão de alertas, operações de auditoria e alteração de configurações.

## Atualização de validação — 27/11/2026

### Commit de formatação publicado

- Commit: `6d2b06b828359dc00797541d41543d578ef65b92` — `style(issue-118): format changed console files`.
- A branch `feat/issue-118-ti-console-dashboard` e o HEAD da PR #177 apontam para esse commit no momento da verificação.
- Foram formatados somente os nove arquivos incluídos no commit. A checagem Prettier direcionada a esses nove arquivos passou; `git diff --check` também passou.
- Não foi executada formatação global do repositório, para não alterar arquivos fora do escopo.

### CI no HEAD de formatação

Os dois workflows associados ao commit `6d2b06b828359dc00797541d41543d578ef65b92` concluíram com sucesso:

| Run         | Resultado | Evidência                                                                      |
| ----------- | --------- | ------------------------------------------------------------------------------ |
| 46071987967 | PASS      | [GitHub Actions](https://github.com/Aluvioz/Polychat/actions/runs/46071987967) |
| 46071987988 | PASS      | [GitHub Actions](https://github.com/Aluvioz/Polychat/actions/runs/46071987988) |

O run 46071987988 concluiu as etapas de testes automatizados, ESLint, TypeScript, build Next.js e smoke test do build. O teste focado `tests/ti-console-authorization.test.mjs` também passou (7 testes, 0 falhas) na execução local anterior à publicação.

### Conta TI e homologação real — atualização em 27/11/2026

A consulta ao projeto Supabase de homologação Polyfordtest (`rferhswvesmoyaqvkoet`) localizou a conta Auth já existente e seu perfil correspondente:

- Perfil: `640dc282-20c6-4530-820e-eab12a6e3386`.
- E-mail: `12726121378@ulife.com.br`.
- `role = 'ti'`, `is_active = true`, e-mail confirmado e usuário Auth não excluído.
- A conta já existia, mas `public.profiles.username` estava nulo, impedindo a busca pelo identificador usada pelo formulário de login.
- Após verificar o código de autenticação, a unicidade parcial de `username` e a ausência de conflito, foi preenchido somente `username = 'Teste_TI'` no perfil correspondente. A leitura posterior confirmou o valor, mantendo `role = 'ti'` e `is_active = true`.

A alteração foi restrita ao Polyfordtest. Nenhuma alteração foi realizada no projeto de produção Polyford (`oixifpdfvrenlhvycszy`), nem na identidade Auth ou na senha. A senha não foi solicitada nem manipulada.

**Pendente:** ainda não foi executado um login pelo formulário do Polychat com essa conta e senha. O registro de último login do Supabase Auth é anterior à atualização do username e, isoladamente, não comprova autenticação pelo fluxo da aplicação. Portanto, Dashboard, navegação interna autenticada, loading e error boundary continuam aguardando homologação real em navegador desktop. A senha deve ser inserida diretamente pelo responsável no ambiente de homologação, nunca compartilhada nesta PR ou conversa.

### Estado da PR e próximo gate

A PR #177 permanece aberta e em Draft. Os resultados automatizados acima não substituem a homologação com conta TI real nem a revisão final do SQA. Não houve merge nem encerramento da Issue #118.

### Revalidação local do HEAD documental

No clone limpo da branch em `af5c68a177ef66f1895a7f392bf7bd7b44f339ac`, foram executados `npm test` (87 testes aprovados, 0 falhas), `npm run lint`, `npm run typecheck` e `npm run build`; todos concluíram com sucesso. A checagem Prettier direcionada aos nove arquivos do commit de formatação e a `git diff --check` também passaram. A checagem foi restrita aos nove arquivos, sem executar formatação global do repositório.

O clone não possui `package-lock.json`; por isso `npm ci` não pôde ser usado nessa validação local. As dependências foram instaladas com `npm install --ignore-scripts --no-audit --no-fund`. O CI do GitHub, que executa sua própria etapa de instalação, passou nos dois workflows para o HEAD documental indicado acima.
