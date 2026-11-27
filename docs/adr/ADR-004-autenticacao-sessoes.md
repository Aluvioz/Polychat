# ADR-004 — Autenticação e sessões

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD definiu autenticação por nome de usuário e senha, com contas criadas exclusivamente pelo TI. Não há cadastro aberto, autoinscrição ou convites externos. O nome de usuário é único na organização, definido e alterável pelo TI. A senha é criada pelo TI e entregue individualmente com o link de acesso.

A FORD não exige troca obrigatória de senha no primeiro acesso, expiração periódica ou MFA. A recuperação de senha é realizada exclusivamente pelo TI. As regras de proteção de credenciais, sessões e gestão de chaves estão consolidadas na baseline e nos requisitos não funcionais; esta ADR não acrescenta parâmetros de senha ou timeout não aprovados.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. Supabase Auth é a plataforma de identidade utilizada pela implementação atual, enquanto Vercel hospeda a aplicação. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados dentro dos limites e responsabilidades registrados. Essa aprovação não certifica os fluxos de autenticação, a proteção efetiva de credenciais ou a homologação de produção, que dependem de implementação e evidências próprias.

## Problema

Definir o contrato funcional e as fronteiras de segurança da autenticação e das sessões de acordo com o provisionamento centralizado pelo TI e com a stack adotada, sem implementar primitivas criptográficas próprias, expor credenciais privilegiadas ou confundir os serviços já integrados com a conclusão de todo o ciclo administrativo de contas.

## Alternativas consideradas

1. **Supabase Auth na stack adotada:** serviço oficial de identidade do Polychat, com autenticação e sessões integradas à aplicação e controles de acesso sob governança definida pela FORD, dentro do modelo de utilização aprovado na Q-025.
2. **Outro provedor externo de identidade/SaaS:** não faz parte da direção aprovada. Qualquer substituição ou inclusão de provedor que acesse ou processe dados da FORD exige avaliação e decisão formal.
3. **Autenticação artesanal implementada pela aplicação:** não recomendada; a aplicação não deve criar suas próprias primitivas criptográficas, mecanismos de hash ou emissão/validação de tokens.
4. **SSO corporativo:** não presumido como requisito ou integração aprovada nesta baseline.

## Decisão proposta

Manter autenticação por nome de usuário e senha, utilizando Supabase Auth na stack Supabase + Vercel definida pela ADR-003. A configuração e as responsabilidades devem permanecer dentro do modelo de utilização aprovado na Q-025 e ser validadas tecnicamente por TI e Tech Lead no escopo desta ADR. Esta ADR permanece **Proposed**.

O contrato funcional obrigatório é:

- Somente o TI cria contas, inclusive contas de administradores TI.
- O nome de usuário é único na organização, definido e alterável pelo TI.
- O TI cria a senha e a entrega individualmente junto ao link de acesso.
- Não exigir troca de senha no primeiro acesso nem expiração periódica por requisito da FORD.
- MFA não é requisito exigido pela FORD para este MVP.
- A recuperação de senha é realizada exclusivamente pelo TI.
- Não deve existir cadastro aberto, autoinscrição ou criação de contas por Usuários.
- O sistema aceita somente os perfis `user` e `ti`; o cliente não define nem altera papel ou estado da própria conta.
- O servidor valida a identidade e consulta papel e estado da conta em fonte confiável. Body, query ou metadados controlados pelo cliente não são fontes de autorização.
- A desativação de conta pelo TI deve impedir novas autorizações, encerrar/revogar a sessão validada e preservar o histórico. Fluxos com conexão persistente, como Realtime, precisam também cumprir a revogação específica definida na ADR-007.
- Os administradores TI possuem poderes equivalentes, conforme a decisão de negócio registrada na baseline.

### Fluxo técnico implementado

O módulo `src/auth/supabase-session.mjs` implementa o serviço de sessão:

1. Localiza o perfil pelo nome de usuário em `public.profiles`.
2. Rejeita perfil ausente, conta inativa ou papel diferente de `user`/ `ti`.
3. Resolve a identidade correspondente no Supabase Auth e autentica a senha pelo endpoint de token.
4. Confere novamente o perfil após a autenticação antes de devolver a sessão.
5. Valida access token e, quando necessário, renova a sessão por refresh token; em seguida reconsulta o perfil e o estado ativo.
6. Quando a validação encontra perfil ausente, inativo ou papel inválido, não concede acesso e solicita revogação da sessão.
7. O logout solicita a revogação ao Supabase Auth e a rota limpa os cookies locais mesmo quando o provedor falha.

A resolução entre nome de usuário interno e identidade Supabase Auth é feita exclusivamente no servidor. A chave secreta usada nas consultas administrativas deve permanecer em variável server-side, nunca em código cliente, bundle público, repositório ou logs. O e-mail interno associado à identidade Auth não é retornado ao cliente.

As rotas atuais são:

- `POST /api/auth/login`: recebe nome de usuário e senha, inicia a sessão e define cookies.
- `GET /api/auth/session`: revalida sessão e perfil por meio do adaptador Next.js.
- `POST /api/auth/logout`: solicita logout e limpa os cookies.

Os cookies de access/refresh token são `HttpOnly`, usam `Secure` em produção, `SameSite=Lax` e escopo de caminho `/`. As respostas das rotas de autenticação usam `Cache-Control: no-store`. O refresh token é mantido como cookie de sessão, sem inventar prazo de validade local; Supabase Auth permanece responsável pela validade e rotação do token.

A integração de autorização ao Next.js App Router foi realizada pelo adaptador `src/auth/next-authorization.mjs`, que consome os cookies, valida a sessão e restringe as roles permitidas pela rota. O middleware Express-compatible permanece disponível para handlers que utilizem Bearer token.

### Limites funcionais e de segurança

A implementação atual não deve ser interpretada como conclusão automática de todas as operações de administração de contas. A criação/provisionamento de identidades, alteração administrativa de credenciais, recuperação de senha pelo TI e cobertura integral dos handlers de negócio precisam permanecer documentadas e testadas nos escopos de implementação correspondentes, incluindo a auditoria privilegiada da Issue #124.

A coluna `profiles.username` permanece nullable para não inventar valores para contas já existentes. O login por nome de usuário depende de existir um perfil com username preenchido e de uma identidade Supabase Auth correspondente.

A verificação de conta ativa ocorre durante a validação de sessão/requisição. Esta ADR não afirma que a alteração do perfil encerre, por si só, toda assinatura Realtime já aberta; a revogação nesse tipo de conexão é objeto da ADR-007.

## Justificativa

O provisionamento exclusivo pelo TI corresponde ao modelo operacional confirmado pela FORD. O fluxo usa Supabase Auth para autenticar credenciais e consulta o perfil confiável para validar papel e estado, sem permitir que o navegador escolha privilégios. A renovação e a revogação de sessões são centralizadas no serviço de identidade, enquanto o adaptador Next.js oferece uma fronteira reutilizável para proteger handlers.

A separação entre autenticação, autorização de recursos e administração de contas evita tratar uma sessão válida como autorização irrestrita. A aprovação registrada na Q-025 define o modelo de utilização dos provedores, mas não comprova a implementação ponta a ponta da autenticação, a proteção efetiva das credenciais ou a homologação de produção.

## Consequências

**Positivas:**
- Provisionamento, recuperação e gestão de credenciais centralizados no TI.
- Ausência de autoinscrição e de alteração de privilégios pelo cliente.
- Respostas genéricas para credenciais inválidas e falhas sem concessão de acesso.
- Cookies HttpOnly e respostas sem cache nas rotas de autenticação.
- Revalidação do perfil e do estado da conta junto à autenticação.
- Reutilização da autorização entre middleware Express-compatible e Next.js App Router.

**Negativas e cuidados:**
- O servidor precisa proteger a chave secreta usada nas consultas administrativas ao Supabase.
- A integração entre username e identidade Auth depende da consistência do cadastro em `profiles` e `auth.users`.
- Operações administrativas completas de contas e recuperação de credenciais precisam de handlers e auditoria próprios.
- A integração da sessão não implica que todas as futuras rotas de domínio já estejam protegidas.
- Testes unitários/simulados e CI não substituem a validação completa no ambiente de homologação nem a verificação de que a configuração e os acessos permanecem dentro do modelo aprovado na Q-025.

## Riscos

Roubo de credencial ou sessão; provisionamento incorreto; recuperação indevida; comprometimento de conta administrativa; exposição de chave secreta; divergência entre `profiles` e `auth.users`; username não preenchido; falha de revogação após desativação; handler que não invoque a autorização; cache ou canal persistente que continue ativo após mudança de membership; alteração de configuração ou uso fora dos limites e responsabilidades aprovados pela FORD.

## Evidências atuais

- **Serviço de autenticação e sessão:** `src/auth/supabase-session.mjs` implementa login por username, validação de access token, refresh, reconsulta de perfil/estado, revogação e logout.
- **Rotas Next.js:** `src/app/api/auth/login/route.ts`, `src/app/api/auth/session/route.ts` e `src/app/api/auth/logout/route.ts` integram os fluxos de login, consulta de sessão e logout.
- **Autorização Next.js:** `src/auth/next-authorization.mjs` integra a validação de sessão e a restrição de roles ao App Router.
- **Issue #105 / PR #175:** integração do adaptador ao Next.js foi merged em 26/11/2026. O Tech Lead registrou aprovação; os testes reportados na PR incluíram 55 testes, ESLint, TypeScript, build e smoke test, todos aprovados no head revisado.
- **Testes de sessão:** `tests/supabase-session.test.mjs` cobre login por username, usuário inexistente, conta inativa, senha inválida, desativação durante o login, refresh de sessão, revogação e logout com access token expirado.
- **Testes do adaptador:** `tests/next-authorization.test.mjs` cobre sessão válida/inválida, restrição de TI, perfil TI, falha fechada e rejeição de roles desconhecidas.
- **Modelo de identidade:** a migration versionada relaciona `profiles.id` à identidade Auth e mantém os papéis `user` e `ti`; `profiles.username` permanece nullable.
- **Stack e compatibilidade:** ADR-003 permanece Accepted para Supabase + Vercel; a Q-025 foi concluída em 24/11/2026 com aprovação da TI/FORD para o modelo de utilização e compatibilidade dos provedores nomeados, dentro dos limites e responsabilidades registrados.

As aprovações e os checks de PR comprovam os escopos revisados nas respectivas entregas. Não comprovam provisionamento administrativo completo, recuperação funcional pelo TI, integração de todas as rotas de negócio ou homologação integral de produção.

## Pendências para Accepted

- Validar tecnicamente a configuração do Supabase Auth, as consultas administrativas e o uso da chave secreta server-side conforme o modelo aprovado na Q-025, comprovando acesso mínimo e ausência de exposição ao cliente; essa verificação não reabre a avaliação de compatibilidade concluída.
- Implementar/validar os fluxos administrativos de criação e alteração de contas, redefinição de senha pelo TI e auditoria correspondente, sem cadastro aberto.
- Confirmar que os handlers protegidos existentes e futuros sempre invocam a autorização adequada ao perfil e ao recurso.
- Validar em ambiente homologado os fluxos positivos e negativos de login, logout, refresh, conta inativa, revogação, cookies e falhas do provedor.
- Obter revisão técnica de TI e Tech Lead e registrar a solução, os responsáveis, as evidências e os limites do aceite.

As regras funcionais de credenciais já confirmadas e os requisitos de proteção consolidados em RNF-002 e RNF-003 não são reabertos por esta ADR.
