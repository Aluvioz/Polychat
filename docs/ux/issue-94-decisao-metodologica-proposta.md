# Issue #94 — Proposta de decisão metodológica sobre uso do protótipo clicável

**Estado: AGUARDANDO MANIFESTAÇÃO FORMAL DO PO E DA SQA — NÃO APROVADO.**  
**Issue:** https://github.com/Aluvioz/Polychat/issues/94  
**PR do planejamento:** [#152 — MERGED](https://github.com/Aluvioz/Polychat/pull/152) na `main`, plano UX v0.3 aprovado documentalmente pelo PO e pela SQA.  
**PR do protótipo complementar:** [#164](https://github.com/Aluvioz/Polychat/pull/164).  
**Motivação:** apontamento 2 da revisão `CHANGES_REQUESTED` de Dante na PR #164.

## 1. Premissa já aprovada e imutável sem novo aceite

O plano v0.3 define **avaliação individual, moderada, baseada em tarefas e think-aloud sobre wireframes estáticos** das issues #91 (P-U) e #92 (P-TI). O participante descreve/aponta o que faria; a interface estática não realiza cliques reais. Há dois roteiros, U-01 a U-08 e T-01 a T-06, com registros distintos, mesma amostra e limites de privacidade.

**A aprovação documental do plano pela PO/SQA não altera automaticamente essa metodologia** e não autoriza convites, entrevistas, gravações ou coleta sem aprovação institucional da FORD.

## 2. Proposta opcional (não é deliberação)

Propõe-se manter **os wireframes estáticos como instrumento principal** para cada tarefa do plano v0.3 e disponibilizar o protótipo clicável da PR #164 **apenas como material complementar**, em uma etapa delimitada de exploração da compreensão de feedback, erros e transições. Essa etapa adicional **não substitui** nenhuma tarefa, não altera amostra, perfis, duração como requisito fixo, regras FORD, critérios de encerramento, nem converte UX em homologação funcional.

Se aprovada por PO e SQA, o facilitador deverá:

1. Conduzir primeiro a tarefa nos wireframes estáticos, com pergunta neutra e **sem apresentar previamente** a versão clicável para aquela tarefa.
2. Registrar no formulário do plano o resultado da tarefa estática antes de iniciar qualquer demonstração adicional.
3. Quando aplicável, abrir o clicável fictício para explorar compreensão dos estados, distinguindo observações da **fase estática** e da **fase complementar clicável** no registro; não somar nem comparar taxas sem indicar o instrumento.
4. Identificar em cada sessão: código anônimo, perfil, tarefa, versão do roteiro v0.3 ou revisão aprovada, links/commits exatos do wireframe e do clicável, dispositivo, navegador, ordem dos instrumentos, ajudas e desvios.
5. Dar a mesma informação sobre ausência de autenticação, envio, upload, auditoria ou integração reais. Não inserir credenciais nem dados FORD.
6. Se o clique criar confusão metodológica, suspender o uso complementar naquela tarefa e registrar o desvio; manter comparabilidade com o instrumento estático.

**Alternativa válida:** PO/SQA podem recusar o uso clicável em sessões e restringi-lo à revisão interna de UX. Nesse caso, as sessões continuam integralmente com os wireframes estáticos da PR #152. Uma eventual nova metodologia exige nova decisão documentada.

## 3. Decisão requerida (preenchimento exclusivo pelos responsáveis)

| Campo | A preencher por PO/SQA |
|---|---|
| Parecer do PO (Berthed) | **PENDENTE**: aprova uso complementar / mantém somente estático / solicita revisão |
| Data, referência do parecer PO | **PENDENTE** |
| Parecer independente SQA (Dante) | **PENDENTE**: aprova protocolo complementar / rejeita / condiciona |
| Data, referência do parecer SQA | **PENDENTE** |
| Protocolo autorizado para sessão | **PENDENTE**: apenas estático / estático + complementar com regras aprovadas |
| Versão exata dos instrumentos autorizados | **PENDENTE**: wireframes #91/#92, roteiro v0.3 e commit do clicável |
| Condições adicionais de execução | **PENDENTE** |

**Sem manifestações de ambos os responsáveis, manter método estático aprovado como única referência documental; o clicável não está autorizado para coleta.** Registrar os pareceres e links no histórico da PR #164 e atualizar este documento sem atribuir aprovação retroativa.

## 4. Gate independente: autorização FORD

Mesmo com decisão metodológica favorável, **não iniciar recrutamento, sessão, coleta de evidências ou gravação** sem a autorização operacional específica da FORD, responsáveis designados, custódia, armazenamento/acesso/retensão e informação/consentimento definidos. Ver [minuta de autorização](./issue-94-minuta-autorizacao-institucional.md) e [kit de registro](./issue-94-kit-registros-sessoes.md).

**Este documento é uma proposta submetida à revisão, não uma aprovação do PO/SQA e não um plano substituto da PR #152.**
