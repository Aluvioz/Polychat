# Issue #104 — Implementação parcial de provisionamento e reset por TI

## Escopo desta entrega

Esta entrega implementa somente a redefinição de senha de uma conta que já possua identidade no Supabase Auth e perfil em `public.profiles`.

- A rota é `POST /api/ti/users/{profileId}/password`.
- A rota valida a sessão no servidor e restringe a operação ao perfil TI ativo.
- O alvo é identificado pelo ID interno do perfil; o endpoint não recebe e-mail e não procura e-mail.
- A senha é enviada somente ao endpoint administrativo do Supabase Auth, no servidor.
- O evento `account.updated` é gravado na trilha append-only existente, com `operation=password_reset`; a senha e outros segredos não são incluídos nos metadados.
- A rota não altera o papel, o estado ativo ou o nome de usuário da conta.
- Não há troca obrigatória de senha no primeiro acesso nem expiração periódica introduzida.

## Limite intencional

A criação de uma nova identidade Auth não foi implementada nesta etapa. A API administrativa de criação de usuário exige que o mecanismo de identidade receba um identificador suportado. O contrato de produto aprovado determina login por nome de usuário, mas não aprova e-mail corporativo como identificador interno obrigatório. A implementação não inventa e-mail, domínio, telefone, alias ou outro identificador.

A criação de identidade, a forma de associar o nome de usuário à identidade Auth e o fluxo completo de provisionamento permanecem para decisão técnica formal do Tech Lead no contexto da ADR-004 e da Q-025. O código desta entrega não fecha essa decisão.

## Auditoria e limite operacional

A atualização de senha no Supabase Auth e a gravação do evento no banco são chamadas remotas separadas; não existe transação distribuída entre elas. Se a senha for atualizada e a gravação de auditoria falhar, a API retorna erro explícito para reconciliação. A operação não registra a senha, tokens, cabeçalhos ou respostas internas do provedor.

## Validação

Os testes unitários adicionados simulam a API REST e verificam autorização TI, conta inexistente, validação de entrada, atualização sem e-mail, auditoria de sucesso/falha, ausência da senha nos metadados e falha fechada sem configuração. Eles não substituem teste de integração no ambiente homologado da FORD.
