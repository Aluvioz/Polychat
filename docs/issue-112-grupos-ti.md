# Issue #112 — Criação e edição de grupos pela TI

## Escopo implementado

A API administrativa permite que uma conta TI autenticada e ativa crie grupos e altere o nome de grupos existentes. O recurso utiliza a tabela `public.conversations`, com `kind = 'group'`.

- `POST /api/ti/groups`: recebe somente `name`.
- `PATCH /api/ti/groups/:groupId`: recebe somente `name`.
- O ator é obtido de `authorizeNextRequest` após validação da sessão; identificadores e papéis enviados pelo cliente não são aceitos.
- A criação utiliza o estado inicial padrão `active` do schema e grava `created_by_profile_id` com a identidade TI validada.
- A edição altera somente `name` e `updated_at`; não altera tipo, criador, participantes, memberships, mensagens ou status.
- A edição não executa encerramento, desativação ou reativação.
- Não é criada membership automaticamente; a gestão de integrantes permanece na Issue #113.

## Campo descrição

A descrição resumida da Issue #112 menciona nome/descrição. RF-005 e a migration inicial de `public.conversations` definem identificação/nome, mas não um campo `description`. Nenhuma migration posterior no branch-base consultado adiciona esse campo e não foi encontrada decisão aprovada que defina seu contrato. Por isso, `description` não foi implementado nem persistido. A inclusão depende de decisão do produto e definição de requisitos.

## Autorização e persistência

As rotas usam `authorizeNextRequest` com `allowedRoles: ["ti"]` e `enforceDeviceCompatibility: true`, reutilizando o adaptador da Issue #105. A sessão, o perfil e o estado da conta são validados no servidor; a política RN-015/RF-017/RF-018 também impede operações administrativas fora do computador/navegadores homologados.

O módulo `src/groups/group-admin.mjs` usa exclusivamente `SUPABASE_SECRET_KEY` no servidor para invocar RPCs. A chave não é exposta ao browser. A identidade passada às RPCs vem de `authorization.session.user.id`; o banco também confirma que o perfil é TI e está ativo.

As policies RLS da Issue #101 permanecem habilitadas e inalteradas para o acesso normal via Data API. **Limite importante:** por serem `SECURITY DEFINER` e executadas com a chave privilegiada, as RPCs administrativas não são filtradas pelas policies RLS durante sua execução. A barreira dessas operações é a combinação de execução concedida somente a `service_role`, chave restrita ao servidor, validação da role JWT `service_role` e verificação independente de perfil TI ativo dentro de cada função. As funções usam `search_path` vazio e não concedem execução a `public`, `anon` ou `authenticated`. A revisão técnica deve confirmar explicitamente que esse padrão privilegiado é aceitável para o projeto.

## Auditoria e atomicidade

As funções SQL de criação/edição chamam `public.write_privileged_audit_event` no mesmo corpo transacional da mutação. O writer existente valida os eventos `group.created` e `group.updated`, exige ator TI ativo e sanitiza metadados. Se o insert de auditoria falhar, a transação inteira falha e a mutação do grupo é revertida.

A função JavaScript `recordPrivilegedAuditEvent` faz uma chamada RPC separada e, portanto, não é usada como etapa posterior da mutação. Fazer isso quebraria a atomicidade exigida pela Issue #124. A integração reaproveita o writer SQL e seu catálogo de eventos dentro da RPC transacional.

Metadados registrados são mínimos: operação e, na edição, lista do campo alterado. Nenhum conteúdo de mensagem, credencial ou dado pessoal é enviado.

## Limites e pendências

- Campo `description`: pendente de decisão formal do produto.
- Membership inicial: não definida para a criação na Issue #112; permanece fora do escopo.
- Ciclo de vida `disabled/closed`: não implementado nesta issue.
- Integração real com projeto Supabase e testes RLS/transacionais em ambiente autorizado ainda precisam ser executados.
- A dependência da Issue #105 foi resolvida pela integração da PR #175 à `main` em 26/11/2026. Esta branch também depende da política de compatibilidade da Issue #106, implementada na PR #176; por isso, a PR #178 está empilhada sobre `feat/issue-106-device-restriction`, e não deve ser retargeted para `main` antes da integração da #176.

## Testes

`tests/group-admin.test.mjs` cobre validação de entradas, chamadas RPC, identidade do ator, mapeamento de erros, configuração ausente e falha de auditoria reportada pela RPC. Esses testes unitários simulam a API PostgREST; não substituem os testes de integração SQL/RLS em Supabase.

### Cobertura da camada HTTP

A camada de handlers foi extraída para `src/groups/group-routes.mjs`, mantendo as rotas App Router como adaptadores finos. Isso permite testar os contratos HTTP com dependências simuladas, sem credenciais Supabase:

- `tests/group-routes.test.mjs` cobre criação (201), atualização (200), sessão ausente (401), perfil sem permissão (403), JSON inválido, campos não permitidos e erros de domínio.
- Os testes verificam que cookies de sessão renovados são enviados também nas respostas 400/403/404/503 após uma sessão válida ter sido renovada.
- `authorizeNextRequest` ganhou a opção explícita `preserveSessionOnForbidden`, desativada por padrão. As rotas de grupos a habilitam para persistir a rotação de sessão sem conceder acesso ao perfil User.
- A autorização continua sendo decidida pelo adaptador existente; a opção preserva somente os dados da sessão validada para atualizar cookies na resposta 403.

### Reforço adicional da validação

A suíte unitária também cobre falhas de rede, respostas RPC sem UUID válido e erros SQL de validação, garantindo mensagens genéricas sem detalhes internos do provedor.

O roteiro SQL de integração foi ampliado para verificar que:
- perfis TI inativos não conseguem executar a criação privilegiada;
- falhas na gravação do evento `group.updated` revertem também a alteração do nome, preservando a atomicidade entre mutação e auditoria.


## Estado de conclusão da implementação

A implementação da Issue #112 está desenvolvida no branch da PR #178. A PR #175 já está integrada à `main`, mas esta implementação reutiliza `enforceDeviceCompatibility` da PR #176. Portanto, a base atual da #178 permanece `feat/issue-106-device-restriction`; após a integração da #176, a #178 poderá ser retargeted para `main`.

A conclusão técnica ainda depende das verificações finais:
- CI completo da PR #178 sobre a base final após a integração da PR #176 em `main`: testes, lint, typecheck, build e smoke test;
- execução do roteiro `supabase/tests/issue_112_group_admin.integration.sql` em projeto Supabase de homologação, com migrations aplicadas;
- revisão técnica das RPCs privilegiadas e confirmação do modelo de segurança descrito acima.

A aprovação da PR #175 não equivale à aprovação da PR #178. O status de implementação não deve ser confundido com validação final de CI/Supabase. A Issue #112 só deve ser marcada como concluída após essas verificações.

## Validação contínua após integração com `main`

Na execução anterior, o CI identificou um erro de resolução ESM ao importar `next/server` diretamente no Node.js. O import foi ajustado para `next/server.js` no commit `90b721a`. No commit `6418b97`, a execução completa de CI (testes automatizados, ESLint, TypeScript, build Next.js e smoke test) concluiu com sucesso. Essa evidência é histórica e não comprova a validação do HEAD atual `76e0990`; a PR permanece empilhada sobre a #176 e os workflows configurados para PRs direcionadas a `main` ainda precisam ser executados após a integração da dependência.

O workflow de instalação limpa foi corrigido para preparar o ambiente somente com as migrations presentes no checkout da PR, sem contagem fixa de arquivos nem dependência de outra branch. Na execução anterior registrada para o commit `6418b97`, a instalação aplicou as 19 migrations em um Supabase local vazio; o teste SQL identificou um delimitador inválido na função temporária que simula falha de auditoria, corrigido nesse commit. Essa evidência é histórica e não comprova o HEAD atual `e6a8554`; a validação do roteiro SQL desta PR deve ser repetida sobre a base final após a integração da PR #176.

A execução do roteiro em projeto Supabase de homologação continua pendente. A validação automatizada local cobre a instalação limpa e as asserções SQL incluídas no workflow, mas não substitui a validação no ambiente de homologação nem a revisão técnica das RPCs privilegiadas. A revisão da PR #178 foi solicitada ao Tech Lead `luizme7`.
