# ADR-002 — Frontend Next.js

- **Status:** Accepted
- **Escopo do aceite:** stack efetivamente versionada no repositório; não significa aceite das telas ou da UX final.
- **Data:** 17/11/2026
- **Issue:** #89

## Contexto

A `main` contém `package.json`, `next.config.ts` e a estrutura `src/app/`. O projeto declara Next.js `^16.0.0`, React e React DOM `^19.2.0`, TypeScript `^5.9.3` e usa o App Router. A página atual é uma apresentação institucional do Polychat; login, conversas e painel TI ainda não estão implementados.

A baseline exige perfil Usuário em smartphone e perfil TI em computador, além de uma interface simples com identidade azul e branca. A matriz de navegadores/dispositivos e os ativos oficiais de marca ainda estão pendentes.

## Problema

Registrar a stack real para que documentação, deploy e próximas implementações não tratem React + Vite ou outra alternativa como stack vigente.

## Alternativas consideradas

1. React + Vite como SPA independente.
2. Next.js com App Router.
3. HTML/CSS/JavaScript sem framework.

## Decisão

Manter **Next.js 16 + React 19 + TypeScript** como stack de frontend do repositório, usando o App Router existente. A decisão registra o estado atual e evita troca de stack no escopo da Issue #89. Mudança futura exige ADR de substituição e avaliação de impacto.

As regras de negócio, autenticação, autorização e acesso a dados devem permanecer no servidor e no banco; esconder componentes ou adaptar a interface por viewport não constitui controle de segurança.

## Justificativa

É a stack já instalada, configurada e validada pelo pipeline atual. Substituí-la durante a documentação arquitetural criaria retrabalho sem evidência de benefício proporcional.

## Consequências

**Positivas:** reduz divergência entre código e documentação; mantém compatibilidade com o deploy Next.js/Vercel previsto.

**Negativas:** dependência do framework e de seu ciclo de atualizações; necessidade de testes responsivos e de compatibilidade.

## Limites e pendências

- A página inicial é apenas institucional; esta ADR não declara chat ou autenticação entregues.
- A regra celular/desktop é requisito de experiência. User-agent, viewport ou emulação podem ser contornados e não podem autorizar operações.
- Matriz de SO/navegadores, tablets, modo desktop, acessibilidade aplicável, manual de marca e fluxos de tela continuam pendentes (Q-012, Q-018, Q-019 e Q-020).

## Evidências

`package.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx` e `.github/workflows/ci.yml`.
