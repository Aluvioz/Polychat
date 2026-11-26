# ADR-008 — Armazenamento privado e anexos

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issues relacionadas:** #89, #115, #116 e #117
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD v2 confirma anexos exclusivamente em PDF e JPEG, com limite de 10 MB por arquivo e até 5 arquivos por mensagem. O TI define limites individuais e a capacidade total de armazenamento; não existe quota por conversa. PDF protegido por senha não é aceito. JPEG deve ser selecionado da galeria, sem captura pela câmera, e os metadados EXIF/GPS devem ser removidos.

A análise antimalware deve ocorrer dentro da infraestrutura aprovada para a FORD. Se o scanner falhar, estiver indisponível ou retornar resultado inconclusivo, o anexo permanece bloqueado; o envio de texto continua funcionando. O TI pode liberar qualquer arquivo e também baixar anexos durante investigações. Usuários não podem contornar a análise.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026, com aprovação da TI e da FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, inclusive Storage, dentro dos limites e responsabilidades registrados. Essa aprovação resolve a avaliação de compatibilidade/modelo de uso; não comprova que todos os controles funcionais e operacionais de anexos estejam implementados ou homologados.

## Problema

Armazenar, analisar e entregar anexos sem expor objetos publicamente, sem permitir acesso fora das permissões da conversa e respeitando a fronteira de processamento, as responsabilidades e os controles aprovados pela FORD.

## Alternativas consideradas

1. **Supabase Storage privado:** alternativa adotada para armazenamento de objetos no modelo de uso aprovado na Q-025, com bucket privado e acesso mediado por servidor confiável.
2. **Armazenamento de arquivos em infraestrutura corporativa separada:** não é a alternativa adotada na decisão vigente; qualquer mudança exige avaliação de impacto e decisão arquitetural formal.
3. **Armazenamento em banco relacional:** não é a opção preferencial para bytes de arquivos; o banco mantém metadados e vínculos necessários.
4. **Serviço adicional de storage ou análise:** não está automaticamente autorizado. Qualquer serviço adicional que acesse, armazene ou processe dados da FORD exige avaliação e aprovação próprias.

## Decisão proposta

Manter **Supabase Storage** como armazenamento de objetos de anexos na stack Supabase + Vercel, conforme o modelo de utilização aprovado na Q-025. O bucket `attachments` já foi provisionado como privado. O acesso a objetos deve permanecer mediado por servidor confiável, com autorização vigente e sem exposição de URLs públicas permanentes.

Esta ADR permanece Proposed porque a fundação de armazenamento e o upload inicial não equivalem à implementação de todo o ciclo de anexos. A aprovação da Q-025 não substitui os critérios funcionais da baseline nem os testes, controles e evidências ainda pendentes.

### Regras funcionais consolidadas

- Aceitar somente PDF e JPEG.
- Limitar cada arquivo a 10 MB e cada mensagem a, no máximo, 5 arquivos.
- Aplicar quotas individuais e capacidade total configuradas pelo TI, sem limite específico por conversa.
- Rejeitar PDF protegido por senha.
- Permitir seleção de JPEG existente na galeria; a aplicação não oferece captura de foto pela câmera.
- Remover metadados EXIF, inclusive GPS/localização, antes da disponibilização.
- Validar formato, conteúdo e estrutura do arquivo e submetê-lo ao scanner antimalware interno da FORD antes de liberar acesso.
- Manter o anexo indisponível até resultado favorável da análise. Falha, indisponibilidade, timeout ou resultado inconclusivo não equivalem a arquivo seguro e mantêm o anexo bloqueado.
- A indisponibilidade do scanner não bloqueia o envio de mensagens de texto.
- O TI pode liberar qualquer arquivo por ação administrativa. A ação deve ser autenticada e registrada em auditoria; usuários comuns não podem executar bypass ou alterar o estado da análise.
- O TI pode baixar anexos durante investigações, com registro de auditoria.
- O acesso deve ser privado e condicionado à autorização vigente do usuário para a conversa e o anexo.
- Links temporários podem ter validade máxima de 5 minutos. A remoção de participante deve revogar imediatamente seu acesso, inclusive por links previamente emitidos; o tempo máximo do link não substitui a verificação de autorização/revogação.
- Não utilizar URLs públicas permanentes nem expor o caminho físico do objeto.

### Retenção, descarte e backup

- Anexos não sofrem exclusão automática enquanto o sistema estiver em operação.
- Exclusão depende de autorização do TI, observadas investigações e preservação administrativa.
- Backups são diários e retidos por 12 meses.
- Após uma exclusão autorizada, o dado deixa as cópias de backup ao final do ciclo de retenção definido; o descarte deve ser registrado em auditoria.
- Metadados e eventos de auditoria seguem as regras de retenção consolidadas nos requisitos.

### Fronteira de processamento

Storage, scanner antimalware, processamento de metadados, emissão/revogação de links, backups e logs relacionados devem respeitar o modelo de utilização e as responsabilidades aprovadas na Q-025 e permanecer sujeitos à governança da FORD. Não encaminhar arquivos, conteúdo, metadados ou identificadores a serviços adicionais externos para varredura, conversão, extração, análise ou armazenamento sem aprovação específica.

Bibliotecas e atualizações sem acesso a dados da FORD podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.

## Justificativa

O bucket privado e a mediação server-side reduzem a exposição de objetos e permitem vincular o arquivo à mensagem, conversa e identidade autenticada. A Q-025 aprovou o modelo de utilização dos provedores nomeados, mas a autorização efetiva de download, a análise antimalware, a revogação, a retenção e a operação segura continuam dependendo de implementação e evidências próprias.

## Consequências

**Positivas:**
- Consistência com a stack adotada e com o modelo de utilização aprovado na Q-025.
- Bucket privado provisionado, sem policy de acesso direto para `anon` ou `authenticated` na verificação registrada pela PR #181.
- Upload inicial mediado por endpoint server-side, com validação de sessão, vínculo com mensagem e validação básica do arquivo.
- Preservação das regras de privacidade, autorização, antimalware e operação definidas pela FORD.

**Negativas e cuidados:**
- A fundação de storage e o endpoint de upload não entregam o ciclo completo de anexos.
- Ainda são necessários download autorizado, links temporários, revogação, quarentena, scanner, liberação administrativa auditada, quotas, validação estrutural e evidências de backup/restore.
- A implementação e operação exigem monitoramento de capacidade, permissões, falhas e retenção.

## Riscos

Objeto público por configuração incorreta; URL vazada; link não revogado após remoção; bypass por usuário; liberação administrativa sem auditoria; malware não detectado; scanner indisponível; arquivo corrompido ou malformado; metadados GPS preservados; backups contendo dados já excluídos até o fim do ciclo; processamento por serviço não aprovado.

## Evidências e estado atual

- **Q-025:** concluída em 24/11/2026, com aprovação de TI/FORD para a compatibilidade e o modelo de utilização dos provedores nomeados, inclusive Storage, dentro dos limites e responsabilidades registrados. Essa decisão não comprova implementação integral dos controles de anexos.
- **PR #181 — provisionamento do bucket privado:** integrada em 26/11/2026. Provisionou o bucket `attachments` como privado, com limite configurado de 10 MiB e allowlist MIME PDF/JPEG. A verificação registrada confirmou ausência de policies de acesso direto em `storage.objects`; naquele momento da verificação, não havia objetos armazenados. A PR não implementou o upload funcional.
- **PR #185 — upload privado:** integrada em 26/11/2026. Adicionou `POST /api/attachments/upload`, validação da sessão por cookies HTTP-only, consulta da mensagem com JWT do usuário e RLS, verificação de que o remetente corresponde ao usuário autenticado, upload no bucket privado com credencial secreta apenas no servidor, validação de extensão/MIME/assinatura binária, limite técnico de 10 MiB e registro de metadados. Se a gravação dos metadados falhar, o objeto é removido. Foram adicionados 10 casos unitários de validação.
- **Issue #115:** permanece aberta. As PRs #181 e #185 entregaram a infraestrutura privada e a primeira camada de upload, mas não encerraram os critérios completos da issue.
- **Issues #116 e #117:** permanecem abertas para download autorizado/links temporários e para os demais controles funcionais e operacionais de anexos.

**Limite de interpretação do tamanho:** a regra da Issue #117 registra 10 MB, enquanto as PRs #181 e #185 descrevem/configuram 10 MiB. A documentação registra os dois valores sem redefinir a regra de produto; Desenvolvimento/SQA devem confirmar e evidenciar a equivalência ou corrigir a configuração antes do aceite, sem ampliar o limite funcional por inferência.

A validação de assinatura binária não equivale a parser completo, validação estrutural ou análise antimalware. O endpoint de upload não implementa download, emissão de URL temporária ou scanner. A PR #181 verificou a configuração do bucket no momento de sua execução, não a operação completa do ciclo de vida dos anexos.

## Pendências para Accepted

- Concluir e testar o download autorizado, emissão de links temporários de até 5 minutos e revogação efetiva após remoção de participante (#116).
- Implementar scanner antimalware interno, quarentena e máquina de estados; falha/inconclusão deve manter o anexo bloqueado sem interromper o envio de mensagens de texto.
- Implementar liberação excepcional pelo TI, autenticada e auditada, sem alterar o resultado original do scanner.
- Implementar quotas individuais e capacidade total administradas pelo TI, limite de até 5 arquivos por mensagem, rejeição de PDF protegido por senha e remoção de EXIF/GPS.
- Completar validação de estrutura real de PDF/JPEG e resolver a divergência documental/técnica entre 10 MB e 10 MiB.
- Evidenciar backup diário dos anexos, retenção de 12 meses, restauração, auditoria e descarte conforme a governança de release/continuidade (#130).
- Obter evidências de integração e revisão SQA/Tech Lead para o ciclo completo, sem tratar os merges das PRs #181 e #185 como aceite funcional integral.

Os limites de arquivo, quantidade por mensagem, quotas individuais e total, ausência de quota por conversa, comportamento fail-closed, formatos, retenção, scanner interno e responsabilidades do TI são requisitos consolidados; não devem ser reabertos como pendências de produto nesta ADR.
