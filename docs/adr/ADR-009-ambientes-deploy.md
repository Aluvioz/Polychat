# ADR-009 — Ambientes, configuração, deploy e rollback

- **Status:** Accepted — escopo delimitado
- **Data de revisão:** 26/11/2026
- **Issue de origem:** #89
- **Issues operacionais relacionadas:** #96, #98 e #130
- **Baseline:** POLY-REQ-001 v0.5

## Escopo do aceite

Esta ADR está Accepted no escopo da compatibilidade e do modelo de utilização Supabase + Vercel aprovados na Q-025, bem como das decisões e responsabilidades de ambientes, configuração, deploy e rollback aqui registradas. O status não significa homologação integral do produto, execução comprovada de backup/restore, continuidade operacional concluída ou autorização de lançamento.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, dentro dos limites e responsabilidades registrados. A decisão inclui o uso de Storage. A Q-025 não substitui os critérios de execução e evidência operacional da Issue #130.

## Contexto

A baseline FORD v2 exige governança, segregação de ambientes, controle de acesso, gestão de segredos, disponibilidade, recuperação e operação dos componentes que tratam dados da organização. O modelo de uso dos provedores Supabase e Vercel foi submetido à Q-025 e aprovado pela TI/FORD dentro dos limites e responsabilidades registrados.

As Issues #96 e #98 foram encerradas como concluídas, com confirmações expressas dos responsáveis/Tech Lead sobre a configuração e as validações operacionais abrangidas pelos respectivos escopos:

- **Issue #96 — Configurar ambientes Supabase e Vercel:** encerrada em 17/11/2026. O responsável/Tech Lead confirmou a conclusão das configurações e validações operacionais dos ambientes descritas na issue. O registro de auditoria identificou Polyford como projeto Supabase de desenvolvimento e observou Preview Vercel Ready; o comentário de encerramento atesta a conclusão do escopo, sem apresentar inventário administrativo granular de todos os ambientes.
- **Issue #98 — Estabelecer deploy preview, produção e rollback:** encerrada em 19/11/2026. O Tech Lead confirmou que foram executados a validação do deployment hospedado, os ensaios de rollback, as verificações de produção/domínio/HTTPS e a revisão dos fluxos relacionados. O comentário registra o aceite e a conclusão da issue, mas ressalva que não constitui nova auditoria administrativa independente e que as evidências detalhadas devem permanecer acessíveis e atualizadas.

Os encerramentos das Issues #96 e #98 permanecem válidos para seus escopos originais. Não devem ser repetidos nem extrapolados como homologação integral do produto, prova de operação contínua, execução de backups/restauração ou autorização de release.

O workflow de CI executa testes, ESLint, TypeScript e build em pushes para main e Pull Requests para main. A existência do workflow não comprova, por si só, proteção administrativa da branch, required checks ou homologação de produção.

## Problema

Estabelecer ambientes segregados, gestão de segredos, promoção segura, evidência de smoke tests e rollback, com responsabilidades operacionais claras e distinção entre decisão arquitetural aprovada, escopos operacionais aceitos e evidências de continuidade ainda pendentes.

## Alternativas consideradas

1. **Supabase + Vercel:** stack adotada pela ADR-003 e cujo modelo de utilização/compatibilidade foi aprovado pela TI/FORD na Q-025, dentro dos limites e responsabilidades registrados.
2. **Serviço adicional de hospedagem, armazenamento ou pipeline com acesso a dados da FORD:** não está automaticamente autorizado; depende de avaliação e aprovação próprias.
3. **Ambiente único compartilhado:** não atende ao requisito de isolamento entre desenvolvimento, homologação e produção.
4. **CI de código sem acesso a dados corporativos:** pode ser utilizado para testes e validações de código, desde que não receba dados da FORD, segredos operacionais ou acesso capaz de processá-los.

## Decisão

### Registro formal da aprovação da Q-025

**Aprovadores:** TI e representante da FORD.  
**Data:** 24/11/2026.  
**Referência:** Q-025 — Compatibilidade da stack Supabase + Vercel.  
**Resultado:** compatibilidade e modelo de utilização dos provedores nomeados, incluindo Supabase para backend e Vercel para hospedagem/deploy, aprovados dentro dos limites e responsabilidades registrados.

A aprovação confirma a direção de stack, o modelo de ambientes e as responsabilidades delimitadas. Não declara homologação funcional integral, execução comprovada de backup/restauração, continuidade operacional concluída ou autorização de lançamento.

Manter ambientes separados de **desenvolvimento, homologação/Preview e produção**, utilizando Supabase para backend e Vercel para hospedagem/deploy, conforme a ADR-003 e o modelo de utilização aprovado na Q-025.

O aceite da ADR cobre a decisão e os limites de uso dos provedores, as responsabilidades e a direção de segregação, configuração, deploy e rollback descritas neste documento. As evidências de execução por ambiente e os controles operacionais previstos na Issue #130 devem ser mantidos e atualizados. Esta ADR não reabre a seleção da stack nem exige repetir os escopos já aceitos das Issues #96 e #98.

### Isolamento e dados

- Cada ambiente deve possuir recursos, configurações, credenciais, permissões e armazenamento isolados.
- Desenvolvimento e homologação devem utilizar dados sintéticos ou minimizados; dados reais somente podem ser utilizados conforme autorização e controles da FORD.
- O uso de Supabase e Vercel deve respeitar o modelo, limites e responsabilidades aprovados na Q-025.
- Preview de Pull Request deve ocorrer em ambiente controlado e isolado, sem conexão com dados ou segredos de produção.
- O ambiente de produção deve ser protegido contra acesso de desenvolvimento e homologação.

### Segredos e configuração

- Segredos privilegiados permanecem em mecanismo de gestão controlado pela FORD, somente no servidor ou ambiente operacional autorizado.
- Não registrar segredos em Git, bundle de cliente, logs, tickets, documentação ou variáveis públicas NEXT_PUBLIC_.
- As credenciais devem possuir escopo mínimo por ambiente; não reutilizar credenciais de produção em desenvolvimento ou homologação.
- O inventário documental pode registrar nomes, finalidade e escopo de variáveis, nunca seus valores secretos.
- Proteção de credenciais e gestão de chaves seguem os requisitos técnicos já alinhados com Desenvolvimento e as responsabilidades registradas na Q-025.

### CI, deploy e promoção

- O CI pode executar testes, lint, verificação de tipos e build sobre código sem dados da FORD.
- O deploy deve ocorrer na Vercel, dentro do modelo de utilização aprovado, com segredos, permissões e escopos de ambiente administrados de forma controlada pela FORD.
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
- Os testes de restore e a compatibilidade das versões de aplicação e schema devem ser evidenciados na infraestrutura aprovada.

### Registro das Issues #96 e #98

O encerramento das Issues #96 e #98 permanece válido para seus escopos originais, com base nas confirmações registradas pelos responsáveis. A existência histórica de ambientes e deployments Supabase/Vercel, inclusive a confirmação de smoke tests e rollback no contexto da #98, deve ser preservada como evidência de execução anterior.

Esses aceites não devem ser reabertos ou repetidos sem alteração técnica relevante ou lacuna concreta. Também não devem ser apresentados como prova de homologação funcional integral, operação contínua, backup/restauração ou release autorizada.

### Relação com a Issue #130

A Issue #130 acompanha as entregas operacionais ainda não comprovadas: runbooks, backup diário de banco e anexos com retenção de 12 meses, teste de restauração, disponibilidade, RPO/RTO, monitoramento, incidentes, ensaios e evidências de release. A conclusão da Q-025 resolve a avaliação de compatibilidade e do modelo de utilização dos provedores; não fecha esses critérios operacionais.

## Justificativa

A stack Supabase + Vercel permanece vigente por decisão da ADR-003 e teve sua compatibilidade/modelo de utilização aprovado na Q-025. Os aceites das Issues #96 e #98 comprovam os escopos operacionais registrados e devem ser preservados. A distinção entre esses aceites, a aprovação arquitetural e as evidências de continuidade evita tanto reabrir trabalho já concluído quanto declarar uma prontidão de produção que ainda depende das entregas da Issue #130.

## Consequências

**Positivas:**
- Registro explícito da aprovação de compatibilidade e do modelo de utilização Supabase + Vercel na Q-025.
- Preservação dos encerramentos das Issues #96 e #98 sem extrapolação.
- Separação entre aceite arquitetural/operacional delimitado e homologação integral do produto.
- Ambientes, promoção e rollback mantidos sob regras documentadas e rastreáveis.

**Negativas e cuidados:**
- A FORD/equipe ainda precisa executar e evidenciar backup/restore, continuidade, runbooks, monitoramento, incidentes, ensaios e preparação de release conforme a Issue #130.
- Alterações relevantes de configuração exigem evidências e validação apropriadas, sem repetir automaticamente os escopos já aceitos.
- A configuração de branch protection e required checks não pode ser presumida com base apenas na existência do workflow de CI.

## Riscos

Mistura de dados entre ambientes; vazamento de segredos; pipeline ou serviço adicional com acesso indevido; deploy para ambiente errado; Preview conectado à produção; rollback incompatível com migrations; restauração não testada; domínio ou TLS incorreto; descumprimento dos limites e responsabilidades aprovados na Q-025.

## Evidências atuais

- **ADR-003:** Accepted; Supabase + Vercel é a stack adotada e obrigatória.
- **Q-025:** concluída em 24/11/2026, com aprovação de TI/FORD para compatibilidade e modelo de utilização dos provedores nomeados, inclusive Storage, dentro dos limites e responsabilidades registrados.
- **Issue #96 — encerramento:** confirmação de conclusão das configurações e validações operacionais do escopo em 17/11/2026.
- **Issue #98 — aceite e encerramento:** confirmação de deployment hospedado, smoke/rollback, produção, domínio/HTTPS e fluxos relacionados em 19/11/2026.
- **Issue #130:** registra expressamente a conclusão da Q-025 e delimita as entregas de continuidade, operação e release que permanecem pendentes.
- **Workflow de CI:** testes, ESLint, TypeScript e build no GitHub Actions; sua existência não comprova proteção administrativa da branch nem homologação de produção.

As confirmações do Tech Lead são evidência de aceite operacional para os escopos das Issues #96 e #98. A aprovação da Q-025 é evidência da decisão sobre compatibilidade e modelo de utilização dos provedores. Nenhuma dessas evidências, isolada ou em conjunto, comprova por si só execução de backup/restore, continuidade operacional, homologação funcional integral ou autorização de lançamento.

## Acompanhamento operacional remanescente

- Manter a Issue #130 aberta até que os runbooks, backups/restauração, parâmetros de continuidade, monitoramento, incidentes, ensaios e critérios de release tenham evidências verificáveis e aprovações requeridas.
- Não reabrir nem repetir configuração de ambientes, smoke test, deploy ou ensaio de rollback já aceitos nas Issues #96 e #98, salvo alteração técnica relevante ou lacuna concreta documentada.
- Registrar eventuais mudanças de configuração, escopo ou responsabilidades por meio do processo de governança e atualização documental pertinente.

**Regra de interpretação:** o status Accepted desta ADR é limitado à decisão e ao modelo de utilização nela descritos. Não equivale a produto pronto, homologação funcional, evidência de continuidade ou autorização de release.
