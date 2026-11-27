# Issue #118 — Console TI: dashboard e navegação

## Escopo desta entrega

- Cria a área `/ti` com layout administrativo desktop e navegação persistente.
- Implementa o Dashboard TI como página inicial para contas com perfil `ti`.
- Exibe o catálogo T-02 a T-08 definido em `docs/ux/decisoes-produto-q018-q019.md`.
- Mantém Usuários, Grupos, Consulta de conversas, Alertas, Auditoria e Configurações como indisponíveis, sem ações ou links falsos.
- Não apresenta contagens, indicadores, nomes ou eventos fictícios.
- Inclui estados de carregamento, erro, acesso negado, sessão expirada e indisponibilidade de validação.
- Direciona o login de usuários TI para `/ti`; os demais perfis mantêm o destino atual.
- Não implementa as funcionalidades das Issues #117, #119 ou #120.

## Segurança e integração

As PRs #175 (Issue #105) e #176 (Issue #106) foram integradas à `main`. A PR #177 tem `main` como base.

O helper `src/auth/ti-console.mjs` restringe o adaptador existente a `allowedRoles: ["ti"]`. O proxy protege `/ti/:path*` no servidor. Sessão, papel e estado da conta continuam validados pelo serviço existente; o papel informado pelo navegador não é fonte de autorização. A matriz RN-015/RF-017/RF-018 restringe a experiência TI a computador e navegador homologado. A rotação de cookies HttpOnly é preservada. Falhas de autenticação redirecionam ao login; perfil sem autorização vai para acesso negado; falhas do provedor resultam em indisponibilidade, sem liberar a área.

A checagem de perfil não substitui RLS. A ADR-006 cobre somente o módulo/perfis e a migration correspondente; não existem policies de domínio que autorizem operações de conversas, grupos ou anexos.

## Interface e limites de produto

- A navegação segue os nomes e códigos da decisão POLY-UX-DEC-001.
- A paleta Ford provisória Q-019 é aplicada apenas como direção cromática; não é incorporado Ford Oval nem outro ativo de marca.
- A documentação UX da Issue #92 é uma proposta sem aprovação formal e não foi tratada como protótipo aprovado.
- T-03 a T-08 permanecem indisponíveis nesta entrega.
- Gestão de usuários/credenciais (#119), gestão de grupos (#120), limites e antimalware de anexos (#117), consulta administrativa de conversas, alertas, auditoria operacional e configurações estão fora do escopo.

## Validação automatizada e formatação

### Validação local registrada

Na revalidação local do clone limpo, no commit `af5c68a177ef66f1895a7f392bf7bd7b44f339ac`, foram executados:
- `npm test`: 87 testes aprovados, 0 falhas.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS.
- Prettier direcionado aos nove arquivos alterados: PASS.
- `git diff --check`: PASS.

O clone não continha `package-lock.json`; por isso `npm ci` não pôde ser utilizado nessa validação local. As dependências foram instaladas com `npm install --ignore-scripts --no-audit --no-fund`. Essa ressalva não altera o resultado dos workflows de CI, que executam a instalação no ambiente GitHub Actions.

### Formatação dos arquivos da PR

O commit `6d2b06b828359dc00797541d41543d578ef65b92` (`style(issue-118): format changed console files`) formatou somente os nove arquivos alterados, sem reformatação global do repositório. A checagem Prettier direcionada aos nove arquivos e `git diff --check` passaram.

A execução global anterior de `npm run format:check` reportou 103 arquivos fora do padrão no repositório, incluindo os nove arquivos desta PR naquele momento. Esse resultado é histórico: os nove arquivos do escopo foram posteriormente formatados. O workflow CI do repositório não inclui atualmente `format:check`; por isso o resultado direcionado é registrado separadamente.

### GitHub Actions

Os dois workflows associados ao commit de formatação `6d2b06b828359dc00797541d41543d578ef65b92` concluíram com sucesso:
- [Run 46071987967](https://github.com/Aluvioz/Polychat/actions/runs/46071987967) — PASS.
- [Run 46071987988](https://github.com/Aluvioz/Polychat/actions/runs/46071987988) — PASS.

Os dois workflows associados ao commit documental intermediário `af5c68a177ef66f1895a7f392bf7bd7b44f339ac` também concluíram com sucesso:
- [Run 46072360199](https://github.com/Aluvioz/Polychat/actions/runs/46072360199) — PASS.
- [Run 46072360236](https://github.com/Aluvioz/Polychat/actions/runs/46072360236) — PASS.

No HEAD atual anterior a esta consolidação (`a461fce0f06ae3a36dab633f9415d4dc48b2f188`), os dois workflows de CI associados também concluíram com sucesso:
- [Run 46073092088](https://github.com/Aluvioz/Polychat/actions/runs/46073092088) — PASS.
- [Run 46073092089](https://github.com/Aluvioz/Polychat/actions/runs/46073092089) — PASS.

Os testes automatizados não substituem a integração Supabase real ou a homologação autenticada.

## Homologação desktop — evidência parcial

Foi executada verificação automatizada de interface em Chromium com viewport desktop de 1440×900, sobre build local:
- Login com `?motivo=sessao-expirada`: PASS — aviso exibido.
- Página `/acesso-negado`: PASS — título de acesso não autorizado exibido.
- Página `/indisponivel`: PASS — mensagem de indisponibilidade exibida.
- Acesso não autenticado a `/ti`: PASS — redirecionado ao login com motivo de sessão expirada.

Essa execução foi parcial e não equivale à homologação integral.

## Conta TI no Polyfordtest

Consulta read-only ao projeto de homologação Polyfordtest (`rferhswvesmoyaqvkoet`) encontrou um usuário Auth e perfil correspondente:
- Perfil: `640dc282-20c6-4530-820e-eab12a6e3386`.
- E-mail de homologação: `12726121378@ulife.com.br`.
- Perfil com `role = 'ti'` e `is_active = true`; e-mail confirmado; usuário Auth não excluído.
- O campo `public.profiles.username` estava nulo, impedindo a busca pelo identificador utilizado pelo formulário de login.
- Após verificar o fluxo de autenticação, a unicidade parcial de `username` e a ausência de conflito, foi preenchido somente `username = 'Teste_TI'` no perfil correspondente. A consulta posterior confirmou o username, mantendo papel e estado ativo.

A alteração ficou restrita ao Polyfordtest. Nenhuma alteração foi feita no projeto de produção Polyford (`oixifpdfvrenlhvycszy`), na identidade Auth ou na senha. A senha não foi solicitada nem manipulada.

## Homologação autenticada — PENDENTE

Ainda não foi executado login pelo formulário do Polychat com a conta `Teste_TI`. O registro de último login do Supabase Auth antecede a atualização do username e não comprova autenticação pelo fluxo da aplicação.

Permanecem pendentes:
1. **Bloqueio de configuração Vercel identificado:** no projeto Vercel `polyford`, as variáveis atualmente listadas estão compartilhadas entre Production, Preview e Development. `NEXT_PUBLIC_SUPABASE_URL` aponta para `https://oixifpdfvrenlhvycszy.supabase.co` (Polyford produção), e não há variáveis específicas para a branch `feat/issue-118-ti-console-dashboard`. Portanto, o Preview atual não é seguro para homologação com a conta TI.
2. Isolar a configuração da branch Preview para apontar integralmente ao Polyfordtest, incluindo URL, publishable key e chave privilegiada `SUPABASE_SECRET_KEY`. Não basta trocar somente a URL: todas as credenciais Supabase do servidor devem pertencer ao mesmo projeto de homologação. A chave de homologação precisa ser fornecida/configurada pelo administrador sem compartilhá-la no chat.
3. Confirmar por leitura que a configuração efetiva do Preview está exclusivamente conectada ao Polyfordtest e que Production continua inalterada.
4. Realizar login pelo formulário com a senha inserida diretamente pelo responsável no ambiente de homologação; não compartilhar senha em chat, comentário ou documentação.
3. Confirmar redirecionamento para `/ti`, Dashboard, menu lateral e navegação persistente.
4. Confirmar que T-03 a T-08 permanecem indisponíveis, sem ações falsas.
5. Testar atualização da página e preservação da sessão conforme o fluxo existente, e executar logout.
6. Forçar loading e error boundary em condições controladas, registrando o resultado.
7. Registrar data, ambiente, commit, cenários e capturas sem credenciais ou dados sensíveis.

Não declarar homologação autenticada até esses cenários serem efetivamente executados e evidenciados.

## Estado e próximos gates

No momento desta atualização, a PR #177 está aberta, em Draft, com base `main`. O HEAD anteriormente verificado era `a461fce0f06ae3a36dab633f9415d4dc48b2f188`; a atualização documental gera um novo commit e exige revalidação dos workflows nesse novo HEAD.

A aprovação técnica integral continua condicionada à homologação TI autenticada, à comprovação de loading/error boundary e a novo parecer SQA. Não houve merge nem encerramento da Issue #118.
