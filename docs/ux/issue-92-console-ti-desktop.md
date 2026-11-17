# UX/UI — Console TI desktop e fluxos administrativos (Issue #92)

> **Estado:** documentação de design para revisão, **sem aprovação formal** da FORD/PO/Tech Lead.  
> **Issue:** https://github.com/Aluvioz/Polychat/issues/92  
> **Miro (artefatos editáveis):** https://miro.com/app/board/uXjVENfDPjY=/  
> **Ator:** perfil administrativo **TI**, interface **desktop**.

## 1. Escopo

Mapear as jornadas da equipe de TI em dashboard, contas, grupos, consulta de conversas e trilha de auditoria, alertas e configurações. Representar explicitamente confirmações para ações críticas e estados alternativos. Trata-se de uma proposta de UX/UI e documentação; **não há implementação, testes automatizados, análise de segurança concluída ou aprovação do cliente nesta entrega**.

Referências de requisitos do repositório: `docs/01-visao-geral-e-escopo.md`, `docs/03-requisitos-funcionais.md`, `docs/05-regras-de-negocio-e-restricoes.md`, `docs/08-glossario-e-questoes-em-aberto.md`. As referências a provedor/arquitetura na descrição da issue não substituem ADRs aprovadas.

## 2. Fluxogramas revisados no Miro

| Diagrama | Jornada | Verificações representadas |
|---|---|---|
| 01 — Acesso TI e dashboard | Identificar e autenticar a TI, verificar sessão e ambiente desktop, navegar entre as áreas | Erro genérico, acesso negado e retorno ao login |
| 02 — Gestão de contas | Pesquisar, criar/provisionar, desativar e redefinir credencial | Conta ativa, dados válidos, confirmação da desativação, feedback e registro |
| 03 — Gestão de grupos | Criar grupo e incluir participantes ativos | Validação, confirmação, permissão; **remoção condicionada à aprovação** |
| 04 — Consulta e trilha de auditoria | Consultar conversa autorizada e pesquisar registros de ações administrativas | Escopo/justificativa sujeitos à política aprovada, acesso negado e lista vazia |
| 05 — Alertas e revisão | Carregar fila, identificar alertas, abrir contexto e revisar | Falha de carregamento, estado vazio, encaminhamento e auditoria; **sem punição automática presumida** |
| 06 — Configurações e estados | Ver opções autorizadas e editar parâmetros somente se aprovados | Confirmação de mudança crítica, validação, erro, sucesso e sessão expirada |

**Atenção:** a criação e gestão de usuários e grupos, consulta administrativa de conversas e alertas são intenções de escopo já descritas. O fluxo concreto de **remover integrantes**, as operações de **configurações**, as políticas de justificativa/consulta e retenção, assim como qualquer bloqueio ou punição por alertas, **não podem ser tratados como funcionalidades aprovadas**.

## 3. Wireframes desktop (baixa fidelidade)

| Tela | Elementos visuais documentados | Situação |
|---|---|---|
| 01 — Dashboard TI | Navegação para Usuários, Grupos, Consulta, Alertas, Auditoria e Configurações; cartões de resumo sem métricas reais | Proposta |
| 02 — Gestão de usuários | Busca, tabela, criação, redefinição e desativação | Proposta alinhada às funções TI |
| 03 — Gestão de grupos | Busca, grupo ilustrativo, criação e inclusão de usuário ativo | Remoção depende de aprovação |
| 04 — Consulta autorizada | Escopo de consulta, lista, verificação de permissão e rastreabilidade | Regras de governança pendentes |
| 05 — Central de alertas | Filtros, contexto sinalizado, revisão humana e encaminhamento | Critérios/regras de análise pendentes |
| 06 — Trilha de auditoria | Filtros, eventos e visualização de registros | Perfis, retenção e acesso a logs pendentes |
| 07 — Configurações | Parâmetros autorizados, validação e confirmação | **Não há catálogo aprovado de opções** |

Os dados nas telas são fictícios; números, nomes e eventos não representam dados reais da FORD. Os wireframes são **editáveis e estáticos**, não protótipos funcionais.

## 4. Estados alternativos e confirmações

1. **08.1 — Confirmar desativação:** alerta sobre perda de acesso, opções Cancelar/Confirmar; nenhuma alteração antes da confirmação.
2. **08.2 — Gestão não aprovada:** apresenta operação indisponível quando ainda não houver regra autorizando a remoção de integrante.
3. **08.3 — Permissão negada:** informação compreensível, saída para o painel; controles de interface não substituem autorização **server-side**.
4. **08.4 — Fila sem registros:** estado vazio para consultas sem resultado.
5. **08.5 — Falha administrativa:** erro e nova tentativa; não exibir sucesso se a operação falhou.
6. **08.6 — Sessão expirada:** exigir login para operações protegidas.

**Regras transversais:** acessibilidade e clareza dos textos; confirmações em ações críticas; diferenciação entre carregamento, erro, cancelamento e êxito; documentação da decisão de segurança. O acesso ao console TI apenas por computador é um requisito de uso e não, por si só, uma fronteira de segurança.

## 5. Rastreabilidade com requisitos

| Necessidade UX | Requisito / regra |
|---|---|
| TI autenticado com perfil e dispositivo permitido | RF-001, RF-002, RF-018; RN-001, RN-015 |
| Provisionar e desativar conta | RF-003, RF-004; RN-003 a RN-005 |
| Criar grupos e adicionar usuários | RF-005, RF-006; RN-007 |
| Consulta de conversas por TI com governança | RF-016; RN-014; Q-009 |
| Alertas de mensagens sinalizadas | RF-014, RF-015; RN-012 e RN-013; Q-007 e Q-008 |
| Marca, navegadores e dispositivos | RN-019; Q-012 e Q-019 |
| Configurações e permissões específicas | Escopo concreto pendente de definição do PO/TI |
| Log de consultas e mudanças administrativas | Recomendação de auditoria a validar pela TI/Segurança/Jurídico |

## 6. Pendências para PO, TI, Segurança e Jurídico

- **Governança de consulta:** quem, quando, qual finalidade, justificativa, registro e retenção de conversas e trilhas (**Q-009/Q-010**).
- **Operações de grupos:** critérios para remover participantes, encerrar grupos ou alterar permissões (**Q-003**).
- **Alertas:** definição das regras, revisão humana, severidades, encaminhamentos e eventual bloqueio, sem presunção de punição automática (**Q-007/Q-008**).
- **Configurações:** catálogo real de parâmetros e controles que TI poderá consultar ou editar (**Q-002, Q-013, Q-018**, conforme aplicável).
- **Contas:** credencial inicial, entrega, redefinição e proteção de ações privilegiadas (**Q-005/Q-006**).
- **Dispositivo:** navegadores e sistemas operacionais homologados, casos de tablet e modos híbridos (**Q-012**).
- **UI:** design system e ativos oficiais, requisitos de acessibilidade (**Q-019/Q-020**).

## 7. Revisão e critérios de aceite da Issue #92

| Critério da issue | Estado |
|---|---|
| Fluxos desktop criados | **Produzidos no Miro; revisão necessária** |
| Ações críticas com confirmação | **Representadas nos diagramas e wireframes** |
| Fluxos desktop aprovados | **Pendente de avaliação formal** |
| Testes automatizados relevantes ou evidência documentada | **Miro/documento como evidência de design; testes de implementação não executados** |
| Revisão por Pull Request | **Pendente** |
| Sem regressão nos fluxos relacionados | **Não demonstrado; depende de QA/implementação** |

Não fechar a issue, marcar critérios como cumpridos ou fazer merge sem aprovação e evidências. Registrar responsáveis e decisões tomadas em comentários de revisão.

## 8. Evidências

- Miro: https://miro.com/app/board/uXjVENfDPjY=/
- Issue: https://github.com/Aluvioz/Polychat/issues/92
- Material separado da experiência de Usuário mobile (#91), para não confundir atribuições de TI/Usuário.

*Documentação de proposta UX/UI elaborada em 17/11/2026, sujeita a revisão.*
