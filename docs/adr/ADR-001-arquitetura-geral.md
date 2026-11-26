# ADR-001 — Arquitetura lógica geral

- **Status:** Proposed
- **Data de revisão:** 24/11/2026
- **Issue:** #89
- **Baseline:** POLY-REQ-001 v0.5
- **Responsáveis pela decisão:** Tech Lead e TI; PO valida aderência ao escopo

## Contexto

O Polychat é uma aplicação web interna da FORD. A baseline atual contempla aproximadamente 25 usuários finais do setor técnico e 2 a 3 administradores de TI, com perfis Usuário e TI, conversas individuais e em grupo, mensagens, anexos PDF/JPEG, alertas, consulta administrativa e auditoria.

A FORD v2 estabelece como regra geral que hospedagem e infraestrutura permaneçam sob controle da FORD, preferencialmente no Brasil, e que serviços de terceiros não acessem, armazenem ou processem dados da organização. A Q-025, concluída em 24/11/2026, registra a aprovação expressa da TI e da FORD para Supabase e Vercel como provedores nomeados da stack, dentro do modelo de utilização aprovado. A restrição geral permanece aplicável a outros fornecedores e serviços não aprovados; bibliotecas e atualizações sem acesso aos dados podem ser utilizadas.

A ADR-003, revisada em 24/11/2026, mantém Supabase + Vercel como stack adotada e obrigatória. A compatibilidade e o modelo de utilização desses provedores foram aprovados pela TI e pela FORD na Q-025, concluída em 24/11/2026. Esta ADR deve detalhar a arquitetura lógica, os componentes, os fluxos de dados, as fronteiras de confiança e as responsabilidades de acordo com esse modelo aprovado e com as demais restrições da FORD v2. Essa análise não reabre a Q-025 nem autoriza retirar ou depreciar a ADR-003 por inferência. Qualquer proposta de substituição deve seguir o processo formal de mudança arquitetural em `docs/10-governanca-desenvolvimento.md`.

O repositório contém Next.js 16, React 19, TypeScript, uma página institucional, um módulo isolado de autorização e uma migration de perfis vinculada ao modelo anterior. Não há implementação funcional ponta a ponta do chat nem comprovação de integração com infraestrutura FORD.

## Problema

Definir fronteiras de confiança, responsabilidades e componentes lógicos sem presumir provedores externos, tratar controles visuais como segurança ou confundir código existente com arquitetura implementada e homologada.

## Alternativas consideradas

1. **Arquitetura modular executada em infraestrutura sob controle da FORD:** aplicação, identidade, banco, armazenamento, análise antimalware, auditoria e operação permanecem dentro da fronteira de controle da organização.
2. **Serviços gerenciados externos para componentes centrais:** recusados para dados da FORD quando o terceiro puder acessar, armazenar ou processar esses dados, em desacordo com a FORD v2.
3. **Aplicação concentrada em um único componente:** reduz configuração inicial, mas aumenta acoplamento e dificulta separar privilégios, testar fronteiras e evoluir a operação.

## Decisão proposta

Adotar uma arquitetura lógica modular que utilize a stack Supabase + Vercel aprovada na Q-025, observando os limites, fluxos, fronteiras de confiança e responsabilidades definidos para esses provedores. A ADR permanece Proposed até a revisão formal do Tech Lead e da TI sobre a arquitetura lógica, seus componentes e suas responsabilidades; essa revisão não representa reabertura da compatibilidade da stack já aprovada.

As responsabilidades lógicas são:

- **Apresentação:** frontend web Next.js 16 + React 19 + TypeScript, conforme ADR-002. O navegador não recebe credenciais privilegiadas nem decide permissões.
- **Camada server-side:** handlers e serviços da aplicação responsáveis por autenticação, autorização, validação de entradas, regras de negócio e operações privilegiadas.
- **Identidade e sessões:** mecanismo de autenticação operado dentro da fronteira de controle da FORD, sem provedor externo que acesse ou processe credenciais, identidades ou sessões. Regras funcionais e de credenciais seguem a baseline e a ADR-004.
- **Persistência:** banco relacional sob controle da FORD. PostgreSQL é a tecnologia proposta na ADR-005, ainda sujeita à validação técnica da implantação.
- **Autorização de dados:** verificações server-side e políticas no banco, incluindo RLS quando suportada e adequada. As permissões devem refletir os perfis Usuário e TI e as regras de participação em conversas e grupos.
- **Arquivos:** armazenamento privado na infraestrutura FORD, com autorização no servidor, revogação de acesso e análise antimalware dentro da mesma fronteira. Não utilizar buckets ou serviços externos para dados da organização.
- **Mensageria em tempo real:** transporte interno/autorizado para notificar participantes; o banco permanece a fonte de verdade. A tecnologia específica não está decidida nesta ADR.
- **Auditoria e monitoramento:** registros e processamento de alertas dentro da infraestrutura FORD, com acesso administrativo conforme a baseline e trilha auditável.
- **Operação:** ambientes de desenvolvimento, homologação e produção isolados e sob controle da FORD; backup, restauração, gestão de chaves e monitoramento conforme os requisitos não funcionais consolidados.

Operações sensíveis devem negar por padrão e falhar fechadas. Criptografia em trânsito e em repouso é obrigatória; a solução não deve ser descrita como E2EE, pois o servidor precisa acessar o conteúdo para as funções administrativas e de monitoramento definidas pela FORD.

Nenhum fornecedor, serviço externo ou suboperador pode receber acesso a dados da FORD ou assumir seu armazenamento/processamento. Dependências de software sem acesso a esses dados não são, por si só, proibidas.

## Justificativa

A modularidade mantém responsabilidades testáveis e reduz a confiança no cliente. A execução sob controle FORD respeita a restrição de infraestrutura mais recente e permite que autenticação, dados, arquivos, antimalware, auditoria e recuperação permaneçam dentro da fronteira exigida pelo cliente.

A seleção de tecnologias específicas deve considerar compatibilidade com a infraestrutura corporativa, operação, segurança, continuidade e capacidade de homologação, sem reintroduzir serviços externos incompatíveis.

## Consequências

**Positivas:**
- Alinhamento com a restrição de soberania e controle de infraestrutura da FORD.
- Fronteiras claras entre apresentação, regras, identidade, dados e operação.
- Menor dependência de provedores externos para tratar dados corporativos.
- Decisões técnicas rastreáveis e passíveis de substituição por componente.

**Negativas e cuidados:**
- Maior responsabilidade da FORD/equipe sobre operação, disponibilidade, atualização e recuperação.
- Necessidade de comprovar capacidade de infraestrutura, observabilidade, backup/restore e suporte.
- Integração e testes de segurança precisam ocorrer no ambiente operacional real.

## Riscos

Configuração incorreta de autorização; credenciais privilegiadas expostas; RLS incompleta; acesso indevido a anexos; falha no antimalware; perda de histórico; publicação de eventos antes da persistência; segregação inadequada de ambientes; dependência externa que passe a acessar ou processar dados.

## Evidências e estado atual

A `main` contém Next.js 16/React 19/TypeScript, página institucional, o módulo `src/auth/authorization.mjs` e uma migration de perfis vinculada ao Supabase. Não foram encontradas rotas funcionais de chat, serviços de domínio, armazenamento de anexos, canais realtime ou trilha de auditoria funcional.

A existência desses artefatos não comprova integração funcional nem homologação de produção. A stack Supabase + Vercel permanece adotada conforme ADR-003, e sua compatibilidade e modelo de utilização foram aprovados na Q-025. A evidência de implementação, integração, fluxos efetivos de dados e controles operacionais deve ser produzida nas issues e nos ambientes correspondentes; essas verificações não reabrem a decisão de compatibilidade nem alteram o status da ADR-003.

## Pendências para Accepted

- Detalhar e submeter à revisão formal a arquitetura lógica e sua correspondência com o modelo Supabase + Vercel aprovado na Q-025, incluindo componentes, fluxos, fronteiras de confiança, responsabilidades e limites de cada serviço.
- Revisão do Tech Lead e TI sobre componentes, fronteiras server-side, identidade, banco, armazenamento, antimalware, auditoria, continuidade e operação.
- Registrar na ADR a solução técnica selecionada, os responsáveis pela aprovação, a data, as evidências de viabilidade e os limites do aceite.

Os parâmetros funcionais e grupos de requisitos técnicos já alinhados com Desenvolvimento permanecem consolidados nos documentos de requisitos; não são reabertos por esta revisão arquitetural.
