# ADR-004 — Autenticação e sessões

- **Status:** Proposed
- **Data de revisão:** 24/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD definiu autenticação por nome de usuário e senha, com contas criadas exclusivamente pelo TI. Não há cadastro aberto, autoinscrição ou convites externos. O nome de usuário é único na organização, definido e alterável pelo TI. A senha é criada pelo TI e enviada individualmente com o link de acesso.

A FORD não exige troca obrigatória de senha no primeiro acesso, expiração periódica ou MFA. A recuperação de senha é realizada exclusivamente pelo TI. As regras de proteção de credenciais e de gestão de chaves foram alinhadas com Desenvolvimento e estão consolidadas nos requisitos não funcionais.

A FORD v2 mantém requisitos sobre controle de acesso, armazenamento e processamento de dados. A ADR-003, entretanto, estabelece Supabase + Vercel como stack adotada e obrigatória. O uso e a configuração de Supabase Auth, os fluxos de identidade/sessão e os controles necessários devem ser avaliados na Q-025. A restrição da FORD não deve ser interpretada isoladamente como retirada ou proibição automática de Supabase Auth nem como alteração do status da ADR-003.

O repositório contém o módulo `src/auth/authorization.mjs`, que valida tokens por meio de `supabase.auth.getUser(token)`, e uma migration que associa `profiles` a `auth.users`. Esses artefatos são scaffold alinhado à plataforma Supabase adotada, mas não comprovam autenticação integrada, aplicação da migration ou homologação de produção.

## Problema

Definir o contrato funcional e as fronteiras de segurança de autenticação e sessão de acordo com o provisionamento centralizado pelo TI e com a infraestrutura sob controle da FORD, sem implementar primitivas criptográficas próprias ou adotar um provedor externo incompatível.

## Alternativas consideradas

1. **Mecanismo de identidade operado sob controle da FORD:** alternativa compatível com a restrição de infraestrutura; tecnologia específica a validar na arquitetura.
2. **Provedor externo de identidade/SaaS:** não adotado para credenciais, identidades ou sessões da FORD quando implicar acesso, armazenamento ou processamento por terceiro.
3. **Autenticação artesanal implementada pela aplicação:** não recomendada; a aplicação não deve criar suas próprias primitivas criptográficas ou mecanismos de hash/token sem componente consolidado e revisão técnica.
4. **SSO corporativo:** não presumido como requisito ou integração aprovada nesta baseline.

## Decisão proposta

Adotar autenticação por nome de usuário e senha, com configuração do mecanismo de identidade e sessão na stack Supabase + Vercel estabelecida pela ADR-003. O desenho detalhado, os limites de acesso e a compatibilidade com os requisitos da FORD devem ser documentados e validados na Q-025, com revisão de TI e Tech Lead. Esta ADR permanece Proposed e não autoriza substituir a stack.

O contrato funcional obrigatório é:

- Somente o TI cria contas, inclusive contas de administradores TI.
- O nome de usuário é único na organização, definido e alterável pelo TI.
- O TI cria a senha e a entrega individualmente junto ao link de acesso.
- Não exigir troca de senha no primeiro acesso nem expiração periódica por requisito da FORD.
- MFA não é requisito exigido pela FORD para este MVP.
- A recuperação de senha é realizada exclusivamente pelo TI.
- Não deve existir cadastro aberto, autoinscrição ou criação de contas por Usuários.
- O sistema aceita somente os perfis `user` e `ti`; o cliente não define nem altera papel ou estado da própria conta.
- O servidor valida a identidade e consulta o papel e o estado da conta em fonte confiável, sem aceitar body, query ou metadados controlados pelo cliente como fonte de autorização.
- A desativação de uma conta pelo TI encerra imediatamente suas sessões e revoga o acesso, preservando o histórico.
- Os administradores TI possuem poderes equivalentes, conforme a decisão de negócio registrada na baseline.

A implementação deve aplicar os requisitos de proteção de credenciais, sessões e gestão de chaves já consolidados em RNF-002 e RNF-003. Esta ADR não cria parâmetros adicionais de senha, MFA, expiração ou timeout que não tenham sido definidos na baseline.

Nenhum componente de autenticação pode enviar credenciais, identificadores, tokens ou dados de sessão a serviço externo que acesse ou processe dados da FORD.

## Justificativa

O provisionamento exclusivo pelo TI corresponde ao modelo operacional confirmado pela FORD. Manter identidade e sessões sob controle da organização respeita a restrição atual de infraestrutura e permite aplicar o ciclo de vida de contas e a autorização server-side sem dependência de um provedor externo incompatível.

## Consequências

**Positivas:**
- Provisionamento e recuperação centralizados no TI.
- Ausência de autoinscrição e de alteração de privilégios pelo cliente.
- Compatibilidade com a exigência de infraestrutura sob controle da FORD.
- Revogação imediata de sessões quando uma conta é desativada.

**Negativas e cuidados:**
- A equipe precisará integrar e operar o mecanismo de identidade no ambiente aprovado pela FORD.
- O código atual é um scaffold dependente de Supabase e precisa ser integrado, complementado e validado para os fluxos reais de autenticação e autorização.
- A integração deverá ser testada no runtime e na infraestrutura reais, além dos testes unitários isolados.

## Riscos

Roubo de credencial ou sessão; provisionamento incorreto; recuperação indevida; comprometimento de conta administrativa; falha na revogação de sessões; divergência entre identidade e estado do perfil; exposição de segredos em logs, browser ou repositório.

## Evidências atuais

- `src/auth/authorization.mjs` valida token por `supabase.auth.getUser`, mas depende de cliente fornecido externamente.
- `supabase/migrations/202611160001_profiles_roles_and_account_status.sql` cria perfis associados a `auth.users`; é um artefato versionado da stack adotada, mas não comprova aplicação em ambiente nem integração funcional.
- Não há fluxo integrado de login, logout, recuperação ou provisionamento na interface.
- Testes unitários simulados do middleware não comprovam integração com a solução de identidade definitiva.

## Pendências para Accepted

- Detalhar, com TI e Tech Lead, a configuração do mecanismo de identidade/sessão na stack adotada e registrar a análise de compatibilidade na Q-025.
- Integrar, completar e testar Supabase Auth, o módulo de autorização e o modelo de perfil, com controles adequados à baseline e evidências no ambiente validado.
- Implementar provisionamento administrativo, login, logout, recuperação pelo TI e revogação imediata.
- Validar testes de integração e segurança no ambiente homologado.

As regras funcionais de credenciais já confirmadas e os requisitos de proteção já alinhados não são pendências desta ADR e não devem ser reabertos sem nova decisão da FORD.
