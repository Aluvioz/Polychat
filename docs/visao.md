# Visão do Polychat

**Documento de síntese não normativo.** Em caso de divergência, prevalecem a baseline POLY-REQ-001 v0.4, as decisões arquiteturais com status registrado nas ADRs e os aceites documentados nas issues.

## Propósito

O Polychat é uma aplicação web de comunicação interna para a FORD, com conversas individuais e em grupos administrados pela equipe de TI. O escopo inicial contempla 25 usuários finais do setor técnico e aproximadamente 2 a 3 administradores TI.

## Perfis

- **Usuário (`user`):** utiliza a aplicação em celular Android/iOS, consulta conversas autorizadas, envia mensagens e anexos permitidos.
- **TI (`ti`):** utiliza a aplicação em computador, provisiona e administra contas/grupos, monitora alertas, consulta/exporta conversas e administra auditoria e anexos. Todos os administradores TI possuem poderes equivalentes.

## Stack oficial

- **Frontend:** Next.js 16, React 19 e TypeScript.
- **Hospedagem e deploy:** Vercel.
- **Backend:** Supabase, incluindo os serviços adotados nas ADRs específicas.
- **Persistência:** PostgreSQL via Supabase Database.
- **Identidade:** Supabase Auth.
- **Anexos:** Supabase Storage privado.
- **Tempo real:** Supabase Realtime é a direção registrada na ADR-007, ainda sujeita à validação técnica.

A escolha de Supabase e Vercel está registrada como Accepted na ADR-003. **A implementação funcional do Polychat ainda não começou.** O repositório contém somente scaffold inicial e artefatos isolados; nenhum fluxo de produto está integrado ou homologado. Serviços adicionais que acessem ou processem dados exigem aprovação explícita.

## Regras de produto centrais

- Mensagens são persistidas e recuperadas após reconexão normal.
- Usuários não editam nem excluem mensagens; TI pode fazê-lo com auditoria.
- A remoção de participantes revoga imediatamente o acesso às mensagens e anexos anteriores do grupo.
- Anexos: PDF/JPEG, até 10 MB por arquivo e até 5 por mensagem; quotas individuais e capacidade total são administradas pelo TI.
- O scanner antimalware integra o fluxo controlado do Polychat. Falha ou resultado inconclusivo mantém o arquivo bloqueado no fluxo normal; TI pode liberar por ação excepcional auditada.
- Mensagens suspeitas são identificadas por regras/lista de termos administrada pelo TI, sem análise contextual, IA de terceiros ou bloqueio automático.
- A solução utiliza criptografia em trânsito e em repouso, sem E2EE.
- Não há notificações push ou notificações do navegador; a aplicação apresenta indicador de mensagens não lidas.

## Governança e situação

A baseline vigente é [POLY-REQ-001 v0.4](09-baseline-requisitos-mvp.md), baseada na FORD v2 e nos alinhamentos complementares do PO com Desenvolvimento.

As Issues #96 e #98 estão encerradas nos seus escopos aceitos. A Q-025 não reabre nem repete essas entregas; consolida evidências técnicas específicas de configuração/integração ainda não cobertas. Permanecem também Q-018 (refinamento de UX) e Q-019 (ativos oficiais de marca).

## Navegação

- [Baseline de requisitos](09-baseline-requisitos-mvp.md)
- [Requisitos funcionais](03-requisitos-funcionais.md)
- [Requisitos não funcionais](04-requisitos-nao-funcionais.md)
- [ADRs e decisões arquiteturais](adr/README.md)
- [Modelo de dados](database/modelo-de-dados.md)
- [Matriz de autorização](issue-100-matriz-autorizacao.md)
- [Política de anexos](storage/politica-anexos-e-antimalware.md)
- [Proposta APF](proposta-precificacao-apf.md)
