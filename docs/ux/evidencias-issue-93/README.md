# Índice de evidências visuais — Issue #93 (23/11/2026)

**PR:** https://github.com/Aluvioz/Polychat/pull/143  
**Relatório de execução:** [M-01 a M-08](../issue-93-relatorio-execucao-manual-2026-11-23.md)  
**Avaliação de acessibilidade:** [Matriz e achados](../issue-93-evidencias-acessibilidade.md)

Este índice relaciona imagens fornecidas pelo executor durante o teste com Chrome em Windows. Os anexos foram publicados na [discussão do PR #143](https://github.com/Aluvioz/Polychat/pull/143#issuecomment-7113613570). **Dos 20 arquivos do pacote, 18 possuem referências de imagem completas no comentário. E12 e E13 tiveram suas URLs truncadas durante a inserção e permanecem pendentes de reenvio.** A E14 possui URL completa, embora tenha sido apontada como ausente na leitura inicial da SQA. As imagens originais E12 e E13 foram confirmadas como PNGs íntegros no pacote gerado nesta conversa; a existência local não equivale a anexá-las no GitHub.

| ID / arquivo no pacote | Evidência representada | Limitação |
|---|---|---|
| E01_foco_usuario_atualizado.png | Foco visual no campo Usuário | Screenshot, não vídeo do percurso |
| E02_skip_link_atualizado.png | Link “Pular para o conteúdo principal” com foco | Não comprova sequência inteira sozinho |
| E03_zoom_200_parcial.png | Conteúdo legível em zoom declarado 200% | Print recortado, sem indicador do Chrome |
| E04_zoom_400_parcial.png | Texto refluído em zoom declarado 400% | Print recortado, sem indicador do Chrome |
| E05_responsividade_320px.png | Primeira captura de 320px | Região limitada e versão anterior |
| E06_mobile_390px_antes_correcao.png | Cards truncados na versão anterior | Evidência do defeito antes da correção |
| E07_mobile_390px_topo_antes_correcao.png | Logo Ford desproporcional e cortado em 390px | Defeito antes da correção |
| E08_tablet_768px_antes_correcao.png | Logo desproporcional em 768px | Defeito antes da correção |
| E09_desktop_1280px_antes_correcao.png | Logo desproporcional em 1280px | Defeito antes da correção |
| E10_reteste_390px_corrigido.png | Cabeçalho e cards iniciais após correção em 390px | PASS na região fotografada |
| E11_reteste_320px_corrigido.png | Cabeçalho e cards iniciais após correção em 320px | PASS na região fotografada |
| E12_reteste_768px_corrigido.png | Cabeçalho e cards após correção em 768px | PASS na região fotografada |
| E13_reteste_1280px_corrigido.png | Cabeçalho e cards após correção em 1280px | PASS na região fotografada |
| E14_reteste_320px_botoes_estados.png | Botões na largura de 320px | PASS na região fotografada |
| E15_reteste_320px_formularios_validacao.png | Formulários e erro de anexo a 320px | PASS na região fotografada |

**Notas:** a gravação do leitor de tela não foi anexada. O Narrador do Windows foi executado pelo autor, com resultados relatados como PASS para títulos, campos, erro e avisos estáticos. A galeria demonstra conteúdo, mas não ações de produto funcionais. Aprovação de Dante (SQA) e Luiz (Tech Lead) permanece pendente.

****Para concluir a integridade das evidências:** fazer upload somente de `E12_reteste_768px_corrigido.png` e `E13_reteste_1280px_corrigido.png` em novo comentário da Conversation do PR, ou anexá-las no comentário original. Não reuploadar as demais 18 imagens sem necessidade. A aprovação continua sujeita à avaliação independente da SQA.