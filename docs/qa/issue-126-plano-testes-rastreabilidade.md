# Issue #126 — Plano de testes e rastreabilidade requisito–caso

**Projeto:** Polychat — aplicação de comunicação interna da FORD  
**Issue:** [#126 — Definir plano de testes e rastreabilidade requisito-caso](https://github.com/Aluvioz/Polychat/issues/126)  
**Versão:** 0.6 — 26/11/2026  
**Status:** proposta de QA/PO para revisão; não representa homologação nem execução de testes  
**Responsáveis pela validação:** SQA, desenvolvimento, liderança técnica e PO, conforme o tipo de teste

---

## 1. Objetivo

Estabelecer uma estratégia verificável para relacionar requisitos funcionais e não funcionais aos critérios de aceitação, casos de teste, níveis de teste e evidências do Polychat.

A rastreabilidade deve permitir responder, para cada requisito:

1. Qual comportamento ou atributo precisa ser validado?
2. Qual critério de aceitação define o resultado esperado?
3. Qual caso de teste verifica esse critério?
4. Em qual nível o teste será executado?
5. Qual evidência comprova o resultado?
6. Há alguma decisão, implementação ou dependência que impeça a execução?

Este documento complementa, sem substituir, os documentos de requisitos e a matriz de autorização já existentes.

## 2. Referências e fontes de verdade

| Artefato | Uso neste plano |
|---|---|
| [03 — Requisitos funcionais](../03-requisitos-funcionais.md) | Fonte dos RF-001 a RF-023 e dos critérios CA-xxx.n |
| [04 — Requisitos não funcionais](../04-requisitos-nao-funcionais.md) | Fonte dos RNF-001 a RNF-013 e respectivos métodos de verificação |
| [07 — Rastreabilidade e critérios de aceitação](../07-rastreabilidade-e-criterios-de-aceitacao.md) | Relação existente entre objetivos, RFs, RNFs e critérios |
| [08 — Glossário e questões em aberto](../08-glossario-e-questoes-em-aberto.md) | Q-018 resolvida; Q-019 parcialmente aberta apenas para obtenção dos ativos oficiais de marca; Q-025 concluída em 24/11/2026 com aprovação da compatibilidade/modelo de utilização Supabase + Vercel pela TI e pela FORD. A aprovação não substitui evidências de implementação, integração ou homologação |
| [09 — Baseline consolidada do MVP](https://github.com/Aluvioz/Polychat/blob/main/docs/09-baseline-requisitos-mvp.md) | Baseline POLY-REQ-001 v0.5: escopo, RF-001 a RF-023, RNF-001 a RNF-013 e decisões vigentes |
| [Matriz de autorização — Issue #100](../issue-100-matriz-autorizacao.md) | Regras de autorização e cenários AUTH-01 a AUTH-20; preserva Supabase + Vercel como referência de implementação |
| [ADR-003 — Supabase + Vercel](https://github.com/Aluvioz/Polychat/blob/main/docs/adr/ADR-003-supabase-vercel.md) | Decisão Accepted: stack vigente e obrigatória. A Q-025 foi concluída em 24/11/2026 e aprovou a compatibilidade/modelo de utilização dos provedores nomeados; isso não equivale à homologação integral dos fluxos ou ambientes |
| [ADR-005 — Banco de dados e modelo de dados](https://github.com/Aluvioz/Polychat/blob/main/docs/adr/ADR-005-dados-postgresql.md) | Status Proposed: PostgreSQL via Supabase Database no contexto da stack adotada. A decisão técnica específica da ADR-005 e suas evidências de integração, operação e continuidade permanecem sujeitas à revisão própria; isso não reabre a Q-025 concluída |
| [Issue #101](https://github.com/Aluvioz/Polychat/issues/101) | Implementação e validação de RLS de domínio |
| [Issue #110](https://github.com/Aluvioz/Polychat/issues/110) | Histórico paginado, sincronização Realtime, reconexão e deduplicação |
| [Issue #111](https://github.com/Aluvioz/Polychat/issues/111) | Última mensagem, indicador de não lidas e marcação de leitura |
| [Issue #113](https://github.com/Aluvioz/Polychat/issues/113) | Remoção de participantes e revogação de acesso |
| [Issue #116](https://github.com/Aluvioz/Polychat/issues/116) | Validade de links temporários e autorização de download |
| [Issue #119](https://github.com/Aluvioz/Polychat/issues/119) | Redefinição e recuperação de credenciais |
| [Issue #123](https://github.com/Aluvioz/Polychat/issues/123) | Fila de alertas, estados e fluxo de revisão |
| [Issue #124](https://github.com/Aluvioz/Polychat/issues/124) | Auditoria de ações privilegiadas |
| [Issue #125](https://github.com/Aluvioz/Polychat/issues/125) | Modelo de ameaças e hardening |
| [Issue #129](https://github.com/Aluvioz/Polychat/issues/129) | Execução de homologação, acessibilidade e regressão |

**Regra de precedência:** este plano não altera requisitos nem decide regras de negócio. Quando houver divergência, devem prevalecer os requisitos e decisões formalmente aprovados. Recomendações de teste não podem ser interpretadas como novas funcionalidades ou políticas aprovadas pela FORD.

### 2.1 Correspondência com os critérios de aceite da Issue #126

A tabela abaixo relaciona os critérios já registrados na Issue #126 aos trechos deste plano e ao estado verificável desta entrega documental. **Ela não altera, substitui ou reinterpreta os critérios da Issue**, nem marca seus itens como concluídos no GitHub.

| Critério da Issue #126 | Referência neste plano | Situação nesta entrega |
|---|---|---|
| Matriz de cobertura de RF-001 a RF-023 e RNF-001 a RNF-013 | Seções 7 e 8 | **Documentado.** Os requisitos e critérios estão relacionados a casos ou bloqueios. A cobertura documental não significa que os testes tenham sido executados. |
| Casos positivos/negativos e critérios de entrada/saída | Seções 9, 11 e 12 | **Documentado.** O catálogo descreve cenários e resultados esperados; as condições de entrada e saída estão definidas. A execução depende da disponibilidade das funcionalidades e dos ambientes. |
| Testes de autorização/RLS executáveis no mecanismo de banco definido, em ambiente real de teste e não apenas por mocks | TC-INT-002, seção 5.1 e seções 11.1/13 | **Especificado, mas não demonstrado como executável nem executado.** Os 11 testes preexistentes usam Supabase simulado e não atendem a este critério. A execução exige PostgreSQL real de teste, migrations/policies aplicadas e evidências reproduzíveis. A ADR-005 permanece Proposed para sua decisão técnica específica e para evidências de integração/operação/continuidade; essa pendência é independente da Q-025, concluída em 24/11/2026. |
| Evidências de integração/E2E/segurança/compatibilidade/desempenho/recuperação quando os fluxos forem implementados | Seções 6, 9, 10.2 e 11 | **Processo documentado; evidências funcionais ainda não disponíveis.** As evidências deverão ser registradas à medida que os fluxos forem implementados e testados. Não se declara execução ou aprovação antecipada. |
| Revisão independente SQA e Tech Lead, CI e ausência de contradições com a baseline | Histórico de revisão da PR; seções 2, 5, 6 e 10 | **Parcialmente atendido nesta revisão cruzada.** A versão 0.5 do plano (#153) recebeu parecer documental favorável do SQA em 24/11/2026 (comentário [#7145700407](https://github.com/Aluvioz/Polychat/pull/153#issuecomment-7145700407)) e `APPROVED` do Tech Lead; a PR #153 foi integrada. Esta atualização v0.6 harmoniza Q-025/ADR-005 e o limite de anexos e está incluída na PR #154, portanto ainda depende de revisão específica no contexto dessa PR. No HEAD `36b7a124fc701548fdd142a39ec56bcb85f30d0f`, os dois workflows CI concluíram com sucesso; a instalação limpa PostgreSQL/migrations ainda estava em execução e não deve ser contabilizada como aprovada. Vercel reportou `build-rate-limit`, separado do CI. A revisão final SQA da PR #154 sobre POLY-SEC-001 v0.22 e os documentos harmonizados permanece pendente. A ADR-005 segue Proposed apenas para sua decisão técnica específica; Q-025 está concluída. |

**Leitura arquitetural aplicável a este plano:** a ADR-003 — Accepted mantém Supabase + Vercel como stack adotada e obrigatória; a Q-025 foi concluída em 24/11/2026, aprovando a compatibilidade e o modelo de utilização dos provedores nomeados nos limites registrados. A ADR-005 permanece Proposed para sua decisão específica sobre PostgreSQL/Supabase Database e para as evidências de integração/operação/continuidade, sem reabrir a Q-025. A especificação de testes reais de autorização/RLS não equivale à prova de que o mecanismo ou o ambiente estejam integrados, configurados ou homologados.



## 3. Escopo

### 3.1 Incluído

- Testes unitários, de integração, ponta a ponta (E2E) e de segurança.
- Verificação dos comportamentos positivos e negativos previstos nos critérios de aceitação.
- Rastreabilidade entre RF/RNF, CA, casos de teste e evidências.
- Critérios de entrada, saída, bloqueio, severidade e regressão.
- Registro do estado de prontidão dos testes, distinguindo casos especificados de testes executados.
- Aproveitamento dos testes e cenários existentes, sem duplicar a matriz de autorização da Issue #100.

### 3.2 Fora do escopo desta entrega documental

- Implementar funcionalidades de produto ou políticas RLS.
- Declarar que uma migration foi aplicada em ambiente hospedado sem evidência.
- Executar homologação funcional, teste de invasão, carga ou acessibilidade.
- Aprovar políticas ainda pendentes de negócio, segurança, privacidade ou infraestrutura.
- Considerar aprovada uma regra de teste quando o requisito de origem ainda não tem critério suficiente.

## 4. Princípios de qualidade e rastreabilidade

1. **Rastreabilidade bidirecional:** cada caso deve apontar para requisitos e critérios; cada critério testável deve apontar para um ou mais casos.
2. **Resultado fundamentado:** o resultado esperado deve estar sustentado por requisito, regra aprovada ou decisão registrada.
3. **Separação entre especificação e execução:** caso descrito não significa teste implementado, executado ou aprovado.
4. **Falha fechada em segurança:** erros de autenticação, autorização ou dependências críticas nunca podem conceder acesso por omissão.
5. **Dados sintéticos:** utilizar contas, conversas, grupos e anexos fictícios nos ambientes de teste. Não copiar conversas reais para evidências.
6. **Reprodutibilidade:** toda execução deve registrar versão/commit, ambiente, dados/precondições, passos, resultado e evidência.
7. **Pendência explícita:** critérios incompletos devem permanecer como bloqueados ou parcialmente testáveis, nunca como aprovados por inferência.
8. **Independência:** quem implementa uma proteção não deve ser a única pessoa a validar sua eficácia em revisão de segurança/SQA.

## 5. Estratégia por nível de teste

| Nível/tipo | Objetivo | Exemplos para o Polychat | Evidência esperada |
|---|---|---|---|
| Unitário | Verificar funções e regras isoladas | Validação de sessão, estados de conta, validação de conteúdo de arquivo, tratamento de erros | Relatório do executor de testes, resultado por caso e cobertura quando configurada |
| Integração | Verificar colaboração entre a aplicação e os serviços reais da stack adotada | Supabase (serviços efetivamente integrados, incluindo autenticação, PostgreSQL/RLS, armazenamento e demais capacidades previstas) e aplicação/deployment na Vercel, conforme ADR-003 e configuração técnica registrada | Relatório automatizado, logs sanitizados, registros do banco de teste e configuração do ambiente |
| E2E | Verificar jornadas completas por perfil | Login, lista de conversas, leitura/envio, administração de grupos e anexos | Relatório do cenário, captura sanitizada e identificação da versão |
| Segurança | Verificar resistência a uso não autorizado e exposição de dados | Troca de role, IDOR, acesso por URL/API, isolamento de membership, sessão inválida | Relatório SQA/segurança, requisições/respostas sanitizadas e defeitos |
| Compatibilidade | Verificar perfis nos dispositivos e navegadores homologados | Usuário em smartphone; TI em computador | Matriz de dispositivo/navegador, versão e resultado |
| Usabilidade | Verificar execução das tarefas e compreensão da interface | Encontrar conversa, enviar mensagem, administrar grupo | Protocolo e relatório de sessões da Issue #94 |
| Acessibilidade | Verificar critérios aplicáveis aprovados | Teclado, foco, zoom, contraste e leitor de tela | Evidências manuais e automatizadas conforme o escopo aprovado nas Issues #93/#129 |
| Desempenho/capacidade | Medir resposta sob carga definida | Concorrência, envio de mensagens, consulta de conversas e anexos | Relatório de carga comparado com metas aprovadas |
| Continuidade/recuperação | Verificar backup e restauração | Recuperar dados e serviço após falha controlada | Registro de exercício, tempos medidos e comparação com RPO/RTO aprovados |

### 5.1 Orientação para automação

A automação deve ser escolhida pelo risco e pela repetibilidade:

- Regras determinísticas e regressivas devem ser automatizadas sempre que viável.
- Testes de integração e RLS devem validar a implementação real na stack adotada Supabase + Vercel, em ambiente de teste isolado. As políticas devem ser verificadas no PostgreSQL do Supabase; os fluxos devem exercitar os serviços Supabase efetivamente integrados e a aplicação/deployment na Vercel, conforme o escopo implementado e as ADRs aplicáveis. Mocks podem apoiar testes unitários, mas não comprovam integração real nem aplicação/eficácia de RLS. A Q-025 documenta a compatibilidade, a configuração, os controles, a localização/processamento dos dados e as responsabilidades operacionais exigidas pela FORD; não autoriza retirar ou substituir a stack por inferência.
- Cenários E2E devem validar o comportamento observável dos perfis e das rotas reais.
- Testes manuais são aceitáveis quando a atividade exigir julgamento humano ou quando a automação não for adequada; nesse caso, o roteiro e a evidência são obrigatórios.
- Não considerar um mock como evidência de integração com serviço real.

## 6. Inventário de implementação e evidências preexistentes

A fotografia do repositório registra artefatos iniciais de estrutura, mas a implementação funcional do produto ainda não começou. O que existe não constitui fluxo real integrado ou funcional:

- A aplicação está estruturada em Next.js 16, React 19, TypeScript e App Router.
- Existe um módulo isolado de autorização Express-compatible e testes unitários com cliente Supabase simulado. Esses artefatos demonstram apenas o comportamento isolado daquele módulo: não comprovam integração real com Supabase, aplicação/eficácia de RLS, fluxos ponta a ponta nem deployment na Vercel. Supabase + Vercel permanece a stack adotada conforme ADR-003; a validação integrada depende da implementação e de evidências reproduzíveis no ambiente de teste.
- Há uma migration de exemplo para `public.profiles`; sua presença versionada não comprova aplicação em um banco de teste ou homologação, integração com o runtime nem implementação funcional de perfis.
- Não há integração funcional de Auth/handlers do App Router, nem migrations/RLS de domínio para conversas, grupos, mensagens, anexos e auditoria.
- Nenhuma funcionalidade do Polychat — login, conversas, mensagens, grupos, anexos, alertas, console TI ou auditoria — está implementada de ponta a ponta.
- O pipeline CI disponibiliza `npm test`, `npm run lint`, `npm run typecheck` e `npm run build`.

Os 11 testes existentes cobrem: usuário ativo; ausência de token; sessão inválida; conta inativa; falha na consulta de perfil; papel desconhecido; autorização de TI; bloqueio de usuário em rota TI; perfil ausente; exceção do provedor; e rota TI sem autenticação.

**Limite da evidência:** a existência do middleware isolado, da migration de exemplo e dos testes unitários simulados não comprova integração com a arquitetura-alvo, aplicação de migrations, RLS de domínio ou fluxos do produto. Esses casos permanecem especificados/não executados até que haja implementação integrada e evidência reproduzível no ambiente de teste correspondente.

## 7. Matriz de rastreabilidade — requisitos funcionais

Os identificadores de caso abaixo são a referência planejada para automação ou execução manual. O estado “especificado” significa que o cenário está descrito neste plano, não que esteja implementado ou aprovado.

| Requisito / critério | Caso(s) relacionado(s) | Nível principal | Prontidão / observação |
|---|---|---|---|
| RF-001 — CA-001.1 | TC-E2E-001, TC-INT-001 | Integração / E2E | Especificado; depende de Auth integrado |
| RF-001 — CA-001.2 e CA-001.3 | TC-E2E-002, TC-SEC-001 | E2E / Segurança | Especificado; testar credencial inválida e conta desativada separadamente |
| RF-001 — CA-001.4 | TC-E2E-003 | E2E | Especificado; validar roteamento por perfil |
| RF-002 — CA-002.1 a CA-002.4 | TC-SEC-002, TC-SEC-003, TC-SEC-004 | Segurança / Integração | Especificado; usar somente os dois perfis aprovados |
| RF-003 — CA-003.1 a CA-003.4 | TC-E2E-010, TC-INT-003, TC-SEC-005 | Integração / E2E / Segurança | Especificado; todos os administradores TI possuem poderes iguais; Q-002 resolvida |
| RF-003 — CA-003.5 | TC-E2E-010 | E2E | Especificado; TI cria e envia individualmente a senha inicial e o link; Q-006 resolvida |
| RF-004 — CA-004.1 a CA-004.3 | TC-INT-004, TC-E2E-011, TC-SEC-006 | Integração / E2E / Segurança | Especificado; testar desativação, revogação de sessão e reativação conforme Q-002 resolvida |
| RF-005 — CA-005.1 a CA-005.3 | TC-E2E-012, TC-SEC-007 | E2E / Segurança | Especificado; depende de schema e operações administrativas |
| RF-006 — CA-006.1 a CA-006.3 | TC-INT-005, TC-E2E-013, TC-SEC-008 | Integração / E2E / Segurança | Especificado; depende de membership definido na #99/#101; remoção e revogação cruzadas com #113 |
| RF-007 — CA-007.1 a CA-007.3 | TC-E2E-004 | E2E | Especificado; lista, ordenação e estado vazio; relacionar histórico e sincronização com a #110 quando aplicável |
| RF-008 — CA-008.1 a CA-008.3 | TC-E2E-005, TC-SEC-009 | E2E / Segurança | Especificado; acesso direto por URL/API deve ser negado a não participante |
| RF-009 — CA-009.1 a CA-009.4 | TC-E2E-006, TC-INT-006, TC-SEC-010 | Integração / E2E / Segurança | Especificado; requer conversa e mensagens funcionais |
| RF-010 — CA-010.1 a CA-010.3 | TC-E2E-007, TC-INT-005, TC-SEC-008 | Integração / E2E / Segurança | Especificado; testar membro e não membro |
| RF-011 — CA-011.1 a CA-011.3 | TC-INT-007, TC-INT-015, TC-E2E-008, TC-E2E-021, TC-SEC-011, TC-SEC-021 a TC-SEC-023 | Integração / E2E / Segurança | Especificado; formatos, validação de conteúdo, antimalware, autorização/expiração de download e revogação após remoção de participante |
| RF-011 — CA-011.4 | TC-INT-007, TC-E2E-008 | Integração / E2E | Requisito definido: até 10 MiB (10.485.760 bytes) por arquivo e até 5 arquivos por mensagem; implementação/teste pendentes |
| RF-012 — CA-012.1 a CA-012.3 | TC-UNIT-003, TC-INT-007, TC-INT-015, TC-E2E-008 | Unitário / Integração / E2E | Especificado; incluir extensão, assinatura e conteúdo real do arquivo; falha/inconclusão do scanner deve manter o anexo bloqueado |
| RF-013 — CA-013.1 a CA-013.3 | TC-E2E-009 | E2E | Requisito definido: selecionar JPEG da galeria, sem câmera/gravação, removendo EXIF/GPS; Q-004 resolvida |
| RF-014 — CA-014.1 a CA-014.4 | TC-UNIT-004, TC-INT-008 | Unitário / Integração | Regra definida: lista/regras mantidas pelo TI, incluindo palavrões; sem análise contextual/IA externa; implementação pendente |
| RF-015 — CA-015.1 a CA-015.3 | TC-INT-009, TC-E2E-014 | Integração / E2E | Regras definidas: fila TI, severidades e prazos confirmados, encerramento sem justificativa; implementação pendente |
| RF-016 — CA-016.1 a CA-016.4 | TC-E2E-015, TC-INT-010, TC-SEC-012 | Integração / E2E / Segurança | TI pode consultar qualquer conversa sem justificativa ou segunda aprovação; consultas devem ser auditadas. Q-009 resolvida; implementação #102/#121/#124 pendente |
| RF-017 — CA-017.1 a CA-017.3 | TC-COMP-001, TC-COMP-003 | Compatibilidade | Matriz definida: Usuário Android/iOS, Chrome/Safari móveis atuais; comportamento em dispositivo incompatível é aviso/experiência, não controle de segurança; Q-012 resolvida |
| RF-018 — CA-018.1 a CA-018.5 | TC-COMP-002, TC-COMP-004 | Compatibilidade | Matriz definida: TI em computador com Chrome/Edge/Firefox atuais; comportamento em dispositivo incompatível é aviso/experiência, não controle de segurança; tablets não permitidos; Q-012 resolvida |

### Requisitos funcionais adicionais RF-019 a RF-023

| Requisito / critério | Caso(s) relacionado(s) | Nível principal | Prontidão / observação |
|---|---|---|---|
| RF-019 — CA-019.1 a CA-019.4 | TC-INT-011, TC-E2E-016, TC-SEC-017 | Integração / E2E / Segurança | Especificado; testar registro de leitura, horário e contagem de não lidas por usuário/conversa; relacionar com #111 |
| RF-020 — CA-020.1 a CA-020.5 | TC-INT-012, TC-E2E-017, TC-SEC-018 | Integração / E2E / Segurança | Especificado; usuário negado; TI edita/exclui a qualquer momento; ações auditadas; relacionar auditoria com #124 |
| RF-021 — CA-021.1 a CA-021.4 | TC-INT-013, TC-E2E-018, TC-SEC-019 | Integração / E2E / Segurança | Especificado; TI exporta conversas individuais e grupos, sem justificativa/segunda aprovação, com auditoria |
| RF-022 — CA-022.1 a CA-022.11 | TC-INT-014, TC-E2E-019, TC-SEC-020 | Integração / E2E / Segurança | Especificado; catálogo de eventos, acesso exclusivo TI, sem exclusão automática e exclusão autorizada auditada; relacionar operações privilegiadas com #124 |
| RF-023 — CA-023.1 a CA-023.3 | TC-E2E-020 | E2E | Especificado; aviso de monitoramento no primeiro acesso, com texto informando que conversas podem ser monitoradas, sem depender de push/browser notification |

## 8. Matriz de rastreabilidade — requisitos não funcionais

| RNF | Verificação planejada | Caso(s) / evidência | Dependências e bloqueios |
|---|---|---|---|
| RNF-001 — autorização server-side | Casos negativos por perfil, sessão, URL, API e RLS | TC-SEC-002 a TC-SEC-010; cenários AUTH da #100 | Integração real, modelo #99 e RLS #101 |
| RNF-002 — proteção de dados | Revisão arquitetural, análise de ameaças e testes de segurança | TC-SEC-015; relatório da #125 | Controles criptográficos, chaves, arquitetura e threat model aprovados |
| RNF-003 — credenciais | Inspeção de armazenamento/tráfego e testes de autenticação/sessão | TC-SEC-001, TC-SEC-016 | Q-006 resolvida: sem MFA, sem troca obrigatória no primeiro acesso e sem expiração periódica; verificar proteção técnica alinhada e recuperação exclusiva pelo TI |
| RNF-004 — auditabilidade | Confirmar geração, integridade e consulta autorizada dos eventos definidos | TC-INT-010, TC-INT-014, TC-SEC-012, TC-SEC-020 | Requisitos de eventos, acesso e retenção definidos; implementação e evidências #102/#124 pendentes |
| RNF-005 — compatibilidade | Executar matriz de SO, navegador e dispositivo definida pela FORD | TC-COMP-001, TC-COMP-002 | Q-012 resolvida; execução/homologação pendente (#129) |
| RNF-006 — usabilidade | Tarefas com usuários representativos e métricas acordadas | TC-UX-001; protocolo/relatório da #94 | Participantes, métricas e protótipo/fluxos disponíveis |
| RNF-007 — desempenho | Carga e latência comparadas às metas alinhadas com Desenvolvimento | TC-PERF-001 | Requisitos/metas alinhados; execução e evidência de desempenho pendentes |
| RNF-008 — capacidade | Carga com capacidade inicial definida: até 25 conexões simultâneas de usuários finais, além dos administradores TI | TC-PERF-002 | População e capacidade alinhadas; testar carga real e registrar resultado |
| RNF-009 — continuidade | Exercício de backup/restauração; verificar backup diário por 12 meses, RPO até 24h em desastre e RTO até 24h | TC-REC-001 | Parâmetros definidos; implementação e evidências de restore pendentes |
| RNF-010 — segurança de arquivos | Testar PDF/JPEG, 10 MiB (10.485.760 bytes), 5 arquivos por mensagem, PDF protegido por senha, EXIF/GPS, antimalware interno, falha segura, autorização de upload/download, expiração de link e revogação após remoção de participante | TC-UNIT-003, TC-INT-007, TC-INT-015, TC-E2E-008, TC-E2E-021, TC-SEC-011, TC-SEC-021 a TC-SEC-023 | Requisitos definidos; implementação, integração e evidências de execução pendentes (#116/#117) |
| RNF-011 — privacidade/governança | Verificar aviso no primeiro acesso, acesso TI conforme regras e tratamento de solicitações descrito pela FORD | TC-SEC-012, TC-E2E-020 | Regras definidas; não exigir trilha separada de aprovação jurídica no projeto; obrigações legais aplicáveis permanecem |
| RNF-012 — acessibilidade | Verificação de obrigações legais/corporativas aplicáveis | TC-A11Y-001; evidências das #93/#129 | Q-020 resolvida: FORD não estabeleceu requisito adicional específico; obrigações aplicáveis permanecem |
| RNF-013 — arquitetura/plataforma | Verificar integração real da aplicação/deployment na Vercel e dos serviços Supabase efetivamente adotados, incluindo configuração server-only, autorização/RLS e fronteiras de acesso/processamento | TC-INT-001 a TC-INT-015; CI/deployment | Supabase + Vercel são a stack adotada (ADR-003), com compatibilidade/modelo de utilização aprovados na Q-025 concluída. A integração funcional, configuração efetiva e evidências reproduzíveis continuam pendentes; essas pendências não reabrem a decisão de compatibilidade |

## 9. Catálogo mínimo de casos de teste

Os casos abaixo são especificações de teste. O executor deve completar pré-condições específicas do ambiente, dados, versão e passos antes da execução formal.

### 9.1 Unitários e integração

| ID | Cenário / pré-condição | Resultado esperado | Tipo / estado |
|---|---|---|---|
| TC-UNIT-001 | Validar autenticação sem token, token inválido e sessão expirada | Operação negada; não prossegue para handler protegido | Especificado; testes existentes exercitam apenas módulo isolado/mock, não runtime do produto |
| TC-UNIT-002 | Validar conta ativa, inativa, perfil ausente e role desconhecida | Somente conta ativa com perfil permitido prossegue | Especificado; artefato isolado/mock não equivale à implementação funcional |
| TC-UNIT-003 | Submeter PDF/JPEG válidos e arquivos com extensão/MIME incompatíveis | Aceitar apenas formatos permitidos após validar conteúdo real; recusar arquivos falsificados | Unitário; pendente de implementação do fluxo de anexos |
| TC-UNIT-004 | Aplicar regras/lista de termos mantidas pelo TI, incluindo palavrões | Resultado sinalizado conforme regra ativa; sem análise contextual/IA e sem bloqueio automático | Especificado; implementação pendente, Q-007 resolvida |
| TC-INT-001 | Autenticar conta ativa por meio da integração Supabase Auth adotada para o projeto e carregar seu perfil | Identidade e perfil correspondem ao usuário validado pelo Supabase Auth | Integração; depende de Auth integrado e ambiente de teste configurado conforme ADR-003 e Q-025 |
| TC-INT-002 | Consultar/alterar perfil com políticas de autorização/RLS no PostgreSQL do Supabase em ambiente de teste | Aplicar exatamente as políticas aprovadas; acesso não autorizado negado | Integração; execução no banco real de teste pendente, não substituível por mock |
| TC-INT-003 | TI provisiona conta com username único e perfil permitido | Conta criada apenas pelo fluxo administrativo; duplicidade rejeitada | Integração; Q-002/Q-006 resolvidas; implementação pendente |
| TC-INT-004 | TI desativa uma conta já existente | Conta fica impedida de iniciar nova sessão; operação não pode ser feita por Usuário | Integração; depende de fluxo administrativo |
| TC-INT-005 | Incluir conta ativa em grupo e tentar operação como não membro | Membro incluído pelo TI pode participar conforme regra; não membro não lê nem envia | Integração; depende de modelo #99 e RLS #101 |
| TC-INT-006 | Enviar e recuperar mensagem individual persistida | Mensagem é gravada e disponibilizada somente aos participantes autorizados | Integração; depende de recursos de conversa |
| TC-INT-007 | Fazer upload de PDF/JPEG, incluindo formato falso, arquivo corrompido, limite de tamanho e quantidade | Somente formato real permitido, dentro dos limites, é aceito; objeto permanece privado e não é exposto sem autorização | Integração; depende do componente de armazenamento definido na arquitetura e da #117 |
| TC-INT-008 | Submeter mensagem à lista de termos/regras mantidas pelo TI | Ocorrência registra regra/motivo e vínculo com mensagem; não há análise contextual | Integração; Q-007 resolvida, implementação pendente |
| TC-INT-009 | Gerar alerta para mensagem sinalizada | Alerta aparece na fila TI com severidade e prazo definidos; TI pode encerrar sem justificativa; sem bloqueio automático | Integração; Q-008 resolvida, implementação pendente |
| TC-INT-010 | TI consulta conversa e o sistema registra auditoria | Consulta permitida a qualquer conversa sem justificativa/segunda aprovação; evento auditado conforme baseline | Integração; regras definidas, implementação #102/#121/#124 pendente |
| TC-INT-011 | Registrar leitura de mensagem por um usuário em uma conversa | Recibo, horário e contagem de não lidas são atualizados para o contexto correto, sem expor estado de leitura de outros usuários | Integração; RF-019 definido, implementação pendente |
| TC-INT-012 | TI edita e exclui mensagem existente | Operação permitida apenas a TI, aplicada à mensagem correta e registrada em auditoria | Integração; RF-020 definido, implementação pendente |
| TC-INT-013 | TI exporta conversa individual e de grupo | Exportação respeita o escopo autorizado, gera arquivo consistente e registra evento de auditoria | Integração; RF-021 definido, implementação pendente |
| TC-INT-014 | Registrar, consultar e proteger eventos do catálogo de auditoria | Eventos requeridos são persistidos, consultáveis por TI e protegidos contra alteração/exclusão indevida | Integração; RF-022 definido, implementação pendente |
| TC-INT-015 | Forçar indisponibilidade, timeout, falha ou resposta inconclusiva do antimalware no fluxo de anexos | Anexo permanece bloqueado e não pode ser baixado; falha do scanner não impede o envio de mensagem de texto; evento técnico é registrado sem expor conteúdo | Integração; RF-011/RNF-010 definidos, implementação pendente (#117) |

### 9.2 Ponta a ponta (E2E)

| ID | Jornada | Resultado esperado |
|---|---|---|
| TC-E2E-001 | Usuário ativo informa credenciais válidas | Sessão iniciada e usuário acessa a aplicação |
| TC-E2E-002 | Usuário informa credenciais inválidas; depois tenta conta desativada | Acesso negado em ambos os casos, com mensagem apropriada e sem expor dados internos |
| TC-E2E-003 | Entrar como Usuário e como TI | Cada perfil é direcionado ao ambiente correspondente, sem conceder funções do outro perfil |
| TC-E2E-004 | Abrir a tela principal sem conversas e depois com várias conversas | Estado vazio é compreensível; com conversas, lista somente as conversas às quais o usuário tem acesso, em ordem de atividade |
| TC-E2E-005 | Abrir conversa individual e conversa de grupo como participante | Mensagens disponíveis são exibidas; conversa alheia não pode ser aberta |
| TC-E2E-006 | Enviar mensagem individual para conta ativa e tentar destinatário inexistente/inativo | Envio válido aparece para os participantes; destinatário inválido recebe tratamento de erro sem criar conversa válida |
| TC-E2E-007 | Enviar mensagem em grupo como membro e tentar como não membro | Membro autorizado envia; não membro não lê nem envia |
| TC-E2E-008 | Anexar PDF/JPEG e tentar formato proibido | Anexos permitidos são disponibilizados de forma autorizada; formato proibido é recusado e explicado |
| TC-E2E-009 | Selecionar JPEG existente na galeria e verificar ausência de captura/gravação | Aplicação não oferece câmera/gravação; metadados EXIF/GPS removidos |
| TC-E2E-010 | TI cria conta com identificador, credencial inicial e perfil | Conta criada somente no fluxo administrativo; duplicidade e auto cadastro são impedidos |
| TC-E2E-011 | TI desativa conta e essa conta tenta autenticar | A conta desativada não inicia nova sessão |
| TC-E2E-012 | TI cria grupo e administra sua disponibilidade | Grupo é criado e fica disponível para administração por TI |
| TC-E2E-013 | TI inclui conta ativa em grupo e tenta incluir conta desativada | Inclusão da conta ativa é permitida; conta desativada não se torna participante ativo |
| TC-E2E-014 | Mensagem sinalizada gera alerta ao TI | Fila mostra severidade e prazo correto; TI revisa/encerra sem justificativa obrigatória; envio da mensagem não é bloqueado automaticamente |
| TC-E2E-015 | TI consulta conversa da qual não participa | Consulta é permitida a qualquer administrador TI, sem justificativa ou segunda aprovação; evento é auditado; Usuário comum não recebe a função administrativa |
| TC-E2E-016 | Usuário A envia mensagem a Usuário B; B recebe, consulta a lista de conversas, lê a mensagem e A consulta a confirmação | O sistema registra a leitura da mensagem; A consegue visualizar quando ela foi lida; a lista de B apresenta a quantidade de mensagens não lidas e o estado é atualizado conforme as regras técnicas alinhadas para a mensageria (CA-019.1 a CA-019.4). |
| TC-E2E-017 | Usuário comum tenta editar e excluir mensagens enviadas; em seguida, TI realiza uma edição e uma exclusão administrativa | As tentativas do Usuário comum são impedidas; TI consegue editar e excluir mensagens; ambas as operações administrativas geram registros de auditoria (CA-020.1 a CA-020.5). |
| TC-E2E-018 | TI exporta uma conversa individual e uma conversa de grupo; um Usuário comum acessa a área de conversas | TI consegue exportar ambos os tipos de conversa sem justificativa ou autorização prévia de outra pessoa; cada exportação gera registro de auditoria; Usuário comum não dispõe da função de exportação administrativa (CA-021.1 a CA-021.4). |
| TC-E2E-019 | TI realiza as operações administrativas e de segurança previstas e consulta/gerencia os registros; Usuário comum tenta consultar, alterar e excluir registros | São gerados registros para login administrativo; criação/alteração e desativação/reativação de usuários; criação/encerramento de grupos; inclusão/remoção de participantes; consulta de conversas/alertas; download de anexos; alteração de configurações; exportação; edição/exclusão administrativa de mensagens. Somente TI consegue consultar e gerenciar a auditoria; Usuário comum não consegue consultar, alterar ou excluir registros. Os registros não são excluídos automaticamente; exclusões autorizadas pelo TI seguem a política de retenção alinhada (CA-022.1 a CA-022.11). |
| TC-E2E-020 | Funcionário acessa a aplicação pela primeira vez, sem histórico anterior de apresentação do aviso | O sistema apresenta o aviso no primeiro acesso e informa que as conversas podem ser monitoradas; a apresentação não depende de notificações push ou do navegador (CA-023.1 a CA-023.3). |
| TC-E2E-021 | Participante autorizado realiza download de anexo e TI realiza download em contexto administrativo previsto | Download é validado separadamente do upload; acesso é autorizado conforme perfil, vínculo e regra aplicável; download administrativo por TI gera auditoria; pessoa sem autorização é negada |

### 9.3 Segurança

| ID | Tentativa | Resultado esperado |
|---|---|---|
| TC-SEC-001 | Usar token inválido/expirado, conta inativa ou perfil ausente | Negar acesso; falhar fechado; não revelar dados sensíveis |
| TC-SEC-002 | Usuário comum chama rota/ação exclusiva de TI | Negar no servidor, mesmo que a interface seja manipulada |
| TC-SEC-003 | Enviar role alterada no body, query, cookie não confiável ou payload do cliente | Identidade e role são obtidas de fonte server-side confiável; alteração do cliente não eleva privilégio |
| TC-SEC-004 | Tentar introduzir role diferente de Usuário/TI ou alterar a própria role | Rejeitar operação e manter autorização limitada aos dois perfis |
| TC-SEC-005 | Tentar provisionar conta por auto cadastro/convite ou fora do fluxo TI | Negar conforme RF-003 |
| TC-SEC-006 | Conta inativa tenta reutilizar sessão/credencial | Acesso negado; não basta impedir somente novo login se a sessão ainda puder operar |
| TC-SEC-007 | Usuário comum tenta criar grupo | Negar no servidor |
| TC-SEC-008 | Não membro tenta ler/enviar mensagem de grupo por interface, URL ou API | Negar; membership deve ser verificado no servidor/RLS |
| TC-SEC-009 | Usuário não participante tenta abrir conversa por URL direta ou identificador conhecido | Negar sem revelar existência/conteúdo da conversa |
| TC-SEC-010 | Tentar enviar mensagem com sessão expirada ou conta desativada | Negar; nenhuma mensagem válida é criada |
| TC-SEC-011 | Tentar acessar anexo por ID conhecido, URL direta ou API sem autorização; submeter arquivo malformado | Negar acesso ao objeto sem revelar seu conteúdo; validar assinatura/conteúdo real e política de antimalware |
| TC-SEC-012 | Usuário tenta consulta administrativa; TI consulta sem registro de auditoria | Usuário é negado; consulta TI permitida gera evento obrigatório conforme RF-016 |
| TC-SEC-015 | Revisar proteção de dados em trânsito/armazenamento e segredos | Evidenciar controles definidos na arquitetura e threat model aprovado; nenhuma chave privilegiada exposta ao cliente |
| TC-SEC-016 | Inspecionar armazenamento/transmissão de credenciais e sessão | Credenciais nunca aparecem em texto puro; controles correspondem à política aprovada |
| TC-SEC-017 | Tentar consultar/alterar recibo de leitura de outro usuário | Acesso a estado de leitura é limitado ao contexto autorizado; manipulação de identificador não expõe leitura de terceiros | RF-019; não implementado |
| TC-SEC-018 | Usuário tenta editar/excluir mensagem; TI executa ação privilegiada | Usuário é negado no servidor; TI é autorizado e a ação é auditada | RF-020; não implementado |
| TC-SEC-019 | Usuário tenta exportar conversa; TI exporta conversa | Usuário é negado; exportação TI é autorizada e auditada, sem exigir justificativa ou segunda aprovação | RF-021; não implementado |
| TC-SEC-020 | Usuário tenta consultar/modificar auditoria; TI consulta/gerencia registros | Usuário é negado; TI autorizado; logs não são alteráveis por usuários e não sofrem exclusão automática | RF-022; não implementado |
| TC-SEC-021 | Tentar baixar anexo usando sessão/identidade com permissão de upload, mas sem autorização vigente para download; repetir por ID conhecido e URL direta | Upload não concede automaticamente permissão de download; cada operação valida autorização atual no servidor; acesso não autorizado é negado e não revela conteúdo |
| TC-SEC-022 | Tentar usar link temporário de download após o limite máximo de cinco minutos | Link expirado não permite novo acesso; expiração deve ser verificada no servidor/componente de entrega |
| TC-SEC-023 | Emitir link temporário para participante e, antes do download, remover esse participante da conversa | O acesso ao anexo é revogado imediatamente, inclusive para link emitido anteriormente; a tentativa posterior é negada e registrada conforme política de auditoria |

### 9.4 Compatibilidade, UX, acessibilidade, carga e recuperação

| ID | Verificação | Resultado esperado / pré-condição |
|---|---|---|
| TC-COMP-001 | Executar perfil Usuário em Android/iOS com Chrome/Safari móveis atuais | Fluxos suportados funcionam; tablets e desktop não são permitidos para o perfil Usuário |
| TC-COMP-002 | Executar perfil TI em computador com Chrome/Edge/Firefox atuais | Fluxos administrativos funcionam; smartphones e tablets não são permitidos para o perfil TI |
| TC-COMP-003 | Abrir a aplicação como Usuário em computador ou navegador fora da matriz homologada | Apresentar aviso claro de dispositivo incompatível e orientação/fallback acessível; não tratar identificação do dispositivo, viewport ou user-agent como controle de autorização |
| TC-COMP-004 | Abrir as funções destinadas ao TI em celular ou navegador fora da matriz homologada | Apresentar aviso claro de dispositivo incompatível e orientação/fallback acessível; a autorização das funções permanece validada no servidor, independentemente do dispositivo |
| TC-UX-001 | Usuários representativos executam tarefas definidas no plano da #94 | Registrar sucesso, tempo, erros, dúvidas e severidade; métricas devem ser aprovadas antes da avaliação |
| TC-A11Y-001 | Executar avaliação manual/automatizada das obrigações aplicáveis | Evidenciar teclado, foco, contraste, zoom/reflow e leitor de tela conforme #93/#129; Q-020 não adiciona critério específico FORD |
| TC-PERF-001 | Medir latência das operações críticas | Comparar com as metas de desempenho/latência já alinhadas com Desenvolvimento; utilizar valores registrados nos artefatos técnicos aprovados, sem inventar thresholds. Registrar medição e resultado. |
| TC-PERF-002 | Simular carga do público inicial | Verificar até 25 conexões simultâneas de usuários finais, além de administradores TI; registrar volumes/latência contra metas já alinhadas. Q-016 está resolvida; execução pendente. |
| TC-REC-001 | Executar restauração controlada de banco e anexos | Comprovar backup diário, retenção de 12 meses, integridade, RPO até 24h em desastre e RTO até 24h |

## 10. Regras para execução e registro de resultado

### 10.1 Status permitidos

| Status | Significado |
|---|---|
| Não executado | Caso especificado, mas ainda sem execução registrada |
| Em execução | Execução iniciada e ainda sem conclusão |
| Aprovado | Resultado observado corresponde ao esperado e há evidência vinculada |
| Reprovado | Resultado observado diverge do esperado; deve existir defeito associado ou justificativa |
| Bloqueado | Execução impossível por dependência técnica, decisão pendente ou ambiente indisponível |
| Não aplicável | Justificativa formal demonstra que o cenário não se aplica ao escopo aprovado |

Não converter “Bloqueado”, “Não executado” ou “Não aplicável” em aprovação. A porcentagem de aprovação deve considerar somente testes efetivamente executados; a cobertura deve informar separadamente os critérios ainda bloqueados.

### 10.2 Modelo obrigatório de evidência

Para cada execução relevante, registrar:

| Campo | Conteúdo |
|---|---|
| ID do caso / requisito / CA | Identificadores relacionados |
| Versão | Commit SHA, build ou release testada |
| Ambiente | Local, CI, staging/homologação ou produção controlada |
| Data e responsável | Data/hora e pessoa executora |
| Pré-condições e dados | Estado da conta, perfil, membership, dados sintéticos e configuração necessária |
| Passos | Sequência reproduzível |
| Resultado esperado | Conforme requisito/CA ou decisão aprovada |
| Resultado observado | Comportamento real, sem interpretação vaga |
| Status | Um dos status da seção 10.1 |
| Evidência | Link para run CI, relatório, captura sanitizada ou log sem segredos/dados pessoais |
| Defeito/pendência | Issue vinculada, severidade e responsável quando aplicável |

**Cuidados com evidências:** ocultar tokens, cookies, senhas, e-mails pessoais, conteúdo real de mensagens, chaves, URLs assinadas e qualquer dado sensível. Capturas de tela devem usar dados fictícios e exibir contexto suficiente para reproduzir o cenário.

### 10.3 Severidade de defeitos

| Severidade | Critério de classificação | Tratamento |
|---|---|---|
| Crítica | Exposição ou alteração indevida de dados; bypass de autorização; comprometimento de credenciais; indisponibilidade ampla | Bloqueia aceite e release; correção e reteste obrigatórios |
| Alta | Função central indisponível ou falha relevante de segurança sem alternativa aceitável | Bloqueia aceite, salvo decisão formal e documentada dos responsáveis competentes |
| Média | Falha funcional com impacto limitado e alternativa operacional | Corrigir ou aceitar formalmente com responsável e prazo |
| Baixa | Problema cosmético ou inconveniente sem impacto relevante nos requisitos | Registrar e priorizar no backlog |

SQA deve avaliar severidade considerando impacto, probabilidade, dados envolvidos e possibilidade de exploração. A prioridade de correção é decisão de produto/risco e não deve alterar a classificação técnica sem justificativa. A aceitação de risco residual exige decisão documentada de representante da FORD formalmente autorizado; a participação da TI responsável por segurança operacional e de outras instâncias da FORD ocorre conforme a natureza do risco e a governança aplicável. O PO pode recomendar prioridade, contenção ou No-Go, mas não aceita risco residual em nome da FORD sem delegação formal. Defeitos críticos permanecem bloqueadores enquanto abertos.

## 11. Critérios de entrada

Um ciclo de testes só deve começar quando as condições aplicáveis ao seu nível forem atendidas:

- RF/RNF e critérios de aceitação revisados e identificados; pendências explicitamente excluídas do escopo da rodada.
- Build/commit identificável e artefatos implantados correspondentes à versão sob teste.
- Ambiente isolado e acessível, com configuração e serviços necessários.
- Massa de dados sintética preparada para Usuário, TI, contas ativas/inativas, participantes e não participantes.
- Migrations e policies aplicadas no ambiente de teste, com versão registrada, quando o caso exigir banco/RLS real.
- Serviços externos, Storage e credenciais de teste disponíveis; segredos não incluídos nas evidências.
- Casos, passos, resultados esperados e responsáveis definidos.
- Dependências da #99/#100/#101/#102 e decisões Q relevantes verificadas antes da execução dos cenários correspondentes.

### 11.1 Entradas específicas por nível

| Nível | Condição adicional |
|---|---|
| Unitário | Funções/componentes isoláveis e resultado esperado definido |
| Integração | Serviços reais de teste disponíveis e contrato de integração definido |
| E2E | Fluxo funcional implantado e contas de teste preparadas |
| Segurança | Regras de autorização aprovadas; ambiente autorizado para testes ofensivos controlados |
| Compatibilidade | Matriz de SO/navegador/dispositivo aprovada |
| Desempenho | Perfil de carga e metas aprovados |
| Recuperação | Backup de teste, ambiente isolado e RPO/RTO aprovados |

## 12. Critérios de saída

Uma rodada pode ser considerada concluída quando:

1. Todos os casos planejados para a rodada tiverem status e evidência registrados.
2. Todos os critérios de aceitação incluídos na rodada estiverem ligados a casos executados ou a bloqueio formalmente justificado.
3. Não houver defeito crítico aberto.
4. Defeitos altos estiverem corrigidos e retestados ou tiverem risco residual aceito por decisão documentada de representante da FORD formalmente autorizado, após as avaliações técnica, SQA e de segurança operacional pertinentes. O PO avalia impacto e prioridade de produto, mas não aceita risco residual em nome da FORD sem delegação formal.
5. Testes automatizados exigidos pelo CI estiverem aprovados no commit sob revisão.
6. Testes de autorização e segurança relevantes tiverem evidência suficiente para as operações e dados cobertos.
7. Regressão dos fluxos impactados estiver concluída.
8. SQA registrar parecer e limitações remanescentes; PO registrar aceite funcional quando aplicável.

**Saída de um ciclo não significa homologação geral do produto.** A homologação, acessibilidade e regressão global da Issue #129 exigem evidências próprias e dependem da disponibilidade das funcionalidades e dos ambientes.

## 13. Estratégia de regressão

Executar novamente os casos impactados após mudanças em autenticação, autorização, schema, RLS, conversas, mensagens, grupos, anexos, auditoria ou dependências.

Conjunto mínimo de regressão de segurança:

- Autenticação: sessão válida, inválida, expirada e conta inativa.
- Perfis: usuário não acessa funções TI; TI acessa apenas operações administrativas definidas.
- Conversas: participante acessa; não participante não acessa, inclusive por URL/API/ID conhecido.
- Grupos: membro incluído pelo TI participa; não membro não lê nem envia.
- Mensagens: autoria obtida da identidade autenticada; sessão inválida não envia.
- Anexos: somente PDF/JPEG válidos; scanner indisponível/falho/inconclusivo mantém o arquivo bloqueado; upload e download são autorizados separadamente; links expiram em até cinco minutos; remoção de participante revoga imediatamente o acesso, inclusive por link emitido anteriormente.
- Auditoria: consulta administrativa TI gera evento obrigatório.
- Erros: indisponibilidade de dependência falha fechada e não revela detalhes internos.

A regressão funcional inclui, quando disponíveis, login, lista e abertura de conversas, envio individual/grupo, administração de conta/grupo e anexos.

## 14. Dependências, riscos e decisões pendentes

| Dependência/questão | Efeito sobre os testes | Encaminhamento |
|---|---|---|
| #99 — modelo de dados | Sem schema revisado não há base definitiva para testes de domínio e membership | Vincular casos de banco/RLS ao modelo revisado |
| #100 — matriz de autorização | As regras estão documentadas, mas aprovação e enforcement precisam ser confirmados | Preservar os cenários AUTH-01..AUTH-20; não duplicar sua especificação |
| #101 — RLS | Sem policies de domínio e testes reais, não há prova de isolamento de conversas/grupos/mensagens | Testar em banco real de teste após implementação e revisão |
| #102 — auditoria | Eventos, acesso e retenção estão definidos; a implementação da trilha, integridade e evidências ainda não começou | Validar os eventos RF-016/RF-022 e retenção conforme baseline POLY-REQ-001 v0.5 |
| #105 — integração Auth | Middleware isolado não comprova login e autorização ponta a ponta | Executar integração e E2E depois de conectar os fluxos reais |
| #110 — histórico e sincronização | Histórico paginado, Realtime, reconexão e deduplicação precisam de verificação integrada | Vincular cenários de recuperação/sincronização ao fluxo de mensagens e evidenciar ausência de duplicidade |
| #111 — leitura e não lidas | Última mensagem, contador e recibos/horários de leitura precisam de validação por usuário e conversa | Executar cenários de leitura e sincronização conforme os critérios da issue |
| #113 — remoção de participantes | Remoção precisa encerrar autorização de leitura e download do conteúdo anterior | Verificar revogação server-side de conversa e anexos após a remoção |
| #116 — links e autorização de download | Regras de link temporário, validade e autorização de download precisam ser verificadas junto à política de anexos | Testar expiração e revogação de acesso após remoção de participante, sem presumir que um link emitido mantenha acesso válido |
| #117 — anexos/antimalware | Formatos, limites, quotas, scanner interno, liberação administrativa e falha segura definidos; implementação ainda não começou | Testar os requisitos confirmados, sem reabrir parâmetros de produto |
| #119 — redefinição/recuperação de credenciais | Fluxo exclusivo de TI precisa ser validado contra autenticação e sessão | Cobrir credencial redefinida, sessões e mensagens de resultado conforme os critérios de recuperação |
| #123 — alertas e revisão | Fila, severidades, prazos e encerramento precisam de verificação integrada | Relacionar alertas gerados aos testes de detecção e registrar estados/transições do fluxo de revisão |
| #124 — auditoria privilegiada | Eventos de edição/exclusão, exportação, consulta e outras operações privilegiadas precisam de cobertura | Completar os cenários de auditoria além da consulta de conversas, sem duplicar a matriz da #100 |
| #125 — threat modeling | Controles e cenários de ameaça ainda requerem consolidação | Incorporar ameaças aprovadas à suíte de segurança |
| #129 — homologação | Execução manual e regressão global são trabalho próprio dessa issue | Transferir roteiros e evidências de execução à #129 |
| Q-002/Q-006 | Decisões resolvidas: poderes iguais de TI; TI provisiona username/senha e recupera credenciais | Não são pendências; testar conforme RF-002/RF-003/RNF-003 |
| Q-004 | Resolvida: JPEG selecionado da galeria; sem câmera/gravação e com EXIF/GPS removidos | Testar conforme RF-013 |
| Q-007/Q-008 | Resolvidas: regras/lista TI incluindo palavrões; fila, severidades/prazos e encerramento sem justificativa | Testar conforme RF-014/RF-015; implementação #122/#123 pendente |
| Q-009/Q-010 | Resolvidas: consulta TI sem justificativa, exportação, auditoria e política de retenção | Implementar/evidenciar #102/#121/#124, sem reabrir regra de produto |
| Q-011 | Resolvida: PDF/JPEG, 10 MiB (10.485.760 bytes), 5 arquivos/mensagem, quotas TI e regras antimalware | Implementação/testes #115/#116/#117 pendentes |
| Q-012 | Resolvida: matriz mobile Usuário e desktop TI definida pela FORD | Execução/homologação #129 pendente |
| Q-016/Q-017 | Resolvidas: 25 conexões simultâneas de usuários finais + TI; 99% disponibilidade, RPO 24h, RTO 24h, backups diários por 12 meses | Requisitos definidos; testes de carga/restore pendentes |
| Q-020 | Resolvida: FORD não definiu requisito adicional específico; obrigações aplicáveis permanecem | Testes/evidências pertinentes em #93/#129 |
| Q-025 — concluída em 24/11/2026 | Compatibilidade/modelo de utilização Supabase + Vercel com os requisitos de infraestrutura e governança da FORD | Decisão de compatibilidade aprovada pela TI e pela FORD para os provedores nomeados, dentro dos limites e responsabilidades registrados. A execução de testes deste plano deve verificar a integração/configuração real e as evidências operacionais, sem reabrir a decisão nem presumir homologação |

## 15. Responsabilidades

| Papel | Responsabilidades no processo |
|---|---|
| PO | Priorizar escopo de validação, esclarecer critérios com negócio e registrar aceite funcional; não inventar regra pendente |
| SQA/QA | Manter casos, rastreabilidade, evidências, severidade e parecer independente; validar regressão |
| Desenvolvimento | Implementar automação, corrigir defeitos, fornecer dados/ambientes e evidência técnica |
| Tech Lead | Definir contratos técnicos, apoiar critérios verificáveis, revisar arquitetura, CI e cobertura de riscos |
| TI (responsável por segurança na FORD) | Validar controles operacionais, autorização, threat model, auditoria e infraestrutura |
| Representante da FORD / gestor | Conduzir homologação funcional, aceite escrito e Go/No-Go conforme governança informada; quando formalmente autorizado, registrar a aceitação institucional de risco residual. Requisitos de dispositivo, carga e retenção já estão definidos |

## 16. Critério de aceite documental da Issue #126

A entrega documental desta issue poderá ser considerada pronta para revisão quando:

- [ ] Este plano estiver versionado e referenciado no índice de documentação.
- [ ] A matriz cobrir RF-001 a RF-023 e RNF-001 a RNF-013, relacionando critérios e casos ou identificando bloqueios.
- [ ] Os casos existentes de autorização da #100 estiverem referenciados, sem duplicação ou contradição.
- [ ] Os 11 testes de autorização existentes estiverem descritos como evidência preexistente, sem alegação de nova execução.
- [ ] Houver critérios de entrada e saída, status de execução, severidade e modelo de evidência.
- [ ] Pendências e dependências estiverem explícitas, sem transformar requisitos incompletos em casos aprovados.
- [ ] A PR receber revisão independente de SQA e Tech Lead e os checks exigidos forem concluídos.

## 17. Parecer do PO

O plano apresenta uma estrutura adequada de planejamento e rastreabilidade, com cobertura documental de RF-001 a RF-023 e RNF-001 a RNF-013. A existência de um caso especificado não comprova implementação, execução ou aprovação. Os artefatos isolados hoje disponíveis — módulo de autorização, migration de exemplo e testes com dependências simuladas — não comprovam integração ponta a ponta, RLS de domínio ou homologação do produto.

A versão 0.6 preserva Supabase + Vercel como stack adotada e obrigatória, conforme ADR-003 Accepted e baseline POLY-REQ-001 v0.5. A Q-025 foi concluída em 24/11/2026 com aprovação da compatibilidade/modelo de utilização; não permanece como decisão aberta. A ADR-005 continua Proposed para sua decisão técnica específica. A especificação de testes segue separada da implementação e da execução: integração real, RLS e deployment somente serão considerados comprovados mediante evidências reproduzíveis.

A execução deve ocorrer por fatias, acompanhando a disponibilidade das funcionalidades e dependências: autenticação/autorização; dados e políticas de acesso; conversas e mensagens; grupos, anexos e auditoria; e, por fim, homologação transversal, compatibilidade, acessibilidade, desempenho e recuperação. A Issue #129 permanece responsável pela homologação, acessibilidade e regressão global executadas.

---

**Histórico:**  
- 19/11/2026 — v0.1: primeira proposta de estratégia de testes, catálogo inicial e matriz de rastreabilidade para revisão.
- 20/11/2026 — v0.2: amplia cenários de anexos e download, corrige a classificação dos testes por dispositivo, completa rastreabilidade de dependências e formaliza autoridade para aceitação de risco residual.
- 24/11/2026 — v0.3: alinha o plano à baseline POLY-REQ-001 v0.5 e à ADR-003 Accepted; esclarece que Q-025 trata de compatibilidade/configuração da stack Supabase + Vercel, sem substituição por inferência.
- 24/11/2026 — v0.4: acrescenta ao catálogo os casos TC-E2E-016 a TC-E2E-020 e corrige a rastreabilidade de RF-023, removendo a referência sem correspondência a TC-UX-002 e mantendo TC-E2E-020.
- 24/11/2026 — v0.5: acrescenta a correspondência dos cinco critérios de aceite da Issue #126 com as seções e evidências documentais; explicita a distinção entre documentação, execução e aprovação, e consolida as referências à ADR-003 Accepted, ADR-005 Proposed e Q-025.
- 26/11/2026 — v0.6: harmoniza o estado das questões: Q-018 resolvida, Q-019 parcialmente aberta e Q-025 concluída; separa a decisão específica da ADR-005 da aprovação da stack; atualiza o limite de anexos para 10 MiB (10.485.760 bytes) e registra a situação de revisões/checks sem declarar testes funcionais executados.
