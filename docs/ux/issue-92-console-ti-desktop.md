# UX/UI — Console TI desktop e fluxos administrativos (Issue #92)

> **Estado:** aprovada pelo PO/Tech Lead em 17/11/2026 como baseline de UX desktop de baixa fidelidade. Entrega documental concluída na Issue #92; não representa implementação do console, teste de usabilidade, análise de segurança concluída ou homologação institucional da FORD.  
> **Issue:** https://github.com/Aluvioz/Polychat/issues/92  
> **Miro (artefatos editáveis):** https://miro.com/app/board/uXjVENfDPjY=/  
> **Ator:** perfil administrativo **TI**, interface **desktop**.

## 1. Escopo

Mapear as jornadas da equipe de TI em dashboard, contas, grupos, consulta de conversas e trilha de auditoria, alertas e configurações. Representar explicitamente confirmações para ações críticas e estados alternativos. Trata-se de wireframes e documentação de UX de baixa fidelidade; **não há implementação do console, testes de usabilidade, análise de segurança concluída ou homologação institucional da FORD nesta entrega**.

Referências vigentes: baseline POLY-REQ-001 v0.4 e documentos 01, 03, 05 e 08. As decisões da FORD v2 substituem premissas antigas sobre autenticação, grupos, consulta administrativa, alertas, auditoria, anexos e infraestrutura. O aceite da UX permanece limitado à baixa fidelidade.

## 2. Fluxogramas revisados no Miro

| Diagrama | Jornada | Verificações representadas |
|---|---|---|
| 01 — Acesso TI e dashboard | Identificar e autenticar a TI, verificar sessão e ambiente desktop, navegar entre as áreas | Erro genérico, acesso negado e retorno ao login |
| 02 — Gestão de contas | Pesquisar, criar/provisionar, desativar e redefinir credencial | Conta ativa, dados válidos, confirmação da desativação, feedback e registro |
| 03 — Gestão de grupos | Criar/encerrar/desativar/reativar grupos e incluir/remover participantes | Operações exclusivas do TI; remoção revoga imediatamente o acesso do participante às mensagens e anexos anteriores |
| 04 — Consulta e trilha de auditoria | TI consulta qualquer conversa a qualquer momento, sem justificativa ou segunda aprovação, e consulta registros de auditoria | Acesso administrativo e exportação/consulta devem gerar auditoria; somente TI consulta e gerencia os registros |
| 05 — Alertas e revisão | Carregar fila, filtrar alertas, abrir contexto, analisar e encerrar | Severidade baixa/média/alta; prazos: alta imediata (até 1h), média até 1 dia útil, baixa até 3 dias úteis; TI encerra sem justificativa obrigatória; sem bloqueio automático |
| 06 — Configurações e estados | Ver opções autorizadas e editar parâmetros somente se aprovados | Confirmação de mudança crítica, validação, erro, sucesso e sessão expirada |

**Atenção:** o TI pode criar/administrar contas e grupos, incluir/remover participantes, consultar e exportar conversas, editar/excluir mensagens e consultar/gerenciar auditoria. Todos os administradores TI têm poderes iguais. A consulta de conversas não exige justificativa ou segunda aprovação. O catálogo detalhado de configurações persistentes continua sujeito ao refinamento de UX (Q-018); não criar endpoint genérico sem inventário.

## 3. Wireframes desktop (baixa fidelidade)

| Tela | Elementos visuais documentados | Situação |
|---|---|---|
| 01 — Dashboard TI | Navegação para Usuários, Grupos, Consulta, Alertas, Auditoria e Configurações; cartões de resumo sem métricas reais | Proposta |
| 02 — Gestão de usuários | Busca, criação, alteração de nome de usuário, provisionamento de senha, desativação e reativação | Proposta de UI para operações confirmadas; fluxo e textos finais devem refletir provisionamento exclusivo pelo TI |
| 03 — Gestão de grupos | Busca, criação/gestão do grupo e administração de participantes | TI pode incluir e remover participantes; remoção revoga acesso ao histórico e anexos |
| 04 — Consulta de conversas | Busca e consulta administrativa de qualquer conversa | Sem justificativa ou segunda aprovação; consulta e exportação são auditadas |
| 05 — Central de alertas | Filtros por severidade, contexto da mensagem sinalizada, revisão humana e encerramento | Lista de termos gerida pelo TI; inclui palavrões; sem análise contextual ou IA externa; sem bloqueio automático |
| 06 — Trilha de auditoria | Filtros, eventos administrativos e visualização dos registros | Somente TI consulta/gerencia logs; usuários não consultam, alteram ou excluem; retenção sem exclusão automática enquanto sistema opera |
| 07 — Configurações | Área reservada para parâmetros e políticas administradas por TI | O inventário detalhado de telas/opções permanece no refinamento UX Q-018; não presumir catálogo genérico de permissões |

Os dados nas telas são fictícios; números, nomes e eventos não representam dados reais da FORD. Os wireframes são **editáveis e estáticos**, não protótipos funcionais.

## 4. Estados alternativos e confirmações

1. **08.1 — Confirmar desativação:** alerta sobre perda de acesso, opções Cancelar/Confirmar; nenhuma alteração antes da confirmação.
2. **08.2 — Confirmar remoção de participante:** informar o efeito da remoção, confirmar a ação crítica e registrar a operação; a remoção é permitida ao TI e revoga imediatamente o acesso às mensagens/anexos anteriores.
3. **08.3 — Permissão negada:** informação compreensível, saída para o painel; controles de interface não substituem autorização **server-side**.
4. **08.4 — Fila sem registros:** estado vazio para consultas sem resultado.
5. **08.5 — Falha administrativa:** erro e nova tentativa; não exibir sucesso se a operação falhou.
6. **08.6 — Sessão expirada:** exigir login para operações protegidas.

**Regras transversais:** acessibilidade e clareza dos textos; confirmações em ações críticas; diferenciação entre carregamento, erro, cancelamento e êxito; todas as ações administrativas relevantes devem ser auditadas. TI utiliza computador nos navegadores atuais Chrome/Edge/Firefox; essa restrição de uso não substitui autorização server-side.

## 5. Rastreabilidade com requisitos

| Necessidade UX | Requisito / regra |
|---|---|
| TI autenticado com perfil e dispositivo permitido | RF-001, RF-002, RF-018; RN-001, RN-015 |
| Provisionar e desativar conta | RF-003, RF-004; RN-003 a RN-005 |
| Criar/administrar grupos e incluir/remover participantes | RF-005, RF-006; RN-007 |
| Consulta de conversas por TI | RF-016/RF-021; RN-014; RN-022 |
| Alertas de mensagens sinalizadas | RF-014/RF-015; RN-012/RN-013; severidades e prazos consolidados na FORD v2 |
| Marca, navegadores e dispositivos | RN-015, RNF-005 e RN-019; ativos visuais exatos em Q-019 |
| Configurações e permissões específicas | Escopo concreto pendente de definição do PO/TI |
| Auditoria de operações administrativas, consultas, exportações, mensagens e anexos | RF-022; RNF-004; catálogo funcional consolidado na FORD v2 |

## 6. Pontos ainda sujeitos a refinamento de UX e entrega técnica

- **Q-018:** concluir o mapa de telas, navegação e inventário de configurações que efetivamente precisam de interface; este wireframe é referência de baixa fidelidade.
- **Q-019:** obter os ativos oficiais da identidade visual FORD e fechar especificações visuais.
- Executar testes de usabilidade/acessibilidade e validações com usuários nas atividades próprias.
- A implementação real dos fluxos, autorização server-side, RLS, auditoria e testes de segurança pertence às issues técnicas correspondentes; o aceite de UX não declara esses fluxos implementados.

As regras de consulta sem justificativa, auditoria, retenção, grupos, credenciais, severidades/prazos e poderes do TI foram consolidadas na FORD v2 e não devem continuar listadas como questões abertas.

## 7. Aceite e critérios da Issue #92

| Critério da issue | Estado documental final |
|---|---|
| Fluxos desktop e wireframes de baixa fidelidade | **Aprovados pelo PO/Tech Lead em 17/11/2026** |
| Ações críticas com confirmação | **Representadas** |
| Estados alternativos e rastreabilidade | **Documentados** |
| Evidência documental, CI e Vercel | **CI runs #14 e #84 aprovados; Vercel success** |
| Revisão por Pull Request | **PR #142 aprovada (review #5946890924)** |
| Sem regressão de runtime | **PR exclusivamente documental; sem alteração de código da aplicação** |

O aceite conclui o mapeamento documental de UX. Não equivale à implementação do console, testes de usabilidade, análise de segurança concluída ou homologação institucional da FORD.

## 8. Evidências

- Miro: https://miro.com/app/board/uXjVENfDPjY=/
- Issue: https://github.com/Aluvioz/Polychat/issues/92
- PR de entrega: [#142](https://github.com/Aluvioz/Polychat/pull/142), aprovada pelo PO/Tech Lead em 17/11/2026 (review #5946890924).
- Material separado da experiência de Usuário mobile (#91), para não confundir atribuições de TI/Usuário.
- **Estado:** Issue #92 encerrada como concluída em 17/11/2026. O aceite é de UX de baixa fidelidade; não declara implementação, teste de usabilidade ou homologação.

**Histórico:** v1.0 — entrega inicial para revisão (17/11/2026); v1.1 — registra o aceite formal e alinha as regras à FORD v2 (19/11/2026).
