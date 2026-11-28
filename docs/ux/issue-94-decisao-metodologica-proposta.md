# Issue #94 — Registro da decisão metodológica sobre uso do protótipo clicável

**Estado: decisão formal do PO registrada em 26/11/2026; reavaliação independente do SQA pendente.**  
**Issue:** https://github.com/Aluvioz/Polychat/issues/94  
**PR do planejamento:** [#152 — MERGED](https://github.com/Aluvioz/Polychat/pull/152) na `main`, plano UX v0.3 aprovado documentalmente pelo PO e pela SQA.  
**PR do protótipo complementar:** [#164](https://github.com/Aluvioz/Polychat/pull/164).  
**Motivação:** apontamento 2 da revisão `CHANGES_REQUESTED` de Dante na PR #164.

## 1. Premissa já aprovada e imutável sem novo aceite

O plano v0.3 define **avaliação individual, moderada, baseada em tarefas e think-aloud sobre wireframes estáticos** das issues #91 (P-U) e #92 (P-TI). O participante descreve/aponta o que faria; a interface estática não realiza cliques reais. Há dois roteiros, U-01 a U-08 e T-01 a T-06, com registros distintos, mesma amostra e limites de privacidade.

**A aprovação documental do plano pela PO/SQA não altera automaticamente essa metodologia** e não autoriza convites, entrevistas, gravações ou coleta sem aprovação institucional da FORD.

## 2. Decisão do PO — uso complementar e opcional

Em review formal publicado na PR #164 em **26/11/2026**, o PO autorizou metodologicamente o protótipo clicável como instrumento **complementar e opcional** aos wireframes estáticos do plano v0.3. Os wireframes permanecem o instrumento principal. A autorização do PO não substitui a reavaliação independente do SQA, solicitada pelo próprio PO; a aprovação SQA da PR continua pendente.

A etapa clicável não substitui tarefas, não altera amostra, perfis, critérios de encerramento ou regras do plano v0.3, não converte UX em homologação funcional e não deve ser confundida com validação de produção.

Condições estabelecidas pelo PO:

1. Conduzir primeiro a tarefa correspondente nos wireframes estáticos, sem apresentar previamente o protótipo clicável.
2. Registrar o resultado da tarefa estática antes de iniciar a exploração complementar.
3. Identificar e registrar separadamente os resultados da fase estática e da fase clicável; não somar métricas sem identificar o instrumento.
4. Registrar código anônimo, perfil, tarefa, versões/commits exatos dos instrumentos, ambiente, navegador/dispositivo, ordem de apresentação, ajudas e desvios.
5. Informar que o protótipo é fictício e não possui autenticação, envio, upload, persistência ou integração reais; não inserir credenciais nem dados FORD.
6. Suspender o complemento em determinada tarefa se o clique causar confusão metodológica, registrando o desvio.

**Situação de aplicação:** o parecer do PO está registrado; o SQA ainda deve manifestar-se independentemente sobre o protocolo. Até essa reavaliação, o plano estático v0.3 continua sendo a baseline aprovada e não se deve presumir aprovação SQA.

1. Conduzir primeiro a tarefa nos wireframes estáticos, com pergunta neutra e **sem apresentar previamente** a versão clicável para aquela tarefa.
2. Registrar no formulário do plano o resultado da tarefa estática antes de iniciar qualquer demonstração adicional.
3. Quando aplicável, abrir o clicável fictício para explorar compreensão dos estados, distinguindo observações da **fase estática** e da **fase complementar clicável** no registro; não somar nem comparar taxas sem indicar o instrumento.
4. Identificar em cada sessão: código anônimo, perfil, tarefa, versão do roteiro v0.3 ou revisão aprovada, links/commits exatos do wireframe e do clicável, dispositivo, navegador, ordem dos instrumentos, ajudas e desvios.
5. Dar a mesma informação sobre ausência de autenticação, envio, upload, auditoria ou integração reais. Não inserir credenciais nem dados FORD.
6. Se o clique criar confusão metodológica, suspender o uso complementar naquela tarefa e registrar o desvio; manter comparabilidade com o instrumento estático.

**Alternativa válida:** PO/SQA podem recusar o uso clicável em sessões e restringi-lo à revisão interna de UX. Nesse caso, as sessões continuam integralmente com os wireframes estáticos da PR #152. Uma eventual nova metodologia exige nova decisão documentada.

## 3. Registro das manifestações e situação do protocolo

| Responsável | Manifestação | Situação |
|---|---|---|
| PO — Berthed | Review formal de 26/11/2026: aprova o uso do protótipo clicável como complemento opcional, com wireframes primeiro e registros separados. | **REGISTRADO / FAVORÁVEL** |
| PO — Berthed | Review formal de 26/11/2026: aceita o ensaio interno por papéis como evidência complementar limitada, com voluntariedade, consentimento e limites explícitos. | **REGISTRADO / ACEITO COM LIMITES** |
| SQA — Dante | Reavaliação independente do protocolo e do ensaio; concluir inspeção humana e manifestar-se sobre os controles. | **PENDENTE** |

**Protocolo de referência:** wireframes estáticos da PR #152 como instrumento principal; protótipo clicável apenas como complemento opcional, sujeito à manifestação independente do SQA. Registrar versões exatas, ordem, ambiente, perfil, tarefa, ajuda e desvios. Não substituir tarefas, amostra nem critérios do plano v0.3.

## 4. Gate independente: autorização FORD

A aceitação pelo PO do ensaio interno por papéis **não é autorização institucional da FORD** e não permite apresentar voluntários como funcionários/representantes da empresa. Para qualquer pesquisa com funcionários FORD, recrutamento institucional, coleta formal ou uso de dados corporativos, continuam obrigatórios a autorização específica da FORD, responsáveis designados, custódia, armazenamento, acesso, retenção e consentimento aplicáveis. Gravações exigem autorização e consentimento específicos. Ver [minuta de autorização](./issue-94-minuta-autorizacao-institucional.md) e [kit de registro](./issue-94-kit-registros-sessoes.md).

**Este documento registra a decisão do PO e mantém explícita a manifestação independente ainda pendente do SQA. Não substitui o plano v0.3 da PR #152 nem representa autorização institucional da FORD.**
