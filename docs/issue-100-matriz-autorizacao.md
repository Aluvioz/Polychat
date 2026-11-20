# Issue #100 — Matriz de autorização e políticas RLS

- **Issue:** [#100 — Definir matriz de autorização e políticas RLS](https://github.com/Aluvioz/Polychat/issues/100)
- **Epic:** [#80 — Modelo de dados, autorização e RLS](https://github.com/Aluvioz/Polychat/issues/80)
- **Baseline:** POLY-REQ-001 v0.4 — FORD v2
- **ADRs:** [índice](adr/README.md), ADR-004, ADR-006 e ADR-010
- **Última revisão:** 19/11/2026
- **Estado:** matriz funcional atualizada e aprovada pelo PO quanto às regras confirmadas; **aprovação independente do SQA permanece pendente**.

> Esta matriz define o contrato funcional de autorização. Não declara RLS de domínio, integração de autenticação, handlers ou fluxos de negócio implementados. O parecer do PO registrado em 19/11/2026 aprova as regras funcionais dentro do escopo e limites descritos; não substitui a aprovação independente do SQA.

## 1. Como interpretar a matriz

- **Permitido — confirmado:** operação e ator expressamente previstos na baseline v0.4.
- **Negado — confirmado:** a FORD v2 proíbe a operação ou atribui a operação a outro ator.
- **Condicionado:** operação permitida somente quando a condição descrita estiver satisfeita (por exemplo, membership vigente).
- **Pendente de detalhamento:** a categoria funcional existe, mas o catálogo/tela/opção específica ainda não foi inventariado. Não criar permissão genérica.
- **Implementação parcial:** evidência existente na stack oficial, mas que ainda não comprova integração ponta a ponta nem RLS de domínio.

Três conceitos devem permanecer separados:

1. **Identidade:** a conta autenticada, validada pelo Supabase Auth, serviço oficial de identidade do Polychat.
2. **Role:** um dos dois perfis de aplicação — `user` ou `ti`. Todos os administradores TI têm poderes iguais.
3. **Membership:** relação entre uma conta e uma conversa/grupo. Role TI não é membership; membership não concede funções administrativas.

## 2. Fontes e limites

| Fonte | Uso nesta matriz | Limite |
|---|---|---|
| POLY-REQ-001 v0.4 | Fonte atual de regras, escopo, dispositivos, anexos, monitoramento, auditoria e retenção | Necessidade confirmada não significa implementação concluída |
| RF-001 a RF-023 | Operações funcionais e critérios de aceitação | Devem ser implementados e testados no servidor |
| RN-001 a RN-025 | Responsabilidades, restrições e regras de negócio | Não inferir poderes além dos explicitamente atribuídos |
| ADR-003 | Registra Supabase + Vercel como plataformas oficiais do Polychat | A aprovação das plataformas não comprova integração funcional nem homologação de cada ambiente |
| ADR-006 | Registra o contrato de autenticação/perfil em `profiles` via Supabase | O aceite limitado não cobre políticas RLS de domínio nem integração completa às rotas |
| ADR-004/005/008/009/010 | Restrições e propostas técnicas alinhadas à FORD v2 | Permanecem Proposed e dependem de validação/implementação técnica |
| Modelo de dados | Entidades lógicas e relações candidatas | Não é schema físico aprovado |
| Issue #101 | Implementação de RLS e testes de isolamento | Não declarar políticas de domínio prontas antes da implementação |
| Issue #102 / RF-022 | Auditoria, catálogo de eventos e retenção | Regras funcionais estão consolidadas; desenho e testes técnicos precisam ser entregues |
| Parecer do PO na Issue #100 | Aprovação funcional das regras já confirmadas | Não substitui SQA, revisão técnica ou homologação |

## 3. Matriz de autorização

| Entidade | Operação | Ator | Condição/resultado | Enforcement esperado | Rastreabilidade |
|---|---|---|---|---|---|
| Conta/perfil | Autenticar | Usuário ou TI | Permitido para conta ativa e credenciais válidas | Mecanismo de identidade sob controle da FORD; validação server-side | RF-001; ADR-004 |
| Conta/perfil | Criar conta, inclusive conta TI | TI | Permitido; não existe auto cadastro ou convite externo | Operação privilegiada server-side | RF-003; RN-003 a RN-005 |
| Conta/perfil | Definir/alterar nome de usuário | TI | Permitido; nome único na organização | Verificação de unicidade e operação server-side | RF-003; RN-005 |
| Conta/perfil | Criar e entregar senha inicial | TI | Permitido; entrega individual com link de acesso | Fluxo protegido; nunca expor senha em logs ou repositório | RF-001; RN-005 |
| Conta/perfil | Recuperar senha | TI | Exclusivo do TI | Operação administrativa server-side | RF-001; RN-005 |
| Conta/perfil | Alterar role/status por payload de cliente | Usuário ou TI | Negado; cliente não é fonte de role ou status | Ignorar dados de role/status enviados pelo browser | RN-001; RNF-001 |
| Conta/perfil | Desativar/reativar conta | TI | Permitido; desativação encerra imediatamente sessões e revoga acesso, preservando histórico | Operação administrativa e propagação da revogação | RF-004; RN-003 |
| Conta/perfil | Acessar enquanto desativada | Usuário desativado | Negado | Verificar estado vigente em cada operação protegida e revogar sessão | RF-004; RNF-003 |
| Conta TI | Administrar outra conta TI | TI | Permitido sob o mesmo conjunto de poderes administrativos; sem hierarquia ou administrador principal | Mesma role e mesmas operações para todos os administradores TI | D-003; RN-003 |
| Conversa individual | Iniciar conversa com usuário ativo | Usuário | Permitido para qualquer outro usuário ativo, sem distinção de cargo | Verificar identidade e estado das contas no servidor | RF-009; RN-006 |
| Conversa | Abrir/ler conversa individual | Usuário participante | Permitido somente se a conta for participante autorizada | Validar membership vigente no servidor e no banco | RF-008; CA-008.1 a CA-008.3 |
| Conversa | Abrir/ler conversa por ID/URL/API sem membership | Usuário não participante | Negado, mesmo que conheça o identificador | Negar por padrão; não revelar conteúdo ou existência indevida | RF-008; RNF-001 |
| Conversa/grupo | Criar grupo | TI | Permitido | Operação privilegiada server-side | RF-005; RN-007 |
| Conversa/grupo | Encerrar/desativar/reativar grupo | TI | Permitido | Operação privilegiada; preservar histórico | RN-007 |
| Grupo | Incluir participante | TI | Permitido para conta aplicável/ativa | Gravar membership e operador no servidor | RF-006; RN-007 |
| Grupo | Remover participante | TI | Permitido; revoga imediatamente acesso às mensagens e anexos anteriores | Encerrar membership e invalidar novas leituras/downloads, inclusive links emitidos | RF-006; RN-007 |
| Grupo | Sair voluntariamente | Usuário | Negado | Não disponibilizar ação de saída | RN-007 |
| Grupo | Ler mensagens | Usuário participante vigente | Permitido | Membership vigente, validação server-side e RLS de domínio | RF-008/RF-010; RN-007 |
| Grupo | Ler/enviar mensagens | Usuário não participante | Negado | Validar membership em cada operação | RF-008/RF-010; RNF-001 |
| Mensagem | Enviar mensagem individual | Usuário | Permitido em conversa individual autorizada | Autoria derivada da identidade autenticada; validação server-side | RF-009; RN-006 |
| Mensagem | Enviar mensagem em grupo | Usuário participante vigente | Permitido | Validar membership vigente no servidor | RF-010; RN-007 |
| Mensagem | Ler mensagem | Usuário participante autorizado | Permitido; inclui estado de leitura conforme regra | Validar acesso à conversa e destinatário | RF-008; RF-019 |
| Mensagem | Ver confirmação/horário de leitura e não lidas | Usuário autorizado na conversa | Permitido | Exibir recibos/horários e contador no aplicativo | RF-019 |
| Mensagem | Editar/excluir mensagem própria | Usuário | Negado | Não expor operação de edição/exclusão para usuário comum | RF-020; RN-014 |
| Mensagem | Editar/excluir mensagem | TI | Permitido a qualquer momento; ação auditada | Operação privilegiada server-side; gerar evento auditável | RF-020; RF-022 |
| Conversa | Consultar qualquer conversa | TI | Permitido a qualquer momento; sem justificativa ou segunda aprovação | Acesso privilegiado server-side com evento de auditoria | RF-016; RN-014; RF-022 |
| Conversa | Exportar conversa | TI | Permitido; ação auditada | Operação privilegiada server-side; auditar operador, recurso e momento | RF-021; RF-022 |
| Anexo | Enviar PDF/JPEG | Usuário em conversa autorizada | Permitido; até 10 MB por arquivo e até 5 por mensagem | Validar identidade, membership, formato real, limites e antimalware no servidor | RF-011/RF-012; RN-008; RNF-010 |
| Anexo | Enviar formato diferente ou PDF protegido por senha | Usuário | Negado | Rejeitar antes de disponibilizar | RF-012; RN-008 |
| Anexo | Selecionar JPEG | Usuário | Somente JPEG existente na galeria; sem captura por câmera | Interface sem captura; remover metadados EXIF/GPS | RF-013; RN-011 |
| Anexo | Baixar arquivo | Usuário com acesso vigente à conversa | Permitido após análise favorável e autorização atual | Storage privado; autorizar cada download; link até 5 minutos | RF-011; RN-008; ADR-008 |
| Anexo | Baixar arquivo durante investigação | TI | Permitido; download auditado | Operação administrativa server-side | RF-022; RN-008 |
| Anexo | Liberar arquivo bloqueado | TI | Permitido por ação administrativa; ação auditada | Fluxo explícito de liberação TI; usuários não podem contornar análise | RN-008; RNF-010 |
| Anexo | Baixar após remoção do participante | Participante removido | Negado imediatamente, inclusive para anexos anteriores | Revogar acesso e invalidar links previamente emitidos | RF-006; RN-007 |
| Antimalware | Analisar anexo | Sistema | Scanner interno integrado ao fluxo controlado do Polychat na stack oficial; não encaminhar a scanner externo não aprovado; falha/inconclusão mantém bloqueado | Fail closed para disponibilização automática; envio de texto permanece funcional | RNF-010; ADR-008 |
| Mensagem suspeita | Detectar por regra/lista | Sistema | Regra/lista mantida pelo TI, incluindo palavrões; sem análise contextual ou IA de terceiros | Processamento nos componentes oficiais da stack; sem envio a serviços adicionais de análise não aprovados | RF-014; RN-012 |
| Mensagem suspeita | Bloquear automaticamente mensagem/conta por detecção | Sistema | Negado/não previsto | Não implementar bloqueio automático | RF-014/RF-015; RN-012/RN-013 |
| Alertas | Consultar fila e alertas | TI | Permitido | Área administrativa protegida | RF-015; RN-013 |
| Alertas | Encerrar alerta | TI | Permitido sem justificativa obrigatória | Registrar evento de tratamento/encerramento | RF-015; RF-022 |
| Auditoria | Registrar ações administrativas | Sistema | Obrigatório para as categorias listadas em RF-022/RNF-004 | Gravação confiável no servidor | RF-022; RNF-004 |
| Auditoria | Consultar/gerenciar registros | TI | Permitido somente ao TI | Acesso privilegiado; retenção e exclusão segundo decisão administrativa | RF-022; RNF-004 |
| Auditoria | Consultar/alterar/excluir registros | Usuário | Negado | Negar no servidor e no banco | RF-022; RNF-004 |
| Auditoria | Excluir automaticamente logs | Sistema | Negado | Sem exclusão automática enquanto sistema opera | RN-021; RNF-004 |
| Configurações | Administrar parâmetros | TI | Permitido para as configurações atribuídas ao TI; não inferir permissão genérica para parâmetro não inventariado | Enumerar cada configuração e ação; não criar endpoint genérico | RN-003; Q-018 |
| Dispositivo | Usuário acessar fora de celular ou TI fora de computador | Perfil correspondente | Restrição de compatibilidade: Usuário em Android/iOS; TI em computador; tablets não permitidos | Aplicar comportamento de UX/compatibilidade; nunca usar viewport/user-agent como prova de role | RF-017/RF-018; RN-015 |

## 4. Regras transversais de segurança

1. **Identidade confiável:** validar identidade e sessão no servidor por mecanismo sob controle da FORD.
2. **Role não é membership:** TI tem operações administrativas explicitadas; isso não o torna participante de todas as conversas. A consulta administrativa é exceção funcional auditada.
3. **Membership não é role:** ser participante concede somente ações funcionais da conversa/grupo.
4. **Menor privilégio:** conceder somente operações descritas na matriz.
5. **Falha fechada:** erros de identidade, perfil, membership, storage ou autorização não podem conceder acesso.
6. **IDs não são autorização:** conhecer UUID, identificador ou URL não concede acesso.
7. **Frontend não é enforcement:** ocultar botões ou telas não substitui validação server-side e políticas no banco.
8. **Segredos:** credenciais, tokens e chaves permanecem fora do browser, bundle e logs.
9. **Plataformas:** Supabase e Vercel são os serviços oficiais do projeto. A inclusão de outros serviços externos que acessem ou processem dados exige aprovação explícita.
10. **Auditoria:** operações privilegiadas devem registrar operador, ação, recurso e momento, sem armazenar senha, token, chave ou conteúdo integral desnecessário.
11. **Erros:** não revelar dados de conversas, mensagens, anexos ou perfis a atores sem autorização.
12. **Igualdade de TI:** todos os administradores TI aplicam o mesmo conjunto de poderes; não criar hierarquia nem segunda aprovação.

## 5. Implementação observada e limites

| Componente | Evidência existente | Limite |
|---|---|---|
| `src/auth/authorization.mjs` | Middleware Express-compatible que valida JWT via Supabase e consulta `profiles` | Implementação parcial na stack oficial; não está conectado a handlers reais |
| Migration `202611160001_profiles_roles_and_account_status.sql` | Cria `profiles` ligada a `auth.users`, RLS para perfil e proteção de role/status | Artefato existente na stack oficial; cobre apenas perfis e não cobre domínio |
| Testes `tests/authorization.test.mjs` | 11 testes unitários com Supabase simulado | Não comprovam integração real, RLS de domínio ou Storage |
| RLS de domínio | Não comprovada no repositório | Conversas, memberships, mensagens, anexos, alertas e auditoria ainda exigem implementação/teste |
| Autenticação da UI | Não comprovada como fluxo funcional completo | Necessita mecanismo sob controle FORD e integração Next.js |
| Auditoria de domínio | Não comprovada como fluxo completo | Catálogo e requisitos estão documentados; implementação e testes ainda necessários |

## 6. Casos positivos e negativos para validação

| ID | Cenário | Resultado esperado | Natureza |
|---|---|---|---|
| AUTH-01 | Conta ativa autentica com credenciais válidas | Permitido | Regra funcional; implementação pendente |
| AUTH-02 | Conta desativada tenta autenticar/usar sessão | Negado; sessão revogada | Confirmado |
| AUTH-03 | Usuário tenta alterar role/status via payload | Negado/ignorado | Confirmado |
| AUTH-04 | TI cria conta e define username único | Permitido | Confirmado |
| AUTH-05 | Usuário tenta criar conta ou recuperar senha por conta própria | Negado | Confirmado |
| AUTH-06 | Usuário abre conversa sem membership | Negado | Confirmado |
| AUTH-07 | Membro de grupo envia mensagem | Permitido | Confirmado |
| AUTH-08 | Não membro tenta ler/enviar no grupo | Negado | Confirmado |
| AUTH-09 | Participante removido tenta ler histórico/anexo | Negado imediatamente | Confirmado |
| AUTH-10 | TI consulta conversa sem ser membro | Permitido e auditado; sem justificativa/segunda aprovação | Confirmado |
| AUTH-11 | TI exporta conversa | Permitido e auditado | Confirmado |
| AUTH-12 | Usuário tenta editar/excluir mensagem | Negado | Confirmado |
| AUTH-13 | TI edita/exclui mensagem | Permitido e auditado | Confirmado |
| AUTH-14 | TI consulta/gerencia logs | Permitido | Confirmado |
| AUTH-15 | Usuário tenta consultar/alterar/excluir logs | Negado | Confirmado |
| AUTH-16 | TI libera anexo bloqueado | Permitido por ação administrativa auditada | Confirmado |
| AUTH-17 | Usuário tenta contornar análise antimalware | Negado; anexo permanece indisponível | Confirmado |
| AUTH-18 | Scanner falha/inconclusivo | Bloquear disponibilização automática; texto continua | Confirmado |
| AUTH-19 | Detecção de termo gera alerta | Gerar alerta; não bloquear automaticamente mensagem/conta | Confirmado |
| AUTH-20 | TI encerra alerta sem justificativa | Permitido e registrado | Confirmado |
| AUTH-21 | Link de anexo permanece após remoção de participante | Acesso negado/revogado imediatamente | Confirmado |
| AUTH-22 | Consulta/exportação/download administrativo | Evento de auditoria gerado | Confirmado |

A execução dos casos acima ainda deve ser demonstrada por testes unitários, integração e isolamento no ambiente homologado. A existência da matriz não representa execução de testes.

## 7. Parecer funcional do PO e situação de SQA

O parecer do PO foi registrado na [Issue #100, comentário de 19/11/2026](https://github.com/Aluvioz/Polychat/issues/100#issuecomment-7000163557), aprovando as regras funcionais então confirmadas e delimitando as pendências. A atualização v0.4 amplia/alinha a matriz às decisões adicionais da FORD v2.

A matriz **não está integralmente aprovada**: o registro da Issue #100 mantém pendente a aprovação independente do SQA sobre rastreabilidade, casos positivos/negativos, distinção entre regras confirmadas e pendências e evidências. Não declarar a Issue #100 concluída nem a RLS de domínio implementada por causa desta atualização.

## 8. O que esta matriz não aprova

- DDL, migration ou modelo físico de banco.
- Configuração dos serviços oficiais e integração ainda precisam ser validadas pela Q-025.
- Policies RLS de domínio que não foram implementadas e testadas.
- Alteração de regra de negócio, incluindo papéis adicionais ou hierarquia de TI.
- Justificativa obrigatória, segunda aprovação ou limitação da consulta de TI que não exista na baseline.
- Bloqueio automático de mensagem/conta após detecção.
- Retenção diferente da política consolidada.
- Permissão genérica para configurações não inventariadas.

## 9. Encaminhamento à Issue #101

A Issue #101 deve implementar as regras desta matriz na stack oficial Supabase + Vercel, após revisão do schema da #99 e validação técnica da Q-025. Deve incluir testes positivos e negativos para identidade, role, membership, conta ativa/inativa, consulta administrativa TI, grupos, mensagens, anexos e acesso por ID/link conhecido.

A revisão independente SQA da matriz #100 deve permanecer rastreável e não pode ser substituída pelo parecer do PO.

## 10. Situação da Issue #100

| Critério original | Situação atual |
|---|---|
| Matriz aprovada; acesso mínimo; casos positivos/negativos definidos | **Parcial:** parecer funcional do PO registrado; revisão independente SQA pendente |
| Testes relevantes automatizados ou evidência documentada | **Parcial:** 11 testes unitários simulados documentados; faltam testes de RLS real/domínio e integração |
| Revisão por PR concluída | A PR #144 possui aprovação técnica registrada; a atualização v0.4 desta matriz será submetida nesta PR para revisão |
| Sem regressão nos fluxos relacionados | Alteração documental; checks desta PR ainda precisam executar |

**Regra de encerramento:** manter a Issue #100 aberta até o SQA registrar parecer independente e os critérios de aceite restantes estarem demonstrados. Esta atualização não muda o estado da issue.
