# Restrição de dispositivo por perfil — Issue #106

## Regra de compatibilidade (RN-015 / RF-017 / RF-018)

| Perfil | Dispositivo permitido  | Navegadores homologados |
| ------ | ---------------------- | ----------------------- |
| `user` | Celular Android ou iOS | Chrome ou Safari móvel  |
| `ti`   | Computador             | Chrome, Edge ou Firefox |
| Ambos  | Tablets não permitidos | —                       |

O acesso de User em computador deve exibir exatamente a orientação funcional
**“só pode ser usado em celular”**. TI em celular deve receber orientação para
utilizar um computador. Para tablets, a mensagem informa que tablets não são
permitidos e indica o tipo de dispositivo correspondente ao perfil.

## Implementação nesta entrega

- `src/auth/device-compatibility.mjs` interpreta o User-Agent e aplica a matriz
  de compatibilidade aprovada, sem introduzir dependências.
- `evaluateDeviceCompatibility({ role, userAgent })` recebe o perfil somente
  depois que a sessão tiver sido validada por `validateSession` /
  `authorizeNextRequest`.
- `authorizeNextRequest` aplica a política após validar a sessão e o perfil.
  A rota protegida existente de upload de anexos utiliza `enforceDeviceCompatibility: true`;
  login, logout e validação/renovação de sessão continuam sem bloqueio por dispositivo.
- A checagem de dispositivo é um controle de experiência e compatibilidade,
  não uma fronteira de segurança. User-Agent é fornecido pelo cliente, pode
  ser alterado e não prova a identidade, o tipo real do aparelho ou a
  autorização. Sessão, perfil, permissões e RLS continuam sendo validados
  independentemente.

## Integração em handlers Next.js protegidos

A rota `POST /api/attachments/upload` reutiliza o adaptador existente antes de processar o formulário. A integração de novas rotas protegidas deve seguir o mesmo padrão:

```js
const authorization = await authorizeNextRequest(request, {
  allowedRoles: ["user", "ti"],
  enforceDeviceCompatibility: true,
});

if (!authorization.authorized) {
  return Response.json(
    { error: authorization.message ?? "Acesso não autorizado.", code: authorization.reason },
    { status: authorization.status },
  );
}
```

A autorização do papel ocorre antes da checagem de dispositivo. Nunca aceite
`role`, `is_active` ou identidade enviados pelo navegador.

## Limites técnicos conhecidos

- A versão mínima de navegador não é numericamente definida nos requisitos.
  Por isso, a implementação identifica a família e a versão principal, mas não
  inventa um piso de versão. A orientação usa “atualizado”.
- Alguns navegadores podem reduzir ou modificar o User-Agent. iPad em modo
  desktop pode se identificar como Macintosh; a classificação server-side não
  consegue distinguir com segurança esse caso sem sinais adicionais do cliente.
- A classificação é indicativa e pode ser falsificada. Não usar para conceder
  privilégios, substituir autenticação, autorização, validação de sessão ou RLS.
- A PR #177 aplica a mesma política à área administrativa `/ti`, reutilizando o adaptador e sem duplicar autenticação ou autorização.
- A jornada completa de conversas mobile ainda não existe no repositório. A integração cobre a operação protegida de upload existente, sem inventar páginas de produto.

## Testes

`tests/device-compatibility.test.mjs` cobre perfis, dispositivos, navegadores,
tablets, User-Agent ausente e mensagens. A execução de CI desta PR deve validar
também a suíte existente; não foram alterados os fluxos de login, logout ou
renovação de sessão.
