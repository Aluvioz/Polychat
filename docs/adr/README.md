# ADRs — Polychat

**Data:** 16/11/2026 · **Baseline:** POLY-REQ-001 v0.3 · **Issue:** #89  
**Estado geral:** propostas documentadas. Nenhum ADR foi marcado Accepted.

## Inventário

| ADR | Tema | Estado |
|---|---|---|
| ADR-001 | Arquitetura geral | Proposed |
| ADR-002 | Frontend e experiência WEB | Proposed |
| ADR-003 | Backend e infraestrutura | Proposed |
| ADR-004 | Autenticação e sessões | Proposed |
| ADR-005 | Banco de dados e modelagem | Proposed |
| ADR-006 | Autorização e controle de acesso | Proposed |
| ADR-007 | Mensageria e tempo real | Proposed |
| ADR-008 | Storage e anexos | Proposed |
| ADR-009 | Ambientes, hospedagem e deploy | Proposed |
| ADR-010 | Segurança, auditoria e monitoramento | Proposed |

## Convenção de status e aprovação

Proposed = recomendação para revisão; Accepted = decisão aprovada por responsável autorizado; Rejected = alternativa avaliada e recusada; Deprecated = decisão retirada; Superseded = substituída por ADR posterior. A instrução do solicitante “considere tudo aprovado” foi registrada como orientação para avançar com propostas, mas não identifica papel/autoridade de aprovação nem substitui evidência formal da FORD/PO/TI. Por isso, os dez ADRs permanecem Proposed até aprovação rastreável.

## Cobertura de assuntos adicionais

- Restrição de dispositivos e identidade visual: ADR-002.
- Captura de tela/gravação: ADR-002 e ADR-010 (limitações da plataforma web).
- Detecção de mensagens suspeitas e falsos positivos: ADR-010.
- Retenção de mensagens, auditoria e backups: ADR-010; anexos: ADR-008.
- Gestão de credenciais: ADR-004.

Não foram criados ADRs extras redundantes.

## Evidências inspecionadas

- Baseline v0.3 em `docs/09-baseline-mvp-e-rastreabilidade-backlog.md` na branch da Issue #88.
- Branch anterior `docs/issue-89-adrs-supabase-vercel`: sem `docs/adr/`, ADR-001, `package.json`, `vite.config.ts` ou `supabase/config.toml`; índice `docs/README.md` consultado era versão 0.1.
- Issues #79, #80, #82, #84 e #86 e comentários disponíveis: propostas tecnológicas antigas não constituem aprovação; nenhum comentário com decisão final autorizada foi encontrado na consulta.
- Issue #105 e PR #132: o PR descreve JWT/Supabase Auth, tabela profiles, RLS e testes simulados; informa que a migration ainda precisa ser aplicada em homologação e que integração às rotas da aplicação permanece pendente. Vercel Preview reportado como falha.
- Busca de código não retornou correspondências para Supabase, Vercel, createClient, Realtime, storage ou RLS. Isso não prova inexistência de código; os caminhos acima foram verificados diretamente.

## Promoção para Accepted

Registrar aprovador (nome e papel), declaração explícita, data, versão aprovada, escopo, condições e evidência (comentário/ata/decisão formal). ADR-010 requer aprovação de cliente, TI, Segurança e Jurídico/Privacidade para monitoramento e acesso a conteúdo. ADR-003/009 requerem aprovação de TI e liderança técnica sobre hospedagem/região/fornecedor.
