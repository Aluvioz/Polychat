# ADR-001 — Arquitetura lógica geral

- **Status:** Accepted — arquitetura lógica geral aprovada pela TI da FORD, conforme confirmação expressa do PO registrada em 26/11/2026.
- **Data de revisão:** 26/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5
- **Responsáveis pela decisão:** Tech Lead e TI; PO valida aderência ao escopo

## Contexto

O Polychat é uma aplicação web interna da FORD. A baseline atual contempla aproximadamente 25 usuários finais do setor técnico e 2 a 3 administradores de TI, com perfis Usuário e TI, conversas individuais e em grupo, mensagens, anexos PDF/JPEG, alertas, consulta administrativa e auditoria.

A FORD v2 estabelece como regra geral que hospedagem, processamento e operação dos dados sigam os controles definidos pela organização, preferencialmente no Brasil, e que fornecedores não aprovados não acessem, armazenem ou processem dados da FORD. A Q-025, concluída em 24/11/2026, registra a aprovação expressa da TI e da FORD para Supabase e Vercel como provedores nomeados da stack, dentro do modelo de utilização, dos serviços e dos controles aprovados. Essa exceção é específica: não autoriza automaticamente outros fornecedores, subprocessadores ou serviços externos. Bibliotecas e atualizações sem acesso aos dados podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.


A ADR-003, revisada em 24/11/2026, mantém Supabase + Vercel como stack adotada e obrigatória. A compatibilidade e o modelo de utilização desses provedores foram aprovados pela TI e pela FORD na Q-025, concluída em 24/11/2026. Esta ADR deve detalhar a arquitetura lógica, os componentes, os fluxos de dados, as fronteiras de confiança e as responsabilidades de acordo com esse modelo aprovado e com as demais restrições da FORD v2. Essa análise não reabre a Q-025 nem autoriza retirar ou depreciar a ADR-003 por inferência. Qualquer proposta de substituição deve seguir o processo formal de mudança arquitetural em `docs/10-governanca-desenvolvimento.md`.

O repositório contém Next.js 16, React 19, TypeScript, uma página institucional, um módulo isolado de autorização e uma migration de perfis vinculada ao modelo anterior. Não há implementação funcional ponta a ponta do chat nem comprovação de integração com infraestrutura FORD.

## Problema

Definir fronteiras de confiança, responsabilidades e componentes lógicos coerentes com a stack Supabase + Vercel e com as decisões arquiteturais já aceitas, sem tratar controles visuais como segurança nem confundir decisões aprovadas, código existente e integração homologada.

## Alternativas consideradas

1. **Arquitetura modular sobre a stack Supabase + Vercel aprovada:** aplicação hospedada e executada na Vercel, com os serviços Supabase previstos nas ADRs específicas, respeitando os limites e controles aceitos pela TI e pela FORD na Q-025.
2. **Outros serviços gerenciados ou fornecedores externos:** não autorizados a acessar, armazenar ou processar dados da FORD sem aprovação específica. A aprovação da Q-025 é restrita aos provedores e usos nomeados Supabase e Vercel; não constitui autorização genérica para terceiros.
3. **Aplicação concentrada em um único componente:** reduz configuração inicial, mas aumenta acoplamento e dificulta separar privilégios, testar fronteiras e evoluir a operação.

## Decisão aprovada — escopo delimitado

Adotar uma arquitetura lógica modular sobre a stack Supabase + Vercel, aprovada na ADR-003 e na Q-025. A Vercel é a plataforma de hospedagem, deployment e execução da aplicação; o Supabase fornece os serviços de backend previstos nas ADRs específicas, incluindo autenticação, PostgreSQL e armazenamento privado. A composição, os fluxos, as fronteiras de confiança e as responsabilidades devem respeitar os limites operacionais e de segurança registrados na Q-025 e nas ADRs 004 a 009. **Decisão da TI da FORD:** conforme confirmação expressa fornecida pelo PO em 26/11/2026, a TI da FORD aprovou a arquitetura lógica geral descrita nesta ADR, abrangendo componentes, fluxos de dados, fronteiras de confiança, responsabilidades e limites dos serviços, em coerência com a ADR-003/Q-025 e com as ADRs específicas. O registro identifica a TI da FORD como instância aprovadora; o nome individual do aprovador e a referência de ata/documento da deliberação não foram informados nesta atualização. **Registro separado do Tech Lead:** a concordância específica anteriormente considerada recebida pelo PO permanece distinta desta decisão institucional e não é apresentada como novo evento formal `APPROVED` no GitHub. A ADR-001 passa a `Accepted` no escopo da arquitetura lógica geral aqui descrita. Esta aprovação não antecipa o aceite das ADRs específicas 004, 005, 007, 008 ou 010, não comprova a implementação integral dos fluxos e não equivale à homologação de produção. Não reabre nem substitui decisões já aceitas, em especial ADR-003, ADR-006 (escopo delimitado) e ADR-009 (escopo delimitado). As ADRs-005 e 008 permanecem Proposed para suas decisões técnicas específicas; isso não reabre a Q-025 nem a aprovação dos provedores nomeados Supabase + Vercel, inclusive Storage.

As responsabilidades lógicas são:

- **Apresentação:** frontend web Next.js 16 + React 19 + TypeScript, conforme ADR-002, hospedado e publicado pela Vercel na configuração aprovada. O navegador não recebe credenciais privilegiadas nem decide permissões.
- **Camada server-side:** handlers e serviços da aplicação executados no ambiente de aplicação da Vercel, responsáveis por autenticação, autorização, validação de entradas, regras de negócio e operações privilegiadas. Segredos e operações privilegiadas permanecem no servidor, nunca no bundle do cliente.
- **Identidade e sessões:** a arquitetura prevê Supabase Auth como capacidade de identidade da stack aprovada. O contrato funcional e o detalhamento dos fluxos, da sessão e dos controles técnicos permanecem sujeitos à ADR-004, ainda Proposed; não se deve presumir integração completa nem introduzir outro provedor de identidade sem aprovação específica.
- **Persistência:** PostgreSQL no Supabase Database é a tecnologia relacional utilizada na stack adotada e está detalhada como proposta na ADR-005 (Proposed). A aprovação do provedor/modelo de uso na Q-025 não converte a ADR-005 em Accepted nem comprova todos os fluxos de negócio, operação ou continuidade.
- **Autorização de dados:** verificações server-side combinadas com políticas RLS no PostgreSQL, conforme ADR-006 (Accepted — escopo delimitado). O aceite e os testes existentes cobrem os mecanismos, tabelas e fluxos documentados nessa ADR; a integração uniforme de todos os handlers de negócio continua sendo trabalho de implementação.
- **Arquivos:** Supabase Storage é provedor nomeado e capacidade privada autorizada pela Q-025; a arquitetura específica de anexos permanece proposta na ADR-008 (Proposed). O desenho prevê autorização server-side, objetos privados e revogação de acesso. O scanner antimalware permanece dentro da infraestrutura e da responsabilidade operacional da FORD/TI; não encaminhar arquivos ou metadados para scanner SaaS ou outro serviço externo não aprovado.
- **Mensageria em tempo real:** notificação dos participantes sem substituir a persistência como fonte de verdade. A solução e seus controles seguem a ADR-007, ainda Proposed; esta ADR não antecipa o aceite de uma tecnologia específica para realtime.
- **Auditoria e monitoramento:** eventos e registros de auditoria devem utilizar a persistência e os serviços da stack aprovada, com autorização administrativa e rastreabilidade conforme baseline e ADRs aplicáveis. Os detalhes e controles de segurança/monitoramento permanecem sujeitos à ADR-010 e às issues de implementação.
- **Operação:** ambientes de desenvolvimento, homologação e produção segregados na stack Supabase + Vercel conforme ADR-009 (Accepted — escopo delimitado). A TI mantém as responsabilidades operacionais de acesso, configuração, segredos, monitoramento, backup e continuidade, sem confundir o modelo aprovado com evidência de execução de todos os testes de recuperação.

Operações sensíveis devem negar por padrão e falhar fechadas. Criptografia em trânsito e em repouso é obrigatória; a solução não deve ser descrita como E2EE, pois o servidor precisa acessar o conteúdo para as funções administrativas e de monitoramento definidas pela FORD.

Supabase e Vercel são os provedores nomeados e aprovados na Q-025, exclusivamente para os serviços e o modelo de utilização previstos na arquitetura do Polychat. Nenhum outro fornecedor, serviço externo ou subprocessador pode receber acesso a dados da FORD ou assumir seu armazenamento/processamento sem aprovação específica. A aprovação da stack não autoriza scanner externo, análise SaaS ou encaminhamento de arquivos e metadados para serviços não aprovados. Dependências de software sem acesso a esses dados não são, por si só, proibidas.

## Justificativa

A modularidade mantém responsabilidades testáveis e reduz a confiança no cliente. A stack Supabase + Vercel, expressamente aprovada pela TI e pela FORD na Q-025, fornece a direção tecnológica obrigatória. As ADRs específicas definem como cada capacidade deve ser configurada e controlada: os provedores nomeados são exceções explícitas à restrição geral a terceiros, enquanto fornecedores e serviços adicionais continuam vedados sem aprovação específica. A aprovação arquitetural não substitui implementação, testes nem homologação operacional.

## Consequências

**Positivas:**
- Alinhamento com a stack Supabase + Vercel e com os limites aprovados pela TI e pela FORD na Q-025.
- Fronteiras claras entre apresentação, regras, identidade, dados e operação.
- Decisões técnicas rastreáveis por ADR e passíveis de evolução por componente, sem substituição informal da stack.

**Negativas e cuidados:**
- Dependência das plataformas Supabase e Vercel e necessidade de manter suas configurações, acessos e responsabilidades operacionais sob governança da TI.
- Necessidade de comprovar capacidade, observabilidade, backup/restore e suporte conforme os critérios das ADRs e do plano operacional.
- Integração e testes de segurança precisam ocorrer nos ambientes efetivos; aprovação dos provedores não comprova integração funcional nem prontidão para produção.

## Riscos

Configuração incorreta de autorização; credenciais privilegiadas expostas; RLS incompleta; acesso indevido a anexos; falha no antimalware; perda de histórico; publicação de eventos antes da persistência; segregação inadequada de ambientes; uso de fornecedor ou subprocessador não aprovado; configuração incorreta dos serviços Supabase/Vercel ou desvio dos limites aprovados na Q-025.

## Evidências e estado atual

A `main` contém Next.js 16/React 19/TypeScript, rotas e módulos de autenticação/autorização, migrations de domínio e políticas RLS, estruturas de auditoria, bucket privado no Supabase Storage e o endpoint server-side parcial de upload de anexos PDF/JPEG incorporado pelas entregas #181 e #185. As policies RLS de domínio foram testadas no ambiente de desenvolvimento no escopo da ADR-006. Esses componentes representam entregas parciais e não comprovam a implementação funcional ponta a ponta do chat.

Permanecem sem comprovação de integração ponta a ponta, entre outros pontos, o conjunto completo de handlers de conversas/mensagens, a mensageria realtime, o fluxo completo de download e emissão/revogação de links, o scanner antimalware interno, quotas efetivas, remoção de EXIF/GPS, rejeição de PDF protegido por senha e os testes de backup/restauração dos anexos. As entregas e seus limites estão distribuídos nas ADRs 004, 006, 007, 008, 009 e 010 e nas issues correspondentes.

A stack Supabase + Vercel permanece adotada conforme ADR-003; a compatibilidade e o modelo de utilização foram aprovados na Q-025. A existência de migrations, políticas, bucket, handlers parciais ou configurações não equivale à homologação do MVP nem à prontidão para produção. A evidência de implementação, integração, fluxos efetivos de dados e controles operacionais deve ser mantida nas issues e nos ambientes correspondentes; essas verificações não reabrem a decisão de compatibilidade nem alteram o status das ADRs já aceitas.

## Pendências de implementação e validação das ADRs específicas

- A decisão da TI da FORD sobre a arquitetura lógica geral está registrada como Accepted, conforme confirmação do PO em 26/11/2026. A aprovação limita-se ao escopo descrito na seção “Decisão aprovada — escopo delimitado”; não representa homologação de produção nem aceite automático das ADRs específicas.
- Confirmar a coerência da arquitetura com as ADRs específicas: ADR-003 (Accepted) para a stack; ADR-005 (Proposed) para PostgreSQL/Supabase Database; ADR-006 (Accepted — escopo delimitado) para autorização/RLS; ADR-008 (Proposed) para a arquitetura específica de Storage/anexos, sem reabrir a autorização do provedor na Q-025; ADR-009 (Accepted — escopo delimitado) para ambientes e deploy.
- Manter explícitos os pontos ainda sujeitos a decisão ou detalhamento nas ADRs Proposed, especialmente ADR-004 (autenticação/sessões), ADR-007 (realtime) e ADR-010 (segurança/auditoria/monitoramento), sem antecipar seus aceites.
- Manter a decisão institucional e seus limites rastreáveis. O registro desta atualização identifica a TI da FORD como aprovadora e 26/11/2026 como data de registro pelo PO; a data exata da deliberação, o nome individual do aprovador e eventual ata/documento de referência não foram fornecidos.



Os parâmetros funcionais e grupos de requisitos técnicos já alinhados com Desenvolvimento permanecem consolidados nos documentos de requisitos; não são reabertos por esta revisão arquitetural.
