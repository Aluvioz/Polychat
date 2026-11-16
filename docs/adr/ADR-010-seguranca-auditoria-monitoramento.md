# ADR-010 — Segurança, auditoria e monitoramento

- **Número:** ADR-010
- **Status:** Proposed
- **Data:** 16/11/2026

## Contexto
Segurança é prioridade. TI precisa consultar conversas; o sistema deve monitorar mensagens suspeitas, incluindo palavrões, e alertar TI. A baseline reconhece conflito entre leitura/análise server-side e criptografia ponta a ponta (E2EE). LGPD, transparência, proporcionalidade e governança não podem ser ignoradas.

## Problema
Escolher proteção de conteúdo e modelo de acesso compatíveis com os requisitos sem prometer confidencialidade E2EE quando o servidor precisa ler o conteúdo, nem permitir vigilância administrativa sem controle.

## Requisitos relacionados
RF-015, RF-016, RF-020; RNF-014–RNF-023; RN-026; Q-007–Q-010, Q-013, Q-025–Q-030.

## Alternativas consideradas
1. **E2EE real:** chaves apenas nos endpoints; servidor não lê conteúdo. Melhor confidencialidade contra servidor/provedor, mas impede consulta normal do TI e análise server-side; qualquer acesso excepcional por escrow/backdoor enfraquece a promessa de E2EE.
2. **Criptografia em trânsito + em repouso com acesso administrativo controlado:** servidor processa texto para busca/alertas e TI pode consultar com autorização; maior compatibilidade funcional, mas operadores/comprometimento do backend podem acessar conteúdo.
3. **Modelo híbrido com chaves organizacionais/escrow ou decrypt sob demanda:** pode limitar leitura operacional e suportar investigação, mas não é E2EE estrito; complexidade de chaves e governança elevada.
4. **Análise local no cliente:** reduz leitura server-side, mas pode ser contornada e não resolve consulta de TI.

## Decisão proposta
Para atender simultaneamente consulta TI e análise automatizada server-side, propor criptografia em trânsito (TLS atual) e em repouso (criptografia de banco, storage e backups), com gestão de chaves por KMS/HSM ou serviço equivalente, segregação de funções e rotação. **Não declarar E2EE.** O conteúdo pode ser descriptografado pelo serviço autorizado para entrega, análise e consulta administrativa sob política. Essa proposta exige aprovação explícita do cliente, TI, Segurança e Jurídico/Privacidade; até lá o status permanece Proposed e a implementação de leitura/monitoramento de conteúdo não deve ser considerada autorizada apenas por este ADR.

### Consulta de conversas por TI
Aplicar acesso just-in-time, justificativa obrigatória, escopo mínimo (conversa/alvo e período), autenticação reforçada/MFA, reautenticação, registro append-only com operador, data/hora, alvo, motivo, ação, resultado e correlação. Revisão periódica independente; alertas para consultas em massa, fora de horário ou padrão anômalo. Separar quem administra contas de quem revisa auditoria quando viável. A consulta não deve permitir exportação em massa por padrão. Informar usuários em política de privacidade clara e definir exceções legais/operacionais com Jurídico. Acesso break-glass deve ser excepcional, limitado, justificado e revisado.

### Monitoramento automatizado
Iniciar com regras determinísticas versionadas e lista de termos/categorias aprovada pelo cliente; não presumir que qualquer palavrão implica infração. Gerar alerta com trecho mínimo necessário, regra acionada, score/versão e contexto controlado. Alertas não bloqueiam mensagens nem contas automaticamente. TI revisa, classifica verdadeiro/falso positivo, registra justificativa e escalona conforme procedimento. Medir falsos positivos/negativos e permitir revisão da política. Modelos de IA/serviços externos não são assumidos; qualquer uso externo exige avaliação de transferência de dados, contrato e privacidade.

### Retenção, logs e incidentes
Definir prazos separados para mensagens, anexos, alertas, auditoria e backups, com descarte verificável e propagação para réplicas conforme ciclo técnico. Logs de segurança devem ser protegidos contra alteração, conter metadados necessários e evitar cópia desnecessária do conteúdo. Monitorar autenticação anômala, falhas de autorização, mudanças de privilégios, exportações, acesso administrativo e falhas de backup. Ter processo de resposta a incidentes, preservação de evidências, contenção, comunicação e revisão pós-incidente.

## Justificativa
A alternativa 2 é a única das opções listadas que satisfaz diretamente a consulta TI e análise server-side sem contornar silenciosamente E2EE. O custo é reduzir a garantia de que nem o operador do serviço poderá acessar conteúdo; por isso controles organizacionais, criptográficos e de auditoria são essenciais. A decisão final depende de avaliação de impacto à proteção de dados (DPIA/RIPD quando aplicável), base legal, finalidade, transparência e minimização.

## Consequências
**Positivas:** compatibilidade com consulta e detecção; trilha de auditoria; gestão central de chaves. **Negativas:** não oferece E2EE; aumenta impacto potencial de comprometimento do backend/conta privilegiada; exige operação e revisão contínuas.

## Riscos
Abuso de privilégio TI; chave comprometida; insider threat; falso positivo; monitoramento excessivo; retenção excessiva; exposição em logs; acesso de fornecedor; falha de auditoria; incompatibilidade com expectativas dos funcionários ou obrigações legais.

## Questões pendentes
Aprovação do modelo sem E2EE; base legal/finalidade e transparência; quem pode consultar e em que hipóteses; MFA; justificativas e revisão; lista de termos e categorias; política de alertas; retenção por classe; acesso/exportação; KMS/HSM e custodiante; jurisdição e suboperadores; resposta a incidentes; RPO/RTO.

## Referências
POLY-REQ-001 v0.3; RNF-014–RNF-023; RN-026; Q-007–Q-010, Q-013, Q-025–Q-030; LGPD (Lei 13.709/2018); ADR-003–ADR-009.
