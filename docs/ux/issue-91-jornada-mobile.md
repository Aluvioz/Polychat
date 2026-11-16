# UX/UI — Jornada do Usuário mobile (Issue #91)

> **Status:** proposta de UX/UI para revisão; **não aprovada** pelo PO ou pela FORD.  
> **Issue:** [#91 — Mapear jornada, navegação e estados do Usuário mobile](https://github.com/Aluvioz/Polychat/issues/91)  
> **Artefato visual editável:** [Quadro Miro — POLYCHAT — UX/UI — Issue #91](https://miro.com/app/board/uXjVENIAOT4=/)  
> **Escopo:** perfil **Usuário**, aplicação **web mobile**. A console de TI desktop pertence a outra entrega (#92).

## 1. Objetivo e método

Mapear a experiência do funcionário da FORD desde a autenticação até a leitura e o envio de mensagens individuais, mensagens em grupos dos quais participa e anexos PDF/JPEG. Indicar os estados alternativos e as restrições conhecidas.

A atividade reúne fluxogramas e wireframes de **baixa fidelidade** elaborados e revisados no Miro, com auxílio de ferramentas de IA e inspeção manual. São **propostas visuais**, não telas implementadas nem resultados de teste com usuários. Os exemplos de participantes e mensagens são **fictícios**.

Referências consultadas na branch principal: `docs/01-visao-geral-e-escopo.md`, `docs/03-requisitos-funcionais.md`, `docs/05-regras-de-negocio-e-restricoes.md` e `docs/08-glossario-e-questoes-em-aberto.md`. Os documentos de requisitos ainda contêm pendências de validação, portanto não devem ser tratados como aprovação do cliente.

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

### Decisões que são propostas, não requisitos aprovados

- Navegação inferior com `Conversas / Contatos / Perfil`; a existência da tela Perfil e o mapa definitivo de páginas dependem de **Q-018**.
- Comportamento da aplicação offline (histórico em cache, indicadores de reconexão e reenvio) depende de definição técnica e homologação.
- Indicadores de mensagem enviada/confirmada e detalhes de carregamento dependem de desenho técnico/QA.
- Uso de cores azuis e brancas segue orientação geral da FORD; códigos, tipografia e ativos oficiais precisam de aprovação (**Q-019**).
- Textos definitivos, além do que está expressamente previsto nos critérios, ainda devem passar por revisão.

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
| Revisão/validação pelo PO e cliente | **Pendente** |
| Teste com usuários representativos, acessibilidade e homologação | **Pendente / escopo de validação subsequente** |
| Revisão por PR e aceite da issue | **Pendente** |

**Critérios da issue #91:** os fluxos e wireframes precisam ser **aprovados**; todos os estados cobertos; testes relevantes ou evidências documentadas; revisão por PR; ausência de regressão. A presença de artefatos e este arquivo **não satisfaz automaticamente** todos esses critérios.

## 5. Perguntas objetivas ao PO / representante FORD

1. O Usuário pode enviar mensagens em todos os grupos dos quais participa? Existem regras de saída/remoção? (**Q-003**)
2. A escolha de JPEG será apenas por arquivos existentes? Como impedir captura de câmera dentro da aplicação? (**Q-004**)
3. Qual será o identificador de login e o procedimento de credencial inicial/recuperação? (**Q-005/Q-006**)
4. Qual é o limite de tamanho/quantidade de anexos e o comportamento de falha? (**Q-011**)
5. Quais dispositivos/navegadores são homologados? Como lidar com tablets e modo desktop? (**Q-012**)
6. A navegação `Conversas / Contatos / Perfil` é desejada? Quais páginas são obrigatórias? (**Q-018**)
7. Quais são os ativos oficiais de marca, a paleta e os padrões de acessibilidade? (**Q-019/Q-020**)

## 6. Evidência e próximos passos

- **Miro:** https://miro.com/app/board/uXjVENIAOT4=/
- **Issue:** https://github.com/Aluvioz/Polychat/issues/91
- Revisar visualmente os protótipos em zoom adequado; validar legibilidade, hierarquia, inconsistências e restrições.
- Solicitar feedback do PO/Tech Lead e registrar o resultado, com data e responsável, no GitHub.
- Planejar testes de usabilidade e acessibilidade conforme responsabilidades das issues #94 e #129.
- Manter a issue **aberta** e este PR em **Draft** até revisão/aceite; não declarar implementação, testes ou aprovação que não ocorreram.

**Histórico deste documento:** versão inicial de documentação UX/UI para revisão, 16/11/2026.
