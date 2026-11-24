# ADR-003 — Direção tecnológica: Supabase + Vercel

- **Status:** Accepted
- **Data da decisão original:** 17/11/2026
- **Data da revisão:** 24/11/2026
- **Issue de origem:** #89 · **Referência original:** #88
- **Baseline de referência:** POLY-REQ-001 v0.5
- **Escopo:** registrar Supabase + Vercel como stack tecnológica vigente e obrigatória para o desenvolvimento do Polychat. Esta decisão orienta as issues, PRs e documentos técnicos; não substitui a definição dos detalhes de implantação, segurança e operação.

## Contexto

A direção tecnológica Supabase + Vercel foi originalmente registrada como aceita em 17/11/2026, com base na Issue #88. Em 19/11/2026, uma revisão documental passou a tratar essa direção como Deprecated após interpretar as restrições da FORD v2 sobre controle de hospedagem, armazenamento e processamento como incompatíveis com a stack.

Essa interpretação foi posteriormente identificada como divergente das orientações vigentes do projeto. A Issue #100, atualizada em 20/11/2026, determina expressamente que Supabase + Vercel deve ser preservada como referência de implementação e que a Q-025 deve avaliar a compatibilidade com as restrições da FORD, sem descartar ou substituir a stack por inferência. A Issue #102 também mantém a stack oficial Supabase/Vercel como referência de integração.

Em 24/11/2026, o Product Owner confirmou novamente que Supabase + Vercel é a direção tecnológica correta do Polychat. Esta revisão corrige a classificação anterior e restabelece o aceite da stack.

## Problema

Manter uma direção tecnológica única e coerente entre ADRs, baseline, issues, PRs e planejamento de implementação, sem transformar uma análise de compatibilidade ainda pendente em uma decisão implícita de substituição da stack.

## Decisão

**Supabase + Vercel permanece como a stack tecnológica adotada e obrigatória do Polychat. O status desta ADR é Accepted.**

- **Vercel:** permanece como plataforma de hospedagem, deployment e execução da aplicação, conforme a configuração técnica aprovada para o projeto.
- **Supabase:** permanece como plataforma de backend do projeto, incluindo os serviços adotados para autenticação, banco de dados, armazenamento e demais capacidades efetivamente previstas nas ADRs e no desenho técnico.
- **Frontend:** permanece alinhado à direção registrada na ADR-002 e deve ser integrado à stack Supabase + Vercel.
- **Implementação:** issues, PRs e documentos técnicos devem preservar Supabase + Vercel como referência. Não classificar esses serviços como Deprecated, obsoletos ou substituídos sem uma decisão formal posterior do Product Owner e a correspondente revisão arquitetural.

A Q-025 continua responsável por documentar a análise técnica de compatibilidade entre a stack adotada e as restrições da FORD relativas a hospedagem, armazenamento, processamento, localização dos dados, acessos e responsabilidades operacionais. Essa análise deve avaliar a configuração e o modelo de utilização da stack, identificar controles necessários e registrar eventuais limitações com evidências.

**A Q-025 não constitui autorização para retirar ou substituir Supabase + Vercel por inferência.** Caso a análise técnica identifique uma incompatibilidade concreta que não possa ser mitigada, o conflito deverá ser apresentado ao Product Owner e aos responsáveis da FORD para decisão explícita antes de qualquer mudança de stack.

O aceite desta ADR define a direção tecnológica do projeto. Isoladamente, não comprova que ambientes, integrações, controles de segurança, contratos, requisitos de governança ou operação estejam implementados ou homologados para produção.

## Justificativa

- A Issue #100 determina a preservação de Supabase + Vercel como referência de implementação.
- A Issue #102 também utiliza Supabase/Vercel como stack oficial para orientar a implementação de auditoria e retenção.
- A confirmação do Product Owner restabelece a direção tecnológica do projeto e elimina a classificação contraditória introduzida na revisão de 19/11.
- As restrições da FORD devem ser tratadas por análise técnica rastreável, definição de configuração e controles aplicáveis, e não pela substituição automática da stack.

## Consequências

**Positivas:**

- Restabelece uma direção tecnológica única para Desenvolvimento, Tech Lead, SQA e PO.
- Evita que documentos e issues apresentem Supabase + Vercel como tecnologias descartadas.
- Preserva o planejamento e os artefatos técnicos que utilizam essa stack como referência.
- Mantém a Q-025 como atividade de compatibilização e registro de riscos, sem reabrir unilateralmente a decisão de produto.

**Responsabilidades e pontos de atenção:**

- O Tech Lead deve documentar na Q-025 a arquitetura de implantação e os controles necessários para atender aos requisitos da FORD.
- Desenvolvimento deve manter as integrações e referências técnicas alinhadas às ADRs vigentes.
- SQA deve verificar consistência entre a implementação, a baseline e esta ADR, sem considerar a existência de migrations, configurações ou previews como evidência suficiente de integração real.
- A adoção da stack não declara concluídos testes, controles de autorização/RLS, auditoria, retenção, backups, segurança ou homologação.

## Evidências e limites

- A Issue #100 registra Supabase + Vercel como stack adotada e determina que a Q-025 avalie compatibilidade sem descartar os serviços por inferência.
- A Issue #102 exige integração real na stack oficial Supabase/Vercel para auditoria e retenção.
- A presença de migrations, arquivos de configuração, variáveis de ambiente, previews ou workflows no repositório não comprova, isoladamente, integração funcional nem autorização de produção.
- A Q-025 permanece aberta para detalhamento e evidências da configuração arquitetural compatível com os requisitos da FORD.

## Orientação de continuidade

1. Preservar Supabase + Vercel nas issues, PRs, ADRs e documentos do Polychat como stack vigente.
2. Remover ou corrigir referências que classifiquem a ADR-003, Supabase ou Vercel como Deprecated, descartados ou substituídos sem decisão formal posterior.
3. Atualizar a Q-025 com a análise técnica de compatibilidade, controles, responsabilidades e evidências necessárias, sem alterar a stack por inferência.
4. Revisar as ADRs dependentes para garantir coerência com esta decisão e com a baseline POLY-REQ-001 v0.5.
5. Não declarar integração, segurança ou prontidão de produção concluídas sem implementação, testes e evidências verificáveis.

## Histórico da decisão

- **17/11/2026:** Supabase + Vercel registrados como direção tecnológica Accepted, com base na Issue #88.
- **19/11/2026:** revisão da FORD v2 levou à classificação temporária da ADR como Deprecated, sob interpretação de incompatibilidade com as restrições de infraestrutura.
- **20/11/2026:** a Issue #100 registrou que Supabase + Vercel deveria ser preservada como stack do projeto e que a Q-025 deveria avaliar compatibilidade sem substituição por inferência.
- **24/11/2026:** o Product Owner confirmou Supabase + Vercel como stack correta e obrigatória; esta ADR foi revisada para restabelecer o status Accepted e corrigir a interpretação anterior.
