# Polychat

Aplicação web de comunicação interna do Polychat para a FORD.

> **Estado atual:** estrutura inicial em Next.js 16 + React + TypeScript. A tela inicial é apenas uma página de apresentação; autenticação, conversas, grupos, anexos e administração ainda serão implementados e validados.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Vercel para hospedagem e deploy
- Supabase como backend planejado (integração pendente de configuração)

## Requisitos

- Node.js 20.9 ou superior (recomendado Node.js 22)
- npm

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Validação

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Para aplicar a formatação configurada ao repositório:

```bash
npm run format
```

O GitHub Actions executa testes automatizados, lint, verificação de tipos e build em atualizações da `main` e em Pull Requests direcionadas à `main`. A verificação de formatação está disponível localmente por `npm run format:check`; sua inclusão obrigatória no CI depende de normalizar os arquivos existentes e validar o resultado.

## Governança do desenvolvimento

Os critérios de Definition of Ready (DoR) e Definition of Done (DoD), convenções de branches e commits, processo de Pull Request, revisão, CI e evidências estão documentados em [Governança do desenvolvimento](docs/10-governanca-desenvolvimento.md).

## Deploy na Vercel

1. Importe o repositório `Aluvioz/Polychat` na Vercel.
2. Selecione **Next.js** como Framework Preset (a detecção automática também deve reconhecer o projeto).
3. Defina Root Directory como `./`.
4. Mantenha Build Command e Output Directory nos padrões automáticos da Vercel.
5. Configure a branch de produção como `main`.

A integração Git da Vercel cria deployments de produção para atualizações da branch principal e Preview Deployments para Pull Requests, conforme as configurações do projeto e da integração GitHub.

## Supabase

A integração com Supabase ainda não foi conectada. Quando o projeto Supabase estiver disponível:

1. Copie `.env.example` para `.env.local`.
2. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores do projeto.
3. Cadastre as mesmas variáveis no painel da Vercel para os ambientes necessários.
4. Nunca exponha nem versione chaves secret/service-role no navegador ou no Git.

Não há credenciais reais neste repositório.

## Segurança e escopo

- A interface inicial não implementa login nem concede acesso a dados.
- Toda autorização de negócio deverá ser aplicada no servidor e reforçada por políticas RLS no Supabase.
- Não considere o ambiente pronto para produção até concluir autenticação, autorização, RLS, testes de integração e revisão de segurança.
