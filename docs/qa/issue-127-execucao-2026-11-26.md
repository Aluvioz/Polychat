# Issue #127 — incremento de testes de autenticação e integração

Data: 26/11/2026. Base: main (commit 74eb0a348ca869175dc3f19b962043941460763d).
Escopo: incremento parcial; não equivale a homologação ou conclusão da issue.

## Resultados executados

- Antes: npm test, 49/49 PASS.
- Depois: npm test, 59/59 PASS, Node v24.22.3, ambiente Linux local.
- Novos casos 127-A01 a A10: entrada inválida, identidade ambígua/papel desconhecido, e-mail ausente, identidade divergente, indisponibilidade do provedor, refresh inválido, metadados não confiáveis, ausência de tokens, indisponibilidade durante validação e logout bem-sucedido.
- Os testes novos usam respostas HTTP simuladas, não contas reais.
- Runner SQL: bash -n PASS; sem configuração explícita de ambiente dedicado, bloqueio esperado com código 2.
- Testes SQL reais neste incremento: BLOCKED (psql não instalado no ambiente local; nenhum banco dedicado autorizado/configurado). Nenhuma migração, alteração ou fixture aplicada ao Supabase compartilhado.

## Reutilização dos testes existentes

O runner executa os quatro arquivos existentes das issues #101/#102, em processos separados, com ON_ERROR_STOP. A verificação de visibilidade de conversa direta agora lança exceção em caso de resultado incorreto, em vez de apenas imprimir false. Os scripts possuem transações e rollback; não devem ser executados em produção. Evidência histórica de #101 consta em docs/security/issue-101-rls-evidence.md; não constitui nova execução neste incremento.

## Reprodução

1. Em checkout do PR, execute npm test (CI principal já executa esse comando).
2. Em ambiente exclusivo de teste, já migrado e vazio de dados reais, configure PGHOST, PGDATABASE, PGUSER e autenticação segura via PGPASSFILE, além de PGSSLMODE apropriado ao ambiente. Não inclua credenciais em logs.
3. Somente após o administrador confirmar isolamento e ausência de dados reais, ele deve gerar um UUID exclusivo e registrar no catálogo do banco dedicado (como proprietário do banco): `COMMENT ON DATABASE nome_do_banco IS 'polychat-dedicated-test:<UUID>';`. Não executar esse comando em produção ou em banco compartilhado; não reutilizar marcador de outro ambiente. Caso o provedor não permita provisionar o marcador, manter BLOCKED. Configure `POLYCHAT_TEST_DB_ID` com o UUID correspondente, `POLYCHAT_TEST_DB_CONFIRM=dedicated-test` e execute `bash scripts/test-supabase-integration.sh`. O runner consulta o nome, a identidade da sessão e o comentário do banco na mesma conexão que executará cada fixture; uma divergência aborta antes do SQL de teste. Não aceita múltiplos hosts, conninfo nem PGHOSTADDR/PGSERVICE/PGOPTIONS. Use conexão direta e TLS verificado para ambientes remotos.
4. Registre saída, versão de PostgreSQL, commit e ambiente. Qualquer erro é FAIL; ausência de ambiente é BLOCKED.

## Pendências

- Coordenação com Tech Lead/SQA sobre banco dedicado e reconciliação das migrations (#180).
- Execução SQL real, integração real de login com conta sintética provisionada e CI de integração isolada.
- Evidência de ausência de chave privilegiada no bundle cliente; testes de demais fluxos quando implementados.
- Revisão independente SQA. Não encerrar #127.

## Revisão SQA — proteção do runner

- O marcador no catálogo é a evidência técnica adicional à confirmação textual; depende de provisionamento exclusivo pelo administrador e não deve ser copiado em clones de produção. Não é prova absoluta de isolamento se um administrador marcar indevidamente o banco.
- `bash -n scripts/test-supabase-integration.sh`: PASS.
- `python3 scripts/test-supabase-runner-guard.py`: 10/10 PASS em Linux com psql simulado: confirmação ausente, UUID ausente/inválido, múltiplos hosts, conninfo, PGHOSTADDR/PGSERVICE/PGOPTIONS, identidade recusada sem fixture, e identidade aceita com guarda antes das quatro fixtures.
- `npm test`: 59/59 PASS. O teste simulado verifica fluxo e argumentos; não executa a consulta PostgreSQL real. A validação positiva e negativa da guarda em bancos isolados reais permanece BLOCKED até disponibilização de ambiente autorizado e psql; nenhuma alteração ao Supabase compartilhado.
