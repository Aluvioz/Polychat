# ADR-009 — Ambientes, configuração, deploy e rollback

- **Status:** Accepted — escopo delimitado
- **Data de revisão:** 26/11/2026
- **Issue de origem:** #89
- **Issues operacionais relacionadas:** #96, #98 e #130
- **Baseline:** POLY-REQ-001 v0.5

## Escopo do aceite

Esta ADR está **Accepted — escopo delimitado** para a compatibilidade e o modelo de utilização Supabase + Vercel aprovados na Q-025, bem como para as decisões e responsabilidades de ambientes, configuração, deploy e rollback aqui registradas. O status não significa homologação integral do produto, execução comprovada de backup/restore, continuidade operacional concluída ou autorização de lançamento.

A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para os provedores nomeados e o modelo de utilização, inclusive Storage, dentro dos limites e responsabilidades registrados. A Q-025 não substitui os critérios de execução e evidência operacional da Issue #130.

## Contexto

A baseline FORD v2 exige controle de hospedagem, processamento, armazenamento, auditoria, antimalware, backup e demais componentes que tratem dados da organização, preferencialmente no Brasil. A Q-025 registrou aprovação expressa da TI e da FORD para Supabase e Vercel como provedores nomeados da stack, dentro do modelo de utilização, dos controles e das responsabilidades descritos nesta ADR. Outros serviços de terceiros continuam sujeitos a aprovação específica. Os ambientes de desenvolvimento, homologação e produção devem ser isolados.

As Issues #96 e #98 foram encerradas como concluídas, com confirmações expressas do responsável/Tech Lead sobre a configuração e as validações operacionais abrangidas pelos respectivos escopos:

- **Issue #96 — Configurar ambientes Supabase e Vercel:** encerrada em 17/11/2026. O responsável/Tech Lead confirmou a conclusão das configurações e validações operacionais dos ambientes descritas na issue. O registro de auditoria identificou Polyford como projeto Supabase de desenvolvimento e observou Preview Vercel Ready; o comentário de encerramento atesta a conclusão do escopo, sem apresentar inventário administrativo granular de todos os ambientes.
- **Issue #98 — Estabelecer deploy preview, produção e rollback:** encerrada em 19/11/2026. O Tech Lead confirmou que foram executados a validação do deployment hospedado, os ensaios de rollback, as verificações de produção/domínio/HTTPS e a revisão dos fluxos relacionados. O comentário registra o aceite e a conclusão da issue, mas ressalva que não constitui nova auditoria administrativa independente e que as evidências detalhadas devem permanecer acessíveis e atualizadas.

As issues foram concluídas utilizando a direção técnica Supabase + Vercel. A ADR-003 mantém essa stack como adotada e obrigatória. Em 24/11/2026, a Q-025 foi concluída com aprovação da TI e da FORD para a compatibilidade da configuração e do modelo de utilização, aproveitando os aceites #96 e #98 e as evidências de desenvolvimento da #99. Os encerramentos permanecem válidos para seus escopos e são complementados pela decisão expressa da Q-025.

O workflow de CI executa testes, ESLint, TypeScript e build em pushes para main e Pull Requests para main. A existência do workflow não comprova proteção administrativa da branch nem autoriza que segredos ou dados de produção sejam expostos a serviços externos.

## Problema

Estabelecer isolamento de ambientes, gestão de segredos, promoção segura, evidência de smoke tests e rollback, respeitando a exigência de infraestrutura sob controle da FORD e distinguindo execução histórica atestada de arquitetura-alvo vigente.

## Alternativas consideradas

1. **Ambientes e pipeline sob controle da FORD:** solução-alvo compatível com isolamento, operação, deploy, monitoramento e recuperação dentro da infraestrutura da organização.
2. **Hospedagem ou pipeline de terceiros não aprovados:** não permitido quando puder acessar, armazenar ou processar dados, artefatos com dados, segredos ou conteúdo operacional. Supabase e Vercel são as exceções nomeadas e expressamente aprovadas na Q-025.
3. **Ambiente único compartilhado:** não atende ao requisito de isolamento entre desenvolvimento, homologação e produção.
4. **CI de código sem acesso a dados corporativos:** pode ser utilizado para testes e validações de código, desde que não receba dados da FORD, segredos operacionais ou acesso capaz de processá-los.

## Decisão

Adotar ambientes separados de **desenvolvimento, homologação e produção** na stack Supabase + Vercel definida pela ADR-003. A Q-025 foi concluída em 24/11/2026: TI e FORD aprovaram a topologia, o modelo de isolamento, a gestão de segredos, o fluxo de deploy e as responsabilidades operacionais descritas nesta ADR. A decisão preserva os provedores nomeados e não autoriza substituição por inferência.

### Registro de aprovação

**Aprovadores funcionais:** TI e representante da FORD.  
**Data:** 24/11/2026.  
**Referência:** Q-025 — Compatibilidade da stack Supabase + Vercel, concluída.  
**Resultado:** ambientes, configuração, fluxo de deploy e operação na stack Supabase + Vercel aprovados. Os aceites das Issues #96 e #98 são preservados como evidência operacional de seus escopos.

A aprovação cobre o modelo de ambientes, segregação por estágio, variáveis e credenciais por ambiente, deploy Preview/Production, domínio/HTTPS, smoke test e rollback de aplicação, com responsabilidades atribuídas. Não declara que todos os fluxos de produto, testes de segurança, restore de banco ou homologação funcional já estejam executados.

### Isolamento e dados

- Cada ambiente deve possuir recursos, configurações, credenciais, permissões e armazenamento isolados.
- Desenvolvimento e homologação devem utilizar dados sintéticos ou minimizados; dados reais somente podem ser utilizados conforme autorização e controles da FORD.
- Supabase e Vercel são os provedores nomeados aprovados para os serviços previstos na stack do Polychat; não encaminhar dados a outros provedores sem aprovação específica da FORD.
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
- A etapa de deploy utiliza o pipeline Vercel expressamente aprovado na Q-025, com credenciais segregadas por ambiente, escopo mínimo e controle operacional da TI. Nenhum outro serviço externo recebe secrets ou dados da FORD sem aprovação específica.
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

A compatibilidade da configuração e do modelo de uso Supabase/Vercel foi aprovada na Q-025 pela TI e pela FORD em 24/11/2026. A decisão libera a arquitetura adotada como referência operacional. A prontidão de cada release continua condicionada à implementação dos fluxos, testes, evidências e critérios de Go/No-Go definidos no plano de release; isso não reabre a Q-025 nem altera a stack da ADR-003.

## Justificativa

Isolamento e promoção controlada reduzem o risco de contaminação entre estágios e erros de operação. Os aceites das Issues #96 e #98, somados à aprovação expressa da TI e da FORD na Q-025, sustentam a decisão de compatibilidade e operação da stack adotada. As entregas de implementação, testes e homologação funcional seguem seus próprios critérios.

## Consequências

**Positivas:**
- Alinhamento com a restrição de infraestrutura da FORD.
- Separação explícita entre ambientes e credenciais.
- Promoção e rollback rastreáveis.
- Preservação dos registros de conclusão das Issues #96 e #98 e integração desses aceites à aprovação de compatibilidade registrada na Q-025.

**Negativas e cuidados:**
- TI mantém as responsabilidades operacionais por infraestrutura, pipeline de deploy, segredos, backups e recuperação.
- A implementação e os testes dos controles por ambiente permanecem nas issues correspondentes; sua execução não altera a aprovação arquitetural da Q-025.

## Riscos

Mistura de dados entre ambientes; vazamento de segredos; pipeline externo com acesso indevido; deploy para ambiente errado; preview conectado à produção; rollback incompatível com migrations; restauração não testada; domínio ou TLS incorreto; dependência de SaaS externo incompatível com a FORD v2.

## Evidências atuais

- Documento de auditoria da Issue #96: auditoria original, confirmação de Polyford como desenvolvimento e registro de encerramento por atestação do responsável/Tech Lead.
- [Issue #96 — encerramento](https://github.com/Aluvioz/Polychat/issues/96#issuecomment-6963142263): confirmação de conclusão das configurações e validações operacionais do escopo.
- Documento de auditoria da Issue #98: auditoria de 18/11 e aditivo de aceite do Tech Lead.
- [Issue #98 — aceite e encerramento](https://github.com/Aluvioz/Polychat/issues/98#issuecomment-7013655363): confirmação de deployment hospedado, smoke/rollback, produção, domínio/HTTPS e fluxos relacionados.
- Runbook de smoke test e rollback da Issue #98: procedimento e registro do ensaio, com os limites de detalhamento documental.
- Workflow de CI: testes, ESLint, TypeScript e build no GitHub Actions.
- Baseline POLY-REQ-001 v0.4: isolamento, disponibilidade, RPO/RTO, backup, manutenção e suporte.

As confirmações do Tech Lead nas Issues #96 e #98 e a aprovação da TI e da FORD na Q-025 constituem o aceite operacional e de compatibilidade do modelo Supabase + Vercel. A aprovação não equivale a execução de todos os testes funcionais, de segurança ou de recuperação descritos nas issues de implementação e operação.

## Implementação e evidências operacionais remanescentes

- Manter atualizados os registros administrativos de projetos, deployments e variáveis por ambiente, sem publicar valores secretos.
- Executar e registrar os testes de integração, regressão, segurança e recuperação previstos nas issues aplicáveis.
- Preservar os relatórios e logs originais dos smoke tests e ensaios de rollback das Issues #96 e #98.
- Atualizar a ADR se houver alteração efetiva na topologia ou no modelo de operação aprovado.

Não há pendência de aprovação ou compatibilidade na Q-025. As atividades acima são de manutenção operacional e implementação, não condições para reabrir a decisão arquitetural.

Os requisitos de isolamento, proteção de credenciais, gestão de chaves, metas de disponibilidade, backup, RPO/RTO e operação já alinhados com Desenvolvimento são premissas consolidadas; não devem ser reabertos como pendências de produto.
