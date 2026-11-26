# ADRs — Polychat

**Data de revisão:** 26/11/2026  
**Baseline funcional:** POLY-REQ-001 v0.5 — `docs/09-baseline-requisitos-mvp.md`  
**Épico:** #77 · **Issue de origem:** #89  
**Escopo:** arquitetura lógica, frontend, autenticação, banco de dados, autorização/RLS, realtime, storage, ambientes, deploy, segurança, auditoria e monitoramento.

## Como ler os status

- **Accepted:** decisão aceita no escopo expressamente descrito na ADR. Não significa que todos os fluxos do produto estejam implementados, integrados, testados ou homologados.
- **Accepted — escopo delimitado:** decisão aceita apenas para os mecanismos, componentes, regras ou responsabilidades indicados na seção de escopo da ADR. É vedado extrapolar o aceite.
- **Proposed:** proposta técnica que ainda aguarda as revisões, decisões ou evidências descritas na própria ADR.
- **Deprecated:** decisão formalmente retirada por decisão posterior aprovada e registrada. A mudança exige justificativa, evidências, alternativas, impacto, decisão das responsabilidades competentes e PR aprovada, conforme `docs/10-governanca-desenvolvimento.md`.
- **Rejected / Superseded:** alternativa recusada ou decisão substituída por decisão posterior formalmente aprovada.

Uma ADR Proposed não deve ser tratada como decisão técnica final. Uma ADR Accepted com escopo limitado não autoriza extrapolar seu escopo. Riscos, dúvidas técnicas ou análises parciais de compatibilidade não reclassificam automaticamente uma ADR Accepted.

## Inventário

| ADR | Tema | Status | Escopo do status |
|---|---|---|---|
| [ADR-001](ADR-001-arquitetura-geral.md) | Arquitetura lógica geral | Proposed | Arquitetura modular e integração ponta a ponta; componentes possuem entregas parciais, mas a arquitetura consolidada ainda requer revisão técnica e evidências de integração |
| [ADR-002](ADR-002-frontend-nextjs.md) | Frontend | Accepted | Next.js 16 + React 19 + TypeScript como stack de frontend; não representa aceite das telas ou UX final. React + Vite foi recusado |
| [ADR-003](ADR-003-supabase-vercel.md) | Direção tecnológica Supabase + Vercel | **Accepted** | Stack adotada e obrigatória: Supabase para backend e Vercel para hospedagem/deploy; compatibilidade/modelo de utilização aprovados na Q-025 |
| [ADR-004](ADR-004-autenticacao-sessoes.md) | Autenticação e sessões | Proposed | Fluxos de sessão já possuem integração parcial; provisionamento e administração de contas, recuperação e cobertura completa ainda exigem implementação/evidência |
| [ADR-005](ADR-005-dados-postgresql.md) | Banco e modelo de dados | Proposed | PostgreSQL via Supabase Database; schema e migrations evoluíram, mas validações de integração, operação e continuidade permanecem |
| [ADR-006](ADR-006-autorizacao-rls.md) | Autorização server-side e RLS | **Accepted — escopo delimitado** | RBAC `user`/`ti`, adaptador server-side e políticas RLS de domínio nas tabelas descritas na ADR; não cobre todos os handlers, Storage de objetos, Realtime ou homologação de produção |
| [ADR-007](ADR-007-realtime-mensageria.md) | Mensageria e atualizações em tempo real | Proposed | Modelo de mensageria e persistência documentados; prova de conceito, transporte Realtime, autorização de canais e revogação de assinaturas ainda pendentes |
| [ADR-008](ADR-008-storage-anexos.md) | Armazenamento privado e anexos | Proposed | Bucket privado e primeira camada de upload integrados; download, scanner, quotas, EXIF/GPS, revogação e backup/restore ainda pendentes |
| [ADR-009](ADR-009-ambientes-deploy.md) | Ambientes, configuração, deploy e rollback | **Accepted — escopo delimitado** | Compatibilidade/modelo de uso Supabase + Vercel aprovados na Q-025 e responsabilidades registradas; não significa homologação integral, continuidade comprovada ou release autorizada |
| [ADR-010](ADR-010-seguranca-auditoria-monitoramento.md) | Segurança, auditoria e monitoramento | Proposed | Decisões de produto consolidadas; bases de auditoria genérica e privilegiada existem, mas monitoramento, fila e integração completa dos eventos ainda pendem |

## Decisões e restrições vigentes

1. **Stack de frontend:** Next.js 16 + React 19 + TypeScript (ADR-002). React + Vite foi explicitamente recusado para o Polychat; não deve ser introduzido sem ADR substitutiva aprovada.
2. **Stack tecnológica:** a ADR-003 — Accepted define Supabase + Vercel como stack adotada e obrigatória. Supabase é a plataforma de backend; Vercel é a plataforma de hospedagem/deploy.
3. **Q-025 concluída:** em 24/11/2026, TI e FORD aprovaram a compatibilidade e o modelo de utilização dos provedores nomeados, inclusive Storage, dentro dos limites e responsabilidades registrados. Essa conclusão não significa que cada módulo esteja integrado, que todos os controles estejam executados ou que o produto esteja homologado para produção.
4. **Regras da FORD:** requisitos de governança, acesso, localização, processamento, responsabilidades e operação permanecem válidos dentro do modelo aprovado. Não reabrir a decisão de stack por inferência nem tratar Q-025 como pendência.
5. **Autenticação e autorização:** a autenticação deve respeitar provisionamento pelo TI, perfis `user` e `ti`, autorização server-side e RLS. ADR-006 mantém aceite limitado aos mecanismos e tabelas descritos nela; não presume proteção de handlers que ainda não existam.
6. **Banco de dados:** PostgreSQL via Supabase Database é a tecnologia relacional da stack adotada. A existência de migrations e testes não comprova homologação integral, backup/restore ou operação de produção.
7. **Realtime:** a aprovação da stack na Q-025 não aprova automaticamente a modalidade Supabase Realtime, a configuração de canais, a autorização nem a revogação de assinaturas. Esses elementos continuam na ADR-007.
8. **Storage e anexos:** as PRs #181 e #185 entregaram o bucket privado e a camada inicial de upload. Isso não encerra as Issues #115, #116 ou #117 nem comprova download autorizado, scanner, quotas ou backup.
9. **Ambientes e deploy:** ADR-009 está Accepted no escopo delimitado. Os encerramentos das Issues #96 e #98 permanecem válidos nos respectivos escopos e não devem ser repetidos nem extrapolados como homologação integral do produto.
10. **Segurança e auditoria:** as decisões de produto estão consolidadas na baseline v0.5. As PRs #170 e #173 entregaram bases de auditoria distintas; faltam integração aos fluxos reais, detecção e fila de alertas, testes e evidências operacionais.
11. **Continuidade e release:** backups diários por 12 meses, restore, disponibilidade de 99%, RPO/RTO de 24 horas e runbooks são requisitos definidos, mas precisam de evidência operacional conforme Issue #130.
12. **Separação entre decisão e execução:** nenhum status Accepted ou decisão da Q-025, isoladamente, declara produto pronto, homologação funcional concluída ou autorização de lançamento.

## Evidências verificadas no repositório

- **Frontend:** `package.json`, `src/app/` e `next.config.ts` registram Next.js 16 / React 19 / TypeScript.
- **Sessão/autorização:** PR #175 / Issue #105 integraram adaptador de autorização ao Next.js App Router e rotas de sessão; isso não representa ciclo administrativo completo de contas.
- **Modelo de dados:** PR #165 / Issue #99 implementaram schema de domínio e integridade; PR #180 reconciliou identificadores de migrations sem executar repair ou `db push` remoto.
- **Instalação limpa:** workflow da PR #180 aplicou 18 migrations em PostgreSQL local descartável. O resultado comprova reprodutibilidade local, não homologação de produção nem execução de restore.
- **RLS:** PR #172 / Issue #101 integraram policies de domínio e evidências SQL; os limites específicos constam da ADR-006.
- **Auditoria genérica:** PR #173 / Issue #102 implementaram `audit_events`, retenção investigativa, descarte controlado e writer. A Issue #102 foi encerrada; callsites de operações administrativas ainda faltam em fluxos não implementados.
- **Auditoria privilegiada:** PR #170 / Issue #124 implementaram `privileged_action_audit`, writer e pesquisa server-side. A Issue #124 permanece aberta porque handlers/callsites reais e integração atômica ainda estão pendentes.
- **Storage:** PR #181 provisionou bucket privado `attachments`; PR #185 integrou upload server-side com validação de sessão, mensagem, assinatura e metadados. Issues #115, #116 e #117 permanecem abertas para critérios remanescentes.
- **Ambientes:** Issues #96 e #98 foram encerradas e seus aceites permanecem válidos nos escopos originais. Q-025 foi concluída em 24/11/2026.
- **CI:** `.github/workflows/ci.yml` executa testes, ESLint, TypeScript e build. A existência do workflow não comprova branch protection, required checks ou homologação de produção.

As evidências de PR, migration, writer, teste unitário, teste SQL ou CI devem ser interpretadas nos seus escopos. Elas não comprovam automaticamente fluxos de ponta a ponta, segurança operacional completa, continuidade ou release.

## Implementações e validações ainda pendentes

- Fluxos completos de autenticação e administração de contas.
- Realtime efetivo, política de canais e revogação de assinaturas ativas.
- Download autorizado de anexos, links temporários e revogação após remoção de participante.
- Scanner antimalware interno, quarentena, quotas, rejeição de PDF protegido por senha e remoção EXIF/GPS.
- Integração dos eventos de auditoria aos handlers reais, inclusive consulta/exportação e ações privilegiadas.
- Detecção de conteúdo suspeito e fila de revisão do TI.
- Testes integrados/E2E, threat modeling e evidências de segurança.
- Backups/restore, RPO/RTO, monitoramento operacional, incidentes, runbooks e preparação de release.

Essas entregas pertencem às ADRs e Issues indicadas; não devem ser confundidas com pendências de definição da stack ou reabertura da Q-025.

## Aprovações e responsabilidades pendentes

| Tema | Responsável pela revisão/decisão | Evidência necessária |
|---|---|---|
| Arquitetura lógica e integração dos componentes | Tech Lead + TI | Revisão da ADR-001, fronteiras, responsabilidades e evidências de integração |
| Autenticação e sessões | Tech Lead + Desenvolvimento + TI | Fluxos administrativos completos, autorização e testes integrados |
| Banco e RLS | Tech Lead + Desenvolvimento + SQA | Migrations, políticas, testes de isolamento e validação dos fluxos reais |
| Realtime | Tech Lead + Desenvolvimento + SQA | Prova de conceito, testes de canais, autorização, ordenação, reconexão e revogação |
| Storage e antimalware | Tech Lead + Desenvolvimento + TI + SQA | Download autorizado, scanner, quarentena, revogação, quotas e backup |
| Segurança e auditoria | TI + Tech Lead + SQA | Call sites, testes, catálogo integrado, proteção dos registros e evidências |
| Continuidade e release | TI + Tech Lead + SQA + PO | Backup/restore, RPO/RTO, runbooks, homologação, Go/No-Go e aceite formal |
| Aderência ao escopo e rastreabilidade | Product Owner | Parecer de produto e atualização dos documentos/backlog |

## Questões da baseline e histórico

- **Q-018:** resolvida pelo PO em 20/11/2026; arquitetura da informação registrada em `docs/ux/decisoes-produto-q018-q019.md`.
- **Q-019:** parcialmente concluída; permanece apenas a obtenção/confirmação do arquivo autorizado do Ford Oval e eventuais regras corporativas específicas de aplicação/tipografia. A paleta provisória está definida.
- **Q-025:** concluída em 24/11/2026, com aprovação de TI/FORD para compatibilidade e modelo de utilização Supabase + Vercel, inclusive Storage, dentro dos limites e responsabilidades registrados. Não deve permanecer listada como questão aberta nem ser usada para reabrir a escolha da stack.

O registro histórico das questões permanece em `docs/08-glossario-e-questoes-em-aberto.md`. Referências antigas que ainda classifiquem Q-025 como aberta precisam ser reconciliadas com a decisão de 24/11/2026 antes da revisão final integrada.

## Issue #89 e esta revisão corretiva

A Issue #89 foi encerrada em 17/11/2026 após integração da PR #139 e aceite dos critérios originais. O encerramento não declarou implementadas ou homologadas todas as funcionalidades das ADRs.

A PR #161 é uma revisão documental corretiva posterior: restaura e harmoniza a stack Supabase + Vercel, atualiza evidências e escopos de ADRs e corrige referências que ficaram divergentes. Ela não reabre a Issue #89 nem altera retroativamente o aceite da PR #139.

A PR #161 deve passar por sincronização/reconciliação com a `main`, checks aplicáveis e revisões técnicas/SQA antes de deixar Draft e ser integrada. A conclusão desta revisão documental não equivale a aprovação do SQA, aprovação do Tech Lead ou autorização de release.
