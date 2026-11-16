# 09 - Baseline do MVP e rastreabilidade com o backlog

**Identificador:** POLY-REQ-001  
**Versão:** 0.4 (minuta revisada por SQA; pendências mantidas)  
**Data:** 16/11/2026  
**Status:** decisões do levantamento refletidas; aprovação formal do cliente/PO e validações técnicas/jurídicas/QA pendentes  
**Issue de acompanhamento:** [#88 — Consolidar baseline de requisitos e escopo MVP](https://github.com/Aluvioz/Polychat/issues/88)

## 1. Finalidade e leitura desta baseline

Este documento complementa os capítulos 00 a 08. Consolida o que está dentro do primeiro produto utilizável, relaciona requisitos aos épicos/issues existentes e registra conflitos ou decisões que ainda impedem uma baseline aprovada.

A documentação de requisitos já existente no repositório é a fonte de conteúdo funcional desta versão. Este capítulo não substitui os requisitos detalhados nem transforma hipóteses em decisões aprovadas.

Use os seguintes estados:

- **Confirmado:** declarado expressamente nas informações de levantamento registradas nos capítulos 01, 03 e 05.
- **Derivado:** comportamento necessário para tornar o fluxo coerente/testável, ainda sujeito à validação indicada.
- **Bloqueado (BLOCKED):** critério não pode ser validado até que uma decisão, parâmetro ou evidência indicada seja fornecida.
- **Proposto para MVP:** recomendação de organização do primeiro incremento, não compromisso aprovado.
- **Pendente de decisão:** falta informação ou aprovação para fechar o requisito.
- **Fora do MVP informado:** explicitamente excluído do escopo atual.

## 2. Definição consolidada do produto

Polychat é uma aplicação web de comunicação interna para a FORD. O público inicial informado é de 25 funcionários do setor técnico, em uma organização de aproximadamente 900 funcionários com níveis Operacional, Técnico e Estratégico. Somente o setor técnico integra o primeiro lançamento. O produto tem dois identificadores de perfil: **USER** (rótulo Usuário) e **TI**.

O perfil USER (rótulo Usuário) abrange todos os funcionários não alocados em TI, sem hierarquia de permissões por cargo, utiliza celular e pode conversar individualmente com qualquer usuário ativo e participar de grupos criados pelo TI. O perfil TI abrange a equipe de TI, utiliza computador e concentra as funções administrativas: criar/definir credenciais e desativar contas, criar grupos, adicionar/remover membros, administrar medidas de segurança, consultar conversas sob governança e receber alertas. O acesso administrativo a conversas exige política formal de finalidade, autorização, auditoria, transparência e retenção antes da liberação em produção.

A experiência inicial deve apresentar conversas recentes após a autenticação. Os formatos de anexo informados são PDF e JPEG. Não devem existir chamadas/gravações de áudio ou vídeo nem função própria de captura de fotos. JPEG é aceito como arquivo, mas a aplicação não deve oferecer captura própria de fotos. O seletor nativo pode expor recursos do sistema operacional e a aplicação não impede capturas externas ou screenshots.

### 2.1 Stack registrada no backlog técnico

O épico [#79 — Fundação técnica, Vercel e Supabase](https://github.com/Aluvioz/Polychat/issues/79) registra como direção técnica React + TypeScript + Vite, Vercel e Supabase (PostgreSQL, Auth, Realtime, Storage e Edge Functions).

Essa direção está registrada no backlog do projeto, mas as decisões de implementação, trade-offs, configuração e limites devem ser detalhados nas ADRs da [#89](https://github.com/Aluvioz/Polychat/issues/89). A escolha de fornecedores de infraestrutura não contradiz a exclusão de integrações funcionais com aplicativos externos: a exclusão refere-se às integrações oferecidas ao usuário final.

## 3. Escopo proposto para o MVP

### 3.1 Núcleo funcional

| Capacidade | Requisitos | Estado atual | Referência no backlog |
|---|---|---|---|
| Autenticar usuários provisionados pelo TI, sem cadastro público | RF-001, RF-003, RF-004 | Necessidade confirmada; identificador, recuperação e entrega segura de senha pendentes | [#81 Identidade e autenticação](https://github.com/Aluvioz/Polychat/issues/81), tarefas #103–#106 |
| Aplicar os perfis Usuário e TI e negar acesso não autorizado | RF-002, RF-016 | Dois perfis confirmados; matriz detalhada e salvaguardas pendentes | [#80 Modelo de dados, autorização e RLS](https://github.com/Aluvioz/Polychat/issues/80), [#86 Segurança](https://github.com/Aluvioz/Polychat/issues/86) |
| Administrar contas e grupos pelo TI | RF-003 a RF-006 | Criação/desativação de contas, criação de grupos e inclusão de participantes confirmadas | [#83 Grupos](https://github.com/Aluvioz/Polychat/issues/83), [#85 Console TI](https://github.com/Aluvioz/Polychat/issues/85) |
| Listar, abrir e utilizar conversas individuais | RF-007 a RF-009 | Conversa individual confirmada; listagem recente e leitura detalhadas como derivadas | [#82 Conversas e mensagens](https://github.com/Aluvioz/Polychat/issues/82), UX [#91](https://github.com/Aluvioz/Polychat/issues/91) |
| Utilizar conversas em grupo | RF-005, RF-006, RF-010 | Criação, inclusão e envio de mensagens em grupo confirmados; saída voluntária e demais regras de ciclo de vida pendentes | [#83 Grupos](https://github.com/Aluvioz/Polychat/issues/83) |
| Anexar somente PDF/JPEG | RF-011, RF-012, RF-013 | Formatos confirmados; limite, validação de conteúdo e regra da câmera pendentes | [#84 Arquivos e anexos](https://github.com/Aluvioz/Polychat/issues/84) |
| Sinalizar mensagens suspeitas e alertar TI | RF-014, RF-015 | Intenção confirmada; regras, canal, severidade e resposta pendentes | [#86 Segurança](https://github.com/Aluvioz/Polychat/issues/86) |
| Restringir Usuário a celular e TI a computador | RF-017, RF-018 | Intenção confirmada; matriz de dispositivos e método de enforcement pendentes | UX [#91](https://github.com/Aluvioz/Polychat/issues/91) e [#92](https://github.com/Aluvioz/Polychat/issues/92) |

### 3.2 Requisitos transversais para qualquer release

- Autorização no servidor e políticas RLS testadas; esconder controles na interface não é suficiente (RNF-001).
- Senhas não podem ser armazenadas em texto puro e devem usar hash apropriado; sessão e gestão de chaves seguem RNF-003, RNF-016 e RNF-017.
- Acesso do TI às conversas deve ser governado e auditável antes de produção (RNF-004, RNF-011, RNF-014 e RNF-018).
- Anexos devem validar o conteúdo real (RNF-010) e ter armazenamento privado, autorização por conversa e limites aprovados (RNF-019).
- Ambientes, segredos, CI, deploy e recuperação devem ser tratados conforme RNF-009, RNF-013, RNF-016, RNF-020 e RNF-023; a stack registrada no backlog requer ADR e aprovação.
- Segurança tem prioridade sobre velocidade, mas metas mensuráveis de desempenho e carga ainda precisam ser aprovadas (RNF-007 e RNF-008).

### 3.3 Fora do MVP informado

- Acesso por fornecedores, parceiros, agentes externos ou público geral.
- Cadastro aberto, convites ou autoatendimento para criação de conta.
- Integrações funcionais com outros aplicativos/serviços externos.
- Chamadas de áudio/vídeo e gravação de áudio/vídeo.
- Perfil Usuário em computador e perfil TI em celular.
- Expansão automática para os demais funcionários da FORD sem nova aprovação de escopo.

Não estão confirmados como parte do MVP: criptografia ponta a ponta, SSO, MFA, notificações push, exportação de conversas, edição/exclusão de mensagens, confirmação de entrega/leitura, threads, reações, canais e busca avançada. Esses itens só entram mediante decisão explícita e análise de impacto; a existência de issues no backlog não equivale a aprovação de produto.

## 4. Rastreabilidade entre requisitos e backlog

A tabela indica onde o trabalho técnico está organizado. Os vínculos são **rastreabilidade de planejamento**, não declaração de que as issues estejam concluídas, nem criação de dependência formal no GitHub.

| Requisitos / objetivos | Épico ou issue de implementação | Observação de rastreabilidade |
|---|---|---|
| OBJ-001; RF-001 a RF-004 | #81; #103–#106 | Identidade, provisionamento e ciclo de sessão |
| RF-002; RNF-001 a RNF-003 | #80; #100–#101; #86 | Autorização, matriz de permissões e RLS |
| RF-005, RF-006, RF-010, RF-019 | #83; #111–#113; #85 | Grupos, mensagens, membros e administração; regras complementares de ciclo de vida pendentes |
| OBJ-002; RF-007 a RF-009 | #82; #107, #109, #110; #91 | Conversas individuais, mensagens, histórico e interface |
| RF-011 a RF-013; RNF-010 | #84; #114–#116 | Anexos privados, validação e política de formatos |
| RF-014, RF-015, RF-016; RNF-004, RNF-011, RNF-014, RNF-018, RNF-022 | #86; #121–#124; #85 | Detecção, alertas, consulta administrativa, privacidade, auditoria e governança |
| RF-017, RF-018; RNF-005, RNF-006 | #78; #91–#94 | Jornada mobile/desktop, design system e validação UX |
| RNF-007 a RNF-009, RNF-013 | #79; #96–#98 | Ambientes, deploy, continuidade e operação |
| Todos os RF/RNF e critérios CA | #87; #126–#130 | Estratégia de testes, homologação e release |
| Governança e mudanças | #77; #88–#90 | Baseline, ADRs, DoR/DoD e processo de mudança |

## 5. Conflitos e pontos de alinhamento entre requisitos e backlog

| ID | Ponto identificado | Risco / decisão necessária | Encaminhamento sugerido |
|---|---|---|---|
| AL-001 | O épico #80 menciona autorização por tenant/empresa, mas o cliente confirmou que o produto é exclusivo da FORD e não terá múltiplas empresas no escopo atual. | Multi-tenancy multiempresa ampliaria o MVP sem requisito confirmado; isolamento dos dados da FORD continua obrigatório. | Tratar FORD como única organização no MVP; registrar ADR sobre o modelo de isolamento e ajustar #80 se necessário. |
| AL-002 | O épico #82 prevê Realtime e estados básicos de entrega; os requisitos atuais confirmam conversas e mensagens, mas não especificam confirmação de entrega/leitura. | Pode haver funcionalidade implementada sem requisito de negócio aprovado. | Tratar Realtime como solução técnica candidata; confirmar estados de entrega/leitura antes de incluí-los como comportamento de produto. |
| AL-003 | RF-016 permite que TI consulte qualquer conversa; #86 exige política formal e auditoria. | A capacidade sem salvaguardas amplia risco de privacidade e abuso interno. | Não liberar consulta administrativa em produção antes da aprovação da política e dos controles de auditoria. |
| AL-004 | JPEG é permitido como anexo, mas a aplicação não pode oferecer captura de fotos. | Seletor nativo pode expor câmera conforme sistema operacional; bloqueio total de captura fora da aplicação não é garantível. | Não invocar APIs de câmera/microfone nem oferecer controles de captura; homologar o seletor nativo e documentar limitações. |
| AL-005 | RF-017/RF-018 exigem celular para Usuário e computador para TI, mas a identificação por user-agent/tamanho de tela não é controle robusto por si só. | Falsos bloqueios e possibilidade de contorno. | Definir dispositivos homologados e aplicar autorização no servidor para operações; tratar classificação do dispositivo como requisito separado. |
| AL-006 | O requisito de análise de mensagens suspeitas não define termos, contexto, falso positivo, canal ou ação. | Critérios não são testáveis e podem levar a bloqueio indevido. | Aprovar política e fluxo humano; até lá, não inferir bloqueio automático. |
| AL-007 | O orçamento de R$ 450.000,00 e público inicial de 25 pessoas não têm composição/concorrência definidas. | Estimativas de custo, capacidade e infraestrutura podem ser incorretas. | Confirmar se o orçamento inclui operação e quantas sessões simultâneas devem ser suportadas. |
| AL-008 | O README do repositório ainda é um resumo acadêmico e não aponta para o índice de requisitos. | A baseline pode não ser descoberta pelos contribuidores. | Considerar link para docs/README.md no README principal em uma tarefa de documentação separada. |

## 6. Questões que bloqueiam a aprovação final da baseline

As perguntas completas permanecem em [08 - Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md). Para aprovação do MVP, priorizar respostas documentadas para:

1. **Q-001/Q-002:** composição dos 25 usuários e governança de administradores TI.
2. **Q-003:** permissões e ciclo de vida de grupos.
3. **Q-004:** uso de JPEG sem captura pela câmera.
4. **Q-005/Q-006:** identificador de login, senha inicial, redefinição e entrega segura.
5. **Q-007/Q-008:** critérios de suspeição, alertas e tratamento.
6. **Q-009/Q-010:** consulta de conversas pelo TI, auditoria, transparência, retenção e exclusão.
7. **Q-011/Q-012:** limites de arquivos e matriz de dispositivos.
8. **Q-013/Q-014/Q-015:** modelo de ameaças, infraestrutura, jurisdição e solicitações legais.
9. **Q-016/Q-017:** concorrência, desempenho, disponibilidade, RPO e RTO.
10. **Q-019/Q-020:** ativos de marca e requisitos de acessibilidade aplicáveis.
11. **Q-025/Q-026:** criptografia, E2EE e gestão de chaves.
12. **Q-027/Q-028:** auditoria do acesso TI, critérios de detecção e falsos positivos.
13. **Q-029/Q-030:** retenção, backups e segurança da infraestrutura.
14. **Q-031/Q-032:** limites de captura pelo dispositivo, sessões e credenciais.

Responsáveis sugeridos: representante da FORD/cliente, TI da FORD, PO, líder técnico, segurança/privacidade/jurídico e QA. Os nomes e aprovações ainda não constam no repositório.

## 7. Controle de mudanças da baseline

Toda alteração posterior deve ser registrada antes de atualizar os requisitos:

1. Identificar requisito(s) afetado(s) por seus IDs (OBJ, RF, RNF, RN, CA).
2. Registrar origem da mudança, solicitante, justificativa e data.
3. Classificar a mudança como correção, esclarecimento, inclusão, alteração ou remoção.
4. Avaliar impacto em escopo, arquitetura, dados, autorização/RLS, segurança/privacidade, UX, testes, prazo e custo.
5. Atualizar rastreabilidade com épicos/issues afetados; abrir ou ajustar issues somente após alinhamento do PO.
6. Obter aprovação do responsável de produto e, quando aplicável, cliente, TI, segurança/privacidade e líder técnico.
7. Versionar a documentação e registrar a decisão no histórico; mudanças técnicas/arquiteturais relevantes também devem ter ADR.

Não marcar requisito como aprovado apenas porque existe issue correspondente ou código implementado.

## 8. Verificação documental realizada nesta revisão

- Conferidos os capítulos 00 a 09, o índice docs/README.md, a Issue #88, seus comentários e a PR #131.
- Conferidos os épicos #77 e #79–#87 e as issues #88–#94 disponíveis durante a revisão.
- Conferida a relação de sub-issues explicitada nos corpos dos épicos.
- A matriz deste capítulo foi feita por correspondência de escopo; não altera relações formais de dependência do GitHub.
- Esta alteração é documental. Não foram executados testes automatizados de aplicação porque nenhum código funcional foi alterado.
- A revisão SQA documental e seus resultados estão em [10 - Matriz e checklist SQA](10-matriz-e-checklist-sqa.md). Aprovação do cliente/PO, revisão técnica/segurança e respostas às questões abertas permanecem pendentes.

## 9. Critério de saída da baseline

A baseline poderá ser considerada aprovada quando:

- [ ] Cliente/representante da FORD identificado e aprovação registrada.
- [ ] PO identificado e prioridades/escopo do MVP aprovados.
- [ ] Questões críticas da seção 6 respondidas ou formalmente aceitas como risco/fora do MVP.
- [ ] Líder técnico validar compatibilidade com a arquitetura e ADRs.
- [ ] QA validar testabilidade e cobertura dos critérios de aceitação.
- [ ] Matriz de rastreabilidade revisada e PR aprovado.


## 10. Matriz de perfis e permissões

| Capacidade | Usuário | TI |
|---|---|---|
| Autenticar com conta provisionada | Sim | Sim |
| Criar/provisionar/desativar contas | Não | Sim |
| Criar grupos e adicionar/remover membros | Não | Sim |
| Conversar individualmente | Sim, com qualquer usuário ativo | Sim, conforme conta habilitada |
| Participar de grupos | Sim, se incluído pelo TI | Sim, se incluído |
| Administrar medidas de segurança | Não | Sim |
| Consultar conversas alheias | Não | Sim, sob governança e auditoria |
| Receber alertas de mensagens suspeitas | Não | Sim |
| Criar hierarquia por cargo corporativo | Não | Não |

## 11. Catálogo consolidado de requisitos

### 11.1 Funcionais

| ID | Requisito | Estado |
|---|---|---|
| RF-001 | Autenticar por usuário e senha | Confirmado |
| RF-002 | Aplicar somente perfis Usuário e TI, sem hierarquia por cargo | Confirmado |
| RF-003/RF-004 | TI cria, provisiona e desativa contas | Confirmado |
| RF-005/RF-006/RF-019 | TI cria grupos, adiciona e remove participantes | Confirmado |
| RF-007/RF-008 | Exibir conversas recentes e abrir conversas autorizadas | Confirmado/derivado |
| RF-009/RF-010 | Enviar mensagens individuais e em grupos dos quais participa | Individual confirmado; grupos derivados |
| RF-011/RF-012 | Aceitar somente PDF e JPEG | Confirmado |
| RF-013 | Não oferecer captura de foto, gravação ou envio de áudio/vídeo | Confirmado |
| RF-014/RF-015 | Analisar conteúdo suspeito, incluindo palavrões, e alertar TI | Intenção confirmada; política pendente |
| RF-016 | TI consulta qualquer conversa, sob governança e auditoria | Confirmado com salvaguardas |
| RF-017 | Bloquear Usuário em computador com mensagem exata “só pode ser usado em celular” | Confirmado |
| RF-018 | Bloquear TI em celular | Confirmado |
| RF-020 | TI administra medidas de segurança disponibilizadas | Responsabilidade confirmada; catálogo pendente |

### 11.2 Não funcionais

| ID | Requisito | Estado |
|---|---|---|
| RNF-001 a RNF-004 | Autorização server-side, proteção de dados/credenciais e auditabilidade | Controles requeridos; desenho pendente |
| RNF-005/RNF-006 | Compatibilidade por perfil e UX simples | Direção confirmada |
| RNF-007/RNF-008 | Segurança acima de velocidade; dimensionar para 25 pessoas | Confirmado; métricas pendentes |
| RNF-009/RNF-010 | Continuidade e segurança de anexos | Parâmetros/controles pendentes |
| RNF-011/RNF-014 | Governança, transparência e conformidade LGPD | Obrigação aplicável; política pendente |
| RNF-012 | Acessibilidade conforme obrigações aplicáveis | Pendente de avaliação |
| RNF-013 | Nenhuma restrição de linguagem/framework/provedor imposta pelo cliente | Confirmado |
| RNF-015/RNF-016 | Definição de criptografia e ciclo de vida das chaves | Pendente crítico |
| RNF-017/RNF-018 | Sessões revogáveis e logs administrativos protegidos | Requerido; parâmetros pendentes |
| RNF-019/RNF-020 | Proteção de anexos e infraestrutura | Controles pendentes |
| RNF-021 | Reconhecer que identificação de dispositivo pode ser contornada | Limitação técnica conhecida |
| RNF-022 | Avaliar falsos positivos/negativos na detecção automática | Política pendente |
| RNF-023 | Backup, retenção e descarte seguro | Pendente crítico |

## 12. Regras de negócio consolidadas

- RN-021: FORD é a única organização atendida no escopo atual; não há requisito multiempresa.
- RN-022: Operacional, Técnico e Estratégico são níveis organizacionais, não perfis. Só existem Usuário e TI.
- RN-023: conteúdos permitidos: texto, PDF e JPEG; sem áudio/vídeo, gravação ou outros formatos.
- RN-024: somente TI cria grupos e adiciona/remove participantes.
- RN-025: Usuário em computador recebe exatamente “só pode ser usado em celular”; TI em celular é bloqueado.
- RN-026: monitoramento e acesso administrativo devem observar LGPD, transparência, finalidade, governança e rastreabilidade.

## 13. Segurança, monitoramento e privacidade

O TI pode consultar conversas e receber alertas. Isso não autoriza acesso invisível ou sem responsabilização. Antes da produção, a FORD deve aprovar finalidade, base legal, transparência aos funcionários, perfis administrativos, justificativa de consulta, trilha de auditoria, retenção, revisão de acessos, resposta a incidentes e tratamento de solicitações de titulares/autoridades.

A análise automática inclui palavrões e outras categorias a definir pela FORD. O requisito confirmado é alertar o TI; bloqueio, punição, suspensão ou exclusão automática não foram autorizados. Falsos positivos e negativos exigem revisão humana, critérios versionados e processo de contestação.

### 13.1 Criptografia ponta a ponta versus consulta TI

| Modelo | Benefício | Impacto |
|---|---|---|
| Criptografia em trânsito e em armazenamento, com conteúdo disponível no servidor sob autorização | Viabiliza análise server-side e consulta administrativa governada | Administradores/serviços privilegiados podem potencialmente acessar conteúdo; requer controle e auditoria fortes |
| E2EE estrita, com chaves somente nos endpoints | Reduz capacidade do servidor de ler conteúdo | TI não consulta conteúdo no servidor e análise automática server-side não lê o texto em claro |
| Modelo híbrido com acesso excepcional/escrow ou cópia de conformidade | Pode conciliar consulta e análise com controles criptográficos | Amplia superfície de ataque e concentração de poder; não é E2EE estrita e exige aprovação formal |

**Nenhum modelo foi escolhido.** A decisão deve ser registrada em ADR na Issue #89, incluindo threat model, fluxos de dados, gestão de chaves, papéis com acesso, rotação/revogação, riscos e consequências. Não prometer segurança absoluta ou impossibilidade de acesso por terceiros.

### 13.2 Anexos, sessões e infraestrutura

PDF/JPEG exigem validação do conteúdo real, limites aprovados, armazenamento privado, autorização por conversa, proteção contra URL pública, avaliação antimalware e tratamento de arquivos corrompidos/ativos. Sessões exigem expiração e revogação após desativação ou comprometimento; senhas não podem ser armazenadas em texto puro. Infraestrutura deve contemplar segregação de ambientes, menor privilégio, gestão de segredos, hardening, patches, observabilidade, resposta a incidentes, backup e recuperação. Nenhum provedor ou algoritmo foi escolhido nesta baseline.

## 14. Dispositivos, interface e identidade visual

- Aplicação WEB por link entregue pelo TI.
- Usuário somente em celular; computador bloqueado com “só pode ser usado em celular”.
- TI somente em computador; celular bloqueado.
- User-agent, viewport e sinais do navegador podem ser manipulados. Complementar com dispositivos homologados, autenticação forte, sessões revogáveis e autorização server-side; não tratar detecção como garantia.
- Interface azul e branca FORD, tela de login e tela principal com conversas recentes.
- Manual, logotipo, cores oficiais, fontes e navegadores homologados ainda não foram fornecidos. A ausência de requisito de acessibilidade não afasta obrigações legais ou usabilidade mínima.

## 15. Critérios de aceitação verificáveis — resumo

| Requisito | Evidência mínima |
|---|---|
| RF-001 a RF-004 | Login válido/inválido; conta desativada negada; só TI provisiona; sem cadastro/convites |
| RF-002 | Dois perfis somente; usuários de cargos distintos com permissões idênticas |
| RF-005/RF-006/RF-019 | TI cria grupo e adiciona/remove membros; usuário não cria grupo; removido perde acesso futuro |
| RF-007 a RF-010 | Lista recente ordenada; mensagem individual entre usuários ativos; grupo restrito a membros |
| RF-011 a RF-013 | PDF/JPEG aceitos; outros formatos/áudio/vídeo rejeitados; sem controles próprios de captura/gravação |
| RF-014/RF-015/RNF-022 | Casos aprovados de conteúdo suspeito geram alerta com motivo; falso positivo revisável; sem punição automática |
| RF-016/RNF-018 | TI consulta, Usuário não; log protegido registra operador, data/hora, alvo e justificativa |
| RF-017 | Usuário em computador bloqueado com a mensagem literal exigida |
| RF-018 | TI em celular bloqueado antes das funções administrativas |
| RNF-001 | Testes negativos de API, URL direta e autorização server-side |
| RNF-014 | Política LGPD/monitoramento aprovada e transparência demonstrável |
| RNF-015/RNF-016 | ADR de criptografia e chaves aprovada com impactos de acesso TI/análise explícitos |
| RNF-019/RNF-020/RNF-023 | Testes de anexos, infraestrutura, backup/restauração e retenção/descarte |

Limites de arquivo, concorrência, retenção, RPO/RTO, navegadores e severidade ainda não foram informados; critérios que dependem deles não estão totalmente testáveis até decisão formal.

## 16. Matriz de rastreabilidade consolidada

| Capacidade/objetivo | Requisitos | Regras | Backlog |
|---|---|---|---|
| Comunicação interna FORD | RF-001, RF-003, RF-004, RF-009 | RN-004, RN-005, RN-009, RN-021 | #81, #82 |
| Perfis e autorização | RF-002 | RN-001, RN-002, RN-022 | #80, #86 |
| Contas e grupos | RF-003 a RF-006, RF-019, RF-020 | RN-003, RN-004, RN-007, RN-024 | #83, #85 |
| Conversas e UX | RF-007 a RF-010 | RN-006, RN-010 | #82, #91 |
| Anexos e mídia | RF-011 a RF-013 | RN-008, RN-011, RN-023 | #84 |
| Detecção e alertas | RF-014, RF-015 | RN-012, RN-013 | #86 |
| Consulta TI e auditoria | RF-016 | RN-014, RN-026 | #85, #86 |
| Dispositivos | RF-017, RF-018 | RN-015, RN-025 | #91, #92 |
| Segurança e operação | RNF-001 a RNF-023 | RN-016, RN-026 | #79, #80, #86, #89 |
| Testes e release | Todos os RF/RNF/CA | Regras aplicáveis | #87 |

Vínculos são rastreabilidade de planejamento, não declaração de conclusão ou dependência formal no GitHub.

## 17. Glossário, questões pendentes e riscos

O glossário e as questões Q-001 a Q-032 estão no capítulo 08. Priorizar: composição dos 25 usuários; governança dos administradores TI; ciclo de vida de grupos; identificador/recuperação de credenciais; critérios e falsos positivos; auditoria TI; limites PDF/JPEG; matriz de dispositivos; criptografia/chaves; retenção/backups; infraestrutura; acessibilidade; identidade visual; orçamento e metas operacionais.

Riscos principais: conflito E2EE/consulta TI; abuso de privilégio; falso positivo; seletor JPEG expondo câmera do SO; contorno de detecção de dispositivo; vazamento por anexos/URLs; retenção inadequada; comprometimento de infraestrutura; orçamento sem composição.

## 18. Continuidade na Issue #89

A Issue #89 deve registrar ADRs, sem assumir que a stack anotada no backlog já foi aprovada pelo cliente. Priorizar decisões sobre: criptografia/E2EE e acesso TI; identidade, credenciais e sessão; autorização server-side e organização única FORD; anexos/Storage e retenção; análise automática e alertas; hospedagem, ambientes, segredos, backup e resposta a incidentes; restrição de dispositivo.

Cada ADR deve conter contexto, alternativas, decisão, consequências, riscos, evidências e status (proposta/aceita/rejeitada). Não escolher linguagem, framework, provedor ou algoritmo sem justificativa e evidência.

## 19. Evidência, aprovação e condição de encerramento

- Issue #88, comentários e PR #131 consultados.
- PR #131 está em Draft; não há reviews nem threads de revisão registrados.
- Capítulos 00 a 09 e README foram consultados na branch de trabalho.
- Esta alteração é documental; não modifica código funcional. Testes de aplicação não são aplicáveis, mas revisão técnica e QA documental permanecem pendentes.
- Não foi encontrada aprovação formal do representante autorizado da FORD nem do PO.

Checklist:
- [x] Decisões do levantamento de 16/11/2026 refletidas na minuta.
- [x] Perfis, público inicial, escopo e fora de escopo documentados.
- [x] Requisitos e regras com IDs estáveis.
- [x] Critérios de aceitação, rastreabilidade, riscos e questões ampliados.
- [ ] Representante autorizado da FORD identificado e aprovação formal registrada.
- [ ] PO identificado e escopo/prioridades aprovados.
- [ ] Decisões críticas de segurança/privacidade aprovadas.
- [ ] ADRs/validação técnica concluídas.
- [ ] QA revisou critérios e evidências; revisão do PR concluída.
- [ ] Baseline POLY-REQ-001 v0.3 formalmente aprovada.

**Status:** revisão documental v0.4 registrada; baseline não aprovada. A classificação final SQA e os bloqueios constam no documento 10. A Issue #88 deve permanecer aberta até que as pendências obrigatórias sejam evidenciadas.
