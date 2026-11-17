# ADR-010 — Segurança, auditoria e monitoramento

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89
- **Classificação:** aprovação crítica de negócio, TI, Segurança e Jurídico/Privacidade pendente

## Contexto

A baseline confirma a intenção de analisar mensagens suspeitas e alertar o TI. Também confirma que o TI pode consultar conversas para segurança e que esse acesso deve ser registrado em auditoria. A baseline deixa pendentes os critérios de suspeição, falsos positivos, finalidade, transparência, responsáveis, campos de auditoria e retenção (Q-007 a Q-010 e Q-013 a Q-015).

A consulta de conteúdo pelo servidor e a análise automatizada server-side criam um conflito arquitetural com criptografia ponta a ponta estrita (E2EE), na qual o servidor não possui acesso ao conteúdo em claro. Não há decisão aprovada sobre E2EE no repositório.

## Problema

Documentar as opções e salvaguardas sem prometer E2EE em uma arquitetura que precisa ler conteúdo no servidor, nem transformar a capacidade de TI em acesso irrestrito sem justificativa e auditoria.

## Alternativas consideradas

1. **E2EE estrita:** chaves de conteúdo permanecem nos dispositivos; servidor/provedor não lê mensagens. Não atende diretamente à consulta de conteúdo pelo TI e à análise server-side previstas na baseline.
2. **Criptografia em trânsito e em repouso, com processamento server-side controlado:** permite análise e consulta autorizada, mas o serviço e determinados operadores autorizados podem ter acesso ao conteúdo em claro.
3. **Modelo híbrido com chaves organizacionais/escrow:** pode viabilizar investigação, mas não é E2EE estrita e aumenta muito a complexidade de custódia e governança.
4. **Análise apenas no cliente:** reduz leitura server-side, mas pode ser contornada e não resolve a consulta administrativa confirmada.

## Decisão proposta

Não declarar nem anunciar E2EE enquanto não houver desenho e aprovação explícitos. Para preservar a intenção de consulta de TI e análise server-side, avaliar criptografia em trânsito e em repouso com gestão de chaves, segregação de funções e acesso de conteúdo just-in-time. Essa alternativa **não** oferece E2EE estrita e só poderá ser adotada após aprovação expressa da FORD, TI, Segurança e Jurídico/Privacidade, com finalidade, base legal, transparência e avaliação de impacto quando aplicável.

### Consulta de conversas pelo TI

Como proposta mínima de controle: justificar cada consulta; limitar escopo e período; exigir autenticação reforçada conforme política aprovada; registrar operador, data/hora, conversa consultada, motivo, ação e resultado em trilha protegida contra alteração; monitorar consultas fora do padrão; revisar acessos periodicamente. A baseline autoriza consulta para segurança, mas não autoriza automaticamente exportação em massa, alteração ou exclusão de mensagens.

### Monitoramento de mensagens suspeitas

Começar somente após aprovação dos termos/categorias e critérios. Alertas devem dar suporte à análise do TI, registrar regra/versão e contexto mínimo necessário e permitir classificação de falso positivo. Não implementar bloqueio automático de mensagem ou conta sem requisito e aprovação específicos; a baseline confirma alerta e investigação, não bloqueio automático. Uso de IA ou serviço externo exigirá avaliação própria de privacidade e transferência de dados.

### Retenção, descarte e incidentes

Definir prazos separados para mensagens, anexos, alertas, auditoria e backups. Estabelecer acesso mínimo, descarte verificável, proteção de logs, preservação de evidências e fluxo de resposta a incidentes. Não fixar prazos nesta ADR porque não constam da baseline.

## Justificativa

As alternativas tornam explícito o trade-off entre confidencialidade técnica e capacidade de análise/consulta do servidor. A opção híbrida ou server-side não deve ser apresentada como E2EE. Governança e auditoria são necessárias para evitar que uma capacidade técnica se converta em acesso sem responsabilização.

## Consequências

**Positivas:** trade-offs transparentes; capacidade de investigação alinhada aos requisitos, caso aprovada; maior rastreabilidade.

**Negativas:** não oferece E2EE estrita; aumenta impacto de comprometimento do servidor ou de conta privilegiada; exige processo, auditoria e revisão contínua.

## Riscos

Abuso de privilégio, acesso interno indevido, chave comprometida, falso positivo, monitoramento desproporcional, retenção excessiva, exposição em logs, suboperadores e conflito com expectativas dos funcionários ou obrigações legais.

## Evidências atuais

O repositório não contém implementação de monitoramento, consulta administrativa de mensagens, trilha de auditoria de conteúdo, sistema de alertas ou gestão de chaves para esses fluxos. A migration atual trata somente de perfis. Os requisitos constam da baseline e permanecem sem fluxo funcional implementado.

## Pendências para Accepted

- Aprovação da FORD/representante de negócio quanto à finalidade, transparência e modelo de acesso.
- Aprovação de TI e Segurança sobre controle operacional, chaves, autenticação reforçada, auditoria e resposta a incidentes.
- Aprovação de Jurídico/Privacidade sobre base legal, avisos, retenção, descarte e avaliação de impacto aplicável.
- Definição dos critérios de mensagens suspeitas, severidade, falsos positivos e resposta (Q-007/Q-008).
- Definição de governança da consulta TI e retenção por classe de dado (Q-009/Q-010).
- Definição de hospedagem, região e solicitações legais (Q-013/Q-015).

Até essas aprovações, esta ADR permanece Proposed e não autoriza ativar monitoramento de conteúdo nem consulta administrativa em produção.
