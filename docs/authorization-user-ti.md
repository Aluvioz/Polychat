# Perfis User/TI e bloqueio de contas — Issue #105

## Regras
- Os únicos perfis válidos são `user` e `ti`.
- Toda rota protegida deve executar `requireAuthenticatedUser` antes de `requireRole`.
- A identidade é validada por `supabase.auth.getUser(token)`; não confie em IDs, roles ou flags enviados pelo navegador.
- Perfil e estado são lidos de `public.profiles`.
- Conta com `is_active = false`, perfil ausente/desconhecido ou falha de consulta não recebe acesso (fail closed).
- Role e estado só podem ser alterados por operações confiáveis no servidor.

## Uso em rotas Vercel/Express

```js
import { createClient } from "@supabase/supabase-js";
import { requireAuthenticatedUser, requireRole } from "../src/auth/authorization.mjs";

const supabase = createClient(process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } });

const authenticated = requireAuthenticatedUser({ supabase });
const onlyTI = requireRole("ti");
// Na rota: authenticated, onlyTI, handler
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` ao navegador nem use prefixo
`NEXT_PUBLIC_` (ou equivalente). O token Bearer deve ser o access token
da sessão do usuário.

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
O repositório não possui aplicação JavaScript/Vercel integrada identificada.
Este módulo é independente e compatível com middleware Express-style; a
conexão às rotas reais deve ocorrer quando a aplicação for incorporada.
