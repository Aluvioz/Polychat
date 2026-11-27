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

## Homologação autenticada — PARCIAL

### Produção — conta Aluvioz

Em 27/11/2026, o responsável confirmou que a captura enviada nesta conversa foi obtida no ambiente de produção, após acesso com a conta Aluvioz. A evidência visual mostra:
- Dashboard TI (T-02) renderizado com o título e a descrição esperados.
- Navegação lateral persistente com T-02 ativo.
- Áreas T-03 a T-08 visíveis e identificadas como “Indisponível nesta entrega”.
- Mensagem de boas-vindas ao ambiente administrativo.
- Ausência de indicadores ou dados demonstrativos apresentados como reais.

Esta evidência confirma o carregamento visual do Dashboard autenticado em produção conforme declaração do responsável e captura fornecida. A imagem, por si só, não expõe identificador da sessão, claims ou logs de autenticação; por isso, a identidade da conta e o ambiente são registrados com base na confirmação expressa do responsável. A senha não foi registrada nem incluída na documentação.

### Configuração Preview — bloqueio separado

A inspeção anterior do projeto Vercel `polyford` identificou variáveis compartilhadas entre Production, Preview e Development, com `NEXT_PUBLIC_SUPABASE_URL` apontando para Polyford produção e sem variáveis específicas para a branch `feat/issue-118-ti-console-dashboard`. O Preview atual, portanto, não está isolado do banco de produção. A captura acima foi declarada como realizada no ambiente de produção; ela não comprova isolamento do Preview nem altera esse achado de configuração.

### Resultado atualizado da homologação — 27/11/2026

O responsável confirmou que os seguintes cenários foram aprovados em produção:
1. Dashboard TI carregado com a conta Aluvioz.
2. Atualização da página.
3. Acesso direto à rota `/ti`.
4. Proteção de rotas.

Os seguintes cenários não puderam ser executados no contexto de homologação disponibilizado:
1. Logout.
2. Expiração da sessão.
3. Error boundary em condição de falha controlada.

O carregamento do Dashboard foi observado como lento. Esse comportamento fica registrado como observação de desempenho, sem atribuição de causa ou declaração de aprovação de performance. Não foi fornecida medição de duração, trace ou perfil de rede que permita diagnosticar a origem.

As limitações acima não devem ser convertidas em resultados PASS nem em defeitos confirmados. A homologação fica classificada como parcial: os quatro cenários aprovados estão registrados, enquanto logout, expiração e error boundary permanecem não verificados. A lentidão permanece como observação que requer avaliação.

### Avaliação e encaminhamento ao SQA

Solicita-se ao SQA parecer explícito sobre:
- se logout, expiração de sessão e error boundary são bloqueadores para aprovação desta entrega, considerando a impossibilidade prática de executá-los no ambiente atual;
- se a lentidão observada exige correção nesta PR ou pode ser acompanhada separadamente, mediante evidência técnica;
- quais evidências alternativas, se necessárias, são aceitáveis para encerrar os pontos não verificáveis.

Até o parecer, a PR permanece em Draft. Não se declara homologação integral, não se solicita merge e não se encerra a Issue #118.

## Estado e próximos gates

No momento desta atualização, a PR #177 está aberta, em Draft, com base `main`. O HEAD de código/documentação validado antes deste registro é `766b11a72a243cee5a23e723e700f0cbd2c42d54`; esta atualização documental gera um novo commit e exige revalidação dos workflows nesse novo HEAD.

A aprovação técnica integral continua condicionada à homologação TI autenticada, à comprovação de loading/error boundary e a novo parecer SQA. Não houve merge nem encerramento da Issue #118.
