# Issue #94 — Inspeção heurística interna do protótipo v0.1

**Tipo de evidência:** revisão de código e percurso pelo próprio autor; **não são observações de participantes**, não são resultados independentes de SQA, não equivalem a sessão de usabilidade.  
**Escopo:** arquivos públicos de protótipo da branch feat/ponde-issue-94-prototipo-ux.  
**Data:** 24/11/2026.  
**Referência:** PR #152 plano UX v0.3; issues #91, #92 e Q-018.

## 1. Achados internos identificados e tratados durante a implementação

| ID | Fluxo / tarefa | Observação do código antes do ajuste | Risco UX (hipótese) | Prioridade interna | Correção implementada | Estado |
|---|---|---|---|---|---|---|
| H94-01 | U-05/U-07, falha de envio | O fluxo simulava falha, mas não oferecia caminho explícito de nova tentativa | Participante poderia não localizar recuperação | Média | Acrescentado botão Tentar novamente, com retorno separado quando offline | Corrigido na fonte; reteste humano pendente |
| H94-02 | U-03/T-02, busca | O filtro local ocultava resultados sem mensagem quando nenhum exemplo correspondia | Estado vazio poderia ser confundido com defeito | Média | Adicionado estado textual Nenhum resultado para contatos e contas fictícias | Corrigido na fonte; reteste humano pendente |
| H94-03 | U-08, offline | O aviso de indisponibilidade era temporário e desaparecia ao trocar de tela | Risco de tentar enviar sem saber que está offline | Média | Indicador textual de sem conexão mostrado na conversa enquanto o estado simulado estiver ativo | Corrigido na fonte; reteste humano pendente |
| H94-04 | U-06/U-07, falha de upload | Havia apenas o exemplo de falha, sem nova tentativa local acessível | Falha e recuperação poderiam parecer indistintas | Média | Ação demonstrativa de tentar novamente após falha, sem upload real | Corrigido na fonte; reteste humano pendente |

Esses itens são **inspeções internas do autor**, não evidências de frequência ou dificuldade em usuários da FORD. A classificação é de **prioridade de design proposta**, não de severidade S1–S4 derivada de sessão real. Os ajustes precisam de revisão da UI/UX/SQA e avaliação com participantes quando houver autorização.

## 2. Verificações de fonte e responsabilidades

| Item | Evidência disponível | Limitação |
|---|---|---|
| Navegação entre telas | IDs e destinos cobertos em tests/issue-94-ux-prototype.test.mjs | Não prova operação de clique real em navegador |
| Dados fictícios e ausência de rede | Avisos no HTML e inspeção estática de APIs de rede no JS | Não constitui auditoria de segurança de produção |
| Confirmar/Cancelar em ações críticas | Diálogo nativo e mensagens de simulação no código | Não prova gestão de foco em navegadores/leitores reais |
| Distinção de perfis | P-U e P-TI com fluxos separados, catálogo Q-018 | Não existe permissão server-side |
| Paleta | Tokens locais Q-019 provisórios | Não certifica identidade institucional ou WCAG |
| Dispositivos e zoom | Layout responsivo declarado em CSS | **Não realizado teste renderizado** neste registro |

## 3. Próxima avaliação que não pode ser substituída

Após aprovação do protocolo e autorização institucional para recrutamento/coleta: executar as tarefas U-01 a U-08 e T-01 a T-06 do plano PR #152 com participantes autorizados, registrar comportamentos de fato observados, severidades justificadas, versões e limitações em armazenamento aprovado. Solicitar parecer do PO/SQA e atualizar o protótipo por evidência.

**Proibido registrar os itens H94 como achados de participantes.** Também não afirmar que a issue #94 passou nos critérios de aceite com base neste documento.
