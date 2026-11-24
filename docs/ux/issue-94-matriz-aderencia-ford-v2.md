# Issue #94 — Matriz de aderência do protótipo à FORD v2

**Natureza:** inspeção documental realizada pelo autor para apoiar revisão de UX. **Não é homologação, nem revisão SQA independente, nem teste com funcionários.**

**Fonte primária:** documento entregue pelo usuário, *Polychat — Questionário de esclarecimento de requisitos e decisões pendentes*, versão 1.0, 16 páginas, Q1–Q34 (consultado em 24/11/2026). Não anexar a versão integral à PR sem autorização do responsável. Documentação vigente do repositório: baseline POLY-REQ-001 v0.5 e decisões de produto Q-018/Q-019 em `main`.

**Escopo técnico inspecionado:** `public/prototipos/issue-94/index.html`, `app.js` e `app.css`. Cada status **Representado** significa apenas que há texto, navegação ou simulação no protótipo. Não significa funcionalidade de produção. **Não testado** = sem validação funcional, browser ou usuário correspondente.

| Pergunta / página do questionário | Regra atribuída à FORD | Correspondência no protótipo / encaminhamento | Resultado documental |
|---|---|---|---|
| Q1, p.1 | 25 usuários finais e cerca de 2–3 administradores TI, separadamente | Plano PR #152 prevê P-U 5–8 e P-TI cerca de 2–3, sem confundir amostras | **Alinhado no plano** |
| Q2, p.2 | Lançamento único, sem piloto de produto | Sessões de UX e pré-testes do roteiro não são lançamento piloto; documentados como pesquisa | **Alinhado no plano** |
| Q3/Q4, p.2 | TI com poderes equivalentes; login por username único definido pela TI | Telas `u-login`, `t-login`; controles TI sem hierarquia nem segunda aprovação | **Representado** |
| Q5, p.3 | Credencial criada e resetada pelo TI; sem cadastro público, MFA ou alteração obrigatória inicial | `u-login` sem cadastro e `t-users` com reset simulado | **Representado parcialmente**; entrega real da senha é backend/procedimento |
| Q6, p.3 | Revogar acesso/sessões imediatamente ao desativar conta; histórico preservado | `t-users` possui desativação com confirmação | **Só representação**; revogação server-side não implementada |
| Q7, p.3–4 | Apenas TI gerencia grupos; remoção revoga histórico/anexos imediatamente; reativação pelo TI | `u-group` somente consulta, `t-groups` confirma remoção | **Representado parcialmente**; revogação real não implementada |
| Q8, p.4 | Usuário não edita/exclui; não lidas e leitura/horário; TI pode alterar/auditar conforme Q16 | `u-conversations` com contadores; `u-chat` mostra texto de leitura; `t-consult` tem ações simuladas | **Representado parcialmente** |
| Q9, p.4 | Histórico recente paginado, Realtime e recuperação de mensagens após reconexão | `u-conversations`, `u-chat`, estado offline e recuperação simulada | **Só representação**; paginar, sincronizar e persistir são backend, não foram comprovados |
| Q10, p.5 | JPEG da galeria existente, sem câmera/áudio/vídeo; remover EXIF/GPS | `u-attach` indica formatos e remoção no produto real | **Representado**; nenhum arquivo é manipulado |
| Q11, p.5 | PDF/JPEG até 10 MB, até 5 por mensagem; quota por usuário/total TI; PDF com senha não aceito | `u-attach` com exemplos de 12 MB, 6 anexos e PDF com senha; `t-settings` com quotas | **Representado**; validação de bytes não implementada |
| Q12, p.5–6 | Scanner interno; anexo bloqueado enquanto indisponível/inconclusivo; TI pode liberar com auditoria | `u-attach` inclui scanner indisponível e bloqueio | **Parcial**; liberação excepcional de TI não é fluxo navegável nesta v0.1 |
| Q13, p.6 | Link temporário de até 5 min; revogação imediata, não apenas expiração | **Sem tela de download/links na v0.1**; critério deve ser avaliado em #116/#129; não inventar comportamento no protótipo | **Não coberto** |
| Q14/Q15, p.6–7 | Alertas por regras/lista TI, sem IA de terceiros; severidade alta até 1h, média 1 dia útil, baixa 3 dias úteis, sem bloqueio automático | `t-alerts` lista as três faixas, revisão humana; `t-settings` mostra lista de termos | **Representado**; detecção real não implementada |
| Q16, p.7 | TI consulta/exporta qualquer conversa sem justificativa ou segunda aprovação; alterações auditadas | `t-consult` apresenta consultas e ações fictícias | **Representado**; não ler conteúdo real |
| Q17, p.7–8 | Auditoria exclusiva TI para operações administrativas | `t-audit` mostra eventos declarados fictícios; sem logs reais | **Representado** |
| Q18, p.8 | Criptografia em trânsito/repouso, não E2EE, conteúdo acessível ao servidor autorizado | **Fora de escopo de protótipo**; manter controle por arquitetura/segurança | **Não testado** |
| Q19, p.8 | Documento declara privacidade/LGPD não prioritárias | **Alerta de governança:** isso **não afasta a LGPD nem eventuais obrigações legais**; coleta de participantes só com finalidade, base/aviso institucional, minimização, acesso e retenção definidos | **Exige análise institucional** |
| Q20, p.9 | Retenção operacional sem exclusão automática; backups 12 meses | Não representa armazenamento/retensão real | **Fora de escopo**, observar decisões da arquitetura |
| Q21, p.9 | Infraestrutura e dados sob controle FORD; terceiros não podem acessar/processar dados FORD | Protótipo é estático, fictício, sem chamadas externas. **Não concluir compatibilidade da stack Supabase/Vercel por esta demonstração**; remeter Q-025 e ADR-003 para decisão formal | **Sem dados FORD no protótipo**; compatibilização técnica fora de escopo |
| Q24, p.10–11 | Usuário Android/iOS e Chrome/Safari móveis; TI desktop Chrome/Edge/Firefox; tablets não permitidos | Demonstração separa visualmente os perfis, mas não bloqueia dispositivos | **Representado, não aplicado** |
| Q25, p.11 | Área TI para usuários, grupos, alertas, auditoria, segurança | `t-dashboard`, `t-users`, `t-groups`, `t-consult`, `t-alerts`, `t-audit`, `t-settings` | **Representado** |
| Q26, p.11–12 | Azul/branco, logo Ford, sem código exato informado no questionário; aprovação visual pelo gestor | Paleta provisória documentada em Q-019, sem uso de Ford Oval não autorizado no protótipo | **Alinhado provisoriamente**, identidade final pendente |
| Q27, p.12 | Cliente não exigiu formalmente WCAG ou leitor de tela | Protótipo aplica rótulos, foco e skip link voluntariamente; QA de acessibilidade ainda necessário | **Práticas de inclusão; sem homologação** |
| Q28, p.12 | Português; contadores de não lidas; sem notificações push/browser | Textos em português, contadores e ausência de push/browser | **Representado** |
| Q29/Q31, p.13–14 | MVP com login, texto, PDF/JPEG, alertas, consulta/auditoria e restrição de dispositivo | Roteiros U-01…08 / T-01…06 cobrem percepção de fluxos; backend permanece ausente | **Cobertura UX parcial, não funcional** |
| Q32/Q34, p.14–15 | Aceite funcional escrito pelo gestor FORD; representantes TI; Go/No-Go gerencial | **Não houve homologação**; pesquisa UX é etapa distinta de aceite do produto | **Pendente** |

## Divergências e recomendações priorizadas

| ID | Natureza | Constatação | Ação e responsável proposto |
|---|---|---|---|
| FORD94-01 | Defeito de UX demonstrativa — **corrigido em fonte** | Escolha de Rafael podia abrir título/conteúdo da Marina; grupo podia herdar mensagens de conversa individual | Separar contatos e históricos fictícios; executar Playwright e revisão UI/UX |
| FORD94-02 | Cobertura de regra — **corrigida em fonte** | Seleção de anexo não mostrava falhas de 10 MB, 5 arquivos, PDF com senha ou scanner indisponível | Adicionados exemplos textuais sem upload; revisar clareza com PO/SQA |
| FORD94-03 | Fora do escopo atual | Revogação instantânea de links e validade 5 min não representadas em tela | Tratar em #116 / #129 e avaliar necessidade de tarefa de UX adicional sem ampliar Q-018 por conta própria |
| FORD94-04 | Governança de pesquisa | Não há autorização institucional específica, custódia, local/retensão e consentimento para sessões de UX | Obter deliberação formal da FORD; não realizar entrevistas antes |
| FORD94-05 | Governança legal/técnica | Q19 afirma despriorização da LGPD e Q21 veta processamento de dados por terceiros, enquanto ADR-003 trata stack adotada | Não assumir exceção legal ou compatibilidade automática; PO/TI devem resolver conforme Q-025, sem upload de dados reais para protótipo |
| FORD94-06 | Lacuna de evidência | Playwright automatiza fluxos mas não substitui avaliação humana, leitor de tela e sessões | Registrar checks renderizados e SQA independente; depois realizar pesquisas autorizadas |

## Fechamento desta inspeção

Este arquivo constitui **rastreabilidade da representação de UX**, não prova de entrega de requisitos de segurança nem declaração de conformidade à FORD. Os itens corrigidos na fonte devem ser **verificados pela execução do smoke Playwright** e depois avaliados por PO/SQA. A próxima etapa institucional é obter autorização específica para sessões de usabilidade; o questionário v1.0 registra decisões de negócio, **não uma autorização de coleta de pesquisa**. O formulário de encerramento do questionário também contém campos de data e identificação de PO sem preenchimento; **não presumir assinatura formal de aceite da pesquisa**.
