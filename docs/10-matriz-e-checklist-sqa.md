# 10 - Matriz de rastreabilidade e checklist SQA

**Documento:** POLY-REQ-001  
**Revisão:** 0.4  
**Data:** 16/11/2026  
**Escopo:** auditoria documental da Issue #88 e da baseline na branch `docs/issue-88-baseline-mvp`.  
**Limite:** os resultados abaixo avaliam a qualidade da especificação e a existência de evidências documentais. Não comprovam que a aplicação implementada atende aos requisitos.

## 1. Convenção dos resultados

| Estado | Significado nesta revisão |
|---|---|
| `PASS` | Critério documental foi verificado e está suficientemente claro, consistente e rastreável para derivar validação. Não significa teste funcional aprovado. |
| `FAIL` | Verificação executada encontrou falha atual não corrigida. |
| `BLOCKED` | Não é possível concluir a validação sem decisão, parâmetro, aprovação ou evidência externa indicada. |
| `N/A` | Verificação não se aplica ao escopo documental. |

Para os RFs, os critérios `CA-xxx.n` estão descritos em [03 - Requisitos funcionais](03-requisitos-funcionais.md). Para os RNFs, os critérios `CV-RNF-xxx` estão em [04 - Requisitos não funcionais](04-requisitos-nao-funcionais.md).

## 2. Matriz de rastreabilidade dos requisitos funcionais

| ID | Descrição resumida | Critério de aceitação | Método de validação | Resultado documental |
|---|---|---|---|---|
| RF-001 | Autenticar com identificador e senha | CA-001.1 a CA-001.4 | Testes de login válido/inválido, conta desativada e direcionamento por perfil | PASS |
| RF-002 | Aplicar perfis USER e TI sem hierarquia por cargo | CA-002.1 a CA-002.4 | Matriz de permissões e testes negativos por perfil/cargo | PASS |
| RF-003 | TI cria e provisiona contas | CA-003.1 a CA-003.5 | Testar criação, unicidade, perfil, ausência de cadastro/convite e entrega individual | BLOCKED — identificador e canal seguro de entrega não definidos |
| RF-004 | TI desativa contas | CA-004.1 a CA-004.4 | Testar desativação, novo login e rejeição de operações por sessões existentes | PASS — política de tempo/mecanismo de sessão continua pendente em RNF-017 |
| RF-005 | TI cria grupos | CA-005.1 a CA-005.3 | Testar criação por TI e negação para USER | PASS |
| RF-006 | TI adiciona participantes | CA-006.1 a CA-006.4 | Testar inclusão, conta ativa, negação de auto inclusão e referência à regra autoritativa de remoção em RF-019 | PASS |
| RF-007 | Exibir conversas recentes | CA-007.1 a CA-007.3 | Testar lista por atividade e estado vazio | PASS |
| RF-008 | Abrir e ler conversas autorizadas | CA-008.1 a CA-008.3 | Testar participante autorizado e tentativa por URL direta de não participante | PASS |
| RF-009 | Enviar mensagem individual | CA-009.1 a CA-009.4 | Testar remetente/destinatário ativos, conta desativada e destinatário inexistente | PASS |
| RF-010 | Enviar mensagens em grupos | CA-010.1 a CA-010.4 | Testar membro ativo, visibilidade para membros e negação para não membro; remoção referenciada a RF-019 | PASS — regras de saída/encerramento ainda pendentes |
| RF-011 | Anexar PDF e JPEG | CA-011.1 a CA-011.4 | Testar anexos válidos, acesso do destinatário e limite de tamanho | BLOCKED — limite de tamanho/quantidade não definido |
| RF-012 | Rejeitar formatos não permitidos | CA-012.1 a CA-012.3 | Testar formato proibido e mensagem de erro | PASS |
| RF-013 | Não oferecer captura/gravação própria | CA-013.1 a CA-013.4 | Inspecionar interface e chamadas de câmera/microfone; testar seletor de arquivo nos dispositivos homologados | PASS — limitações do seletor nativo e captura externa explicitadas |
| RF-014 | Analisar mensagens suspeitas | CA-014.1 a CA-014.4 | Executar corpus aprovado e verificar regra/motivo sem punição automática | BLOCKED — taxonomia, lista, contexto e contingência não aprovados |
| RF-015 | Alertar TI | CA-015.1 a CA-015.3 | Verificar geração, conteúdo, canal e prazo do alerta | BLOCKED — canal, severidade e prazo não definidos |
| RF-016 | TI consulta conversas sob governança | CA-016.1 a CA-016.6 | Testes positivos/negativos por operador, justificativa, log, transparência e limites de ação | BLOCKED — política de acesso, papéis autorizados e hipóteses não aprovados |
| RF-017 | USER somente em celular; computador mostra texto literal | CA-017.1 a CA-017.4 | Testar matriz de dispositivos, bloqueio e correspondência exata de `só pode ser usado em celular`; tentar contorno de user-agent/viewport | BLOCKED — matriz e método de classificação não homologados |
| RF-018 | TI somente em computador | CA-018.1 a CA-018.4 | Testar bloqueio de funções administrativas em todas as classes móveis da matriz | BLOCKED — matriz e método de classificação não homologados |
| RF-019 | TI remove participantes de grupos | CA-019.1 a CA-019.3 | Testar autorização, revogação de leitura/escrita futura e evento de auditoria | PASS — retenção do histórico após remoção depende da política de retenção |
| RF-020 | TI administra configurações de segurança disponíveis | CA-020.1 a CA-020.3 | Testar acesso administrativo, trilha de alteração e impossibilidade de desativar controles obrigatórios | BLOCKED — catálogo de configurações e papéis autorizados não definidos |

## 3. Matriz de rastreabilidade dos requisitos não funcionais

| ID | Descrição resumida | Critério de aceitação | Método de validação | Resultado documental |
|---|---|---|---|---|
| RNF-001 | Autorização server-side | CV-RNF-001 | Testes por perfil, API e URL direta | PASS |
| RNF-002 | Proteção de dados e modelo de ameaças | CV-RNF-002 | Revisão de threat model, controles e testes de segurança | BLOCKED — modelo de ameaças e controles aprovados ausentes |
| RNF-003 | Hash seguro de senhas; nunca texto puro | CV-RNF-003 | Inspeção de armazenamento, logs, código e mecanismo aprovado | BLOCKED — algoritmo/parâmetros e política de credenciais pendentes |
| RNF-004 | Governança e escopo da auditoria | CV-RNF-004 | Conferir política, eventos, revisores, acesso e retenção | BLOCKED — política operacional não aprovada |
| RNF-005 | Compatibilidade por perfil/dispositivo | CV-RNF-005 | Executar matriz homologada por combinação | BLOCKED — matriz de dispositivos/navegadores ausente |
| RNF-006 | Usabilidade e acesso a conversas recentes | CV-RNF-006 | Teste de tarefas com limiares de sucesso/tempo | BLOCKED — métricas e tarefas aprovadas ausentes |
| RNF-007 | Segurança prevalece sobre desempenho | CV-RNF-007 | Teste de carga sem enfraquecer controles | BLOCKED — metas de desempenho/carga ausentes |
| RNF-008 | Capacidade para público inicial | CV-RNF-008 | Teste com concorrência e volume aprovados | BLOCKED — sessões simultâneas e volume não definidos |
| RNF-009 | Continuidade, backup, RPO/RTO | CV-RNF-009 | Backup/restauração e medição de RPO/RTO | BLOCKED — metas e política de backup não aprovadas |
| RNF-010 | Validação de formato/conteúdo de arquivo | CV-RNF-010 | Testes de PDF/JPEG, MIME divergente, corrupção e formatos proibidos | PASS — critério documental objetivo; implementação não testada |
| RNF-011 | Política de monitoramento e consulta TI | CV-RNF-011 | Verificar aprovação de finalidade, papéis, justificativa, transparência e revisão | BLOCKED — aprovações de negócio, TI, Segurança e Jurídico/Privacidade ausentes |
| RNF-012 | Acessibilidade | CV-RNF-012 | Avaliação por critérios legais/corporativos selecionados | BLOCKED — padrão e nível de conformidade não definidos |
| RNF-013 | Seleção tecnológica por ADR | CV-RNF-013 | Revisar ADRs, alternativas, riscos e aprovações | BLOCKED — decisões técnicas e aprovações ainda não concluídas |
| RNF-014 | Privacidade e tratamento de dados | CV-RNF-014 | Revisar inventário, finalidade, base legal, minimização, direitos e retenção | BLOCKED — validação Jurídica/Privacidade ausente |
| RNF-015 | Criptografia em trânsito/armazenamento e decisão E2EE | CV-RNF-015 | Revisar ADR, fluxos de dados e testes criptográficos | BLOCKED — modelo criptográfico não escolhido |
| RNF-016 | Ciclo de vida de chaves | CV-RNF-016 | Revisar geração, custódia, acesso, rotação, revogação e recuperação | BLOCKED — desenho de gestão de chaves ausente |
| RNF-017 | Ciclo de vida de sessões | CV-RNF-017 | Testar logout, expiração e revogação conforme política | BLOCKED — tempos e parâmetros não definidos |
| RNF-018 | Campos, integridade e acesso aos logs | CV-RNF-018 | Inspecionar eventos e testar restrição/alteração de logs | BLOCKED — retenção, revisão e acesso aos logs pendentes |
| RNF-019 | Storage privado e autorização de anexos | CV-RNF-019 | Testar acesso autorizado/não autorizado, URL direta, limites e varredura | BLOCKED — limites e operação antimalware pendentes |
| RNF-020 | Segurança de infraestrutura | CV-RNF-020 | Revisar segregação, privilégios, segredos, vulnerabilidades e incidentes | BLOCKED — infraestrutura/provedor e evidências técnicas ausentes |
| RNF-021 | Limitações de identificação de dispositivo | CV-RNF-021 | Testar tentativas de contorno e verificar que não substituem autorização server-side | PASS — limitação e proibição de uso como fronteira de segurança explícitas |
| RNF-022 | Detecção automatizada e falsos positivos | CV-RNF-022 | Avaliar corpus aprovado, falsos positivos/negativos e revisão humana | BLOCKED — política e limiares não aprovados |
| RNF-023 | Retenção, backup e descarte | CV-RNF-023 | Testar restauração, retenção e descarte de dados primários/réplicas/backups | BLOCKED — prazos e política de ciclo de vida não definidos |
| RNF-024 | Integridade de mensagens, arquivos, credenciais e registros | CV-RNF-024 | Testar autorização e integridade de alteração/exclusão; revisar detecção de modificação indevida | BLOCKED — controles e evidências técnicas não disponíveis |
| RNF-025 | Confidencialidade e acesso autorizado | CV-RNF-025 | Testes negativos por perfil/participação e revisão dos fluxos de transmissão/armazenamento e consulta TI | BLOCKED — modelo criptográfico e política de acesso pendentes |
| RNF-026 | Desempenho adequado sem reduzir segurança | CV-RNF-026 | Testes de tarefas e carga contra metas quantitativas aprovadas | BLOCKED — metas e perfil de carga não definidos |
| RNF-027 | Identidade visual FORD | CV-RNF-027 | Revisão de telas/design system contra manual e ativos oficiais aprovados | BLOCKED — manual e ativos oficiais não fornecidos |

## 4. Checklist de validação documental

| ID | Verificação | Evidência / escopo | Resultado |
|---|---|---|---|
| SQA-001 | Identificação e versão da baseline | POLY-REQ-001 identificada como revisão documental 0.5, derivada da minuta 0.3 e confrontada com o Documento de Visão e Plano Inicial v0.1 | PASS |
| SQA-002 | Integridade/estrutura dos documentos | Capítulos 00 a 09 e índice docs/README.md consultados; novo capítulo 10 adicionado. Um caminho inexistente `docs/02-atores-e-contexto.md` foi testado e não pertence ao índice; o documento correto é `02-objetivos.md`. | PASS |
| SQA-003 | Integridade dos links internos | Verificação de links Markdown dos documentos alterados contra o conjunto de caminhos da baseline | PASS após verificação final no branch |
| SQA-004 | Formatação Markdown | Revisão estrutural de headings, tabelas, listas e links; nenhum validador Markdown externo foi executado | BLOCKED — validação automatizada não disponível nesta execução |
| SQA-005 | Unicidade e estabilidade dos IDs | Catálogos canônicos OBJ, RF, RNF, RN, CA e CV-RNF; referências em outros capítulos não criam novos IDs | PASS |
| SQA-006 | Ausência de duplicidades conflitantes | Escopos RNF-003/017, RNF-004/018, RNF-010/019 e RNF-011/014 separados e explicitados | PASS |
| SQA-007 | Critérios de aceitação por requisito | CA para RF-001 a RF-020 e CV-RNF para RNF-001 a RNF-027 | PASS |
| SQA-008 | Rastreabilidade objetivo → requisito → critério → teste | Capítulo 07 e matrizes das seções 2 e 3 deste documento | PASS |
| SQA-009 | Terminologia | USER (rótulo Usuário) e TI padronizados como perfis; níveis organizacionais separados | PASS |
| SQA-010 | Requisitos não funcionais | 27 RNFs possuem critério de verificação e estado explícito | PASS documental; parâmetros pendentes individualizados |
| SQA-011 | Segurança, privacidade e governança | Criptografia, E2EE, acesso TI, monitoramento, anexos, sessões, logs e retenção registrados | BLOCKED — aprovações e parâmetros críticos ausentes |
| SQA-012 | Consistência com itens relacionados | Issue #88, comentários, PR #131 e épicos #79/#80/#86 consultados. Também foram lidos o README de ADRs e ADR-003/004/006/008/010 da Issue #89. Há referências de RNF desatualizadas em ADR-004 (sessões/credenciais), ADR-006 (autorização/auditoria) e ADR-008 (segurança de anexos/retensão). | BLOCKED — não alterar documentos da Issue #89 neste escopo; solicitar correção de rastreabilidade no PR #133 antes de declarar consistência integral |
| SQA-013 | Escopo de alterações | Alterações limitadas a arquivos Markdown em `docs/`; nenhum código, dependência ou configuração alterado | PASS |
| SQA-014 | Validação funcional da aplicação | Fora do escopo documental; nenhuma alteração de código | N/A |
| SQA-015 | CI documental do repositório | GitHub Actions CI run #62 no commit `3c9d616` passou na revisão v0.4; a revisão v0.5 gerou novos commits e ainda não possui evidência de execução de CI no head atual. O Vercel Preview associado à PR reportou failure. | BLOCKED para o head v0.5 até nova execução; falha Vercel registrada separadamente, sem alterar configuração ou dependências |
| SQA-016 | Aprovação final da baseline | Aprovação formal da FORD/PO, TI, Segurança e Jurídico/Privacidade não encontrada na Issue/PR consultadas | FAIL — baseline não pode ser aprovada nesta revisão |
| SQA-017 | Aderência ao Documento de Visão e Plano Inicial v0.1 | Conferência dos objetivos, escopo, equipe, responsabilidades, orçamento, diretrizes de qualidade e seis etapas iniciais; itens de contexto foram incorporados sem convertê-los em requisitos funcionais. | PASS |
| SQA-018 | Cobertura explícita dos atributos não funcionais da fonte | Integridade, confidencialidade, desempenho adequado e identidade visual possuem RNF e critério CV-RNF próprios, com parâmetros pendentes identificados. | PASS documental; execução técnica depende da implementação e aprovações |
| SQA-019 | Contexto de equipe e planejamento | Quantidades/papéis e etapas foram registrados como referência, sem inventar nomes, prazos ou compromissos. | PASS |

## 5. Inconformidades encontradas na inspeção inicial

Foram registradas **23 inconformidades** na auditoria acumulada: 18 na revisão inicial e mais 5 na conferência específica com o Documento de Visão e Plano Inicial v0.1.

| Severidade | Quantidade | Temas |
|---|---:|---|
| Crítica | 4 | Governança de consulta TI; conflito E2EE/inspeção server-side; retenção/exclusão/backups; política de monitoramento automatizado |
| Alta | 5 | Classificação de dispositivos sem matriz; ciclo de vida de credenciais/sessões; ciclo de vida de grupos; limites/segurança de anexos; catálogo e autorização das funções administrativas de segurança |
| Média | 12 | Cinco achados adicionais da conferência com a fonte: quatro atributos não funcionais (integridade, confidencialidade, desempenho adequado e identidade visual) sem critério próprio e ausência do contexto de equipe/etapas do plano inicial. Também: estados contraditórios de RNF-003/RNF-017 e RNF-004/RNF-018; sobreposição RNF-010/RNF-019 e RNF-011/RNF-014; rastreabilidade/checklist SQA ausente; nomenclatura de perfis inconsistente; referências RNF desatualizadas nos ADRs relacionados da Issue #89 |
| Baixa | 2 | Navegação/descoberta da documentação; links para artefatos PDF preexistentes não revalidados nesta revisão |

As inconsistências documentais de severidade média e parte das altas foram corrigidas ou explicitamente desambiguadas nos capítulos 00, 01, 02, 03, 04, 05, 07, 08, 09 e neste capítulo. As lacunas críticas e as dependências de aprovação não podem ser resolvidas pela equipe SQA sem decisão dos responsáveis.

## 6. Bloqueios e riscos remanescentes

1. **Acesso administrativo:** a FORD deve aprovar quais operadores TI podem consultar conversas, em quais hipóteses, com qual justificativa, transparência, revisão e limites.
2. **Privacidade/LGPD:** Jurídico/Privacidade deve validar finalidade, base legal, transparência, minimização, retenção, descarte e direitos dos titulares; avaliar necessidade de RIPD conforme o tratamento.
3. **Criptografia:** cliente, TI, Segurança e Jurídico/Privacidade devem decidir entre modelo compatível com leitura server-side, E2EE ou alternativa formalmente analisada. E2EE estrita impede que o servidor leia conteúdo em claro para análise e consulta comuns.
4. **Monitoramento:** aprovar categorias/termos, contexto, corpus, limiares, falsos positivos/negativos, revisão humana, falha do mecanismo e canal/severidade dos alertas.
5. **Credenciais e sessões:** definir identificador de login, canal de entrega inicial, redefinição, MFA, duração de sessão, inatividade e revogação.
6. **Dispositivos:** aprovar matriz de celular/computador, sistemas operacionais, navegadores, tablets, modo desktop e política de classificação, reconhecendo limites de detecção web.
7. **Anexos:** definir tamanho/quantidade, armazenamento, varredura, quarentena, acesso e retenção de PDF/JPEG.
8. **Continuidade:** definir disponibilidade, carga simultânea, RPO/RTO, backup, retenção e restauração.
9. **Administração:** definir quem pode provisionar/alterar/desativar contas TI e quais configurações de segurança podem ser administradas.
10. **Arquitetura relacionada:** verificar ADRs da Issue #89 e confirmar compatibilidade após aprovação; a baseline não aprova automaticamente a stack registrada no épico #79.

## 7. Pendências por responsável

| Responsável | Decisões/evidências necessárias |
|---|---|
| Cliente / representante autorizado FORD | Aprovar escopo, público inicial, consulta TI, monitoramento, transparência, dispositivos, identidade visual e critérios de aceite |
| Product Owner | Aprovar prioridades, regras de grupos, tarefas/limiares de usabilidade, alertas e limites do MVP |
| TI da FORD | Definir administradores autorizados, provisionamento, credenciais, sessões, matriz de dispositivos, infraestrutura e operação |
| Segurança | Aprovar modelo de ameaças, controles, criptografia, gestão de chaves, MFA, anexos e resposta a incidentes |
| Jurídico / Privacidade | Validar base legal, finalidade, transparência, retenção, descarte, direitos dos titulares e necessidade de RIPD |
| Líder técnico / arquitetura | Produzir ADRs, especificar parâmetros, demonstrar viabilidade e apresentar evidências técnicas |
| QA / SQA | Derivar casos de teste dos CA/CV-RNF, executar após implementação e registrar evidências sem confundir revisão documental com teste funcional |

## 8. Parecer SQA

**Classificação: REPROVADO para aprovação final da baseline.**

A revisão documental 0.5 corrigiu conflitos internos, incorporou os atributos e o contexto do Documento de Visão v0.1 e ampliou a rastreabilidade e os critérios de verificação. A conferência cruzada identificou referências RNF a corrigir nos ADRs da Issue #89; elas foram registradas, sem modificar arquivos fora do escopo #88. Entretanto, os requisitos críticos de acesso administrativo, privacidade, monitoramento, criptografia e retenção continuam bloqueados por decisões e aprovações que não existem no material consultado. A especificação pode seguir como minuta de trabalho, mas não deve ser declarada baseline aprovada nem usada para liberar funções sensíveis em produção.

A PR #131 deve permanecer Draft. Não houve aprovação formal, merge ou fechamento da Issue #88 nesta revisão.
