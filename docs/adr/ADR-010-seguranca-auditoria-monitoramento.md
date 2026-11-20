# ADR-010 — Segurança, auditoria e monitoramento

- **Status:** Proposed
- **Data de revisão:** 19/11/2026
- **Issue de origem:** #89
- **Baseline:** POLY-REQ-001 v0.4 — questionário FORD v2 e alinhamentos consolidados
- **Responsabilidade operacional de segurança:** TI da FORD, conforme informado pelo cliente

## Contexto

A FORD v2 consolidou as regras funcionais de monitoramento, consulta administrativa, auditoria, retenção e proteção de dados. O documento anterior mantinha essas regras como perguntas abertas e propunha controles que não correspondem às decisões atuais. Esta revisão substitui aquelas premissas pela baseline v0.4.

O produto deve analisar mensagens por regras e lista de termos mantida pelo TI, incluindo palavrões. Não haverá análise contextual nem uso de IA ou serviço externo para processar o conteúdo. A detecção gera alertas para revisão humana; não bloqueia automaticamente mensagens ou contas.

O TI pode consultar qualquer conversa a qualquer momento, sem justificativa ou aprovação de outro administrador. Também pode exportar conversas, editar ou excluir mensagens e baixar anexos durante investigações. Essas operações e as demais ações administrativas relevantes devem ser auditadas. Todos os administradores TI possuem os mesmos poderes; não há administrador principal ou segunda aprovação. O projeto já avaliou os riscos desse modelo e não os reabre como pendência de produto.

A FORD confirmou criptografia em trânsito e em repouso, sem criptografia ponta a ponta (E2EE). O servidor precisa ter acesso ao conteúdo para executar as funções de monitoramento e administração. As chaves permanecem sob gestão do servidor e da TI FORD.

Supabase e Vercel são as plataformas oficiais do Polychat, conforme ADR-003. O processamento de mensagens, alertas e operações administrativas deve ocorrer nos componentes aprovados dessa stack; nenhum serviço externo adicional ou ferramenta de IA/scanner de terceiros pode receber conteúdo sem aprovação explícita.

A FORD informou que não há política corporativa específica de privacidade para este programa, que Jurídico não será envolvido como frente do projeto e que privacidade/LGPD não é prioridade operacional do programa. TI será o canal para pedidos de acesso, correção e exclusão; pedidos legais serão tratados pela própria FORD, que espera ser informada quando juridicamente permitido. Essas informações registram a posição do cliente e não afastam obrigações legais aplicáveis. A FORD também informou não possuir uma área separada de Segurança da Informação; TI assume essa responsabilidade.

## Problema

Registrar como a solução deve proteger conteúdo, operar monitoramento e investigação, auditar ações privilegiadas e preservar dados, sem apresentar criptografia em trânsito/repouso como E2EE nem acrescentar barreiras operacionais que contrariem as regras confirmadas pela FORD.

## Alternativas consideradas

1. **E2EE estrita:** não atende às funções confirmadas de monitoramento server-side, consulta administrativa e exportação.
2. **Criptografia em trânsito e em repouso nos serviços oficiais Supabase/Vercel, com acesso server-side governado pela FORD:** atende ao modelo funcional confirmado, preservando a capacidade do servidor de processar conteúdo; não é E2EE.
3. **Processamento de conteúdo por provedor ou IA adicional não aprovado:** não permitido; Supabase e Vercel são as plataformas oficialmente aprovadas do projeto.
4. **Bloqueio automático de mensagens/contas após detecção:** não está previsto; a detecção deve produzir alerta para análise do TI.

## Decisão proposta

### 1. Proteção criptográfica e chaves

- Proteger dados em trânsito e em repouso.
- Não declarar nem divulgar o produto como E2EE.
- O servidor mantém acesso técnico ao conteúdo para monitoramento, consulta administrativa e operação do sistema.
- A gestão de chaves permanece sob responsabilidade do servidor e da TI FORD, seguindo os requisitos de proteção de credenciais e gestão de chaves já alinhados com Desenvolvimento.
- Esse processamento deve ocorrer nos componentes oficiais Supabase/Vercel, com acesso mínimo, isolamento por ambiente e proteção de segredos. Não enviar conteúdo, metadados ou chaves para serviços externos adicionais não aprovados.

### 2. Monitoramento de mensagens

- A detecção utiliza regras e uma lista de termos administrada pelo TI, incluindo palavrões.
- Não realizar análise contextual.
- Não enviar conteúdo para IA, scanner de mensagens ou serviço externo de análise.
- A detecção gera um alerta para a fila do TI.
- A detecção, isoladamente, não bloqueia a entrega da mensagem nem desativa a conta do remetente.
- A regra/lista aplicada e os dados mínimos para investigação devem ser rastreáveis, sem replicar conteúdo desnecessário nos logs.

### 3. Alertas e tratamento pelo TI

| Severidade | Prazo de resposta consolidado |
|---|---|
| Alta | Imediato, em até 1 hora |
| Média | Até 1 dia útil |
| Baixa | Até 3 dias úteis |

- Os alertas são apresentados em fila administrativa para o TI.
- O TI analisa e pode encerrar um alerta sem justificativa obrigatória.
- Não há punição, bloqueio de mensagem ou bloqueio de conta automático por força da detecção.
- A taxonomia, severidades e prazos acima são premissas funcionais consolidadas; não devem ser reabertos como pendências de produto.

### 4. Consulta, exportação e administração de conversas

- Qualquer administrador TI pode consultar qualquer conversa a qualquer momento, mesmo sem ser participante.
- Não é exigida justificativa nem aprovação de outro administrador para a consulta.
- O TI pode exportar conversas.
- O TI pode editar ou excluir mensagens a qualquer momento.
- O TI pode baixar anexos durante investigações.
- As permissões são iguais para todos os administradores TI; não criar papel de administrador principal, hierarquia ou fluxo de segunda aprovação.
- A consulta administrativa, exportação, edição/exclusão de mensagens e download de anexos devem gerar registros de auditoria.
- A consulta administrativa não transforma o TI em participante da conversa.

### 5. Catálogo mínimo de auditoria

A trilha deve registrar, no mínimo, as seguintes categorias de operações:

- login administrativo;
- criação, alteração, desativação e reativação de contas;
- criação, encerramento, desativação e reativação de grupos;
- inclusão e remoção de participantes;
- consulta administrativa de conversas;
- consulta e tratamento/encerramento de alertas;
- download de anexos pelo TI;
- liberação administrativa de anexos;
- exportação de conversas;
- edição e exclusão administrativa de mensagens;
- alteração de configurações.

Os registros devem permitir identificar o operador, a ação, o recurso/objeto afetado e o momento do evento, preservando os demais campos técnicos necessários à rastreabilidade. Não se deve incluir senha, token, chave secreta ou cópia integral do conteúdo em logs de auditoria.

- Somente TI pode consultar e gerenciar os registros de auditoria.
- Usuários comuns não podem consultar, alterar ou excluir registros.
- A política de retenção consolidada exige que logs e registros administrativos não sofram exclusão automática enquanto o sistema estiver operando.
- Exclusões dependem de autorização do TI; preservação em investigação e descarte devem seguir a decisão administrativa aplicável e deixar registro de auditoria.

### 6. Retenção, backups e solicitações

- Mensagens, anexos, alertas, logs de auditoria e registros administrativos não são excluídos automaticamente enquanto o sistema operar.
- O TI autoriza exclusões e decide quando preservar dados durante investigações.
- Backups são diários e retidos por 12 meses.
- Após exclusão autorizada, os dados saem dos backups ao final do ciclo de retenção, com descarte registrado em auditoria.
- TI é o canal operacional informado pela FORD para solicitações de acesso, correção e exclusão.
- Solicitações legais são tratadas pela FORD; a expectativa de notificação ao fornecedor aplica-se quando juridicamente permitido.

### 7. Transparência

A aplicação deve apresentar aviso de monitoramento no primeiro acesso do funcionário. A tela e o texto final serão detalhados em UX, mantendo o requisito funcional RF-023.

## Justificativa

O modelo de criptografia definido preserva a capacidade de operação e investigação solicitada pela FORD, sem prometer E2EE. A detecção baseada em lista, com revisão humana e sem bloqueio automático, respeita o comportamento de alerta confirmado. O registro das ações administrativas permite rastreabilidade sem introduzir justificativa obrigatória, segunda aprovação ou hierarquia não previstas.

## Consequências

**Positivas:**
- Regras de monitoramento e investigação alinhadas à FORD v2.
- Separação clara entre alerta, revisão humana e decisão administrativa.
- Rastreabilidade das ações privilegiadas definidas pelo cliente.
- Retenção e backup alinhados aos requisitos operacionais.
- Processamento nos serviços oficiais Supabase/Vercel, com governança de acessos e gestão de chaves conforme os controles definidos pela FORD.

**Negativas e cuidados:**
- A ausência de E2EE implica que o servidor e administradores tecnicamente autorizados podem acessar conteúdo em claro.
- O modelo requer proteção rigorosa do ambiente, das chaves, das contas TI e dos registros de auditoria.
- O catálogo de eventos e controles técnicos precisa ser implementado e testado na stack oficial Supabase/Vercel, sob governança da FORD.

## Riscos

Acesso indevido por comprometimento de conta TI; exposição de conteúdo em servidor; comprometimento de chaves; uso indevido de capacidade administrativa; falso positivo; falha de registro de auditoria; descarte incompatível com investigação; vazamento de dados em logs; integração com serviço adicional não aprovado.

A igualdade de poderes entre os administradores TI e os riscos correspondentes foram avaliados pelo responsável do projeto. Este registro mantém o risco conhecido, sem reabrir o modelo administrativo como pendência.

## Evidências e estado atual

- POLY-REQ-001 v0.4 e documentos 03, 04 e 05 consolidam monitoramento, severidades, prazos, acesso TI, exportação, edição/exclusão, auditoria, retenção, backup e infraestrutura.
- RF-019 a RF-023 foram acrescentados para leitura, edição/exclusão administrativa, exportação, auditoria e aviso de monitoramento.
- O repositório ainda não comprova implementação ponta a ponta de monitoramento, alertas, consulta administrativa, exportação ou auditoria funcional.
- A presença dos requisitos nesta ADR não significa que os fluxos estejam implementados ou homologados.

## Pendências para Accepted

- Definir e revisar tecnicamente o modelo de dados, catálogo de eventos e interfaces de auditoria.
- Integrar e validar o processamento e armazenamento de alertas, conteúdo e logs nos serviços oficiais Supabase/Vercel, com políticas de acesso e auditoria (Q-025).
- Implementar os fluxos server-side e as políticas de autorização correspondentes; testar falhas e tentativas não autorizadas.
- Validar tecnicamente a gestão de chaves, proteção dos logs, backups e restauração.
- Submeter a ADR à revisão do Tech Lead e da TI no contexto da arquitetura-alvo.

Os parâmetros de severidade, prazos, regras de detecção, poderes do TI, retenção e backup já consolidados não são pendências de produto. O posicionamento do cliente sobre privacidade e Jurídico deve ser registrado como tal, sem presumir dispensa de obrigações legais aplicáveis.
