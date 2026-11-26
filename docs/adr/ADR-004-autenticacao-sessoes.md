# ADR-004 — Autenticação e sessões

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD definiu autenticação por nome de usuário e senha, com contas criadas exclusivamente pelo TI. Não há cadastro aberto, autoinscrição ou convites externos. O nome de usuário é único na organização, definido e alterável pelo TI. A senha é criada pelo TI e enviada individualmente com o link de acesso.

A FORD não exige troca obrigatória de senha no primeiro acesso, expiração periódica ou MFA. A recuperação de senha é realizada exclusivamente pelo TI. As regras de proteção de credenciais e de gestão de chaves foram alinhadas com Desenvolvimento e estão consolidadas nos requisitos não funcionais.

A FORD v2 mantém requisitos sobre controle de acesso, proteção, armazenamento e processamento de dados. A ADR-003 estabelece Supabase + Vercel como stack adotada e obrigatória. No contexto da plataforma Supabase adotada, o Supabase Auth é considerado na proposta específica de autenticação desta ADR. Como a ADR-004 permanece Proposed, o desenho técnico específico, a configuração, a integração e os controles ainda dependem de revisão; as condições operacionais e evidências aplicáveis são acompanhadas na Q-025. Isso não reabre a adoção da stack pela ADR-003 nem declara integração ou homologação de produção.

O repositório contém o módulo `src/auth/authorization.mjs`, que valida tokens por meio de `supabase.auth.getUser(token)`, e uma migration que associa `profiles` a `auth.users`. Esses artefatos são scaffold alinhado à plataforma Supabase adotada, mas não comprovam autenticação integrada, aplicação da migration ou homologação de produção.

## Problema

Definir a proposta de contrato funcional e as fronteiras de segurança de autenticação e sessão de acordo com o provisionamento centralizado pelo TI, considerando o Supabase Auth como solução em avaliação específica desta ADR dentro da plataforma Supabase adotada, sem implementar primitivas criptográficas próprias nem introduzir provedores adicionais sem decisão arquitetural.

## Alternativas consideradas

1. **Supabase Auth na plataforma Supabase adotada:** componente considerado nesta proposta específica de autenticação, cuja definição técnica, configuração, integração e controles dependem da revisão desta ADR, atualmente Proposed. É a solução em avaliação no contexto da stack estabelecida pela ADR-003.
2. **Serviço de identidade autogerenciado ou provedor diferente:** não é a direção adotada. Sua inclusão dependeria de necessidade demonstrada, avaliação de impacto e decisão formal de arquitetura; não decorre de uma proibição genérica a serviços gerenciados.
3. **Autenticação artesanal implementada pela aplicação:** não recomendada; a aplicação não deve criar suas próprias primitivas criptográficas ou mecanismos de hash/token sem componente consolidado e revisão técnica.
4. **SSO corporativo:** não presumido como requisito ou integração aprovada nesta baseline.

## Decisão proposta

Propor o uso do **Supabase Auth como solução considerada para autenticação e gestão de identidade/sessões** na plataforma Supabase que integra a stack Supabase + Vercel adotada pela ADR-003. Esta ADR permanece Proposed: a definição técnica específica do componente, seu desenho, a configuração do serviço, a integração com o módulo de autorização, os fluxos de provisionamento e revogação e os controles necessários devem ser detalhados e revisados por TI e Tech Lead. A Q-025 registra as evidências e condições operacionais da configuração, sem reabrir a adoção da stack nem declarar integração ou homologação de produção.

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

Credenciais, identificadores, tokens e dados de sessão devem ser tratados somente nos fluxos propostos de integração com Supabase Auth e nos componentes server-side autorizados. Não os encaminhar a serviços, integrações ou provedores adicionais fora da stack adotada sem avaliação e decisão formal; nunca os registrar em logs, tickets, documentação ou código versionado.

## Justificativa

O provisionamento exclusivo pelo TI corresponde ao modelo operacional confirmado pela FORD. A proposta de uso do Supabase Auth, integrada à autorização server-side e aos controles de perfil/estado, busca atender ao contrato de identidade no contexto da plataforma adotada. A configuração deverá preservar o ciclo de vida das contas e a proteção das sessões definidas na baseline, após revisão e aceite técnico desta ADR.

## Consequências

**Positivas:**
- Provisionamento e recuperação centralizados no TI.
- Ausência de autoinscrição e de alteração de privilégios pelo cliente.
- Proposta de utilização do Supabase Auth dentro da plataforma Supabase adotada, condicionada à revisão técnica desta ADR e à configuração e aos controles aplicáveis.
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

- Detalhar, com TI e Tech Lead, a configuração do Supabase Auth e sua integração com identidade, sessões, perfis e autorização; registrar na Q-025 as evidências e condições operacionais correspondentes.
- Integrar, completar e testar Supabase Auth, o módulo de autorização e o modelo de perfil, com controles adequados à baseline e evidências no ambiente validado.
- Implementar provisionamento administrativo, login, logout, recuperação pelo TI e revogação imediata.
- Validar testes de integração e segurança no ambiente homologado.

As regras funcionais de credenciais já confirmadas e os requisitos de proteção já alinhados não são pendências desta ADR e não devem ser reabertos sem nova decisão da FORD.
