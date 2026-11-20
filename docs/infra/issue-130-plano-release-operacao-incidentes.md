# Issue #130 — Plano de release, operação e gestão de incidentes

**Issue:** #130 — Preparar release, operação e plano de incidentes  
**Epic:** #87 — SQA, validação e release  
**Documento:** POLY-OPS-130  
**Versão:** 0.3 — 20/11/2026  
**Estado:** proposta operacional para revisão; não representa aprovação institucional nem comprova execução de procedimentos  
**Responsáveis pela validação:** Product Owner, Tech Lead, Desenvolvimento, SQA, TI/Operação e representantes designados da FORD. A TI da FORD é responsável operacional por segurança; não há uma área separada de Segurança da Informação como frente do projeto.

---

## 1. Objetivo

Estabelecer o processo mínimo para preparar, avaliar, autorizar, publicar, acompanhar e, quando necessário, reverter uma versão do Polychat. O documento também organiza a operação após a publicação, a resposta a incidentes, os procedimentos de recuperação, o suporte e as evidências necessárias para demonstrar prontidão operacional.

O plano atende ao objetivo da Issue #130: checklist de release, backups, monitoramento, incidentes, rollback e suporte. Ele conecta os resultados das atividades de requisitos, arquitetura, segurança, testes e homologação, sem substituir os respectivos documentos.

Este documento define **o que precisa ser verificado, quem participa, quais decisões devem ser registradas e quais evidências devem existir**. Os parâmetros de produto e operação já alinhados pela FORD v2 são referências obrigatórias; permanecem pendentes sua implementação operacional, procedimentos executáveis e evidências de teste.

## 2. Estado, limites e regras de interpretação

### 2.1 Legenda de situação

| Estado | Significado |
|---|---|
| Confirmado | Informação sustentada por requisito ou registro explícito do projeto. |
| Observado | Condição verificada em arquivo, execução ou integração consultada, limitada ao escopo da evidência. |
| Proposto | Recomendação operacional deste plano, ainda sujeita à revisão dos responsáveis. |
| Pendente | Parâmetro, configuração, evidência ou decisão ainda não apresentado. |
| Bloqueado | Critério que impede a liberação até que seja resolvido ou formalmente tratado pela autoridade competente. |
| Aprovado | Decisão registrada por pessoa ou instância com autoridade para o assunto. |

Uma recomendação deste documento não se transforma automaticamente em política corporativa. Não se deve marcar uma atividade como executada, aprovada ou testada sem evidência correspondente.

### 2.2 Princípios de release e operação

1. Segurança, integridade dos dados e proteção das pessoas prevalecem sobre conveniência ou velocidade de publicação, em alinhamento com a baseline do produto.
2. Nenhuma liberação deve depender apenas de build bem-sucedido ou de deployment marcado como Ready.
3. A decisão Go/No-Go deve considerar testes, riscos, privacidade, recuperação, suporte e capacidade de operação.
4. A publicação deve ser rastreável a uma versão, commit, Pull Request, conjunto de checks e decisão de release.
5. Acesso operacional deve seguir menor privilégio, com autenticação individual e trilha de auditoria apropriada.
6. Dados reais não devem ser copiados para desenvolvimento ou homologação sem autorização e salvaguardas específicas.
7. O rollback deve considerar aplicação, banco, migrations, dados, configurações e segredos; não é sinônimo de apenas voltar o deployment.
8. Incidentes devem ser registrados, tratados e encerrados com evidências e aprendizado, preservando dados e informações sensíveis.

### 2.3 Limites deste documento

Este plano não:
- configura Supabase, Vercel, GitHub Actions, monitoramento ou alertas;
- cria credenciais, secrets, usuários, ambientes ou regras de acesso;
- altera os valores de RPO, RTO, disponibilidade, retenção, manutenção ou suporte já definidos pela FORD;
- declara que backups/restaurações, rollback, smoke tests ou testes de incidente já foram executados;
- aprova a ADR-009 ou a ADR-010;
- substitui o plano de testes da Issue #126, o modelo de ameaças da Issue #125 ou a homologação da Issue #129;
- autoriza monitoramento de conteúdo, consulta administrativa de conversas ou tratamento de dados além do que for formalmente aprovado;
- constitui autorização para colocar o produto em produção.

## 3. Contexto e baseline operacional conhecida

### 3.1 Arquitetura e ambientes

A Issue #88 e a ADR-003 registram Supabase + Vercel como plataformas oficiais. A Issue #96 foi encerrada após aceite de seu escopo operacional de ambientes. A Issue #98 também foi encerrada após aceite do escopo de Preview/Production, smoke test e rollback.

Os encerramentos #96/#98 devem ser respeitados e reutilizados como evidência dos respectivos escopos. A Q-025 consolida somente detalhes objetivos de configuração/integração não cobertos por esses aceites; não reabre a escolha das plataformas nem repete criação/configuração de ambientes, smoke tests ou rollback.

A existência de um Preview Deployment ou de um projeto de desenvolvimento não comprova, isoladamente, segregação de dados, integração funcional completa, homologação ou prontidão de produção.

### 3.2 Estado do produto e da validação

A baseline vigente é POLY-REQ-001 v0.4. A implementação funcional do produto ainda não começou: o repositório contém estrutura inicial Next.js e artefatos isolados de scaffold (middleware, migration de perfil e testes com Supabase simulado), mas não há fluxos reais integrados de autenticação, conversas, grupos, anexos, alertas, console TI ou auditoria.

O workflow de CI executa testes automatizados, ESLint, verificação TypeScript e build. Esses checks são necessários, mas não demonstram por si só:
- integração real com Supabase hospedado;
- políticas RLS de domínio para conversas, participantes, mensagens, anexos e auditoria;
- funcionamento ponta a ponta dos fluxos de produto;
- restauração de backup ou cumprimento de RPO/RTO;
- eficácia do monitoramento e resposta a incidentes;
- homologação formal de negócio ou segurança.

A avaliação de release deve usar a evidência mais recente da versão candidata. Esta seção é contexto documental e não substitui uma nova inspeção técnica antes de cada publicação.

### 3.3 Documentos e decisões relacionados

| Referência | Conteúdo reutilizado | Limite |
|---|---|---|
| docs/09-baseline-requisitos-mvp.md | Escopo, requisitos, restrições e fotografia de implementação. | Não é homologação do produto. |
| docs/04-requisitos-nao-funcionais.md | RNF-009: disponibilidade, backup, retenção, RPO e RTO. | Valores definidos na FORD v2; execução e evidência operacional pendentes. |
| docs/08-glossario-e-questoes-em-aberto.md | Histórico das questões e Q-018/Q-019/Q-025 abertas. | Demais questões foram respondidas/alinhadas; Q-025 não reabre #96/#98. |
| docs/10-governanca-desenvolvimento.md | DoR/DoD, PR, revisão independente, CI e evidências. | Checks de CI não substituem testes funcionais e aceite. |
| docs/infra/issue-96-auditoria-ambientes.md | Auditoria histórica de ambientes e limites de verificação. | Deve ser lida junto com o comentário posterior de encerramento da Issue #96. |
| docs/adr/ADR-009-ambientes-deploy.md | Detalha ambientes/deploy das plataformas oficiais. | Status Proposed para revisão técnica; a seleção Supabase/Vercel é Accepted na ADR-003 e os aceites #96/#98 são preservados. |
| docs/adr/ADR-010-seguranca-auditoria-monitoramento.md | Detalha segurança, auditoria e monitoramento especificados na baseline. | Status Proposed para revisão técnica; TI é responsável operacional por segurança. |
| Issue #125 / PR #154 | Modelo de ameaças e mitigação. | Documento estava em PR Draft na consulta; não declarar integrado ou aprovado. |
| Issue #126 / PR #153 | Plano de testes e rastreabilidade. | Documento estava em PR Draft na consulta; acompanhar sua integração e revisão. |
| Issues #127, #128 e #129 | Automação, E2E, homologação, acessibilidade e regressão. | Evidências devem ser obtidas antes de Go. |

## 4. Ciclo de vida de uma release

A release deve passar pelas etapas abaixo. Uma etapa pode ser repetida quando houver correção, novo risco ou alteração material na versão candidata.

| Etapa | Atividades | Saída obrigatória |
|---|---|---|
| 1. Planejamento | Definir escopo, versão, janela proposta, responsáveis, riscos e dependências. | Registro de release iniciado. |
| 2. Preparação do candidato | Integrar mudanças por PR, revisar código, migrations, configuração e documentação. | Commit/tag candidato identificado e PRs aprovadas. |
| 3. Validação | Executar CI, testes relevantes, segurança, regressão, compatibilidade e smoke test em ambiente apropriado. | Relatório de testes e defeitos conhecidos. |
| 4. Prontidão operacional | Confirmar backup, restauração, monitoramento, suporte, runbooks, comunicação e rollback. | Checklist operacional preenchido. |
| 5. Go/No-Go | Avaliar critérios, riscos residuais, aprovações e bloqueios. | Decisão registrada, responsáveis e justificativa. |
| 6. Publicação | Executar procedimento aprovado, registrar horário, ator, versão e resultado. | Evidência do deployment e das mudanças aplicadas. |
| 7. Smoke test pós-release | Verificar os fluxos críticos e a observabilidade após publicação. | Resultado aprovado/reprovado por caso. |
| 8. Acompanhamento | Monitorar sinais de erro, incidentes, suporte e estabilidade durante período definido. | Registro do acompanhamento e incidentes. |
| 9. Encerramento | Consolidar resultados, pendências, riscos, métricas e lições aprendidas. | Registro final da release e ações de acompanhamento. |

O período de acompanhamento, a janela de publicação e os tempos de resposta devem ser definidos pelo responsável operacional e aprovados pelas áreas competentes antes da release. Este plano não fixa durações por suposição.

## 5. Critérios de Go/No-Go

### 5.1 Regra geral

**Go** somente quando todos os critérios obrigatórios estiverem demonstrados, os responsáveis necessários tiverem aprovado a sua parte e não houver bloqueio crítico ou alto sem tratamento formal compatível com a governança do projeto.

**No-Go** quando faltar evidência essencial, houver defeito impeditivo, risco não avaliado, ausência de recuperação comprovada, falha de segurança, dúvida relevante sobre dados ou autorização, ou indisponibilidade de responsável operacional.

Não se deve converter ausência de evidência em aprovação presumida.

### 5.2 Checklist de decisão

| ID | Critério | Evidência esperada | Responsável primário | Regra |
|---|---|---|---|---|
| GO-01 | Escopo da versão identificado e aprovado. | Release notes, issue(s), versão e commit. | PO + Tech Lead | Obrigatório |
| GO-02 | PRs revisadas e aprovadas por pessoa diferente do autor. | Reviews e checks no GitHub. | Tech Lead | Obrigatório |
| GO-03 | CI aprovado para o commit candidato. | Links dos workflow runs e status checks. | Desenvolvimento | Obrigatório |
| GO-04 | Testes unitários e de integração relevantes aprovados. | Relatório, casos, ambiente e resultado. | SQA + Desenvolvimento | Obrigatório |
| GO-05 | Fluxos E2E críticos aprovados. | Evidências da Issue #128 ou execução equivalente. | SQA | Obrigatório para fluxos implementados |
| GO-06 | Regressão e homologação concluídas. | Matriz de navegador/dispositivo, defeitos e aceite. | SQA + PO | Obrigatório |
| GO-07 | Riscos técnicos avaliados e controles críticos implementados/testados. | Modelo de ameaças, testes e revisão técnica com TI (responsável pela segurança na FORD) e SQA. | Tech Lead + TI + SQA | Obrigatório |
| GO-08 | Regras de monitoramento, consulta administrativa, auditoria e aviso no primeiro acesso implementadas conforme a baseline v0.4. | Evidências de RF-014 a RF-016 e RF-022/RF-023; não exigir nova deliberação de produto sobre Q-007 a Q-010. Obrigações legais aplicáveis permanecem válidas. | TI + Tech Lead + SQA | Obrigatório para funcionalidades relacionadas |
| GO-09 | Ambientes oficiais e variáveis da versão confirmados; nenhum segredo em código ou bundle cliente. | Reutilizar aceites #96/#98; complementar somente lacunas técnicas objetivas via Q-025, sem repetir configurações aceitas. | TI/Operação + Tech Lead | Obrigatório |
| GO-10 | Backups diários de banco e anexos, retenção de 12 meses e restauração demonstrados. | Registro de backup e teste compatível com RPO até 24h em desastre e RTO até 24h. | TI/Operação | Obrigatório antes de mudanças com risco aos dados |
| GO-11 | RPO/RTO e disponibilidade definidos e atendidos na evidência operacional. | Disponibilidade mensal 99%; RPO até 24h em desastre/falha de infraestrutura; RTO até 24h; evidência de teste/monitoramento. | TI/Operação + SQA | Obrigatório antes da produção |
| GO-12 | Plano de rollback viável para aplicação, configuração e banco. | Runbook revisado e evidência de ensaio quando aplicável. | Tech Lead + TI/Operação | Obrigatório |
| GO-13 | Monitoramento, alertas e acesso aos registros operacionais disponíveis. | Painéis/alertas testados e responsáveis de plantão identificados. | TI/Operação | Obrigatório |
| GO-14 | Runbooks, suporte e escalonamento disponíveis. | Procedimentos e contatos aprovados. | TI/Operação + SQA | Obrigatório |
| GO-15 | Comunicação e janela de release aprovadas. | Plano de comunicação e responsáveis. | PO + FORD | Obrigatório |
| GO-16 | Defeitos e riscos residuais registrados e tratados. | Lista de defeitos, severidade, plano e aceite formal quando cabível. | PO + Tech Lead + responsáveis pelo risco | Obrigatório |
| GO-17 | Público-alvo e perfis/dispositivos confirmados para o lançamento único. | 25 usuários finais do setor técnico, além de aproximadamente 2–3 administradores TI; Usuário em Android/iOS com Chrome/Safari móveis atuais; TI em computador com Chrome/Edge/Firefox atuais; tablets não permitidos. Não haverá grupo piloto. | PO + FORD + TI + SQA | Obrigatório |
| GO-18 | Jornadas críticas de cada perfil incluídas na release aceitas pelo PO. | Matriz requisito/critério/caso e evidências de execução dos fluxos Usuário-mobile e TI-desktop efetivamente incluídos. | PO + SQA + UX | Obrigatório para os fluxos incluídos |
| GO-19 | Funcionalidades anunciadas ou comprometidas no escopo estão disponíveis, ou limitações são explicitamente excluídas e comunicadas. | Release notes, matriz de escopo, defeitos conhecidos e decisão do PO. | PO + Tech Lead | Obrigatório |
| GO-20 | Aceite de produto registrado separadamente das aprovações técnica, de qualidade, segurança e operação. | Parecer do PO com versão/commit, escopo, critérios, defeitos conhecidos e ressalvas; aprovações de outros domínios em seus próprios registros. | PO | Obrigatório |
| GO-21 | Orientações de uso e canal de suporte compreensíveis aos usuários finais e administradores TI do lançamento único. | Mensagem de lançamento, instruções mínimas, limitações conhecidas, canal e responsável de suporte confirmados; suporte em horário comercial. | PO + UX + TI/Operação + FORD | Obrigatório |
| GO-22 | Homologação funcional, aceite escrito e Go/No-Go do gestor registrados antes do lançamento único. | Homologação conduzida por Fábio Silva Cerqueira com representantes TI; aceite formal por escrito; decisão Go/No-Go do gestor. Não há piloto nem expansão incremental. | PO + representante FORD + gestor + TI | Obrigatório |

### 5.3 Condições que exigem No-Go

São bloqueios, salvo avaliação e decisão formal de autoridade competente quando a natureza do risco permitir tratamento excepcional:
- falha em autenticação, autorização, isolamento de dados ou acesso indevido;
- exposição de segredo, credencial, mensagem ou dado pessoal;
- perda, corrupção ou migração inconsistente de dados;
- falha em fluxo crítico sem alternativa operacional segura;
- ausência de backup/restauração adequada para uma mudança destrutiva ou de alto risco;
- rollback inviável ou desconhecido para uma alteração com risco de indisponibilidade;
- alertas essenciais sem responsável capaz de receber e tratar a ocorrência;
- ausência de aprovações institucionais/legalmente necessárias;
- testes críticos não executados ou sem resultado confiável;
- defeito crítico ou alto sem correção, contenção ou aceite formal do risco pela autoridade competente.

O Product Owner pode recomendar No-Go e deve registrar a decisão de produto. O PO não pode, sozinho, aceitar riscos técnicos, de segurança, privacidade, infraestrutura ou legais que pertençam a outras autoridades.

### 5.4 Participação na decisão

A decisão deve registrar separadamente:
- **PO:** aderência ao escopo, valor, critérios de aceite, impacto aos usuários e comunicação de produto.
- **Tech Lead:** viabilidade técnica, arquitetura, qualidade da implementação e rollback.
- **SQA:** resultado dos testes, cobertura pertinente, defeitos e limites da homologação.
- **TI/Operação:** capacidade de operar, monitorar, recuperar e prestar suporte.
- **Segurança:** avaliação de controles, ameaças e incidentes de segurança.
- **FORD/negócio:** aceite institucional e autorização de disponibilização ao público definido.
- **Jurídico/Privacidade:** aprovações quando o tratamento de dados, monitoramento, retenção ou comunicação exigir análise dessas áreas.

A decisão final de publicação deve respeitar a governança de release que a FORD vier a aprovar. Até lá, não presumir que o PO ou o Tech Lead tenha autoridade exclusiva de Go.

### 5.5 Critérios específicos de aceite do produto

A aprovação do PO deve responder se **a versão candidata entrega o escopo prometido ao público definido**, com jornadas utilizáveis, limitações conhecidas e condições de adoção claras. Ela é necessária, mas não substitui as aprovações técnica, de SQA, Segurança, TI/Operação ou da autoridade institucional da FORD.

| Dimensão | Pergunta de aceite do PO | Evidência necessária | Regra de bloqueio |
|---|---|---|---|
| Público e rollout | Quem receberá acesso nesta versão? O escopo corresponde à população aprovada? | Lista/grupo de piloto ou critério de provisionamento, composição dos perfis e autorização do responsável da FORD. | Não liberar para público maior por inferência. O contexto do MVP é aproximadamente 25 pessoas do setor técnico; isso não autoriza automaticamente os cerca de 900 funcionários. A composição entre Usuário e TI deve estar confirmada. |
| Adequação por perfil | O perfil Usuário funciona no contexto móvel e o perfil TI no contexto desktop previsto? | Jornadas e matriz de dispositivos/navegadores homologados por perfil. | Não anunciar suporte a dispositivo/navegador não homologado; resolver ou limitar explicitamente Q-012 antes do aceite. |
| Jornadas essenciais | Cada fluxo declarado no escopo foi testado de ponta a ponta para o ator correto? | Rastreabilidade RF → CA → teste; evidências por perfil e por ambiente. | Fluxo crítico anunciado mas inoperante, com falha de autorização ou sem evidência confiável impede Go. |
| Escopo funcional | Release notes correspondem ao que realmente está implementado? | Lista de funcionalidades incluídas, excluídas, parcialmente entregues e dependências. | Não apresentar mock, tela estática, integração parcial ou proposta documental como funcionalidade entregue. |
| Qualidade percebida | Defeitos conhecidos afetam tarefa essencial, confiança ou integridade do trabalho? | Lista de defeitos com severidade, impacto ao usuário, workaround, responsável e prazo. | Defeito crítico/alto que comprometa segurança, dados ou jornada principal bloqueia; exceções exigem autoridade competente e aceite formal, nunca silêncio do PO. |
| Informação ao usuário | A pessoa sabe como acessar, usar, reportar problema e compreender limitações? | Instruções, comunicação, release notes e canal oficial de suporte aprovados. | Não liberar piloto sem orientação mínima e caminho de suporte funcional. |
| Resultado do piloto | Como será avaliado se a versão atende ao propósito e pode ser expandida? | Objetivos, indicadores, fonte, responsável, período de observação e critério de decisão aprovados. | Não ampliar público nem declarar sucesso sem análise e nova autorização. |

**Referência de escopo do MVP:** 25 usuários finais do setor técnico, além de aproximadamente 2–3 administradores TI; Usuário em Android/iOS com Chrome/Safari móveis atuais; TI em computador com Chrome/Edge/Firefox atuais; tablets não permitidos. Q-001 e Q-012 estão resolvidas.

**Aceite de produto por release:** registrar versão, commit, escopo e público, critérios funcionais atendidos, jornadas testadas, defeitos e limitações conhecidas, orientação ao usuário, riscos de produto e decisão (Aprovado, Reprovado ou Aprovado com ressalvas formalmente autorizadas). O PO não deve aprovar itens não demonstrados nem transformar aprovação de produto em autorização final de produção.

**Lançamento:** a FORD definiu lançamento único, sem grupo piloto, após homologação e aceite escrito. Não há rollout experimental ou expansão gradual no escopo aprovado.

## 6. Smoke test

### 6.1 Objetivo e regras

O smoke test é uma verificação curta e rastreável dos fluxos essenciais após o deployment. Não substitui testes unitários, integração, E2E, segurança, acessibilidade ou regressão.

Executar em ambiente autorizado, com contas e dados de teste. Não usar conversas reais, credenciais de funcionários ou anexos sensíveis como massa de teste. Não enviar conteúdo real a ferramentas externas para demonstrar funcionamento.

Somente executar casos correspondentes a funcionalidades efetivamente implementadas na versão candidata. Caso um fluxo não exista, registrar **Não aplicável — funcionalidade não entregue**, e tratar a ausência conforme o escopo e o Go/No-Go; não marcar como aprovado.

### 6.2 Catálogo inicial de smoke tests

| ID | Verificação | Resultado esperado | Evidência mínima |
|---|---|---|---|
| SMK-01 | Abrir aplicação e carregar recursos essenciais. | Página disponível sem erro impeditivo. | URL, horário, versão e captura sem dados pessoais. |
| SMK-02 | Login com conta Usuário ativa. | Acesso permitido ao perfil correto. | Identificador de teste mascarado e resultado. |
| SMK-03 | Login com conta TI ativa. | Acesso permitido apenas às funções TI previstas. | Identificador de teste mascarado e resultado. |
| SMK-04 | Conta inativa, sessão inválida ou expirada. | Acesso negado e fluxo de erro seguro. | Resultado e status observado, sem token. |
| SMK-05 | Usuário tenta acessar função exclusiva de TI. | Acesso negado no servidor, inclusive por chamada direta. | Request sanitizada e resposta. |
| SMK-06 | Enviar e receber mensagem individual. | Mensagem persistida e apresentada ao destinatário autorizado. | IDs técnicos não sensíveis e resultado. |
| SMK-07 | Enviar e receber mensagem em grupo. | Apenas membros autorizados visualizam e participam conforme regras aprovadas. | Grupo de teste e resultado. |
| SMK-08 | Abrir conversa e atualizar estado de leitura/entrega, quando implementado. | Estado coerente com o comportamento especificado. | Resultado observado. |
| SMK-09 | Enviar PDF/JPEG válido. | Arquivo permitido validado e disponibilizado somente a quem tem autorização. | Tipo/tamanho de arquivo de teste e resultado. |
| SMK-10 | Enviar formato ou conteúdo inválido. | Upload rejeitado sem expor storage ou detalhes internos. | Tipo de teste e resultado. |
| SMK-11 | Consultar evento de auditoria permitido. | Evento registrado conforme política aprovada, sem exposição indevida. | Registro sanitizado e referência de auditoria. |
| SMK-12 | Verificar alertas e monitoramento operacional. | Sinal de teste gera alerta para canal/responsável homologado. | Alerta sanitizado e confirmação do recebimento. |
| SMK-13 | Verificar health/observabilidade após deploy. | Métricas e logs mostram serviço operante; sem erro crítico novo. | Painel, intervalo observado e versão. |
| SMK-14 | Verificar suporte e escalonamento. | Responsável de suporte identificado e canal funcional. | Confirmação do canal de teste. |
| SMK-15 | Confirmar versão publicada. | Versão/commit publicado coincide com o aprovado. | URL, commit, horário e registro de deployment. |
| SMK-16 | Confirmar acesso restrito ao público piloto e aos perfis/dispositivos homologados. | Somente contas autorizadas do piloto acessam o produto no contexto aprovado; não há ampliação automática. | Critério do piloto, contas sintéticas por perfil e resultado de acesso permitido/negado. |

### 6.3 Registro de execução

Para cada caso, registrar:
- ID do caso;
- versão, commit e ambiente;
- data/hora e executor;
- pré-condições e conta de teste usada (mascarada);
- resultado: Aprovado, Reprovado, Bloqueado ou Não aplicável;
- evidência sanitizada;
- defeito relacionado, quando houver;
- responsável pela análise e reteste.

O smoke test pós-release deve ser aprovado antes de comunicar a liberação como operacionalmente concluída. Falha em caso crítico deve acionar o processo No-Go pós-release e avaliação de rollback.

## 7. Procedimento de publicação

### 7.1 Antes da publicação

1. Confirmar a versão, o escopo e o commit aprovados.
2. Verificar que todas as mudanças entram por PR, com revisão independente e checks exigidos aprovados.
3. Conferir migrations pendentes, ordem de aplicação, compatibilidade com a versão anterior e plano de recuperação.
4. Confirmar ambiente de destino, integração com Supabase e variáveis necessárias, sem copiar valores secretos para issue, PR ou documentação.
5. Confirmar backup e possibilidade de restauração quando a mudança puder afetar dados ou schema.
6. Confirmar janela, participantes, suporte, monitoramento e canal de comunicação.
7. Obter e registrar a decisão Go.

### 7.2 Durante a publicação

1. O operador autorizado inicia a publicação pelo fluxo aprovado.
2. Registra início, ator, ambiente, versão, commit e referência da PR.
3. Executa migrations somente pelo procedimento versionado e revisado.
4. Registra cada etapa, saída e desvio relevante, sem incluir segredos ou dados pessoais.
5. Interrompe a atividade diante de erro incompatível com o procedimento e aciona Tech Lead/TI.
6. Não executa alterações manuais improvisadas em produção sem registro, autorização e plano de recuperação.

### 7.3 Depois da publicação

1. Confirmar que o deployment corresponde à versão aprovada.
2. Executar os smoke tests aplicáveis.
3. Verificar logs, métricas e alertas no intervalo aprovado.
4. Confirmar os fluxos críticos e a ausência de erro impeditivo.
5. Atualizar o registro de release, inclusive defeitos, limitações, incidentes e decisão de continuidade.
6. Comunicar o resultado aos interessados.

### 7.4 Migrations e compatibilidade

Migrations devem estar versionadas, revisadas e associadas à release. Antes de aplicar:
- identificar tabelas, políticas, índices, funções e dados afetados;
- estimar impacto e tempo de execução com apoio técnico;
- avaliar compatibilidade entre versão anterior e posterior;
- verificar se a operação é reversível;
- definir se a recuperação será por migration corretiva, restore ou outro procedimento aprovado;
- garantir backup compatível e validação pós-migration.

Não presumir que toda migration possa ser revertida com segurança. Em alterações destrutivas ou incompatíveis, preferir plano explícito de expansão/migração/contração quando o Tech Lead considerar adequado. Nunca remover ou sobrescrever dados em produção para tentar recuperar uma publicação sem decisão e evidência.

## 8. Backup, restauração e continuidade

### 8.1 Escopo de proteção

O inventário final deve cobrir, conforme os componentes efetivamente adotados:
- dados de contas e perfis;
- conversas, mensagens, participantes e metadados;
- anexos e objetos de storage;
- alertas e registros de auditoria;
- configuração necessária para reconstrução do serviço, sem exportar segredos para cópias desprotegidas;
- migrations e artefatos versionados.

O backup do banco de dados não deve ser presumido como backup dos objetos de storage. A equipe deve demonstrar como cada classe de dado é protegida e recuperada.

### 8.2 Matriz de definição operacional

Os valores abaixo devem ser preenchidos e aprovados por TI/Operação, Tech Lead e responsáveis de negócio. Este documento deliberadamente não inventa frequências ou prazos.

| Item | Definição necessária | Responsável pela definição | Estado |
|---|---|---|---|
| Escopo de dados | Recursos de banco, storage, logs e configurações cobertos. | TI + Tech Lead | Pendente |
| Frequência | Backups diários de banco de dados e anexos. | TI/Operação | Requisito definido; execução/evidência pendente |
| Retenção | Backups retidos por 12 meses; dados excluídos expiram das cópias ao fim do ciclo. | TI/Operação | Requisito definido; implementação/evidência pendente |
| Criptografia | Proteção em trânsito e em repouso, chaves e rotação. | Segurança + TI | Pendente |
| Localização | Região, jurisdição e fornecedor da cópia. | TI + Segurança + Jurídico | Pendente |
| Acesso | Operadores autorizados, autenticação e trilha de auditoria. | TI + Segurança | Pendente |
| RPO | Até 24 horas em desastre/falha de infraestrutura; não se aplica à reconexão normal de mensagens confirmadas. | TI/Operação | Requisito definido; teste/evidência pendente |
| RTO | Até 24 horas. | TI/Operação | Requisito definido; teste/evidência pendente |
| Integridade | Verificação de consistência e detecção de cópia incompleta. | TI + Desenvolvimento | Pendente |
| Restauração | Procedimento e ambiente seguro para teste. | TI + Tech Lead | Pendente |
| Evidência | Resultado, data, executor, duração e divergências do teste. | TI + SQA | Pendente |

### 8.3 Teste de restauração

A existência de backup não prova que ele seja restaurável. Antes de Go para produção, deve existir evidência de teste de restauração adequada ao risco.

O teste deve:
1. ser autorizado por TI/Operação;
2. usar ambiente isolado e destino controlado;
3. preservar a origem e evitar sobrescrever produção;
4. registrar identificação da cópia, ponto de recuperação e classes de dados restauradas;
5. conferir integridade e consistência das informações;
6. verificar relacionamentos entre banco e objetos de storage;
7. medir o tempo observado e comparar com RTO;
8. verificar o ponto efetivo recuperado e comparar com RPO;
9. registrar falhas, diferenças, correções e reteste;
10. eliminar dados de teste de forma controlada, conforme a política aprovada.

### 8.4 Recuperação de desastre

TI/Operação, com Tech Lead e Segurança, deve manter procedimento para indisponibilidade de provedor, perda de região, comprometimento de credenciais privilegiadas, corrupção de dados e perda de objetos armazenados.

O procedimento deve indicar:
- quem declara o cenário de desastre;
- quem coordena a recuperação;
- como selecionar a cópia e o ponto de recuperação;
- como reconstruir infraestrutura e configuração;
- como validar integridade e autorização antes de reabrir o serviço;
- como comunicar a indisponibilidade e a recuperação;
- como documentar o impacto e as ações corretivas.

## 9. Rollback e recuperação de release

### 9.1 Gatilhos para avaliar rollback

Avaliar interrupção da release e rollback quando ocorrer:
- indisponibilidade relevante ou degradação que impeça fluxo crítico;
- falha de autenticação/autorização ou exposição indevida;
- corrupção, perda ou inconsistência de dados;
- migration com resultado incorreto;
- erro que impeça uso seguro;
- aumento de erros acima do limite operacional aprovado;
- alerta de segurança que exija contenção imediata.

Os limites quantitativos e o tempo de observação devem ser definidos pela operação antes da release. Não estão estabelecidos nesta versão.

### 9.2 Decisão e execução

1. Qualquer membro da equipe pode reportar um defeito ou risco.
2. O operador interrompe novas etapas da publicação quando houver condição insegura.
3. Tech Lead e TI/Operação avaliam impacto, reversibilidade e alternativas.
4. Segurança participa quando houver risco a dados, contas, infraestrutura ou confidencialidade.
5. A autoridade de release definida pela FORD decide continuidade, rollback ou contenção, com recomendação técnica registrada.
6. O operador executa o runbook aprovado e registra cada etapa.
7. SQA ou responsável designado valida os fluxos após a recuperação.
8. PO coordena comunicação de produto e atualização de impacto aos usuários.
9. A equipe abre/atualiza incidentes e issues para correção definitiva.

### 9.3 Tipos de reversão

| Camada | Tratamento esperado | Atenção |
|---|---|---|
| Aplicação Vercel | Retornar à versão estável previamente identificada, conforme recurso e procedimento homologados. | Confirmar compatibilidade com schema e dados atuais. |
| Configuração | Reaplicar configuração versionada e aprovada. | Não publicar secrets em logs ou PR. |
| Migration/schema | Usar estratégia de reversão ou migration corretiva revisada; restaurar backup somente quando decidido e seguro. | DDL ou mudança destrutiva pode não ser reversível sem perda. |
| Dados | Recuperar a partir de ponto e cópia aprovados. | Restore pode descartar operações posteriores; requer decisão de impacto. |
| Storage/anexos | Restaurar objetos e metadados correspondentes. | Validar referências e permissões após a restauração. |
| Credenciais comprometidas | Revogar/rotacionar credenciais e revisar acessos. | Não reutilizar credencial comprometida; preservar trilha de investigação. |

### 9.4 Pós-rollback

Registrar motivo, decisão, versão de origem e destino, horário, operadores, migrations, dados potencialmente afetados, testes, comunicação, resultado e ações corretivas. O rollback não encerra automaticamente o incidente nem dispensa análise de causa raiz.

## 10. Monitoramento e observabilidade

### 10.1 Sinais operacionais mínimos a avaliar

Os itens abaixo são recomendações para a equipe técnica validar e instrumentar de acordo com a arquitetura real:

| Domínio | Sinais a observar | Objetivo |
|---|---|---|
| Disponibilidade | Saúde do serviço, falhas de deployment e indisponibilidade. | Detectar interrupção. |
| Aplicação | Taxa de erros, exceções e latência por fluxo. | Identificar regressão e degradação. |
| Autenticação | Falhas anormais, sessões inválidas e erros do provedor. | Detectar falhas e possível abuso. |
| Autorização | Respostas negadas, tentativas de acesso indevido e falhas de policy. | Identificar problemas de permissão. |
| Banco | Conexões, erros, saturação, latência e falhas de migration. | Prevenir indisponibilidade e inconsistência. |
| Storage | Erros de upload/download, capacidade e falhas de autorização. | Proteger anexos e disponibilidade. |
| Mensageria | Falhas de envio, entrega, persistência e atualização. | Acompanhar o fluxo central do produto. |
| Backup | Execução, idade da última cópia, falhas e resultado de restauração. | Demonstrar capacidade de recuperação. |
| Segurança | Alertas, eventos privilegiados e padrões anormais. | Apoiar detecção e resposta. |

### 10.2 Logs e proteção de informações

Logs devem ser úteis para diagnóstico sem se tornarem nova fonte de exposição. Como princípio:
- não registrar senhas, tokens, chaves, cookies ou secrets;
- não registrar conteúdo integral de mensagens ou anexos sem decisão e justificativa formal;
- minimizar dados pessoais e mascarar identificadores sempre que possível;
- restringir acesso a logs e trilhas de auditoria;
- registrar operador, horário, recurso e resultado para ações administrativas quando exigido;
- proteger registros contra alteração e exclusão indevidas;
- definir retenção, descarte e acesso com Segurança e Jurídico/Privacidade;
- preservar evidências de incidentes com cadeia de custódia e controle de acesso apropriados.

A ADR-010 permanece Proposed e suas aprovações institucionais não são substituídas por esta seção.

### 10.3 Alertas e acionamento

Para cada alerta de operação ou segurança, definir:
- condição e limiar de disparo;
- severidade;
- canal de envio;
- equipe e responsável primário;
- responsável substituto;
- confirmação de recebimento;
- prazo de triagem e escalonamento;
- condição de encerramento;
- evidência e retenção.

O canal real, os limiares e os tempos de atendimento permanecem pendentes até aprovação de TI/Operação e das áreas de negócio.

## 11. Gestão de incidentes

### 11.1 Definição

Incidente é evento que compromete ou pode comprometer disponibilidade, integridade, confidencialidade, autenticação, autorização, dados, continuidade, experiência essencial ou obrigações institucionais do Polychat.

Defeito de software, falha de operação, evento de segurança e solicitação de suporte podem exigir fluxos distintos. A triagem deve classificar corretamente o evento e relacioná-lo a issue, problema ou mudança quando aplicável.

### 11.2 Classificação preliminar de severidade

A seguinte classificação é uma proposta inicial para revisão. Não define SLA nem substitui a classificação corporativa de incidentes da FORD.

| Severidade proposta | Exemplo | Tratamento esperado |
|---|---|---|
| SEV-1 — Crítica | Vazamento ou acesso indevido confirmado; perda/corrupção relevante de dados; serviço indisponível para todos; comprometimento de privilégio administrativo. | Acionamento imediato dos responsáveis designados, contenção prioritária e avaliação institucional/legal. |
| SEV-2 — Alta | Fluxo central indisponível para parte relevante dos usuários; falha grave de autorização; degradação severa; backup ou recuperação comprometidos. | Priorização alta, responsável nomeado e atualização frequente conforme processo aprovado. |
| SEV-3 — Moderada | Falha parcial com alternativa operacional segura; erro localizado sem evidência de exposição ou perda de dados. | Correção planejada, acompanhamento e comunicação proporcional. |
| SEV-4 — Baixa | Problema de baixo impacto, dúvida de uso ou defeito cosmético sem risco operacional relevante. | Tratamento pelo suporte/backlog regular. |

Se a avaliação identificar possível violação de dados pessoais, risco à segurança ou obrigação legal, escalar imediatamente para Segurança e Jurídico/Privacidade, independentemente da severidade operacional inicialmente atribuída.

### 11.3 Fluxo de resposta

1. **Detecção e registro:** registrar o que foi observado, quando, por quem, ambiente, versão e impacto inicial.
2. **Triagem:** classificar tipo, severidade, escopo, usuários afetados e risco a dados.
3. **Acionamento:** notificar responsáveis e substitutos pelos canais aprovados.
4. **Contenção:** limitar impacto, revogar acessos ou interromper funções quando necessário e autorizado.
5. **Preservação:** preservar logs, evidências técnicas e linha do tempo, sem alterar desnecessariamente a origem.
6. **Investigação:** identificar vetor, causa, recursos afetados e extensão do impacto.
7. **Erradicação e correção:** remover a causa, corrigir configuração/código ou aplicar controle temporário.
8. **Recuperação:** restaurar serviço ou dados por procedimento aprovado.
9. **Validação:** executar testes de segurança, integridade, autorização e smoke test aplicáveis.
10. **Comunicação:** atualizar públicos internos e usuários conforme orientação de negócio, Segurança e Jurídico/Privacidade.
11. **Encerramento:** registrar causa, impacto, evidência, decisão, ações corretivas e responsáveis.
12. **Lições aprendidas:** transformar ações em issues priorizadas, atualizar runbooks e revisar riscos.

Não apagar logs, reformar ambiente ou reiniciar componentes de forma que destrua evidências antes de avaliar a necessidade de preservação, salvo quando a contenção urgente exigir ação imediata. Nesse caso, registrar o que foi feito e por quê.

### 11.4 Comunicação durante incidentes

O plano de comunicação deve definir previamente:
- porta-voz autorizado;
- públicos internos e externos que podem ser comunicados;
- canal aprovado por público;
- conteúdo mínimo e frequência de atualização;
- processo de revisão por Segurança/Jurídico/Privacidade;
- procedimento para correção de informação incorreta;
- registro das comunicações enviadas.

Não divulgar causa, dado pessoal, conteúdo de mensagens, detalhes de vulnerabilidade ou informação de investigação antes de validação e autorização apropriadas. O PO organiza a comunicação do produto, mas não substitui o porta-voz institucional ou a autoridade de comunicação de incidentes.

### 11.5 Registro mínimo do incidente

| Campo | Conteúdo |
|---|---|
| ID | Identificador único do registro. |
| Detecção | Data/hora, origem e pessoa/sistema que detectou. |
| Ambiente/versão | Ambiente, deployment, commit e componentes envolvidos. |
| Classificação | Tipo, severidade e estado atual. |
| Impacto | Serviços, dados e públicos potencialmente afetados. |
| Linha do tempo | Eventos, decisões, ações e responsáveis com horários. |
| Evidências | Referências a logs/artefatos sanitizados e local protegido. |
| Contenção | Ações, autorização e resultado. |
| Recuperação | Procedimento, ponto restaurado e validação. |
| Comunicação | Públicos, canal, data/hora e aprovador. |
| Causa | Causa raiz ou hipótese ainda não confirmada, identificada como tal. |
| Ações corretivas | Tarefas, prioridade, responsável e prazo aprovado. |
| Encerramento | Responsável pela validação e justificativa de encerramento. |

## 12. Runbooks operacionais

Um runbook deve ser suficientemente claro para que um operador autorizado execute o procedimento sem depender de memória informal. Cada runbook precisa incluir objetivo, escopo, pré-requisitos, permissões, riscos, passos, validação, rollback/contingência, escalonamento, evidências e data de revisão.

### 12.1 Inventário mínimo

| ID | Runbook | Conteúdo mínimo | Dono primário proposto |
|---|---|---|---|
| RB-01 | Publicar nova versão | Pré-checks, aprovação, deployment, migrations, smoke test e comunicação. | TI/Operação + Tech Lead |
| RB-02 | Reverter release | Gatilhos, autoridade, versão estável, aplicação, banco, validação e registro. | Tech Lead + TI/Operação |
| RB-03 | Executar e verificar backup | Escopo, frequência aprovada, acesso, integridade, falhas e escalonamento. | TI/Operação |
| RB-04 | Restaurar dados/serviço | Seleção de cópia, destino, isolamento, validação, RPO/RTO e comunicação. | TI/Operação + Tech Lead |
| RB-05 | Responder a incidente de segurança | Acionamento, contenção, preservação, investigação, comunicação e encerramento. | Segurança |
| RB-06 | Tratar indisponibilidade/degradação | Triagem, dependências, status, mitigação, recuperação e monitoramento. | TI/Operação |
| RB-07 | Tratar falha de autenticação/autorização | Verificação do provedor, sessão, perfil, RLS, contenção e reteste. | Tech Lead + Segurança |
| RB-08 | Suporte e escalonamento | Receber solicitação, classificar, priorizar, encaminhar, atualizar e encerrar. | TI/Operação + SQA |

A tabela define o inventário esperado, não comprova que os runbooks foram escritos, aprovados ou ensaiados. Cada runbook deve ser publicado e revisado como evidência antes de Go.

### 12.2 Modelo mínimo para um runbook

~~~text
ID e nome:
Objetivo:
Escopo e sistemas:
Responsável primário / substituto:
Autoridade de aprovação:
Pré-requisitos e permissões:
Riscos e cuidados:
Passos numerados:
Critério de sucesso:
Verificações pós-execução:
Rollback ou contingência:
Condição de escalonamento:
Evidências a registrar:
Data da última execução:
Responsável pela revisão:
Próxima revisão:
~~~

## 13. Suporte e operação contínua

### 13.1 Modelo de suporte

O processo deve estabelecer um ponto de contato oficial para os usuários e uma rota de escalonamento técnico. O canal real e os horários devem ser aprovados pela FORD/TI.

O registro de suporte deve conter:
- identificador do chamado;
- solicitante ou referência protegida;
- data/hora e canal;
- descrição objetiva e impacto;
- ambiente, dispositivo e versão, quando pertinente;
- passos para reproduzir sem expor conteúdo sensível;
- prioridade/severidade;
- responsável atual;
- atualização de status e comunicação;
- solução, evidência e aceite do solicitante, quando aplicável.

Solicitações envolvendo conteúdo de conversa, anexos, dados pessoais ou acesso administrativo devem seguir as políticas institucionais aprovadas. O suporte não deve pedir senhas, tokens ou envio de dados sensíveis por canais não autorizados.

### 13.2 Matriz de responsabilidades

A matriz abaixo é uma proposta de divisão operacional. As pessoas, equipes, substitutos e autoridade final precisam ser formalmente confirmados.

| Atividade | PO | Tech Lead | Desenvolvimento | SQA | TI/Operação | Segurança | FORD/Negócio / Jurídico |
|---|---|---|---|---|---|---|---|
| Definir escopo e prioridade da release | Responsável | Consultado | Consultado | Consultado | Consultado | Consultado | Aprova conforme governança |
| Revisar arquitetura e risco técnico | Consultado | Responsável | Participa | Consultado | Participa | Participa | — |
| Implementar e corrigir | Acompanha | Orienta | Responsável | Verifica | Apoia | Apoia | — |
| Executar testes e homologação | Aceite de produto | Apoia | Corrige | Responsável | Apoia | Avalia segurança | Aceite institucional conforme fluxo |
| Operar deployment | Acompanha | Responsável técnico | Apoia | Valida | Responsável operacional | Consultado | Autoriza conforme política |
| Backup/restauração | Acompanha risco/impacto | Apoia | Apoia | Verifica evidência | Responsável | Avalia proteção | Define objetivos e aceita risco de negócio |
| Resposta a incidente de segurança | Comunicação de produto | Apoia tecnicamente | Corrige | Retesta | Contém/recupera conforme papel | Coordena segurança | Jurídico/Privacidade e negócio decidem comunicações aplicáveis |
| Suporte aos usuários | Acompanha impacto | Escala falhas técnicas | Corrige | Classifica defeitos | Responsável pelo canal operacional | Atua quando incidente de segurança | FORD define comunicação institucional |
| Decisão Go/No-Go | Recomenda/aceita produto | Aprova viabilidade técnica | Informa estado | Aprova evidência de qualidade | Aprova prontidão operacional | Aprova aspectos de segurança | Autoridade final conforme governança a formalizar |

Um mesmo indivíduo pode acumular funções em equipe pequena, mas não deve aprovar sozinho uma alteração que ele próprio implementou quando a governança exige revisão independente.

## 14. Métricas e revisão operacional

Antes da produção, TI/Operação e negócio devem selecionar indicadores e metas. Não há metas numéricas aprovadas nesta versão.

Indicadores a avaliar:
- disponibilidade observada;
- taxa de erros por fluxo;
- latência de operações críticas;
- taxa de sucesso de autenticação;
- falhas de autorização;
- falhas de envio/entrega;
- falhas de upload/download;
- idade e sucesso das últimas cópias de backup;
- resultado e duração do último teste de restauração;
- quantidade e severidade de incidentes;
- tempo de detecção, triagem, contenção e recuperação;
- volume e idade de chamados pendentes;
- defeitos reabertos após release.

Cada indicador precisa de definição, fonte, frequência de revisão, responsável, meta e procedimento quando sair do limite. Não usar um indicador isolado para declarar segurança ou disponibilidade.

## 15. Evidências e rastreabilidade

Cada release deve manter um conjunto identificável de evidências, vinculado à versão e ao commit:

1. escopo e release notes;
2. PRs, reviews e checks do CI;
3. relatório de testes unitários, integração, segurança, E2E e regressão aplicáveis;
4. relatório de homologação e defeitos conhecidos;
5. checklist Go/No-Go e aprovações;
6. registro de backup e teste de restauração aplicável;
7. runbooks aprovados e evidência de ensaio;
8. deployment e migrations executados;
9. resultado dos smoke tests;
10. monitoramento pós-release;
11. incidentes, chamados e ações corretivas;
12. comunicação de publicação e encerramento.

Armazenar evidências em local corporativo autorizado, com controle de acesso e retenção aprovados. PRs e issues podem apontar para evidências, mas não devem conter secrets, tokens, dados reais de funcionários ou conteúdo de conversa. Capturas devem ser sanitizadas.

## 16. Modelos de registro

### 16.1 Registro de release

| Campo | Preenchimento |
|---|---|
| Release / versão | A preencher |
| Ambiente de destino | A preencher |
| Commit / tag | A preencher |
| Pull Requests incluídas | A preencher |
| Escopo e issues | A preencher |
| Responsável pela publicação | A preencher |
| Janela aprovada | A preencher |
| Plano de comunicação | A preencher |
| Runbooks aplicáveis | A preencher |
| Riscos conhecidos | A preencher |
| Evidências | Links para registros sanitizados |

### 16.2 Registro Go/No-Go

~~~text
Release / versão:
Ambiente:
Commit / tag:
Data da decisão:
Participantes e papéis:
Resultado: GO / NO-GO / ADIADO
Critérios obrigatórios atendidos:
Critérios pendentes:
Defeitos conhecidos e severidade:
Riscos residuais:
Aprovações por domínio:
Justificativa:
Plano de contingência:
Responsável pela decisão final:
Referências das evidências:
~~~

### 16.3 Registro pós-release

~~~text
Release / versão:
Ambiente:
Commit publicado:
Data/hora de início e término:
Operador:
Resultado do deployment:
Migrations aplicadas:
Smoke tests aprovados/reprovados/bloqueados:
Alertas e métricas observados:
Incidentes/chamados relacionados:
Rollback executado? Motivo e resultado:
Comunicação enviada:
Pendências e ações:
Responsáveis e referências:
Decisão de encerramento:
~~~

### 16.4 Registro de revisão de incidente

~~~text
ID do incidente:
Resumo e severidade:
Impacto confirmado / ainda em investigação:
Linha do tempo:
Causa raiz / hipóteses:
Contenção e recuperação:
Impacto em dados:
Comunicações e aprovações:
O que funcionou:
O que falhou:
Ações preventivas/corretivas:
Responsável e issue de acompanhamento:
Aprovação de encerramento:
~~~

## 17. Decisões pendentes para tornar o plano executável

| ID | Decisão/definição | Responsável sugerido | Bloqueia |
|---|---|---|---|
| OPS-01 | Autoridade final e participantes obrigatórios do Go/No-Go. | FORD + PO + Tech Lead | Aprovação da release |
| OPS-02 | Janelas de publicação, manutenção e período de acompanhamento. | FORD + TI/Operação | Agendamento da release |
| OPS-03 | Ambientes, responsáveis, acessos e variáveis por estágio. | TI + Segurança | Publicação segura |
| OPS-04 | Evidenciar backups diários de banco/anexos, retenção de 12 meses e região/configuração dos backups. | TI/Operação | Continuidade; requisito definido, evidência pendente |
| OPS-05 | Medir e comprovar 99% disponibilidade, RPO 24h em desastre e RTO 24h. | TI/Operação | Aceite operacional; metas já definidas |
| OPS-06 | Procedimento e periodicidade de teste de restauração. | TI + Tech Lead + SQA | Produção |
| OPS-07 | Procedimento de rollback para app, migrations, banco e storage. | Tech Lead + TI | Produção |
| OPS-08 | Ferramentas, métricas, limiares e destinatários de alertas. | TI/Operação + Segurança | Monitoramento |
| OPS-09 | Fluxo/canais e escalonamento de incidentes operacionais. Não confundir com alertas de conteúdo suspeito: severidades/prazos desses alertas já estão definidos em RN-013. | TI/Operação | Operação e suporte; alertas de conteúdo já especificados |
| OPS-10 | Contatos primários, substitutos e cobertura de suporte. | TI + FORD | Operação |
| OPS-11 | Contatos, comunicação e encaminhamento de incidentes conforme governança interna da FORD. A FORD trata solicitações legais; Jurídico não é frente de trabalho do projeto, sem afastar obrigações legais aplicáveis. | FORD + TI | Incidentes com impacto institucional |
| OPS-12 | Implementar acesso exclusivo TI e retenção/descarte de logs conforme baseline v0.4, com eventos auditáveis. | TI/Operação + Desenvolvimento | Monitoramento e investigação; requisito definido, implementação pendente |
| OPS-13 | Revisar controles e riscos residuais técnicos com TI (responsável operacional por segurança) e Tech Lead; não reabrir riscos já avaliados do modelo de poderes TI. | TI + Tech Lead + SQA | Go/No-Go |
| OPS-14 | Instrumentar/evidenciar metas de desempenho alinhadas, considerando até 25 conexões simultâneas de usuários finais além de TI. | Desenvolvimento + TI | Aceite de desempenho; meta definida, medição pendente |

OPS-03/Q-025 consolida evidências específicas da stack oficial, sem reabrir os aceites #96/#98. OPS-04 a OPS-08 tratam de execução/evidência de continuidade, deploy e rollback. OPS-09 trata de incidentes operacionais, não da severidade dos alertas de conteúdo já definida em RN-013. Q-007 a Q-017 estão resolvidas.

## 18. Dependências e critérios de aceite da Issue #130

### 18.1 Dependências

- **Issue #125:** modelo de ameaças e mitigação; necessário para priorizar riscos e validar controles.
- **Issue #126:** plano de testes e rastreabilidade; necessário para identificar evidências de qualidade.
- **Issue #127:** automação unitária e integração Supabase/RLS; necessário para evidenciar regras e isolamento.
- **Issue #128:** automação E2E; necessário para validar fluxos críticos.
- **Issue #129:** homologação, acessibilidade e regressão; necessário para aceite de qualidade e produto.
- **Issue #96:** auditoria de ambientes; reutilizar a auditoria e o registro de encerramento, sem presumir detalhes não presentes.
- **ADR-009 e ADR-010:** permanecem Proposed para revisão técnica específica. ADR-003 Accepted confirma Supabase/Vercel; requisitos de segurança, monitoramento, retenção e alertas estão definidos na baseline v0.4.

Uma dependência não precisa estar encerrada para que este plano seja documentado, mas não se pode declarar a release pronta enquanto faltarem evidências ou aprovações obrigatórias.

### 18.2 Mapeamento dos critérios originais

| Critério de aceite da Issue #130 | Como este documento contribui | Evidência adicional para concluir |
|---|---|---|
| Go/no-go documentado; smoke test; responsáveis e runbooks definidos. | Seções 5, 6, 11, 12, 13 e 16 definem critérios, catálogo e modelos. | Aprovações de governança, nomes/canais, runbooks específicos revisados e ensaiados e registro de Go/No-Go de uma release real. |
| Testes relevantes automatizados ou evidência documentada. | Seção 6 define smoke tests e seção 15 define evidências. | Resultados reais dos testes relevantes, associados à versão candidata, ambientes e executores. |
| Revisão por PR concluída. | Documento será submetido por PR e exige revisão independente. | Review aprovada e checks exigidos concluídos. |
| Sem regressão nos fluxos relacionados. | Seções 5, 6 e 15 exigem regressão e evidência. | Relatórios de regressão/homologação sem defeitos impeditivos na versão candidata. |

### 18.3 Definition of Done específica para a #130

A issue só deve ser considerada concluída quando:
- este plano for revisado e integrado à main;
- os responsáveis e substitutos operacionais forem confirmados;
- os runbooks aplicáveis existirem, forem revisados e tiverem evidência de ensaio;
- critérios e autoridade de Go/No-Go estiverem aprovados;
- parâmetros de continuidade aplicáveis — inclusive RPO/RTO — estiverem definidos;
- backup e restauração tiverem evidência compatível com o risco;
- rollback de aplicação, banco e storage tiver procedimento revisado e ensaio adequado;
- monitoramento, alertas, canais de suporte e escalonamento estiverem operacionais e testados;
- smoke tests, testes relevantes e regressão tiverem evidências reais na versão candidata;
- revisão da PR, checks e ausência de regressão impeditiva estiverem comprovadas;
- o aceite de produto da versão e do público-alvo estiver registrado separadamente dos aceites técnico, SQA, Segurança e operação;
- as jornadas incluídas por perfil, limitações conhecidas e comunicação de lançamento estiverem evidenciadas;
- homologação funcional com aceite escrito e Go/No-Go do gestor estiverem registrados para o lançamento único, sem piloto;
- decisões e riscos pendentes estiverem resolvidos ou formalmente replanejados pela autoridade competente.

Não marcar todos os critérios como concluídos apenas pela criação deste documento.

## 19. Parecer do Product Owner

O plano organiza os elementos necessários para transformar uma entrega em release controlada e suportável. A versão 0.3 reconcilia o plano com a FORD v2: lançamento único sem piloto, público/dispositivos definidos, parâmetros de continuidade, responsabilidades de TI e distinção entre requisitos definidos e evidências operacionais ainda não executadas.

**Validação do PO (19/11/2026):** aprovo os critérios de release do produto descritos nas seções 5.2, 5.4 e 5.5 como baseline de avaliação de cada versão candidata. O aceite do PO deve ser registrado por release e não pode ser inferido de CI verde, deployment Ready, aceite técnico ou aprovação de uma PR documental.

A aprovação do PO cobre aderência ao escopo, critérios funcionais, valor e impacto aos usuários, público autorizado e comunicação. Não aprova arquitetura, segurança, privacidade, infraestrutura, recuperação, RPO/RTO, testes técnicos ou autoridade institucional final de publicação.

**Limites atuais:** a implementação funcional do Polychat ainda não começou. A estrutura Next.js, o middleware isolado, a migration de perfis e os testes simulados são scaffold, não funcionalidades entregues. O catálogo de smoke tests será executado somente quando os fluxos reais estiverem implementados; não marcar como aprovados casos apenas especificados ou sem aplicação.

**Status recomendado da Issue #130:** validação dos critérios de produto concluída; entrega documental e operacional ainda parcial. Manter a issue aberta até as revisões, decisões de governança, runbooks, backup/restore, rollback, monitoramento, suporte, testes e evidências de uma release real.

---

## Histórico de versões

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 19/11/2026 | Primeira proposta do plano de release, operação, backup/recuperação, rollback, monitoramento, incidentes, suporte e evidências. |
| 0.2 | 19/11/2026 | Registra validação do PO dos critérios de release por versão; acrescenta gates de público, jornadas, escopo, comunicação e acompanhamento. |
| 0.3 | 20/11/2026 | Corrige parâmetros para FORD v2, remove piloto de lançamento, reconhece Supabase/Vercel oficiais, atualiza RPO/RTO/99%/backups e explicita que a implementação funcional ainda não começou. |
