# ADR-008 — Armazenamento privado e anexos

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issues relacionadas:** #89, #115, #116 e #117
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD v2 confirma anexos exclusivamente em PDF e JPEG, com limite funcional de **10 MiB (10.485.760 bytes) por arquivo** e até cinco arquivos por mensagem. A unidade foi explicitada pela retificação do PO em 26/11/2026, registrada na seção 11.2 de POLY-DATA-001 v0.5; a regra não deve ser reinterpretada como 10.000.000 bytes. O TI define limites individuais e a capacidade total de armazenamento; não existe quota por conversa. PDF protegido por senha não é aceito. JPEG deve ser selecionado da galeria, sem captura pela câmera, e os metadados EXIF/GPS devem ser removidos.

A análise antimalware deve ocorrer dentro da infraestrutura da FORD. Se o scanner falhar, estiver indisponível ou retornar resultado inconclusivo, o anexo permanece bloqueado; o envio de texto continua funcionando. O TI pode liberar excepcionalmente um arquivo somente por ação autenticada e auditada, preservando o resultado original do scanner; também pode baixar anexos durante investigações com registro de auditoria. Usuários não podem contornar a análise.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. A restrição da FORD v2 sobre acesso, armazenamento e processamento de dados cria uma questão de compatibilidade que deve ser avaliada na Q-025, inclusive para a configuração do Supabase Storage. Esta ADR não pode, por inferência, declarar o serviço retirado nem alterar o status da ADR-003. Se a avaliação identificar incompatibilidade concreta não mitigável, deverá ser apresentada com evidências e impacto para decisão formal.

A implementação possui uma fundação parcial já integrada: a PR #181 provisionou o bucket privado `attachments` no Polyford e a PR #185 integrou o endpoint inicial server-side de upload. Essas entregas não comprovam o ciclo completo de upload/download, a integração antimalware ou a homologação ponta a ponta.

## Problema

Armazenar, analisar e entregar anexos sem expor objetos publicamente, sem permitir acesso fora das permissões da conversa e sem transferir arquivos ou metadados a provedores externos.

## Alternativas consideradas

1. **Armazenamento de objetos privado sob controle da FORD:** opção preferencial a avaliar, com segregação de ambientes e integração com a aplicação server-side.
2. **Armazenamento de arquivos em infraestrutura corporativa controlada pela FORD:** alternativa a validar conforme capacidade, disponibilidade, backup e operação.
3. **Armazenamento em banco relacional:** não é a opção preferencial para bytes de arquivos; o banco deve manter metadados e vínculos necessários.
4. **Storage gerenciado na plataforma adotada, incluindo Supabase Storage:** deve ser avaliado quanto à configuração, acessos, processamento, armazenamento, localização e responsabilidades. As restrições da FORD permanecem obrigatórias; eventual incompatibilidade precisa ser demonstrada e encaminhada ao processo formal de mudança, sem reclassificação automática da ADR-003.

## Decisão proposta

Manter os anexos em **armazenamento privado e protegido, compatível com a stack Supabase + Vercel adotada**. Supabase Storage é candidato a detalhamento técnico, mas sua configuração, controles, acessos, antimalware, backups e compatibilidade com os requisitos da FORD devem ser demonstrados na Q-025 e revisados por Tech Lead e TI. Esta proposta não declara integração/homologação nem autoriza substituir a stack.

### Regras funcionais consolidadas

- Aceitar somente PDF e JPEG.
- Limitar cada arquivo a **10 MiB (10.485.760 bytes)** e cada mensagem a, no máximo, cinco arquivos.
- Aplicar quotas individuais e capacidade total configuradas pelo TI, sem limite específico por conversa.
- Rejeitar PDF protegido por senha.
- Permitir seleção de JPEG existente na galeria; a aplicação não oferece captura de foto pela câmera.
- Remover metadados EXIF, inclusive GPS/localização, antes da disponibilização.
- Validar o arquivo recebido e submetê-lo ao scanner antimalware executado na infraestrutura da FORD.
- Manter o anexo indisponível até resultado favorável da análise. Falha, indisponibilidade, timeout ou resultado inconclusivo não equivalem a arquivo seguro e mantêm o anexo bloqueado.
- A indisponibilidade do scanner não bloqueia o envio de mensagens de texto.
- O TI pode liberar excepcionalmente um arquivo bloqueado somente por ação autenticada e auditada, preservando o resultado original da análise; usuários comuns não podem executar bypass ou alterar o estado da análise.
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

O storage, o scanner antimalware, o processamento de metadados, a emissão/revogação de links, os backups e os logs relacionados devem permanecer sob controle da FORD. Não enviar arquivos, conteúdo, metadados ou identificadores a serviços externos para varredura, conversão, extração, análise ou armazenamento.

Bibliotecas e atualizações sem acesso a dados da FORD podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.

## Justificativa

Armazenamento privado e autorização por requisição preservam o vínculo entre arquivo, mensagem, conversa e participantes. A análise antimalware interna e a indisponibilidade segura do anexo atendem às regras da FORD sem interromper a comunicação textual. A execução sob controle da organização é obrigatória diante da proibição de terceiros processarem ou armazenarem dados.

## Consequências

**Positivas:**
- Conformidade da direção de arquitetura com a fronteira de infraestrutura definida pela FORD.
- Controle de acesso por conversa e revogação após remoção de participante.
- Análise antimalware sem exposição a serviços externos.
- Regras de limite, retenção e operação coerentes com a baseline POLY-REQ-001 v0.5 e a retificação de unidade de 26/11/2026.

**Negativas e cuidados:**
- A FORD/equipe precisa operar e monitorar storage, scanner, capacidade, disponibilidade e backups.
- A implementação demanda fluxo de quarentena, liberação administrativa, autorização por download e revogação efetiva.
- Testes devem cobrir falhas do scanner, acesso indevido, remoção de participante, restauração e descarte.

## Riscos

Objeto público por configuração incorreta; URL vazada; link não revogado após remoção; bypass por usuário; liberação administrativa sem auditoria; malware não detectado; scanner indisponível; arquivo corrompido ou incompatível; metadados GPS preservados; backups contendo dados já excluídos até o fim do ciclo; integração externa que acesse dados da FORD.

## Evidências e estado atual

- **Decisão funcional:** POLY-DATA-001 v0.5, seção 11.2, retifica o limite para 10 MiB (10.485.760 bytes) por arquivo e mantém até cinco anexos por mensagem. Quotas individuais e capacidade total são administradas pelo TI; não existe quota por conversa.
- **Storage privado — PR #181 / Issue #115:** bucket `attachments` provisionado no Polyford como privado, allowlist PDF/JPEG, limite de 10.485.760 bytes e sem policies de acesso direto em `storage.objects`. A entrega foi revisada por SQA e Tech Lead no escopo de provisionamento.
- **Upload inicial — PR #185:** endpoint server-side `POST /api/attachments/upload` integrado. Valida sessão, autoria da mensagem, extensão/MIME/assinatura inicial e grava metadados com JWT de usuário; o segredo privilegiado permanece no servidor. A entrega não constitui parser estrutural completo nem análise antimalware.
- **Estado ponta a ponta:** a coleta documentada na PR #182 encontrou o bucket sem objetos; não há evidência de upload real ponta a ponta homologado. A existência do bucket e do endpoint não conclui a jornada do anexo.
- **Pendências funcionais/técnicas:** download autorizado, links temporários de até cinco minutos e revogação efetiva; scanner interno FORD e quarentena; comportamento fail-closed, liberação excepcional autenticada/auditada e preservação do resultado; rejeição de PDF protegido por senha; remoção de EXIF/GPS; quotas/capacidade; descarte físico e auditoria dos call-sites; backup e restauração dos objetos.
- **Backup/recuperação:** a evidência da PR #182 não demonstrou backup diário automatizado, off-site, retenção de 365 dias nem restauração de banco/objetos; RPO/RTO de até 24 horas permanecem não demonstrados.
- **Arquitetura:** ADR-003 Accepted mantém Supabase + Vercel como stack adotada. ADR-008 permanece **Proposed**; Q-025 continua aberta para evidenciar a compatibilidade da configuração e da fronteira de processamento com as restrições da FORD.

## Pendências para Accepted

- Definir e validar a configuração de armazenamento privado na stack adotada, incluindo a avaliação de Supabase Storage frente aos requisitos da FORD (Q-025).
- Definir a integração do scanner interno, quarentena, liberação administrativa e monitoramento operacional.
- Implementar e testar autorização em upload e em cada download, revogação imediata e links temporários de até 5 minutos.
- Evidenciar remoção de EXIF/GPS e rejeição de PDF protegido por senha.
- Homologar backup, restauração, retenção e descarte no ambiente aprovado.

Os limites de arquivo, quantidade por mensagem, quotas individuais e total, ausência de quota por conversa, comportamento fail-closed, formatos, retenção, scanner interno e responsabilidades do TI são requisitos consolidados; não devem ser reabertos como pendências de produto nesta ADR.
