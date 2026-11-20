# UX/UI — Jornada do Usuário mobile (Issue #91)

> **Status:** aprovada pelo PO/Tech Lead em 17/11/2026 como baseline de UX mobile de baixa fidelidade. Entrega documental concluída na Issue #91; não representa implementação das telas, teste de usabilidade ou homologação institucional da FORD.  
> **Issue:** [#91 — Mapear jornada, navegação e estados do Usuário mobile](https://github.com/Aluvioz/Polychat/issues/91)  
> **Artefato visual editável:** [Quadro Miro — POLYCHAT — UX/UI — Issue #91](https://miro.com/app/board/uXjVENIAOT4=/)  
> **Escopo:** perfil **Usuário**, aplicação **web mobile**. A console de TI desktop pertence a outra entrega (#92).

## 1. Objetivo e método

Mapear a experiência do funcionário da FORD desde a autenticação até a leitura e o envio de mensagens individuais, mensagens em grupos dos quais participa e anexos PDF/JPEG. Indicar os estados alternativos e as restrições conhecidas.

A atividade reúne fluxogramas e wireframes de **baixa fidelidade** elaborados e revisados no Miro, com auxílio de ferramentas de IA e inspeção manual. São **propostas visuais**, não telas implementadas nem resultados de teste com usuários. Os exemplos de participantes e mensagens são **fictícios**.

Referências vigentes: baseline POLY-REQ-001 v0.4 e documentos 01, 03, 05 e 08. As decisões da FORD v2 substituem dúvidas antigas sobre contas, grupos, anexos, dispositivos, leitura e monitoramento. O aceite da UX permanece limitado à baixa fidelidade.

## 2. Entregáveis no Miro

### 2.1 Fluxogramas

1. **01 — Fluxo de acesso mobile:** abrir aplicação, informar credenciais, validação, restrição de dispositivo, conversas e sessão.
2. **02 — Conversas individuais:** conversas recentes, busca de contato ativo, histórico, envio e falha.
3. **03 — Conversas em grupo:** seleção de grupo existente, pertinência, mensagens e anexos permitidos.
4. **04 — Estados e decisões de UX:** carregamento, lista vazia, desconexão, sessão expirada, permissão negada, falha e sucesso.

### 2.2 Wireframes das telas principais

| Tela | Conteúdo representado | Requisitos associados |
|---|---|---|
| **01 — Login** | Identificador, senha, entrar e comunicação de autenticação | RF-001, RF-003, RF-017 |
| **02 — Conversas recentes** | Lista ordenada, busca, entrada para nova conversa individual; elementos de navegação propostos | RF-007, RF-008, RF-009 |
| **03 — Chat individual** | Histórico, escrita, envio e acesso a anexo | RF-008, RF-009, RF-011 |
| **04 — Chat em grupo** | Identificação do grupo, participantes, histórico e anexos | RF-005, RF-006, RF-008, RF-010, RF-011 |

### 2.3 Wireframes de estados alternativos

| Estado | Comportamento visual representado | Referência |
|---|---|---|
| **05.1 — Login inválido** | Erro genérico e nova tentativa | RF-001 / CA-001.2 |
| **05.2 — Conversas vazias** | Orientação clara para iniciar uma conversa | RF-007 / CA-007.3 |
| **05.3 — Sem conexão** | Aviso, histórico visível como proposta e indicação de envio não concluído | Fluxos alternativos; validar política offline |
| **05.4 — Sessão expirada** | Aviso e retorno ao login | RF-009 / CA-009.3 |
| **05.5 — Acesso negado** | Falta de permissão e orientação à TI quando aplicável | RF-002, RF-008 |
| **05.6 — Falha no envio** | Mensagem não confirmada com opção de nova tentativa | RF-009; tratamento de falhas |
| **05.7 — Arquivo inválido** | Rejeição explícita de arquivo fora de PDF/JPEG | RF-011, RF-012 |
| **05.8 — Falha no upload** | Arquivo de tipo permitido cujo envio falhou; nova tentativa | RF-011; tratamento de falhas |

**Importante:** os estados alternativos têm wireframes próprios. Não apresentar exemplos de erro como se fossem o estado normal e simultâneo das telas principais.

## 3. Jornada proposta e decisões de UX

1. **Autenticação:** usuário recebe credenciais do TI e faz login; não existe cadastro público nem convite. Falha de credenciais não deve revelar detalhes de existência da conta. Conta desativada não pode entrar.
2. **Dispositivo:** o perfil Usuário utiliza celular; o perfil TI utiliza computador. A mensagem exigida em ambiente incompatível para Usuário é **“só pode ser usado em celular”** (CA-017.2); a validação de autorização deve acontecer no servidor, não apenas pela interface.
3. **Entrada:** após autenticar, abrir **conversas recentes**, conforme RN-010 / CA-007.1. Uma lista sem mensagens deve explicar a situação e oferecer uma ação relevante.
4. **Conversa individual:** o Usuário pode iniciar conversa com outro usuário ativo, independentemente de seu cargo corporativo, e só pode consultar conversas às quais tem acesso.
5. **Grupo:** o TI cria grupos e administra participantes. O Usuário acessa apenas grupos permitidos; envio por membros ainda está marcado como **derivado e pendente de validação** (RF-010/Q-003).
6. **Anexos:** somente PDF e JPEG. O sistema deve explicar formato inválido e falha de upload em estados **distintos**; tamanho máximo e política de seleção de JPEG ainda não estão definidos.
7. **Feedback:** comunicação visível de carregamento, sessão expirada, acesso negado, ausência de conexão e envio não concluído.

### Decisões de UX ainda não fechadas

- O mapa definitivo de telas, navegação e existência/escopo da tela Perfil permanecem no refinamento interno de UX (Q-018). Os wireframes desta issue são baseline de baixa fidelidade, não especificação visual final.
- Códigos exatos de cor, tipografia, logo e ativos oficiais dependem do material de marca da FORD (Q-019).
- O estado offline deve comunicar que mensagens não confirmadas pelo servidor não foram enviadas. Persistência de mensagens confirmadas e recuperação após reconexão normal são requisitos; cache offline, fila local e reenvio automático não devem ser inferidos sem desenho técnico.
- A interface apresenta confirmação/horário de leitura e contador de não lidas. Não há notificações push nem notificações do navegador.
- O aviso de monitoramento deve ser apresentado no primeiro acesso.
- A aplicação não oferece captura de foto, áudio ou vídeo. O JPEG é selecionado da galeria.

## 4. Checklist de conformidade para revisão

| Checagem | Situação nesta entrega |
|---|---|
| Identificação e senha, sem cadastro aberto | **Representado** nos wireframes |
| Conversas recentes e estado vazio | **Representado** |
| Conversa individual com contato ativo | **Representado** |
| Grupos criados/administrados por TI | **Restrição documentada**; fluxo exato pendente |
| PDF/JPEG permitidos e outros arquivos rejeitados | **Representado** |
| Diferenciar arquivo inválido de erro de upload | **Representado** em estados 05.7/05.8 |
| Sem captura própria de foto, áudio ou vídeo | **Regra documentada**, conferir implementação futura |
| Restrições de dispositivo por perfil | **No fluxo**, demanda verificação de texto e autorização em implementação |
| Credenciais inválidas, sessão expirada, offline, acesso negado, falha no envio | **Representado** |
| Revisão/validação pelo PO/Tech Lead | **Aprovada em 17/11/2026 como baseline de baixa fidelidade** |
| Testes de usabilidade/acessibilidade e homologação FORD | **Não concluídos por esta issue; continuidade em atividades próprias** |
| Revisão por PR e aceite da issue | **Concluídos: PR #141 aprovada (review #5946859734); CI runs #13 e #83 aprovados; Vercel success** |

**Critérios da Issue #91:** foram aceitos os fluxos e wireframes mobile de baixa fidelidade, os estados alternativos, as evidências documentais, a revisão independente da PR #141 e os checks registrados. O aceite conclui o mapeamento documental; não declara telas implementadas, testes de usabilidade ou homologação FORD.

## 5. Pontos ainda sujeitos a refinamento de UX

1. Consolidar o mapa definitivo de telas, navegação e escopo da tela Perfil (Q-018).
2. Obter os ativos oficiais da identidade visual FORD e definir os detalhes visuais finais (Q-019).
3. Executar os testes de usabilidade e acessibilidade previstos nas issues relacionadas, sem confundi-los com o aceite documental desta issue.

As regras de credenciais, grupos, anexos, navegadores/dispositivos, recibos de leitura, mensagens não lidas e aviso de monitoramento foram consolidadas na FORD v2 e não devem continuar listadas como perguntas abertas.

## 6. Evidência e próximos passos

- **Miro:** https://miro.com/app/board/uXjVENIAOT4=/
- **Issue:** https://github.com/Aluvioz/Polychat/issues/91
- **PR de entrega:** [#141](https://github.com/Aluvioz/Polychat/pull/141), aprovada pelo PO/Tech Lead em 17/11/2026 (review #5946859734).
- **Checks registrados:** CI runs #13 e #83 aprovados; Vercel success.
- **Miro editável:** https://miro.com/app/board/uXjVENIAOT4=/
- **Estado:** Issue #91 encerrada como concluída em 17/11/2026. O aceite cobre o mapeamento e os wireframes de baixa fidelidade, não implementação, teste de usabilidade ou homologação.

**Histórico:** v1.0 — entrega inicial para revisão (16/11/2026); v1.1 — registra o aceite formal da baixa fidelidade e alinha as regras à FORD v2 (19/11/2026).
