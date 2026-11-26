# ADR-003 — Direção tecnológica: Supabase + Vercel

- **Status:** Accepted
- **Data da decisão original:** 17/11/2026
- **Data da revisão:** 24/11/2026
- **Issue de origem:** #89 · **Referência original:** #88
- **Baseline de referência:** POLY-REQ-001 v0.5
- **Escopo:** registrar Supabase + Vercel como stack tecnológica vigente e obrigatória para o desenvolvimento do Polychat. Esta decisão orienta as issues, PRs e documentos técnicos; não substitui a definição dos detalhes de implantação, segurança e operação.

## Contexto

A direção tecnológica Supabase + Vercel foi originalmente registrada como aceita em 17/11/2026, com base na Issue #88. Em 19/11/2026, uma revisão documental passou a tratar essa direção como Deprecated após interpretar as restrições da FORD v2 sobre controle de hospedagem, armazenamento e processamento como incompatíveis com a stack.

Essa interpretação foi posteriormente identificada como divergente das orientações vigentes do projeto. A Issue #100, atualizada em 20/11/2026, determinou a preservação de Supabase + Vercel como referência de implementação. Em 24/11/2026, a Q-025 foi concluída com aprovação da TI e da FORD para a compatibilidade da configuração e do modelo de utilização da stack com os requisitos de infraestrutura. A Issue #102 também mantém a stack oficial Supabase/Vercel como referência de integração.

Em 24/11/2026, o Product Owner confirmou novamente que Supabase + Vercel é a direção tecnológica correta do Polychat. Esta revisão corrige a classificação anterior e restabelece o aceite da stack.

## Problema

Manter uma direção tecnológica única e coerente entre ADRs, baseline, issues, PRs e planejamento de implementação, preservando a aprovação de compatibilidade registrada na Q-025 e o processo formal para qualquer mudança futura da stack.

## Decisão

**Supabase + Vercel permanece como a stack tecnológica adotada e obrigatória do Polychat. O status desta ADR é Accepted.**

Esta decisão somente poderá ser retirada, substituída ou reclassificada por decisão posterior formalmente aprovada, acompanhada de justificativa, evidências, alternativas e avaliação de impacto, conforme a seção [Governança de decisões arquiteturais](../10-governanca-desenvolvimento.md#8-governanca-de-decisoes-arquiteturais). A Q-025 não substitui esse processo.

- **Vercel:** permanece como plataforma de hospedagem, deployment e execução da aplicação, conforme a configuração técnica aprovada para o projeto.
- **Supabase:** permanece como plataforma de backend do projeto, incluindo os serviços adotados para autenticação, banco de dados, armazenamento e demais capacidades efetivamente previstas nas ADRs e no desenho técnico.
- **Frontend:** permanece alinhado à direção registrada na ADR-002 e deve ser integrado à stack Supabase + Vercel.
- **Implementação:** issues, PRs e documentos técnicos devem preservar Supabase + Vercel como referência. Não classificar esses serviços como Deprecated, obsoletos ou substituídos sem uma decisão formal posterior do Product Owner e a correspondente revisão arquitetural.

A Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD para a compatibilidade da configuração e do modelo de utilização da stack, incluindo hospedagem/execução, localização e fluxo dos dados, acesso, armazenamento, processamento, isolamento de ambientes, segredos, backup e responsabilidades. O registro e o escopo da aprovação estão documentados em `docs/08-glossario-e-questoes-em-aberto.md`, seção 8.4.

**A aprovação da Q-025 não constitui autorização para substituir Supabase + Vercel por inferência.** Qualquer mudança futura da stack exige decisão formal, justificativa, evidências, alternativas e avaliação de impacto, conforme esta ADR e a governança arquitetural do projeto.

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
- Registra a aprovação da compatibilidade operacional pela TI e pela FORD, preservando Supabase + Vercel como stack adotada e evitando reabrir unilateralmente a decisão de produto.

**Responsabilidades e pontos de atenção:**

- O Tech Lead mantém a documentação da topologia, configuração e controles de implantação conforme as ADRs 005, 008 e 009; a decisão de compatibilidade da Q-025 já foi concluída.
- Desenvolvimento deve manter as integrações e referências técnicas alinhadas às ADRs vigentes.
- SQA deve verificar consistência entre a implementação, a baseline e esta ADR, sem considerar a existência de migrations, configurações ou previews como evidência suficiente de integração real.
- A adoção da stack não declara concluídos testes, controles de autorização/RLS, auditoria, retenção, backups, segurança ou homologação.

## Evidências e limites

- A Issue #100 registra Supabase + Vercel como stack adotada e determina que a Q-025 avalie compatibilidade sem descartar os serviços por inferência.
- A Issue #102 exige integração real na stack oficial Supabase/Vercel para auditoria e retenção.
- A presença de migrations, arquivos de configuração, variáveis de ambiente, previews ou workflows no repositório não comprova, isoladamente, integração funcional nem autorização de produção.
- A Q-025 foi concluída em 24/11/2026 com aprovação da TI e da FORD; sua decisão permanece como referência de compatibilidade do modelo de uso da stack.

## Orientação de continuidade

1. Preservar Supabase + Vercel nas issues, PRs, ADRs e documentos do Polychat como stack vigente.
2. Remover ou corrigir referências que classifiquem a ADR-003, Supabase ou Vercel como Deprecated, descartados ou substituídos sem decisão formal posterior.
3. Preservar o registro concluído da Q-025 e manter a configuração, os controles e as evidências operacionais atualizados nas ADRs e issues correspondentes.
4. Revisar as ADRs dependentes para garantir coerência com esta decisão e com a baseline POLY-REQ-001 v0.5.
5. Não declarar integração, segurança ou prontidão de produção concluídas sem implementação, testes e evidências verificáveis.

## Histórico da decisão

- **17/11/2026:** Supabase + Vercel registrados como direção tecnológica Accepted, com base na Issue #88.
- **19/11/2026:** revisão da FORD v2 levou à classificação documental da ADR como Deprecated, sob interpretação de incompatibilidade com as restrições de infraestrutura; não foi registrada decisão formal de substituição acompanhada de avaliação de impacto.
- **20/11/2026:** a Issue #100 registrou que Supabase + Vercel deveria ser preservada como stack do projeto e que a Q-025 deveria avaliar compatibilidade sem substituição por inferência.
- **24/11/2026:** o Product Owner confirmou Supabase + Vercel como stack correta e obrigatória; esta ADR foi revisada para restabelecer o status Accepted e corrigir a interpretação anterior.
- **24/11/2026:** Q-025 concluída com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização da stack Supabase + Vercel.
