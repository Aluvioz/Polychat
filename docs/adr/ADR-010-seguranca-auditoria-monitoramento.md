# ADR-010 — Segurança, auditoria e monitoramento

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issue de origem:** #89
- **Issues relacionadas:** #102, #122, #123, #124, #125, #126 e #130
- **Baseline:** POLY-REQ-001 v0.5
- **Responsabilidade operacional de segurança:** TI da FORD

## Contexto e decisões de produto vigentes

A FORD v2 e a baseline POLY-REQ-001 v0.5 consolidam as regras de monitoramento de mensagens, investigação administrativa, auditoria, retenção e proteção de dados. Essas regras são decisões de produto e não devem ser reabertas como dúvidas funcionais nesta ADR.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, dentro dos limites e responsabilidades registrados. Esta ADR não reabre a decisão de stack nem exige nova avaliação de compatibilidade já concluída.

A FORD definiu criptografia em trânsito e em repouso, sem criptografia ponta a ponta (E2EE). O servidor precisa acessar o conteúdo em claro para executar monitoramento, consulta administrativa e funções de administração confirmadas. As chaves permanecem sob gestão do servidor e responsabilidade operacional da TI da FORD.

O monitoramento de mensagens deve ser determinístico, baseado em regras e lista de termos mantida pelo TI, incluindo palavrões. Não haverá análise contextual, uso de IA ou envio do conteúdo a serviços adicionais de análise. A detecção gera alerta para revisão humana; não bloqueia automaticamente mensagens, não suspende contas e não aplica punição automática.

O TI pode consultar qualquer conversa a qualquer momento, inclusive sem ser participante, sem justificativa obrigatória ou aprovação prévia de outro administrador. Também pode exportar conversas, editar ou excluir mensagens e baixar anexos durante investigações. Todos os administradores TI possuem poderes equivalentes; não há administrador principal, hierarquia ou segunda aprovação. Essas permissões e os riscos de confiança correspondentes foram avaliados pela FORD e não devem ser reabertos como decisão de produto.

A TI da FORD é responsável operacional por segurança. A FORD informou que não haverá uma frente separada de Segurança da Informação ou Jurídico/Privacidade conduzindo este projeto e indicou TI como canal operacional para solicitações de acesso, correção e exclusão. Essa informação registra a organização e as responsabilidades comunicadas pelo cliente; não constitui dispensa de obrigações legais aplicáveis, nem declaração de conformidade jurídica.

## Problema

Registrar as decisões e os controles necessários para proteger conteúdo, monitorar mensagens, permitir investigação pelo TI e auditar ações privilegiadas, distinguindo as regras funcionais já definidas dos componentes técnicos parcialmente implementados e das integrações ainda pendentes.

## Alternativas consideradas

1. **E2EE estrita:** incompatível com as funções confirmadas de monitoramento server-side, consulta administrativa e administração de conteúdo, pois o servidor não teria acesso ao conteúdo em claro.
2. **Criptografia em trânsito e em repouso, com processamento server-side nos componentes da stack aprovada:** atende ao modelo funcional confirmado e preserva a capacidade de análise e investigação; não é E2EE e exige controles efetivos de acesso, segredos e auditoria.
3. **Processamento do conteúdo por IA, scanner de mensagens ou provedor adicional:** não integra o modelo aprovado. Não encaminhar conteúdo a serviços adicionais sem avaliação e aprovação específicas.
4. **Bloqueio automático após detecção:** não atende ao requisito vigente, que prevê alertas para revisão humana sem bloqueio ou punição automáticos.

## Decisão proposta

Manter o modelo de **criptografia em trânsito e em repouso, sem E2EE**, com processamento server-side nos componentes da stack Supabase + Vercel adotada e aprovada no modelo de utilização da Q-025. A implementação deve preservar as regras de produto a seguir, com acesso mínimo técnico, gestão segura de credenciais e rastreabilidade das ações privilegiadas.

A ADR permanece Proposed porque os módulos de monitoramento, fila de alertas e diversas integrações de auditoria ainda não estão concluídos ou homologados. A existência de tabelas, writers, migrations e testes parciais não comprova a implementação ponta a ponta nem autoriza declarar os controles como operacionais.

### 1. Proteção criptográfica, acesso e chaves

- Proteger dados em trânsito e em repouso.
- Não declarar nem divulgar o produto como E2EE.
- O servidor mantém acesso técnico ao conteúdo necessário ao monitoramento e às operações administrativas previstas.
- A gestão de chaves permanece sob responsabilidade do servidor e da TI da FORD, seguindo os requisitos vigentes de proteção de credenciais e gestão de chaves.
- Segredos privilegiados devem permanecer exclusivamente em contexto server-side autorizado; nunca devem ser expostos no bundle do cliente, em variáveis públicas, logs ou repositório.
- O processamento deve ocorrer no modelo de utilização Supabase + Vercel aprovado na Q-025. Não enviar conteúdo, metadados ou chaves para serviços adicionais de terceiros ou ferramentas de IA não aprovados.

### 2. Monitoramento de mensagens e alertas

- A detecção utiliza regras determinísticas e lista de termos mantida pelo TI, incluindo palavrões.
- Não realizar análise contextual nem utilizar IA/modelos externos para analisar mensagens.
- A detecção gera ocorrência e alerta para revisão humana na fila administrativa do TI.
- A detecção, isoladamente, não bloqueia a entrega da mensagem, não desativa a conta e não aplica punição automática.
- O alerta deve permitir identificar a regra/versão aplicada, severidade, estado e contexto mínimo necessário à investigação, sem replicar conteúdo desnecessário em logs.
- A indisponibilidade ou falha do detector não pode ser apresentada como resultado limpo.

**Severidades e prazos de resposta consolidados:**

| Severidade | Prazo de resposta |
|---|---|
| Alta | Imediato, em até 1 hora |
| Média | Até 1 dia útil |
| Baixa | Até 3 dias úteis |

- Os alertas são apresentados em fila administrativa acessível ao TI.
- O TI analisa e pode encerrar alertas sem justificativa obrigatória.
- A taxonomia, severidades e prazos são requisitos consolidados e não devem ser reabertos como pendências de produto.

### 3. Consulta, exportação e administração de conversas

- Qualquer administrador TI pode consultar qualquer conversa a qualquer momento, mesmo sem ser participante.
- Não é exigida justificativa nem aprovação prévia de outro administrador para a consulta.
- O TI pode exportar conversas.
- O TI pode editar ou excluir mensagens a qualquer momento.
- O TI pode baixar anexos durante investigações.
- Todos os administradores TI possuem poderes equivalentes; não criar administrador principal, hierarquia ou fluxo de segunda aprovação.
- A consulta administrativa, exportação, edição/exclusão de mensagens, download de anexos e demais ações administrativas relevantes devem gerar registros de auditoria.
- A consulta administrativa não transforma o TI em participante da conversa.
- As permissões funcionais confirmadas não eliminam a necessidade de autenticação, autorização server-side, proteção das credenciais e registro das ações.

### 4. Catálogo e proteção da auditoria

A trilha de auditoria deve cobrir, conforme os respectivos fluxos sejam implementados:

- login administrativo, inclusive tentativa malsucedida;
- criação, alteração e desativação de contas;
- criação, alteração e desativação de grupos;
- inclusão e remoção de participantes;
- consulta administrativa de conversas;
- consulta, tratamento e encerramento de alertas;
- download e liberação administrativa de anexos;
- exportação de conversas;
- edição e exclusão administrativa de mensagens;
- alteração de configurações;
- colocação/liberação de retenção investigativa e descarte autorizado de eventos de auditoria.

Os registros devem permitir identificar o operador, a ação, o recurso/objeto afetado, o instante do evento e o resultado, além dos metadados técnicos estritamente necessários. Não registrar senhas, tokens, cookies, chaves, cabeçalhos de autorização nem cópia integral de mensagens/anexos em metadados de auditoria.

Somente TI pode consultar e gerenciar registros de auditoria. Usuários comuns não podem consultá-los, alterá-los ou excluí-los. A trilha deve impedir alteração direta dos eventos por papéis comuns da aplicação; descarte excepcional deve seguir autorização do TI, verificar retenção investigativa e gerar registro próprio, conforme o mecanismo efetivamente implementado.

A implementação deve distinguir:
- **Auditoria genérica:** eventos de operações funcionais e administrativas suportados por `public.audit_events`.
- **Auditoria privilegiada:** eventos de autenticação administrativa, contas, grupos e operações sensíveis suportados por `public.privileged_action_audit`.

As duas estruturas têm escopos distintos e não devem ser tratadas como se todos os eventos já estivessem conectados aos handlers reais.

### 5. Retenção, descarte, backups e solicitações

- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não sofrem exclusão automática enquanto o sistema estiver em operação.
- Exclusões dependem de autorização do TI, observada a preservação de dados durante investigações.
- O descarte de registros de auditoria deve respeitar os mecanismos de retenção/hold disponíveis, registrar o descarte e não alcançar automaticamente outras classes de dados.
- Backups são diários e retidos por 12 meses.
- Após exclusão autorizada, os dados deixam as cópias de backup ao final do ciclo de retenção definido; o descarte deve ser registrado em auditoria.
- TI é o canal operacional informado pela FORD para solicitações de acesso, correção e exclusão.
- Solicitações legais são tratadas pela FORD; eventual notificação ao fornecedor deve observar os limites legalmente aplicáveis.

A definição desses parâmetros não comprova a configuração de backup, a restauração, o descarte completo de todas as classes de dados nem a efetividade operacional do processo.

### 6. Transparência

A aplicação deve apresentar aviso de monitoramento no primeiro acesso do funcionário, conforme RF-023/RN-025. O texto e a apresentação visual devem ser detalhados em UX sem alterar a regra funcional aprovada.

## Justificativa

O modelo de criptografia definido preserva a capacidade de operação e investigação solicitada pela FORD, sem prometer E2EE. A detecção baseada em lista, com revisão humana e sem bloqueio automático, respeita o comportamento de alerta confirmado. O registro das ações privilegiadas permite rastreabilidade sem introduzir justificativa obrigatória, segunda aprovação ou hierarquia que não fazem parte do modelo de produto.

A separação entre auditoria genérica e privilegiada evita duplicação de responsabilidades e permite identificar o que já foi estruturado, o que está integrado e o que permanece dependente de handlers e fluxos ainda não implementados.

## Consequências

**Positivas:**
- Regras de monitoramento e investigação alinhadas à baseline POLY-REQ-001 v0.5.
- Separação clara entre detecção, alerta, revisão humana e decisão administrativa.
- Rastreabilidade das ações privilegiadas definidas pelo cliente.
- Distinção entre auditoria genérica e privilegiada, com proteção de metadados contra credenciais e conteúdo desnecessário.
- Stack e modelo de utilização alinhados à ADR-003 e à Q-025 concluída.

**Negativas e cuidados:**
- A ausência de E2EE implica que o servidor e administradores tecnicamente autorizados podem acessar conteúdo em claro.
- O modelo requer proteção rigorosa do ambiente, das chaves, das contas TI e dos registros de auditoria.
- A base técnica de auditoria não garante, por si só, emissão de eventos por todos os fluxos reais.
- Monitoramento, alertas, consulta/exportação, download de anexos, backup e restauração ainda exigem implementação, integração ou evidência operacional.

## Riscos

Acesso indevido por comprometimento de conta TI; exposição de conteúdo no servidor; comprometimento de chaves; uso indevido de capacidade administrativa; falso positivo; falha de detecção; falha ou omissão de registro de auditoria; metadata sensível em logs; descarte incompatível com investigação; backup ou restauração não comprovados; integração com serviço adicional não aprovado.

A igualdade de poderes entre os administradores TI e os riscos correspondentes foram avaliados pela FORD. Este registro mantém os riscos técnicos relevantes, sem reabrir a legitimidade do modelo administrativo como pendência de produto.

## Evidências e estado atual

- **Q-025:** concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados. Essa decisão não comprova implementação ponta a ponta dos controles de segurança, auditoria ou monitoramento.
- **Baseline POLY-REQ-001 v0.5:** consolida monitoramento por regras/lista do TI, severidades e prazos, poderes administrativos, auditoria, aviso no primeiro acesso, criptografia em trânsito/repouso, ausência de E2EE, retenção e continuidade.

**Auditoria genérica — PR #173 / Issue #102**
- A PR #173 foi integrada em 26/11/2026 e a Issue #102 foi encerrada.
- A entrega versiona `public.audit_events`, catálogo de eventos, ator, recurso, horário, resultado e metadata; restringe acesso à TI ativa; rejeita metadata com conteúdo de mensagem/conversa, senhas, tokens, segredos, cookies e credenciais.
- Implementa append-only para alterações diretas, retenção investigativa por `retention_holds`, descarte controlado por `public.discard_audit_event(uuid)` e writer explícito `src/audit/audit-events.mjs`.
- Testes unitários do writer e testes SQL de integração para acesso, metadata, edição/exclusão lógica, encerramento de alertas, holds e descarte foram registrados como executados.
- Limites documentados na PR: os gatilhos automáticos de alteração de configuração foram removidos; o evento `configuration_changed` permanece no catálogo e o writer está disponível, mas faltam callsites nos handlers administrativos. Consulta/exportação de conversas e download/liberação de anexos dependem dos respectivos fluxos. O descarte implementado cobre `audit_events`, não `privileged_action_audit`, mensagens, anexos ou alertas.

**Auditoria privilegiada — PR #170 / Issue #124**
- A PR #170 foi integrada em 26/11/2026 e entregou a estrutura `public.privileged_action_audit`, RLS server-only, writer e pesquisa paginada restritos a TI ativo, catálogo de eventos e sanitização recursiva de campos de credenciais.
- Foram registrados nove testes unitários com Supabase simulado e verificações remotas de permissões/RLS e sanitização.
- Não havia perfil TI ativo no projeto Supabase consultado para validar uma gravação positiva com ator real; nenhum evento fictício foi persistido.
- A Issue #124 permanece aberta: os handlers e callsites reais de login, gestão de contas/grupos e consultas sensíveis ainda não foram instrumentados. A atomicidade entre mutação e evento deve ser garantida quando os handlers forem implementados.
- A PR #170 não habilita endpoint de consulta de conversas; a instrumentação de consulta de conteúdo segue as decisões funcionais e a implementação apropriada.

**Monitoramento e alertas — Issues #122 e #123**
- Ambas permanecem abertas.
- A #122 ainda precisa implementar a lista versionada do TI, detecção determinística, persistência de ocorrências, severidades, testes positivos/negativos e tratamento seguro de falha.
- A #123 ainda precisa implementar a fila administrativa, visualização/revisão/encerramento e autorização exclusiva de TI.
- Portanto, a presença das regras na baseline/ADR não comprova que a detecção ou a fila estejam operacionais.

**Segurança e continuidade — Issues #125, #126 e #130**
- A #125 permanece aberta para threat modeling, priorização de ameaças, responsáveis, evidências e validações técnicas; seu escopo não é pentest ou certificação.
- A #126 permanece aberta para cobertura e rastreabilidade dos testes da baseline v0.5, distinguindo casos especificados, implementados, executados e aprovados.
- A #130 permanece aberta para backups diários de banco/anexos por 12 meses, testes de restauração, disponibilidade, RPO/RTO, runbooks, monitoramento operacional, incidentes e evidências de release.
- A conclusão da Q-025 não substitui nenhuma dessas entregas operacionais.

## Pendências para Accepted

- Concluir os handlers/callsites reais da auditoria privilegiada e comprovar a relação atômica entre mutação administrativa e evento de auditoria, respeitando a separação de escopo da Issue #124.
- Integrar os eventos de consulta/exportação de conversas, download/liberação de anexos, alteração de configurações e demais ações previstas quando os respectivos fluxos forem implementados, sem registrar conteúdo ou credenciais em metadados.
- Implementar e testar a detecção determinística e a fila administrativa conforme as Issues #122 e #123, incluindo severidades, prazos, falsos positivos, falhas do detector e ausência de bloqueio automático.
- Concluir o threat model da Issue #125 e a matriz de cobertura/testes da Issue #126, com revisão técnica e independente.
- Evidenciar configuração e operação de backups diários por 12 meses, restauração, retenção e descarte por classe de dado conforme a Issue #130.
- Submeter esta ADR à revisão do Tech Lead e SQA, mantendo a TI da FORD como responsável operacional por segurança.
- Atualizar o status somente após as integrações e evidências correspondentes; a aprovação da Q-025 e os merges das PRs #170/#173, isoladamente, não justificam Accepted.

Os parâmetros de produto — ausência de E2EE, criptografia em trânsito/repouso, regras de detecção, severidades, prazos, poderes equivalentes do TI, consulta sem justificativa obrigatória, retenção e responsabilidades — estão consolidados e não devem ser reabertos como pendências de produto. A posição organizacional comunicada pela FORD não afasta obrigações legais aplicáveis.
