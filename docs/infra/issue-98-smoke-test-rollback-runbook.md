# Issue #98 — Runbook de smoke test e rollback de aplicação

**Status:** procedimento proposto para revisão do Tech Lead; ainda não aprovado nem ensaiado.  
**Escopo:** aplicação Next.js hospedada na Vercel. Este documento não define rollback de banco de dados, migrations ou dados.

## 1. Pré-condições obrigatórias

Antes de qualquer release ou exercício:

1. Confirmar no painel Vercel o projeto correto, o ambiente (Preview ou Production), o domínio associado e o commit implantado.
2. Registrar o deployment atual e identificar um deployment anterior conhecido como bom. Não escolher um deployment apenas pela data ou pelo estado `Ready`.
3. Confirmar que o deployment escolhido é compatível com o estado atual do banco e das migrations. Se houver mudança incompatível de schema/dados, interromper: rollback de aplicação sozinho pode não ser seguro.
4. Confirmar que as variáveis do ambiente estão presentes pelo nome e escopo, sem copiar valores secretos para tickets, logs ou documentos.
5. Para produção, obter aprovação explícita do responsável operacional/Tech Lead e comunicar a janela/impacto.
6. Não executar exercício em produção sem autorização específica. Preferir ambiente não produtivo equivalente.

Se qualquer pré-condição não puder ser comprovada, não iniciar o procedimento.

## 2. Smoke test automatizado do artefato Next.js

O workflow de CI executa o build e inicia o servidor Next.js gerado localmente no runner para verificar a rota pública atualmente implementada (`/`).

Critérios do smoke test local:
- o servidor inicia e responde HTTP com sucesso em `http://127.0.0.1:3000/`;
- o HTML contém o marcador público `PLATAFORMA DE COMUNICAÇÃO INTERNA`;
- o processo é encerrado ao final do step.

Esse teste valida somente o artefato/build e a página institucional atual. Não valida DNS público, domínio, TLS, configuração de Production na Vercel, variáveis hospedadas, autenticação, Supabase, RLS ou fluxos de conversas/anexos.

## 3. Smoke test manual do deployment Vercel

Executar primeiro em Preview e, após aprovação de release, em Production:

1. Abrir a URL do deployment no navegador e confirmar que corresponde ao projeto e commit esperados.
2. Confirmar carregamento da rota `/` sem erro HTTP ou tela de erro da plataforma.
3. Conferir o conteúdo institucional e recursos estáticos da página.
4. No domínio configurado para o ambiente, confirmar redirecionamento/uso de HTTPS e ausência de alerta de certificado no navegador.
5. Registrar URL, ambiente, deployment ID, commit SHA, data/hora, resultado e responsável.
6. Não testar login, conversas, grupos ou anexos como se estivessem disponíveis: o repositório consultado ainda os descreve como não implementados.

Se a rota não responder, o domínio/certificado estiver incorreto ou o deployment/commit não corresponder ao release esperado, reprovar o smoke test e não promover o release.

## 4. Procedimento proposto de rollback da aplicação

Este procedimento é uma lista de controle, não uma autorização para executar rollback:

1. Declarar o incidente/release problemático e interromper novas promoções.
2. Registrar o deployment atual, URL afetada, commit SHA, horário e sintomas. Preservar logs/evidências.
3. Confirmar o deployment anterior conhecido como bom e sua compatibilidade com o banco atual.
4. Obter aprovação do responsável operacional/Tech Lead. Em produção, seguir o processo de comunicação/incidente da organização.
5. No painel Vercel do projeto confirmado, selecionar o deployment de referência e usar o mecanismo de rollback/promoção para produção disponibilizado para aquele projeto. Conferir o destino/ambiente antes de confirmar. Não executar comandos ou ações em projeto/ambiente não confirmado.
6. Aguardar a conclusão reportada pela Vercel e confirmar que o domínio de produção aponta para o deployment esperado.
7. Repetir o smoke test manual da seção 3 e verificar logs/erros após a reversão.
8. Registrar quem aprovou e executou, deployment anterior e posterior, commits, horário, resultado e eventuais efeitos colaterais.
9. Manter o release problemático bloqueado até análise de causa e nova aprovação.

Se o deployment anterior não estiver disponível, não for compatível com o schema atual, ou o mecanismo de rollback não estiver claro no painel, interromper e escalar ao Tech Lead/TI. Não improvisar uma reversão.

## 5. Limites: banco de dados e Supabase

Rollback da aplicação Vercel não reverte migrations nem restaura dados Supabase. Não executar `db reset`, restauração, downgrade de migration ou alteração de dados como parte deste runbook.

Backup, restore, RPO, RTO, compatibilidade de migrations e plano de recuperação do Supabase precisam de procedimento próprio, decisão aprovada e teste controlado. A ADR-009 permanece Proposed; este documento não altera seu status.

## 6. Registro do ensaio

Preencher somente após execução real:

| Campo | Registro |
|---|---|
| Ambiente (Preview/Production) | Pendente |
| Projeto Vercel | Pendente |
| Deployment/commit antes | Pendente |
| Deployment/commit de referência | Pendente |
| Aprovação (responsável/data) | Pendente |
| Smoke test antes/depois | Pendente |
| Resultado do rollback | Não executado |
| Evidência/logs | Pendente |
| Responsável pela execução | Pendente |

**Estado atual:** procedimento documentado para revisão; smoke test hospedado e rollback real não foram executados. Não marcar como ensaiado até anexar evidência de execução.
