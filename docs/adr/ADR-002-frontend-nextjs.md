# ADR-002 — Frontend Next.js

- **Status:** Accepted
- **Escopo do aceite:** stack de frontend adotada para o Polychat; não significa aceite das telas ou da UX final.
- **Data de registro:** 17/11/2026
- **Última atualização:** 19/11/2026
- **Issues:** #89 e #95

## Contexto

A `main` contém `package.json`, `next.config.ts` e a estrutura `src/app/`. O projeto declara Next.js `^16.0.0`, React e React DOM `^19.2.0`, TypeScript `^5.9.3` e usa o App Router. A página atual é uma apresentação institucional do Polychat; login, conversas e painel TI ainda não estão implementados.

A baseline exige perfil Usuário em smartphone e perfil TI em computador, além de uma interface simples com identidade azul e branca. A matriz de navegadores/dispositivos e os ativos oficiais de marca ainda estão pendentes.

## Problema

Fixar a stack de frontend do Polychat e eliminar a divergência histórica entre o backlog, que mencionava React + Vite, e a implementação/versionamento efetivos em Next.js.

## Alternativas consideradas

1. **React + Vite como SPA independente — recusada.** Essa alternativa não foi escolhida para o Polychat. Não instalar Vite, não criar configuração paralela e não iniciar migração da aplicação para essa stack.
2. **Next.js com App Router — selecionada e aceita.** Corresponde à estrutura e às dependências já versionadas no repositório.
3. **HTML/CSS/JavaScript sem framework — não selecionada.**

A recusa de React + Vite é específica para o Polychat e para esta decisão arquitetural; não representa uma avaliação geral da tecnologia.

## Decisão

**Rejeitar React + Vite para o Polychat e manter Next.js 16 + React 19 + TypeScript**, utilizando o App Router existente.

A stack oficial de frontend é Next.js 16 + React 19 + TypeScript. Não deve ser criada uma segunda configuração de frontend nem iniciada migração para Vite no âmbito da Issue #95 ou da Epic #79.

Qualquer reconsideração futura exige proposta explícita de mudança arquitetural, análise de impacto técnico e de produto e uma ADR substitutiva aprovada pelos responsáveis. A mera presença de React no projeto não autoriza introduzir Vite.

As regras de negócio, autenticação, autorização e acesso a dados devem permanecer no servidor e no banco; esconder componentes ou adaptar a interface por viewport não constitui controle de segurança.

## Justificativa

Next.js 16 + React 19 + TypeScript é a stack já instalada e versionada no projeto, com App Router e configuração compatível com o caminho de deploy Vercel documentado. A migração para Vite criaria uma mudança de arquitetura e retrabalho sem benefício aprovado ou requisito que a justifique no escopo atual.

## Consequências

**Positivas:**
- Mantém a implementação, o backlog e a documentação alinhados.
- Evita configuração paralela e migração não aprovada.
- Preserva a compatibilidade com a estrutura Next.js e o deploy Vercel previstos.

**Negativas e cuidados:**
- Mantém a dependência do Next.js e de seu ciclo de atualizações.
- Exige testes responsivos e de compatibilidade para os dispositivos e navegadores suportados.
- A escolha da stack não comprova que as funcionalidades de produto ou a integração com Supabase estejam concluídas.

## Limites e pendências

- A página inicial é apenas institucional; esta ADR não declara chat ou autenticação entregues.
- A integração real com Supabase permanece pendente conforme README e baseline.
- A regra celular/desktop é requisito de experiência. User-agent, viewport ou emulação podem ser contornados e não podem autorizar operações.
- Matriz de SO/navegadores, tablets, modo desktop, acessibilidade aplicável, manual de marca e fluxos de tela continuam pendentes (Q-012, Q-018, Q-019 e Q-020).
- A configuração reprodutível de dependências e ferramentas do projeto é acompanhada pela Issue #95.

## Evidências

- `package.json`: Next.js `^16.0.0`, React/React DOM `^19.2.0` e TypeScript `^5.9.3`.
- `next.config.ts` e estrutura `src/app/`: uso do Next.js App Router.
- `src/app/layout.tsx` e `src/app/page.tsx`: estrutura atual da aplicação.
- `.github/workflows/ci.yml`: pipeline de testes, ESLint, TypeScript e build.
- [Issue #95 — configuração base e ferramentas Next.js](https://github.com/Aluvioz/Polychat/issues/95).
