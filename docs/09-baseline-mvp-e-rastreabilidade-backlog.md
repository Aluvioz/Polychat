# 09 - Baseline do MVP e rastreabilidade com o backlog

**Identificador:** POLY-REQ-001  
**Versão:** 0.2 (proposta para revisão)  
**Data:** 13/11/2026  
**Status:** minuta consolidada; aprovação do cliente/PO pendente  
**Issue de acompanhamento:** [#88 — Consolidar baseline de requisitos e escopo MVP](https://github.com/Aluvioz/Polychat/issues/88)

## 1. Finalidade e leitura desta baseline

Este documento complementa os capítulos 00 a 08. Consolida o que está dentro do primeiro produto utilizável, relaciona requisitos aos épicos/issues existentes e registra conflitos ou decisões que ainda impedem uma baseline aprovada.

A documentação de requisitos já existente no repositório é a fonte de conteúdo funcional desta versão. Este capítulo não substitui os requisitos detalhados nem transforma hipóteses em decisões aprovadas.

Use os seguintes estados:

- **Confirmado:** declarado expressamente nas informações de levantamento registradas nos capítulos 01, 03 e 05.
- **Derivado:** comportamento necessário para tornar o fluxo coerente/testável, ainda sujeito à validação indicada.
- **Proposto para MVP:** recomendação de organização do primeiro incremento, não compromisso aprovado.
- **Pendente de decisão:** falta informação ou aprovação para fechar o requisito.
- **Fora do MVP informado:** explicitamente excluído do escopo atual.

## 2. Definição consolidada do produto

Polychat é uma aplicação web de comunicação interna para a FORD. O público inicial informado é de 25 pessoas do nível técnico, em uma organização de aproximadamente 900 funcionários. O produto tem dois perfis: **Usuário** e **TI**.

O perfil Usuário utiliza celular e pode conversar individualmente com qualquer outro usuário ativo e participar de grupos administrados pelo TI. O perfil TI utiliza computador e administra contas e grupos; também foi solicitado que possa consultar conversas e receber alertas sobre mensagens sinalizadas. O acesso administrativo a conversas exige política formal de finalidade, autorização, auditoria, transparência e retenção antes da liberação em produção.

A experiência inicial deve apresentar conversas recentes após a autenticação. Os formatos de anexo informados são PDF e JPEG. Não devem existir chamadas/gravações de áudio ou vídeo nem função própria de captura de fotos. A compatibilidade entre aceitar JPEG e não permitir captura pela câmera permanece pendente.

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
| Utilizar conversas em grupo | RF-005, RF-006, RF-010 | Criação e inclusão confirmadas; envio, saída e remoção de membros pendentes de validação | [#83 Grupos](https://github.com/Aluvioz/Polychat/issues/83) |
| Anexar somente PDF/JPEG | RF-011, RF-012, RF-013 | Formatos confirmados; limite, validação de conteúdo e regra da câmera pendentes | [#84 Arquivos e anexos](https://github.com/Aluvioz/Polychat/issues/84) |
| Sinalizar mensagens suspeitas e alertar TI | RF-014, RF-015 | Intenção confirmada; regras, canal, severidade e resposta pendentes | [#86 Segurança](https://github.com/Aluvioz/Polychat/issues/86) |
| Restringir Usuário a celular e TI a computador | RF-017, RF-018 | Intenção confirmada; matriz de dispositivos e método de enforcement pendentes | UX [#91](https://github.com/Aluvioz/Polychat/issues/91) e [#92](https://github.com/Aluvioz/Polychat/issues/92) |

### 3.2 Requisitos transversais para qualquer release

- Autorização no servidor e políticas RLS testadas; esconder controles na interface não é suficiente (RNF-001).
- Proteção de credenciais, sessões, mensagens e anexos em trânsito e em armazenamento, com arquitetura e gestão de chaves documentadas (RNF-002 e RNF-003).
- Acesso do TI às conversas deve ser governado e auditável antes de produção (RNF-004 e RNF-011).
- Anexos devem validar o conteúdo real, não apenas a extensão, e ter acesso privado/autorizado (RNF-010).
- Ambientes, segredos, CI, deploy e recuperação devem ser tratados no trabalho de fundação técnica (RNF-009 e RNF-013).
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
| RF-005, RF-006, RF-010 | #83; #111–#113; #85 | Grupos, membros e administração |
| OBJ-002; RF-007 a RF-009 | #82; #107, #109, #110; #91 | Conversas individuais, mensagens, histórico e interface |
| RF-011 a RF-013; RNF-010 | #84; #114–#116 | Anexos privados, validação e política de formatos |
| RF-014, RF-015, RF-016; RNF-004, RNF-011 | #86; #121–#124; #85 | Detecção, alertas, consulta administrativa, auditoria e governança |
| RF-017, RF-018; RNF-005, RNF-006 | #78; #91–#94 | Jornada mobile/desktop, design system e validação UX |
| RNF-007 a RNF-009, RNF-013 | #79; #96–#98 | Ambientes, deploy, continuidade e operação |
| Todos os RF/RNF e critérios CA | #87; #126–#130 | Estratégia de testes, homologação e release |
| Governança e mudanças | #77; #88–#90 | Baseline, ADRs, DoR/DoD e processo de mudança |

## 5. Conflitos e pontos de alinhamento entre requisitos e backlog

| ID | Ponto identificado | Risco / decisão necessária | Encaminhamento sugerido |
|---|---|---|---|
| AL-001 | O épico #80 menciona autorização por tenant/empresa, enquanto o escopo atual descreve somente a FORD como organização cliente. | Implementar multi-tenancy completo pode ampliar o MVP sem necessidade; não implementar isolamento organizacional pode contrariar a intenção do épico. | Líder técnico/PO deve decidir se o MVP terá um único tenant FORD com isolamento interno ou suporte multiempresa real. |
| AL-002 | O épico #82 prevê Realtime e estados básicos de entrega; os requisitos atuais confirmam conversas e mensagens, mas não especificam confirmação de entrega/leitura. | Pode haver funcionalidade implementada sem requisito de negócio aprovado. | Tratar Realtime como solução técnica candidata; confirmar estados de entrega/leitura antes de incluí-los como comportamento de produto. |
| AL-003 | RF-016 permite que TI consulte qualquer conversa; #86 exige política formal e auditoria. | A capacidade sem salvaguardas amplia risco de privacidade e abuso interno. | Não liberar consulta administrativa em produção antes da aprovação da política e dos controles de auditoria. |
| AL-004 | RF-011 permite JPEG, mas RF-013 proíbe captura de fotos. | O seletor de arquivo pode expor a câmera dependendo do dispositivo/navegador. | Cliente/UX deve definir se JPEG será apenas arquivo já existente e qual comportamento de câmera é proibido. |
| AL-005 | RF-017/RF-018 exigem celular para Usuário e computador para TI, mas a identificação por user-agent/tamanho de tela não é controle robusto por si só. | Falsos bloqueios e possibilidade de contorno. | Definir dispositivos homologados e aplicar autorização no servidor para operações; tratar classificação do dispositivo como requisito separado. |
| AL-006 | O requisito de análise de mensagens suspeitas não define termos, contexto, falso positivo, canal ou ação. | Critérios não são testáveis e podem levar a bloqueio indevido. | Aprovar política e fluxo humano; até lá, não inferir bloqueio automático. |
| AL-007 | O orçamento de R$ 450.000,00 e público inicial de 25 pessoas não têm composição/concorrência definidas. | Estimativas de custo, capacidade e infraestrutura podem ser incorretas. | Confirmar se o orçamento inclui operação e quantas sessões simultâneas devem ser suportadas. |
| AL-008 | O README do repositório ainda é um resumo acadêmico e não aponta para o índice de requisitos. | A baseline pode não ser descoberta pelos contribuidores. | Considerar link para docs/README.md no README principal em uma tarefa de documentação separada. |

## 6. Questões que bloqueiam a aprovação final da baseline

As perguntas completas permanecem em [08 - Glossário e questões em aberto](08-glossario-e-questoes-em-aberto.md). Para aprovação do MVP, priorizar respostas documentadas para:

1. **Q-001/Q-002:** composição dos 25 usuários e quem administra contas com perfil TI.
2. **Q-003:** permissões e ciclo de vida de grupos.
3. **Q-004:** uso de JPEG sem captura pela câmera.
4. **Q-005/Q-006:** identificador de login, senha inicial, redefinição e entrega segura.
5. **Q-007/Q-008:** critérios de suspeição, alertas e tratamento.
6. **Q-009/Q-010:** consulta de conversas pelo TI, auditoria, transparência, retenção e exclusão.
7. **Q-011/Q-012:** limites de arquivos e matriz de dispositivos.
8. **Q-013/Q-014/Q-015:** modelo de ameaças, infraestrutura, jurisdição e solicitações legais.
9. **Q-016/Q-017:** concorrência, desempenho, disponibilidade, RPO e RTO.
10. **Q-019/Q-020:** ativos de marca e requisitos de acessibilidade aplicáveis.

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

- Conferidos os capítulos 00 a 08 existentes no repositório e o README acadêmico.
- Conferidos os épicos #77 e #79–#87 e as issues #88–#94 disponíveis durante a revisão.
- Conferida a relação de sub-issues explicitada nos corpos dos épicos.
- A matriz deste capítulo foi feita por correspondência de escopo; não altera relações formais de dependência do GitHub.
- Esta alteração é documental. Não foram executados testes automatizados de aplicação porque nenhum código funcional foi alterado.
- A aprovação do cliente/PO, revisão por PR e validação das questões abertas permanecem pendentes.

## 9. Critério de saída da baseline

A baseline poderá ser considerada aprovada quando:

- [ ] Cliente/representante da FORD identificado e aprovação registrada.
- [ ] PO identificado e prioridades/escopo do MVP aprovados.
- [ ] Questões críticas da seção 6 respondidas ou formalmente aceitas como risco/fora do MVP.
- [ ] Líder técnico validar compatibilidade com a arquitetura e ADRs.
- [ ] QA validar testabilidade e cobertura dos critérios de aceitação.
- [ ] Matriz de rastreabilidade revisada e PR aprovado.
