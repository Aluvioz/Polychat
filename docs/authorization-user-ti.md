# Perfis User/TI e bloqueio de contas — Issue #105

## Regras
- Os únicos perfis válidos são `user` e `ti`.
- Em rotas Next.js, use `authorizeNextRequest`; em handlers Express, execute `requireAuthenticatedUser` antes de `requireRole`.
- A identidade é validada por `supabase.auth.getUser(token)`; não confie em IDs, roles ou flags enviados pelo navegador.
- Perfil e estado são lidos de `public.profiles`.
- Conta com `is_active = false`, perfil ausente/desconhecido ou falha de consulta não recebe acesso (fail closed).
- Role e estado só podem ser alterados por operações confiáveis no servidor.

## Integração com Next.js App Router

O projeto utiliza cookies HttpOnly para manter a sessão. O adaptador
`src/auth/next-authorization.mjs` conecta esse fluxo às rotas do Next.js sem
duplicar a validação do Supabase:

```js
import { authorizeNextRequest } from "@/auth/next-authorization.mjs";

export async function GET(request) {
  const authorization = await authorizeNextRequest(request, {
    allowedRoles: ["ti"],
  });

  if (!authorization.authorized) {
    return Response.json(
      { error: "Acesso não autorizado." },
      { status: authorization.status },
    );
  }

  // Use authorization.session.user após a validação server-side.
  return Response.json({ user: authorization.session.user });
}
```

A rota existente `GET /api/auth/session` já utiliza o adaptador e aceita
somente os perfis válidos `user` e `ti`. Para rotas futuras, informe a lista
mínima de perfis em `allowedRoles`; uma rota administrativa deve usar
`["ti"]`. O adaptador consulta a sessão e o perfil pelo serviço existente,
rejeita conta inativa/perfil inválido e falha fechada em erro do provedor.
A renovação de tokens continua sendo responsabilidade de
`validateSession`, preservando a rotação atual dos cookies.

## Middleware Express legado

`requireAuthenticatedUser` e `requireRole` permanecem disponíveis para
handlers Express que usem token Bearer e cliente Supabase criado no servidor.
Não use esse middleware Express diretamente como handler do Next.js.

Nunca exponha a chave privilegiada do Supabase ao navegador nem use prefixo
`NEXT_PUBLIC_` para segredos. Identidade, papel e estado não devem ser aceitos
do body, query string ou metadados controlados pelo cliente.

## Migration e usuários existentes
Aplicar `supabase/migrations/202611160001_profiles_roles_and_account_status.sql`.
Perfis ausentes de usuários Auth existentes devem ser criados por rotina
administrativa confiável, inicialmente com role `user` e estado ativo.
Promover para `ti` somente após validação administrativa.

## Testes
Executar `node --test tests/*.test.mjs` com Node.js 18 ou superior.
Os testes usam Supabase simulado; testes de integração em projeto Supabase
de homologação ainda são necessários.

## Limite de integração
A rota de sessão do Next.js está integrada ao adaptador de autorização. No
estado atual do repositório, as demais rotas de API existentes são login e
logout, que são operações públicas de autenticação; não há handlers de
recursos de negócio que justifiquem aplicar uma role exclusiva. Quando esses
handlers forem implementados, devem chamar `authorizeNextRequest` antes de
executar qualquer operação protegida. A autorização de dados de domínio
continua dependendo das políticas RLS próprias de cada recurso.
