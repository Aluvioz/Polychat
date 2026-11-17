# ADR-001 — Arquitetura lógica geral

- **Status:** Proposed
- **Data:** 17/11/2026
- **Issue:** #89
- **Responsáveis pela decisão:** Tech Lead e TI; PO valida aderência ao escopo

## Contexto

O Polychat é uma aplicação web interna da FORD. A baseline do MVP contempla público inicial aproximado de 25 pessoas do setor técnico, dois perfis (`user` e `ti`), conversas individuais e em grupo, mensagens textuais, anexos PDF/JPEG, alertas de conteúdo suspeito e consulta de conversas pelo TI sob auditoria. A Issue #88 fixa Supabase + Vercel como direção de execução. O repositório já contém Next.js, um módulo isolado de autorização e uma migration inicial, mas não implementa o chat nem a integração completa com Supabase.

## Problema

Definir fronteiras de confiança e responsabilidades de cada camada sem tratar controles visuais como segurança, nem confundir a stack de referência com uma arquitetura já integrada e homologada.

## Alternativas consideradas

1. **Aplicação modular com serviços gerenciados:** frontend web, camada server-side, autenticação, banco relacional, storage privado, eventos realtime e auditoria.
2. **Backend próprio e infraestrutura corporativa:** mais controle operacional, porém maior esforço de implementação, manutenção e disponibilidade.
3. **Aplicação concentrada em um único componente:** menor configuração inicial, porém aumenta acoplamento e dificulta separar privilégios e testar fronteiras de segurança.

## Decisão proposta

Adotar arquitetura lógica modular, mantendo os seguintes limites:

- **Apresentação:** aplicação Next.js, sem credenciais privilegiadas ou regras de autorização confiadas ao browser.
- **Camada server-side:** handlers/serviços responsáveis por autenticação, autorização, validação de entradas e operações privilegiadas.
- **Identidade:** provedor de autenticação Supabase, sujeito à aprovação e integração descritas na ADR-004.
- **Persistência:** PostgreSQL gerenciado pelo Supabase como fonte de verdade para perfis, conversas, membros e mensagens, sujeito ao desenho da ADR-005.
- **Autorização de dados:** RLS no banco, combinada com verificações server-side, conforme ADR-006.
- **Arquivos:** storage privado com autorização antes de upload/download, conforme ADR-008.
- **Atualizações:** canal realtime como mecanismo de notificação; persistência no banco permanece a fonte de verdade, conforme ADR-007.
- **Operação:** Vercel como destino de deploy definido na ADR-003; ambientes e segredos sob a ADR-009.
- **Auditoria e segurança:** operações privilegiadas e consulta administrativa devem ser rastreáveis, conforme ADR-010.

Operações sensíveis devem negar por padrão e falhar fechadas. Esta é uma proposta de arquitetura lógica; não autoriza assumir que todos os componentes já existem ou estão aprovados.

## Justificativa

A separação reduz dependência entre interface e regras de negócio e permite testar autenticação, autorização e acesso a dados de forma independente. Serviços gerenciados aceleram o MVP, mas não transferem a responsabilidade por configuração, acesso, privacidade, continuidade ou segurança.

## Consequências

**Positivas:** fronteiras explícitas; menor confiança no cliente; decisões rastreáveis; componentes substituíveis.

**Negativas:** mais integração e configuração; dependência de provedores; necessidade de testes em cada fronteira; risco de duplicação de regras entre handlers e RLS.

## Riscos

RLS incompleta; credencial privilegiada exposta; autorização esquecida em handler; publicação realtime antes da persistência; configuração divergente entre ambientes; complexidade excessiva para o público inicial.

## Evidências e estado atual

A `main` contém Next.js 16/React 19/TypeScript, a página institucional, o módulo `src/auth/authorization.mjs` e a migration de perfis. Ainda não foram encontradas rotas de chat, serviço de domínio, integração executável com Supabase, realtime, buckets de storage ou trilha de auditoria funcional.

## Pendências para Accepted

Revisão do Tech Lead e TI sobre arquitetura lógica, responsabilidades operacionais, modelo de ameaça, fronteiras server-side/RLS e viabilidade da solução no ambiente corporativo. Registrar aprovadores, data, versão e condições nesta ADR.
