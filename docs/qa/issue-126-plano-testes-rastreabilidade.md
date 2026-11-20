# Issue #126 — Plano de testes e rastreabilidade requisito–caso

**Projeto:** Polychat — aplicação de comunicação interna da FORD  
**Issue:** [#126 — Definir plano de testes e rastreabilidade requisito-caso](https://github.com/Aluvioz/Polychat/issues/126)  
**Versão:** 0.1 — 19/11/2026  
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
| [08 — Glossário e questões em aberto](../08-glossario-e-questoes-em-aberto.md) | Histórico Q-001 a Q-024; somente Q-018, Q-019 e Q-025 permanecem abertas, com Q-025 técnica/operacional |
| [09 — Baseline consolidada do MVP](../09-baseline-requisitos-mvp.md) | Escopo, estado técnico observado, comandos de CI e evidências existentes |
| [Matriz de autorização — Issue #100](../issue-100-matriz-autorizacao.md) | Regras de autorização e cenários AUTH-01 a AUTH-20 |
| [Issue #101](https://github.com/Aluvioz/Polychat/issues/101) | Implementação e validação de RLS de domínio |
| [Issue #125](https://github.com/Aluvioz/Polychat/issues/125) | Modelo de ameaças e hardening |
| [Issue #129](https://github.com/Aluvioz/Polychat/issues/129) | Execução de homologação, acessibilidade e regressão |

**Regra de precedência:** este plano não altera requisitos nem decide regras de negócio. Quando houver divergência, devem prevalecer os requisitos e decisões formalmente aprovados. Recomendações de teste não podem ser interpretadas como novas funcionalidades ou políticas aprovadas pela FORD.

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
| Integração | Verificar colaboração entre aplicação e serviços reais | Supabase Auth, PostgreSQL, RLS, Storage, auditoria, rotas server-side | Relatório automatizado, logs sanitizados, registros de banco de teste e configuração do ambiente |
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
- Testes de RLS devem operar em PostgreSQL/Supabase de teste real, não apenas em mocks.
- Cenários E2E devem validar o comportamento observável dos perfis e das rotas reais.
- Testes manuais são aceitáveis quando a atividade exigir julgamento humano ou quando a automação não for adequada; nesse caso, o roteiro e a evidência são obrigatórios.
- Não considerar um mock como evidência de integração com serviço real.

## 6. Inventário de implementação e evidências preexistentes

A fotografia do repositório registra artefatos iniciais de estrutura, mas a implementação funcional do produto ainda não começou. O que existe não constitui fluxo real integrado ou funcional:

- A aplicação está estruturada em Next.js 16, React 19, TypeScript e App Router.
- Existe um módulo isolado de autorização Express-compatible e testes unitários com Supabase simulado; são artefatos de scaffold/estudo, não autenticação nem autorização integradas à aplicação Next.js.
- Há uma migration de exemplo para `public.profiles`; sua presença versionada não comprova aplicação no projeto Supabase, integração com o runtime ou implementação funcional de perfis.
- Não há integração funcional de Auth/handlers do App Router, nem migrations/RLS de domínio para conversas, grupos, mensagens, anexos e auditoria.
- Nenhuma funcionalidade do Polychat — login, conversas, mensagens, grupos, anexos, alertas, console TI ou auditoria — está implementada de ponta a ponta.
- O pipeline CI disponibiliza `npm test`, `npm run lint`, `npm run typecheck` e `npm run build`.

Os 11 testes existentes cobrem: usuário ativo; ausência de token; sessão inválida; conta inativa; falha na consulta de perfil; papel desconhecido; autorização de TI; bloqueio de usuário em rota TI; perfil ausente; exceção do provedor; e rota TI sem autenticação.

**Limite da evidência:** a existência do middleware, migration e testes unitários simulados não significa que a implementação funcional tenha começado. Esses artefatos não comprovam integração com Supabase real, aplicação da migration, RLS de domínio ou fluxos do produto. Todos os casos deste plano permanecem especificados/não executados até que a implementação real esteja disponível.

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
| RF-006 — CA-006.1 a CA-006.3 | TC-INT-005, TC-E2E-013, TC-SEC-008 | Integração / E2E / Segurança | Especificado; depende de membership definido na #99/#101 |
| RF-007 — CA-007.1 a CA-007.3 | TC-E2E-004 | E2E | Especificado; lista, ordenação e estado vazio |
| RF-008 — CA-008.1 a CA-008.3 | TC-E2E-005, TC-SEC-009 | E2E / Segurança | Especificado; acesso direto por URL/API deve ser negado a não participante |
| RF-009 — CA-009.1 a CA-009.4 | TC-E2E-006, TC-INT-006, TC-SEC-010 | Integração / E2E / Segurança | Especificado; requer conversa e mensagens funcionais |
| RF-010 — CA-010.1 a CA-010.3 | TC-E2E-007, TC-INT-005, TC-SEC-008 | Integração / E2E / Segurança | Especificado; testar membro e não membro |
| RF-011 — CA-011.1 a CA-011.3 | TC-INT-007, TC-E2E-008, TC-SEC-011 | Integração / E2E / Segurança | Especificado; PDF/JPEG e validação de conteúdo real |
| RF-011 — CA-011.4 | TC-INT-007 | Integração | Requisito definido: até 10 MB por arquivo e até 5 arquivos por mensagem; implementação/teste pendentes |
| RF-012 — CA-012.1 a CA-012.3 | TC-UNIT-003, TC-INT-007, TC-E2E-008 | Unitário / Integração / E2E | Especificado; incluir extensão e assinatura real do arquivo |
| RF-013 — CA-013.1 a CA-013.3 | TC-E2E-009 | E2E | Requisito definido: selecionar JPEG da galeria, sem câmera/gravação, removendo EXIF/GPS; Q-004 resolvida |
| RF-014 — CA-014.1 a CA-014.4 | TC-UNIT-004, TC-INT-008 | Unitário / Integração | Regra definida: lista/regras mantidas pelo TI, incluindo palavrões; sem análise contextual/IA externa; implementação pendente |
| RF-015 — CA-015.1 a CA-015.3 | TC-INT-009, TC-E2E-014 | Integração / E2E | Regras definidas: fila TI, severidades e prazos confirmados, encerramento sem justificativa; implementação pendente |
| RF-016 — CA-016.1 a CA-016.4 | TC-E2E-015, TC-INT-010, TC-SEC-012 | Integração / E2E / Segurança | TI pode consultar qualquer conversa sem justificativa ou segunda aprovação; consultas devem ser auditadas. Q-009 resolvida; implementação #102/#121/#124 pendente |
| RF-017 — CA-017.1 a CA-017.3 | TC-COMP-001, TC-SEC-013 | Compatibilidade / Segurança | Matriz definida: Usuário Android/iOS, Chrome/Safari móveis atuais; Q-012 resolvida |
| RF-018 — CA-018.1 a CA-018.5 | TC-COMP-002, TC-SEC-014 | Compatibilidade / Segurança | Matriz definida: TI em computador com Chrome/Edge/Firefox atuais; tablets não permitidos; Q-012 resolvida |

### Requisitos funcionais adicionais RF-019 a RF-023

| Requisito / critério | Caso(s) relacionado(s) | Nível principal | Prontidão / observação |
|---|---|---|---|
| RF-019 — CA-019.1 a CA-019.4 | TC-INT-011, TC-E2E-016, TC-SEC-017 | Integração / E2E / Segurança | Especificado; testar registro de leitura, horário e contagem de não lidas por usuário/conversa |
| RF-020 — CA-020.1 a CA-020.5 | TC-INT-012, TC-E2E-017, TC-SEC-018 | Integração / E2E / Segurança | Especificado; usuário negado; TI edita/exclui a qualquer momento; ações auditadas |
| RF-021 — CA-021.1 a CA-021.4 | TC-INT-013, TC-E2E-018, TC-SEC-019 | Integração / E2E / Segurança | Especificado; TI exporta conversas individuais e grupos, sem justificativa/segunda aprovação, com auditoria |
| RF-022 — CA-022.1 a CA-022.11 | TC-INT-014, TC-E2E-019, TC-SEC-020 | Integração / E2E / Segurança | Especificado; catálogo de eventos, acesso exclusivo TI, sem exclusão automática e exclusão autorizada auditada |
| RF-023 — CA-023.1 a CA-023.3 | TC-E2E-020, TC-UX-002 | E2E / UX | Especificado; aviso de monitoramento no primeiro acesso, sem depender de push/browser notification |

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
| RNF-010 — segurança de arquivos | Testar PDF/JPEG, 10 MB, 5 arquivos por mensagem, PDF protegido por senha, EXIF/GPS, scanner interno e fail-closed | TC-INT-007, TC-SEC-011 | Requisitos definidos; integração do scanner interno e evidências de execução pendentes (#117) |
| RNF-011 — privacidade/governança | Verificar aviso no primeiro acesso, acesso TI conforme regras e tratamento de solicitações descrito pela FORD | TC-SEC-012, TC-E2E-020 | Regras definidas; não exigir trilha separada de aprovação jurídica no projeto; obrigações legais aplicáveis permanecem |
| RNF-012 — acessibilidade | Verificação de obrigações legais/corporativas aplicáveis | TC-A11Y-001; evidências das #93/#129 | Q-020 resolvida: FORD não estabeleceu requisito adicional específico; obrigações aplicáveis permanecem |
| RNF-013 — arquitetura/plataforma | Revisar integração real, configuração server-only, RLS e deployment | TC-INT-001 a TC-INT-014; CI/deployment | Supabase/Vercel são plataformas oficiais; integração funcional ainda não começou e deve ser evidenciada |

## 9. Catálogo mínimo de casos de teste

Os casos abaixo são especificações de teste. O executor deve completar pré-condições específicas do ambiente, dados, versão e passos antes da execução formal.

### 9.1 Unitários e integração

| ID | Cenário / pré-condição | Resultado esperado | Tipo / estado |
|---|---|---|---|
| TC-UNIT-001 | Validar autenticação sem token, token inválido e sessão expirada | Operação negada; não prossegue para handler protegido | Especificado; testes existentes exercitam apenas módulo isolado/mock, não runtime do produto |
| TC-UNIT-002 | Validar conta ativa, inativa, perfil ausente e role desconhecida | Somente conta ativa com perfil permitido prossegue | Especificado; artefato isolado/mock não equivale à implementação funcional |
| TC-UNIT-003 | Submeter PDF/JPEG válidos e arquivos com extensão/MIME incompatíveis | Aceitar apenas formatos permitidos após validar conteúdo real; recusar arquivos falsificados | Unitário; pendente de implementação do fluxo de anexos |
| TC-UNIT-004 | Aplicar regras/lista de termos mantidas pelo TI, incluindo palavrões | Resultado sinalizado conforme regra ativa; sem análise contextual/IA e sem bloqueio automático | Especificado; implementação pendente, Q-007 resolvida |
| TC-INT-001 | Autenticar conta ativa contra Supabase de teste e carregar seu perfil | Identidade e perfil correspondem ao usuário validado pelo provedor | Integração; depende de Auth integrado |
| TC-INT-002 | Consultar/alterar perfil com RLS em banco de teste | Aplicar exatamente as policies aprovadas; acesso não autorizado negado | Integração; RLS real ainda pendente |
| TC-INT-003 | TI provisiona conta com username único e perfil permitido | Conta criada apenas pelo fluxo administrativo; duplicidade rejeitada | Integração; Q-002/Q-006 resolvidas; implementação pendente |
| TC-INT-004 | TI desativa uma conta já existente | Conta fica impedida de iniciar nova sessão; operação não pode ser feita por Usuário | Integração; depende de fluxo administrativo |
| TC-INT-005 | Incluir conta ativa em grupo e tentar operação como não membro | Membro incluído pelo TI pode participar conforme regra; não membro não lê nem envia | Integração; depende de modelo #99 e RLS #101 |
| TC-INT-006 | Enviar e recuperar mensagem individual persistida | Mensagem é gravada e disponibilizada somente aos participantes autorizados | Integração; depende de recursos de conversa |
| TC-INT-007 | Fazer upload/download de PDF e JPEG, incluindo formato falso e arquivo corrompido | Somente formato real permitido é aceito; objeto não é exposto sem autorização | Integração; depende de Storage e #117 |
| TC-INT-008 | Submeter mensagem à lista de termos/regras mantidas pelo TI | Ocorrência registra regra/motivo e vínculo com mensagem; não há análise contextual | Integração; Q-007 resolvida, implementação pendente |
| TC-INT-009 | Gerar alerta para mensagem sinalizada | Alerta aparece na fila TI com severidade e prazo definidos; TI pode encerrar sem justificativa; sem bloqueio automático | Integração; Q-008 resolvida, implementação pendente |
| TC-INT-010 | TI consulta conversa e o sistema registra auditoria | Consulta permitida a qualquer conversa sem justificativa/segunda aprovação; evento auditado conforme baseline | Integração; regras definidas, implementação #102/#121/#124 pendente |

### 9.2 Ponta a ponta (E2E)

| ID | Jornada | Resultado esperado |
|---|---|---|
| TC-E2E-001 | Usuário ativo informa credenciais válidas | Sessão iniciada e usuário acessa a aplicação |
| TC-E2E-002 | Usuário informa credenciais inválidas; depois tenta conta desativada | Acesso negado em ambos os casos, com mensagem apropriada e sem expor dados internos |
| TC-E2E-003 | Entrar como Usuário e como TI | Cada perfil é direcionado ao ambiente correspondente, sem conceder funções do outro perfil |
| TC-E2E-004 | Abrir a tela principal sem conversas e depois com várias conversas | Estado vazio é compreensível; com conversas, lista membros/itens autorizados em ordem de atividade |
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
| TC-E2E-015 | TI consulta conversa da qual não participa | Consulta é permitida a qualquer TI, sem justificativa; evento é auditado; usuário comum não recebe a função administrativa |

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
| TC-SEC-011 | Acessar anexo com ID conhecido ou URL fora do escopo autorizado; enviar arquivo malformado | Negar acesso ao objeto; validar conteúdo e política de antimalware |
| TC-SEC-012 | Usuário tenta consulta administrativa; TI consulta sem registro de auditoria | Usuário é negado; consulta TI permitida gera evento obrigatório conforme RF-016 |
| TC-SEC-013 | Usuário tenta utilizar aplicação/rotas em ambiente classificado como computador | Bloqueio conforme critério aprovado; não depender somente de ocultar componentes |
| TC-SEC-014 | TI tenta utilizar funções administrativas em ambiente classificado como celular | Bloqueio conforme critério aprovado; operações também devem ser protegidas |
| TC-SEC-015 | Revisar proteção de dados em trânsito/armazenamento e segredos | Evidenciar controles definidos na arquitetura e threat model aprovado; nenhuma chave privilegiada exposta ao cliente |
| TC-SEC-016 | Inspecionar armazenamento/transmissão de credenciais e sessão | Credenciais nunca aparecem em texto puro; controles correspondem à política aprovada |
| TC-SEC-017 | Tentar consultar/alterar recibo de leitura de outro usuário | Acesso a estado de leitura é limitado ao contexto autorizado; manipulação de identificador não expõe leitura de terceiros | RF-019; não implementado |
| TC-SEC-018 | Usuário tenta editar/excluir mensagem; TI executa ação privilegiada | Usuário é negado no servidor; TI é autorizado e a ação é auditada | RF-020; não implementado |
| TC-SEC-019 | Usuário tenta exportar conversa; TI exporta conversa | Usuário é negado; exportação TI é autorizada e auditada, sem exigir justificativa ou segunda aprovação | RF-021; não implementado |
| TC-SEC-020 | Usuário tenta consultar/modificar auditoria; TI consulta/gerencia registros | Usuário é negado; TI autorizado; logs não são alteráveis por usuários e não sofrem exclusão automática | RF-022; não implementado |

### 9.4 Compatibilidade, UX, acessibilidade, carga e recuperação

| ID | Verificação | Resultado esperado / pré-condição |
|---|---|---|
| TC-COMP-001 | Executar perfil Usuário em Android/iOS com Chrome/Safari móveis atuais | Fluxos suportados funcionam; tablets e desktop não são permitidos para o perfil Usuário |
| TC-COMP-002 | Executar perfil TI em computador com Chrome/Edge/Firefox atuais | Fluxos administrativos funcionam; smartphones e tablets não são permitidos para o perfil TI |
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

SQA deve avaliar severidade considerando impacto, probabilidade, dados envolvidos e possibilidade de exploração. A prioridade de correção é decisão de produto/risco e não deve alterar a classificação técnica sem justificativa.

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
4. Defeitos altos estiverem corrigidos e retestados ou formalmente aceitos pelos responsáveis de negócio, tecnologia e segurança, quando aplicável.
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
- Anexos: somente PDF/JPEG válidos; download autorizado; ID conhecido não concede acesso.
- Auditoria: consulta administrativa TI gera evento obrigatório.
- Erros: indisponibilidade de dependência falha fechada e não revela detalhes internos.

A regressão funcional inclui, quando disponíveis, login, lista e abertura de conversas, envio individual/grupo, administração de conta/grupo e anexos.

## 14. Dependências, riscos e decisões pendentes

| Dependência/questão | Efeito sobre os testes | Encaminhamento |
|---|---|---|
| #99 — modelo de dados | Sem schema revisado não há base definitiva para testes de domínio e membership | Vincular casos de banco/RLS ao modelo revisado |
| #100 — matriz de autorização | As regras estão documentadas, mas aprovação e enforcement precisam ser confirmados | Preservar os cenários AUTH-01..AUTH-20; não duplicar sua especificação |
| #101 — RLS | Sem policies de domínio e testes reais, não há prova de isolamento de conversas/grupos/mensagens | Testar em banco real de teste após implementação e revisão |
| #102 — auditoria | Campos, governança, integridade e retenção não estão completos | Validar evento obrigatório de RF-016 e manter governança pendente identificada |
| #105 — integração Auth | Middleware isolado não comprova login e autorização ponta a ponta | Executar integração e E2E depois de conectar os fluxos reais |
| #117 — anexos/antimalware | Política e parâmetros finais pendentes | Usar casos exploratórios sem fixar limites não aprovados; formalizar decisões |
| #125 — threat modeling | Controles e cenários de ameaça ainda requerem consolidação | Incorporar ameaças aprovadas à suíte de segurança |
| #129 — homologação | Execução manual e regressão global são trabalho próprio dessa issue | Transferir roteiros e evidências de execução à #129 |
| Q-002/Q-006 | Decisões resolvidas: poderes iguais de TI; TI provisiona username/senha e recupera credenciais | Não são pendências; testar conforme RF-002/RF-003/RNF-003 |
| Q-004 | Resolvida: JPEG selecionado da galeria; sem câmera/gravação e com EXIF/GPS removidos | Testar conforme RF-013 |
| Q-007/Q-008 | Resolvidas: regras/lista TI incluindo palavrões; fila, severidades/prazos e encerramento sem justificativa | Testar conforme RF-014/RF-015; implementação #122/#123 pendente |
| Q-009/Q-010 | Resolvidas: consulta TI sem justificativa, exportação, auditoria e política de retenção | Implementar/evidenciar #102/#121/#124, sem reabrir regra de produto |
| Q-011 | Resolvida: PDF/JPEG, 10 MB, 5 arquivos/mensagem, quotas TI e regras antimalware | Implementação/testes #115/#116/#117 pendentes |
| Q-012 | Resolvida: matriz mobile Usuário e desktop TI definida pela FORD | Execução/homologação #129 pendente |
| Q-016/Q-017 | Resolvidas: 25 conexões simultâneas de usuários finais + TI; 99% disponibilidade, RPO 24h, RTO 24h, backups diários por 12 meses | Requisitos definidos; testes de carga/restore pendentes |
| Q-020 | Resolvida: FORD não definiu requisito adicional específico; obrigações aplicáveis permanecem | Testes/evidências pertinentes em #93/#129 |

## 15. Responsabilidades

| Papel | Responsabilidades no processo |
|---|---|
| PO | Priorizar escopo de validação, esclarecer critérios com negócio e registrar aceite funcional; não inventar regra pendente |
| SQA/QA | Manter casos, rastreabilidade, evidências, severidade e parecer independente; validar regressão |
| Desenvolvimento | Implementar automação, corrigir defeitos, fornecer dados/ambientes e evidência técnica |
| Tech Lead | Definir contratos técnicos, apoiar critérios verificáveis, revisar arquitetura, CI e cobertura de riscos |
| Segurança/TI | Validar políticas de segurança, autorização, threat model, auditoria e controles de infraestrutura |
| Representante da FORD / áreas competentes | Decidir parâmetros de negócio, privacidade, dispositivos, carga, retenção e demais questões Q aplicáveis |

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

A estratégia proposta é adequada como base de planejamento e rastreabilidade, mas não representa prontidão integral de teste. A implementação funcional ainda não começou; existem apenas a estrutura inicial Next.js e artefatos isolados (middleware, migration de perfil e testes simulados). Nenhum desses artefatos comprova fluxo de produto integrado ou homologado.

A execução deve ocorrer por fatias, acompanhando a disponibilidade das funcionalidades e dependências: primeiro a fundação de autenticação/autorização; depois dados, RLS e conversas; em seguida mensagens, grupos, anexos e auditoria; por fim, homologação transversal, compatibilidade, acessibilidade, desempenho e recuperação, conforme decisões aprovadas.

A implementação funcional do Polychat ainda não começou. A existência de artefatos de scaffold e testes unitários isolados não representa fluxos de produto implementados. A Issue #126 deve permanecer aberta até a matriz cobrir RF-001 a RF-023/RNF-001 a RNF-013, receber revisão SQA/Tech Lead e manter os casos vinculados a evidências reais quando a implementação estiver disponível. A Issue #129 permanece responsável pela homologação, acessibilidade e regressão executadas.

---

**Histórico:**  
- 19/11/2026 — v0.1: primeira proposta de estratégia de testes, catálogo inicial e matriz de rastreabilidade para revisão.
