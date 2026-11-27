# ADR-008 — Armazenamento privado e anexos

- **Status:** Proposed
- **Data de revisão:** 26/11/2026
- **Issues relacionadas:** #89, #115, #116 e #117
- **Baseline:** POLY-REQ-001 v0.5

## Contexto

A FORD v2 confirma anexos exclusivamente em PDF e JPEG, com limite funcional de **10 MiB (10.485.760 bytes) por arquivo** e até 5 arquivos por mensagem, conforme retificação do PO em 26/11/2026 registrada no POLY-DATA-001 v0.5, seção 11.2, e detalhada no POLY-STO-001 v0.3, seção 16.2. O TI define limites individuais e a capacidade total de armazenamento; não existe quota por conversa. PDF protegido por senha não é aceito. JPEG deve ser selecionado da galeria, sem captura pela câmera, e os metadados EXIF/GPS devem ser removidos.

A análise antimalware deve ocorrer dentro da infraestrutura da FORD. Se o scanner falhar, estiver indisponível ou retornar resultado inconclusivo, o anexo permanece bloqueado; o envio de texto continua funcionando. O TI pode liberar qualquer arquivo e também baixar anexos durante investigações. Usuários não podem contornar a análise.

A ADR-003 mantém Supabase + Vercel como stack adotada e obrigatória. A Q-025 foi concluída em 24/11/2026 com aprovação expressa da TI e da FORD para o uso dos serviços Supabase, inclusive Supabase Storage, e da Vercel dentro dos limites e controles registrados para o Polychat. A aprovação dos provedores nomeados não autoriza compartilhar dados com outros serviços externos sem decisão específica.

A implementação já possui a fundação privada do Supabase Storage e um endpoint server-side parcial de upload, entregues pelas PRs #181 e #185. Essas entregas não equivalem ao fluxo completo de anexos: download autorizado, links temporários e revogação, validação estrutural profunda, scanner antimalware, quotas, tratamento de PDF protegido por senha, remoção EXIF/GPS e backup/restauração permanecem pendentes nas issues correspondentes.

## Problema

Armazenar, analisar e entregar anexos em armazenamento privado, sem exposição pública nem acesso fora das permissões da conversa, utilizando os provedores nomeados e aprovados na Q-025 e sem encaminhar arquivos ou metadados a outros serviços externos.

## Alternativas consideradas

1. **Supabase Storage — provedor nomeado aprovado na Q-025; proposta técnica desta ADR:** a TI e a FORD aprovaram o serviço como capacidade privada de armazenamento no modelo Supabase + Vercel. Essa aprovação do provedor não equivale ao aceite desta ADR nem comprova a conclusão dos controles e fluxos de anexos; esta proposta detalha o bucket privado, a autorização, o processamento e a operação necessários.
2. **Armazenamento próprio em infraestrutura corporativa da FORD — não selecionado:** exigiria adotar uma arquitetura de armazenamento diferente da stack aprovada para o Polychat, além de especificar e comprovar sua integração, capacidade, disponibilidade, segregação de ambientes, backup, restauração e operação. Não é a solução arquitetural aprovada para esta entrega; eventual adoção dependeria de mudança arquitetural formal.
3. **Armazenamento dos arquivos binários no banco relacional — não selecionado:** não é adequado como repositório principal dos bytes dos anexos. O banco permanece responsável pelos metadados e vínculos necessários à autorização, rastreabilidade e associação com mensagens e conversas.
4. **Outro serviço externo de armazenamento ou análise — não selecionado:** nenhum provedor adicional está autorizado pela Q-025. A adoção de outro serviço exigiria aprovação específica da TI/FORD e revisão formal da arquitetura. Em particular, esta ADR não autoriza encaminhar arquivos a scanner antimalware SaaS ou a qualquer serviço externo de processamento.

## Proposta de decisão

Propor **Supabase Storage como capacidade de armazenamento privado de anexos** na stack Supabase + Vercel. A TI e a FORD aprovaram o serviço como provedor nomeado e a utilização como capacidade de armazenamento privado na Q-025, concluída em 24/11/2026. Essa aprovação não representa aceite automático desta ADR: a ADR-008 permanece **Proposed** até a revisão e aprovação específicas da arquitetura e dos controles aqui descritos, incluindo autorização server-side, links e revogação, scanner interno, quotas, retenção e proteção de backups. O bucket privado e o endpoint parcial de upload das PRs #181 e #185 são evidências de implementação parcial, não de conclusão do ciclo de anexos.

### Registro formal da Q-025 — provedor autorizado, sem aceite automático da ADR-008

**Aprovadores da Q-025:** TI e representante da FORD.  
**Data:** 24/11/2026.  
**Referência:** Q-025 — Compatibilidade da stack Supabase + Vercel, concluída.  
**Resultado:** Supabase Storage aprovado como provedor nomeado e capacidade privada de armazenamento do Polychat, nos limites e responsabilidades do modelo de utilização aprovado. A análise antimalware permanece dentro da infraestrutura e da responsabilidade operacional da TI; não há autorização para scanner SaaS ou serviço externo de análise.

Este registro comprova a aprovação do provedor e do modelo de utilização na Q-025; não altera o status **Proposed** desta ADR nem declara os controles e fluxos de anexos concluídos.

A aprovação é da direção arquitetural e do modelo operacional. Bucket, handlers, políticas de acesso, scanner, revogação efetiva de links e testes de ponta a ponta continuam sendo entregas de implementação e homologação nas issues correspondentes.

### Regras funcionais consolidadas

- Aceitar somente PDF e JPEG.
- Limitar cada arquivo a **10 MiB (10.485.760 bytes)** e cada mensagem a, no máximo, 5 arquivos.
- Aplicar quotas individuais e capacidade total configuradas pelo TI, sem limite específico por conversa.
- Rejeitar PDF protegido por senha.
- Permitir seleção de JPEG existente na galeria; a aplicação não oferece captura de foto pela câmera.
- Remover metadados EXIF, inclusive GPS/localização, antes da disponibilização.
- Validar o arquivo recebido e submetê-lo ao scanner antimalware executado na infraestrutura da FORD.
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

O armazenamento de objetos utiliza o Supabase Storage, provedor nomeado e aprovado na Q-025, dentro do modelo de uso e dos controles definidos pela FORD. O scanner antimalware, o processamento de arquivos, a emissão/revogação de links, os backups e os logs relacionados permanecem sob responsabilidade e controle operacional da FORD/TI, observada a arquitetura aprovada. Não encaminhar arquivos, conteúdo, metadados ou identificadores a outros serviços externos para varredura, conversão, extração, análise ou armazenamento sem aprovação específica.

A chave privilegiada do Supabase Storage deve permanecer exclusivamente no servidor; não criar políticas que permitam acesso direto não autorizado por anon ou authenticated. As operações de aplicação devem passar por handlers server-side autenticados e autorizados, sem exposição de segredos ao navegador.

Bibliotecas e atualizações sem acesso a dados da FORD podem ser utilizadas conforme as regras técnicas e de segurança aplicáveis.

## Justificativa

A escolha do Supabase Storage não parte da premissa de que terceiros estejam genericamente proibidos de armazenar dados. A Q-025, concluída em 24/11/2026, registra a aprovação expressa da TI e da FORD para o uso do Supabase — inclusive Supabase Storage — como provedor nomeado da stack Supabase + Vercel do Polychat. A decisão desta ADR aplica essa aprovação ao armazenamento privado de anexos e evita introduzir um provedor adicional não aprovado.

A aprovação é delimitada ao serviço e ao modelo de uso autorizados: não representa autorização ampla para outros fornecedores, serviços de processamento ou soluções externas de análise. O Supabase Storage fornece a capacidade de armazenamento de objetos; a aplicação deve manter o bucket privado e realizar as operações por handlers server-side autenticados e autorizados, sem expor a chave privilegiada ao navegador. A entrega de arquivos deve respeitar a autorização vigente dos participantes, a validade máxima de 5 minutos dos links temporários e a revogação de acesso após remoção de participante.

O processamento antimalware permanece dentro da infraestrutura da FORD, sob responsabilidade operacional da TI, sem encaminhamento dos arquivos a serviços externos. A FORD/TI também deve governar e comprovar os controles de autorização, auditoria, retenção, backup, restauração e homologação exigidos nesta ADR, de acordo com o modelo aprovado para o Supabase Storage. A existência da aprovação arquitetural não comprova que esses controles e fluxos já estejam integralmente implementados; as evidências e pendências permanecem nas issues correspondentes.

## Consequências

**Positivas:**
- Conformidade da direção de arquitetura com a stack Supabase + Vercel expressamente aprovada pela FORD na Q-025.
- Controle de acesso por conversa e revogação após remoção de participante, quando os fluxos de autorização e entrega estiverem integralmente implementados.
- Análise antimalware interna, sem exposição dos arquivos a serviços externos não aprovados.
- Regras de limites, retenção e operação coerentes com a baseline POLY-REQ-001 v0.5.

**Negativas e cuidados:**
- TI responde pela governança e operação de Storage, scanner, capacidade, disponibilidade e backups, dentro do modelo aprovado para Supabase + Vercel.
- A implementação precisa completar download autorizado, processamento antimalware, quarentena, liberação administrativa, revogação efetiva e quotas.
- A fundação de bucket e upload parcial não comprova o fluxo ponta a ponta; testes devem cobrir falhas do scanner, acesso indevido, remoção de participante, restauração e descarte.

## Riscos

Objeto público por configuração incorreta; URL vazada; link não revogado após remoção; bypass por usuário; liberação administrativa sem auditoria; malware não detectado; scanner indisponível; arquivo corrompido ou incompatível; metadados GPS preservados; backups contendo dados já excluídos até o fim do ciclo; integração externa que acesse dados da FORD.

## Evidências e estado atual

A fotografia abaixo reflete as entregas integradas à main pelas PRs #181 e #185 e as verificações documentadas no ambiente Polyford de desenvolvimento em 26/11/2026.

### Storage privado — PR #181

- A migration 20261126131156_issue_115_private_attachment_bucket provisiona o bucket attachments no Supabase Storage.
- Verificação no Polyford confirmou public = false, limite por objeto de **10.485.760 bytes (10 MiB)** e allowlist MIME restrita a application/pdf e image/jpeg.
- Não existem policies de acesso direto em storage.objects para anon ou authenticated; o acesso deve ocorrer por handler server-side confiável, com a chave secreta exclusivamente no servidor.
- O teste supabase/tests/issue_115_private_bucket.integration.sql concluiu sem exceção. Na verificação registrada, havia zero objetos no bucket.
- A PR #181 foi integrada, mas a entrega provisiona a fundação do Storage; não comprova upload ou download funcional de arquivo real.

### Upload privado — PR #185

- Foi integrado o endpoint server-side POST /api/attachments/upload.
- A rota valida a sessão pelos cookies HTTP-only, consulta a mensagem com o JWT do usuário e só permite upload quando o usuário autenticado é o remetente da mensagem.
- O arquivo é enviado ao bucket privado usando a chave secreta somente no servidor; a rota valida extensão, MIME declarado e assinatura binária PDF/JPEG e aplica limite de **10 MiB**.
- Os metadados são registrados em public.attachments usando o JWT do usuário, preservando o enforcement de RLS. Se o registro falhar após o upload, a rota tenta remover compensatoriamente o objeto.
- Foram adicionados testes unitários de validação de arquivo, incluindo casos positivos PDF/JPEG e rejeições de MIME, extensão, assinatura, arquivo vazio e tamanho acima do limite.
- A PR #185 não implementa download nem emite URL pública ou temporária. A validação de assinatura não é parser estrutural completo nem análise antimalware.

### Limites da evidência

- As verificações SQL no Polyford confirmaram a configuração do bucket, mas não houve upload/download real de arquivo no ambiente consultado; a verificação posterior registrou zero objetos em storage.objects.
- A existência do bucket, da rota e dos testes unitários não comprova integração ponta a ponta com o fluxo de criação de mensagem, análise antimalware, leitura/download ou experiência completa do usuário.
- A Issue #115 permanece aberta; as PRs #181 e #185 entregam, respectivamente, a fundação privada e uma camada inicial de upload, sem declarar encerrados todos os critérios da issue.
- A regra funcional retificada pelo PO em 26/11/2026 estabelece **10 MiB (10.485.760 bytes)** por arquivo. O bucket da PR #181 e o endpoint da PR #185 aplicam esse mesmo limite; não há pendência de decisão sobre a unidade. A suíte `tests/attachment-validation.test.mjs` já verifica a rejeição de `MAX_ATTACHMENT_BYTES + 1` (10.485.761 bytes). Ainda falta um teste positivo explícito que confirme a aceitação de exatamente 10.485.760 bytes e a evidência do limite no fluxo integrado de upload.

As evidências de implementação estão registradas em docs/storage/issue-115-private-storage-evidence.md, docs/storage/issue-115-upload-implementation.md e docs/infra/polyford-integration-validation-2026-11-26.md.

## Trabalho de implementação remanescente

As entregas devem permanecer rastreadas nas issues de implementação, sem reabrir as decisões funcionais ou a aprovação arquitetural já registradas.

### Issue #115 — concluir e validar o upload privado

- Completar a validação de PDF/JPEG além da checagem de extensão, MIME declarado e assinatura binária, incluindo validação estrutural compatível com os requisitos.
- Executar testes de integração do endpoint com upload real no ambiente de desenvolvimento/homologação, verificar objeto e metadados, falhas e limpeza compensatória e produzir evidências reproduzíveis.
- Integrar o upload ao fluxo de criação de mensagens com anexos, preservando consistência entre mensagem, metadados e objeto no Storage; os fluxos atualmente existentes não comprovam transação ponta a ponta.
- Acrescentar teste positivo explícito para a aceitação de exatamente 10.485.760 bytes; preservar a cobertura negativa já existente para 10.485.761 bytes e comprovar o comportamento no fluxo integrado de upload.

### Issue #116 — download autorizado e links temporários

- Implementar download mediado por servidor e autorização atualizada por membership antes de cada entrega.
- Emitir links temporários somente após autorização, com validade máxima de 5 minutos, sem URLs públicas permanentes nem exposição do caminho físico.
- Garantir revogação de acesso após remoção de participante, inclusive quanto à possibilidade de uso de links já emitidos; o desenho deve demonstrar como a revogação imediata será efetiva.
- Permitir o acesso administrativo do TI durante investigações, com autenticação e auditoria da operação.

### Issue #117 — validação, quotas e antimalware

- Aplicar o limite de até 5 anexos por mensagem e implementar quotas individuais por usuário e capacidade total configuradas pelo TI, sem quota por conversa.
- Rejeitar PDF protegido por senha e remover EXIF/GPS de JPEG antes da disponibilização.
- Implementar análise antimalware dentro da infraestrutura da FORD, com quarentena e estados de análise; falha, timeout, indisponibilidade ou resultado inconclusivo devem manter o anexo bloqueado, sem interromper o envio de mensagens de texto.
- Implementar liberação excepcional pelo TI como ação autenticada e auditada, sem permitir bypass por usuário comum e preservando o resultado original do scanner.
- Integrar auditoria de downloads, bloqueios, resultados de análise e liberações administrativas, conforme os requisitos.

### Issue #130 — backup, restauração e continuidade

- Comprovar backup diário dos objetos de Storage com retenção de 12 meses, integrado ao plano operacional e às responsabilidades da TI.
- Executar e registrar testes de restauração, retenção e descarte de anexos, incluindo o tratamento de objetos removidos e cópias de backup.
- Demonstrar os parâmetros de continuidade aprovados (RPO e RTO de até 24 horas) para dados e anexos, sem presumir que backup de banco cubra os objetos do Storage.

Essas entregas comprovam apenas partes da implementação. Não convertem a ADR-008 de Proposed em Accepted; a aprovação do provedor e do modelo de utilização na Q-025 permanece concluída e não é reaberta. Download, scanner, quotas, retenção e evidências ponta a ponta continuam nos critérios de implementação e homologação do produto.

Os limites de arquivo, quantidade por mensagem, quotas individuais e total, ausência de quota por conversa, comportamento fail-closed, formatos, retenção, scanner interno e responsabilidades do TI são requisitos consolidados; não devem ser reabertos como pendências de produto nesta ADR.
