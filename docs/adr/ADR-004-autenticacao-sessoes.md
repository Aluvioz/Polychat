# ADR-004 — Autenticação e sessões

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD definiu autenticação por nome de usuário e senha, com contas criadas exclusivamente pelo TI. Não há cadastro aberto, autoinscrição ou convites externos. O nome de usuário é único na organização, definido e alterável pelo TI. A senha é criada pelo TI e enviada individualmente com o link de acesso.

A FORD não exige troca obrigatória de senha no primeiro acesso, expiração periódica ou MFA. A recuperação de senha é realizada exclusivamente pelo TI. As regras de proteção de credenciais e de gestão de chaves foram alinhadas com Desenvolvimento e estão consolidadas nos requisitos não funcionais.

A FORD v2 mantém requisitos sobre controle de acesso, armazenamento e processamento de dados. A ADR-003 estabelece Supabase + Vercel como stack adotada e obrigatória. A Q-025, concluída em 24/11/2026, registra a aprovação expressa da TI e da FORD do Supabase e da Vercel como provedores nomeados, dentro dos serviços, do modelo de utilização e dos controles aprovados. Essa decisão confirma a compatibilidade dos provedores e não exige reavaliação da Q-025 nesta ADR. A arquitetura prevê Supabase Auth como capacidade de identidade e sessão da stack; o desenho detalhado, a configuração, a integração e a homologação dos fluxos e controles específicos de autenticação permanecem no escopo desta ADR, ainda Proposed. Essa distinção não reabre a Q-025 nem altera o status da ADR-003.

O repositório contém o módulo `src/auth/authorization.mjs`, que valida tokens por meio de `supabase.auth.getUser(token)`, e uma migration que associa `profiles` a `auth.users`. Esses artefatos são scaffold alinhado à plataforma Supabase adotada, mas não comprovam autenticação integrada, aplicação da migration ou homologação de produção.

## Problema

Definir o contrato funcional e as fronteiras de segurança de autenticação e sessão de acordo com o provisionamento centralizado pelo TI e com a infraestrutura sob controle da FORD, sem implementar primitivas criptográficas próprias ou adotar um provedor externo incompatível.

## Alternativas consideradas

1. **Supabase Auth na stack aprovada:** capacidade de identidade e sessão prevista no Supabase, provedor nomeado e aprovado na Q-025. A configuração e os fluxos específicos devem respeitar os controles da FORD e ser detalhados e validados nesta ADR.
2. **Outro provedor externo de identidade/SaaS:** não adotado. A aprovação da Q-025 é restrita aos provedores nomeados Supabase e Vercel e ao modelo de utilização aprovado; não autoriza automaticamente outro fornecedor, subprocessador ou serviço de identidade.
3. **Autenticação artesanal implementada pela aplicação:** não recomendada; a aplicação não deve criar suas próprias primitivas criptográficas ou mecanismos de hash/token sem componente consolidado e revisão técnica.
4. **SSO corporativo:** não presumido como requisito ou integração aprovada nesta baseline.

## Decisão proposta

Adotar autenticação por nome de usuário e senha utilizando Supabase Auth como capacidade de identidade e sessão na stack Supabase + Vercel estabelecida pela ADR-003 e abrangida pela aprovação de provedores registrada na Q-025. A Q-025 confirma a compatibilidade dos provedores e do modelo de utilização aprovado; não representa homologação dos fluxos de login, logout, recuperação, provisionamento, sessão ou revogação. O detalhamento desses fluxos, dos limites de acesso e dos controles específicos deve ser documentado e submetido à revisão de TI e Tech Lead nesta ADR. Esta ADR permanece Proposed e não reabre a Q-025 nem autoriza substituir a stack.

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

Credenciais, identificadores, tokens e dados de sessão somente podem ser processados pelos serviços Supabase e Vercel nomeados e aprovados na Q-025, nos limites do modelo de utilização e dos controles aprovados. O envio desses dados a qualquer outro fornecedor, serviço externo ou subprocessador depende de aprovação específica.

## Justificativa

O provisionamento exclusivo pelo TI corresponde ao modelo operacional confirmado pela FORD. Utilizar Supabase Auth dentro da stack aprovada evita introduzir um provedor adicional de identidade, enquanto o controle do ciclo de vida das contas, dos papéis e da autorização permanece sob governança da FORD, com verificações server-side e os controles definidos nesta ADR.

## Consequências

**Positivas:**
- Provisionamento e recuperação centralizados no TI.
- Ausência de autoinscrição e de alteração de privilégios pelo cliente.
- Compatibilidade com a stack Supabase + Vercel e com a aprovação específica de provedores da Q-025, preservando a governança da FORD sobre contas, papéis e autorização.
- Revogação imediata de sessões quando uma conta é desativada.

**Negativas e cuidados:**
- A equipe precisará integrar e validar os fluxos de identidade e sessão no ambiente Supabase + Vercel aprovado, mantendo os controles de conta e autorização definidos pela FORD.
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

- Detalhar, com TI e Tech Lead, a configuração do Supabase Auth e os fluxos de identidade/sessão na stack já aprovada. Registrar nesta ADR os limites, controles, responsabilidades e evidências da revisão; essa atividade não reabre a Q-025 nem reavalia a compatibilidade dos provedores.
- Integrar, completar e testar Supabase Auth, o módulo de autorização e o modelo de perfil, com controles adequados à baseline e evidências no ambiente validado.
- Implementar provisionamento administrativo, login, logout, recuperação pelo TI e revogação imediata.
- Validar testes de integração e segurança no ambiente homologado.

As regras funcionais de credenciais já confirmadas e os requisitos de proteção já alinhados não são pendências desta ADR e não devem ser reabertos sem nova decisão da FORD.
