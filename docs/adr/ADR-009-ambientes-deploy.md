# ADR-009 — Ambientes, configuração, deploy e rollback

- **Status:** Proposed
- **Data de revisão:** 24/11/2026
- **Issue de origem:** #89
- **Issues operacionais relacionadas:** #96 e #98
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A baseline FORD v2 exige que hospedagem, processamento, armazenamento, auditoria, antimalware, backup e demais componentes que tratem dados da organização permaneçam sob controle da FORD, preferencialmente no Brasil. Nenhum serviço de terceiro pode acessar, armazenar ou processar dados da FORD. Os ambientes de desenvolvimento, homologação e produção devem ser isolados.

As Issues #96 e #98 foram encerradas como concluídas, com confirmações expressas do responsável/Tech Lead sobre a configuração e as validações operacionais abrangidas pelos respectivos escopos:

- **Issue #96 — Configurar ambientes Supabase e Vercel:** encerrada em 17/11/2026. O responsável/Tech Lead confirmou a conclusão das configurações e validações operacionais dos ambientes descritas na issue. O registro de auditoria identificou Polyford como projeto Supabase de desenvolvimento e observou Preview Vercel Ready; o comentário de encerramento atesta a conclusão do escopo, sem apresentar inventário administrativo granular de todos os ambientes.
- **Issue #98 — Estabelecer deploy preview, produção e rollback:** encerrada em 19/11/2026. O Tech Lead confirmou que foram executados a validação do deployment hospedado, os ensaios de rollback, as verificações de produção/domínio/HTTPS e a revisão dos fluxos relacionados. O comentário registra o aceite e a conclusão da issue, mas ressalva que não constitui nova auditoria administrativa independente e que as evidências detalhadas devem permanecer acessíveis e atualizadas.

As issues foram concluídas utilizando a direção técnica Supabase + Vercel. A ADR-003 mantém essa stack como adotada e obrigatória. Os encerramentos continuam válidos para os escopos operacionais originais, mas não substituem a avaliação de compatibilidade/configuração exigida pela Q-025 nem comprovam, isoladamente, homologação de produção sob todos os requisitos da FORD.

O workflow de CI executa testes, ESLint, TypeScript e build em pushes para main e Pull Requests para main. A existência do workflow não comprova proteção administrativa da branch nem autoriza que segredos ou dados de produção sejam expostos a serviços externos.

## Problema

Estabelecer isolamento de ambientes, gestão de segredos, promoção segura, evidência de smoke tests e rollback, respeitando a exigência de infraestrutura sob controle da FORD e distinguindo execução histórica atestada de arquitetura-alvo vigente.

## Alternativas consideradas

1. **Ambientes e pipeline sob controle da FORD:** solução-alvo compatível com isolamento, operação, deploy, monitoramento e recuperação dentro da infraestrutura da organização.
2. **Hospedagem ou pipeline SaaS externo para dados da FORD:** não permitido quando o serviço puder acessar, armazenar ou processar dados, artefatos com dados, segredos ou conteúdo operacional da organização.
3. **Ambiente único compartilhado:** não atende ao requisito de isolamento entre desenvolvimento, homologação e produção.
4. **CI de código sem acesso a dados corporativos:** pode ser utilizado para testes e validações de código, desde que não receba dados da FORD, segredos operacionais ou acesso capaz de processá-los.

## Decisão proposta

Adotar ambientes separados de **desenvolvimento, homologação e produção** utilizando a stack Supabase + Vercel definida pela ADR-003. A topologia, isolamento, configuração, gestão de segredos, fluxo de deploy e responsabilidades devem ser detalhados e validados por TI e Tech Lead na Q-025, frente às restrições da FORD. Esta ADR permanece Proposed e não autoriza retirar ou substituir a stack por inferência.

### Isolamento e dados

- Cada ambiente deve possuir recursos, configurações, credenciais, permissões e armazenamento isolados.
- Desenvolvimento e homologação devem utilizar dados sintéticos ou minimizados; dados reais somente podem ser utilizados conforme autorização e controles da FORD.
- Nenhum terceiro pode acessar, armazenar ou processar dados da FORD.
- Preview de Pull Request deve ocorrer em ambiente controlado e isolado, sem conexão com dados ou segredos de produção.
- O ambiente de produção deve ser protegido contra acesso de desenvolvimento e homologação.

### Segredos e configuração

- Segredos privilegiados permanecem em mecanismo de gestão controlado pela FORD, somente no servidor ou ambiente operacional autorizado.
- Não registrar segredos em Git, bundle de cliente, logs, tickets, documentação ou variáveis públicas NEXT_PUBLIC_.
- As credenciais devem possuir escopo mínimo por ambiente; não reutilizar credenciais de produção em desenvolvimento ou homologação.
- O inventário documental pode registrar nomes, finalidade e escopo de variáveis, nunca seus valores secretos.
- Proteção de credenciais e gestão de chaves seguem os requisitos técnicos já alinhados com Desenvolvimento.

### CI, deploy e promoção

- O CI pode executar testes, lint, verificação de tipos e build sobre código sem dados da FORD.
- A etapa de deploy que tenha acesso a ambientes, segredos, artefatos sensíveis ou sistemas da FORD deve executar dentro da fronteira de controle da organização.
- Deploy de produção deve ocorrer por fluxo controlado após PR revisada, checks aplicáveis, homologação e Go/No-Go do gestor.
- O lançamento do MVP é único após homologação, sem piloto, conforme RN-024.
- Toda promoção deve registrar versão/commit, ambiente de origem e destino, responsável, data/hora, aprovação e resultado.
- Não presumir regras de branch protection ou required checks apenas pela existência de workflow; sua configuração deve ser verificada administrativamente no GitHub.

### Smoke test, rollback e recuperação

- O smoke test deve validar o deployment do ambiente efetivo, domínio e HTTPS, além dos fluxos funcionais implementados e aplicáveis. Smoke test local do build não substitui teste hospedado.
- O rollback da aplicação deve utilizar versão/deployment anterior conhecido como bom e compatível com o estado do banco.
- Rollback de aplicação não equivale a rollback de migration nem restauração de banco ou anexos; esses procedimentos precisam ser separados.
- Backups são diários e retidos por 12 meses.
- Parâmetros consolidados de continuidade: disponibilidade mensal de 99%, RPO de 24 horas em desastre/falha de infraestrutura e RTO de 24 horas.
- Manutenção deve ocorrer fora do horário comercial, com aviso; suporte ocorre em horário comercial.
- Os testes de restore e a compatibilidade das versões de aplicação e schema devem ser evidenciados na infraestrutura homologada.

### Registro das Issues #96 e #98

O encerramento das Issues #96 e #98 permanece válido para seus escopos originais, com base nas confirmações registradas pelos responsáveis. A existência histórica de ambientes e deployments Supabase/Vercel, inclusive a confirmação de smoke tests e rollback no contexto da #98, deve ser preservada como evidência de execução anterior.

As exigências da FORD v2 permanecem obrigatórias e devem ser verificadas na configuração e no modelo de uso dos ambientes Supabase/Vercel por meio da Q-025. Até que as evidências de compatibilidade e homologação sejam registradas, não se deve presumir prontidão para produção com dados reais. Essa condição é um gate de validação operacional, não uma retirada implícita da stack estabelecida pela ADR-003.

## Justificativa

Isolamento e promoção controlada reduzem o risco de contaminação entre estágios e erros de operação. A configuração dos serviços e dos ambientes deve demonstrar atendimento aos requisitos da FORD sem contradizer a stack adotada pela ADR-003. Os encerramentos das issues #96 e #98 comprovam apenas os escopos operacionais aceitos e não substituem as evidências adicionais da Q-025.

## Consequências

**Positivas:**
- Alinhamento com a restrição de infraestrutura da FORD.
- Separação explícita entre ambientes e credenciais.
- Promoção e rollback rastreáveis.
- Preservação dos registros de conclusão das Issues #96 e #98 sem tratá-los como aprovação irrestrita da arquitetura anterior.

**Negativas e cuidados:**
- A FORD/equipe precisa operar a infraestrutura, pipeline de deploy, segredos, backups e recuperação.
- A configuração e eventual adequação da stack adotada exigem planejamento, validação técnica e evidências por ambiente.
- Evidências históricas de deploy e rollback precisam ser preservadas; a configuração e o modelo de utilização da stack Supabase + Vercel adotada também devem ser verificados e evidenciados conforme a Q-025.

## Riscos

Mistura de dados entre ambientes; vazamento de segredos; pipeline externo com acesso indevido; deploy para ambiente errado; preview conectado à produção; rollback incompatível com migrations; restauração não testada; domínio ou TLS incorreto; dependência de SaaS externo incompatível com a FORD v2.

## Evidências atuais

- Documento de auditoria da Issue #96: auditoria original, confirmação de Polyford como desenvolvimento e registro de encerramento por atestação do responsável/Tech Lead.
- [Issue #96 — encerramento](https://github.com/Aluvioz/Polychat/issues/96#issuecomment-6963142263): confirmação de conclusão das configurações e validações operacionais do escopo.
- Documento de auditoria da Issue #98: auditoria de 18/11 e aditivo de aceite do Tech Lead.
- [Issue #98 — aceite e encerramento](https://github.com/Aluvioz/Polychat/issues/98#issuecomment-7013655363): confirmação de deployment hospedado, smoke/rollback, produção, domínio/HTTPS e fluxos relacionados.
- Runbook de smoke test e rollback da Issue #98: procedimento e registro do ensaio, com os limites de detalhamento documental.
- Workflow de CI: testes, ESLint, TypeScript e build no GitHub Actions.
- Baseline POLY-REQ-001 v0.5: isolamento, disponibilidade, RPO/RTO, backup, manutenção e suporte.

As confirmações do Tech Lead são evidência de aceite operacional para as issues, não auditoria administrativa independente das configurações nem prova de conformidade da arquitetura externa com a FORD v2.

## Pendências para Accepted

- Documentar e validar a configuração de ambientes e do pipeline de deploy na stack Supabase + Vercel adotada, demonstrando compatibilidade com os requisitos da FORD na Q-025.
- Definir como Preview, homologação e produção serão isolados na infraestrutura-alvo.
- Documentar a gestão de segredos e o acesso mínimo por ambiente, sem expor valores.
- Revalidar smoke test, deploy e rollback na configuração e no modelo de utilização propostos para a stack Supabase + Vercel adotada, observando o resultado e as evidências da avaliação Q-025.
- Registrar evidências e aprovadores de TI/Tech Lead e atualizar esta ADR após a decisão.

Os requisitos de isolamento, proteção de credenciais, gestão de chaves, metas de disponibilidade, backup, RPO/RTO e operação já alinhados com Desenvolvimento são premissas consolidadas; não devem ser reabertos como pendências de produto.
