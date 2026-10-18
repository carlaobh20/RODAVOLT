# Multas, sinistros e avarias

O acompanhamento separa fato, proposta de valor, análise humana, decisão financeira e resolução. Registrar uma multa, um sinistro ou uma avaria não cria dívida do motorista, não desconta aluguel e não retém caução. Seguro, órgãos de trânsito e consulta de multas não estão conectados.

## Jornada

1. A gestão registra motorista, carro, ciclo e data do fato, tipo, descrição pública, valor proposto opcional e prazo. Referências internas de seguro e futura evidência ficam separadas.
2. Se o carro estiver indisponível, a ocorrência abre uma manutenção ou vincula a que já existe. Resolver o caso não libera essa manutenção automaticamente.
3. A análise acompanha as situações Aberta, Em análise, Contestada e Resolvida. Toda mudança tem motivo e histórico. Os prazos vêm da ocorrência e aparecem na agenda como acompanhamento; concluir na agenda não substitui a decisão de origem.
4. O motorista lê apenas suas ocorrências e mensagens públicas, e pode contar sua versão. Isso cria pedido de atendimento vinculado; não envia recurso a terceiros.
5. A gestão registra quem arca com o valor aprovado, fundamento, mensagem pública e referência única. Responsabilidade do motorista exige registrar oportunidade de manifestação; ressarcimento da seguradora exige conferir seu aceite. Nenhuma dessas marcações substitui análise real ou revisão profissional.
6. Valor aprovado maior que zero cria um único título vinculado. RODAVOLT responsável: conta a pagar, despesa operacional. Motorista ou seguradora responsável: conta a receber, ressarcimento separado de aluguel. Sem cobrança exige valor zero e não cria título.
7. A gestão conclui com parecer. Títulos, pagamentos, manutenção, crédito e caução permanecem em seus próprios fluxos. Uma nova manifestação pode reabrir o acompanhamento sem apagar a decisão financeira.

O valor proposto não preenche o aprovado automaticamente. A decisão preserva sua referência e não pode ser sobrescrita depois de criar um título. Correções financeiras precisam preservar a decisão original e seguir a revisão do compromisso; a ocorrência não cria estorno silencioso.

## Motor e interface

`src/incidents.js` expõe `RodavoltIncidents`:

- `create(ops, input)`: exige `actor: 'management'`, motorista/carro/ciclo coerentes, data válida, tipo (`fine`, `accident`, `damage`), prazo e descrição. `unavailable` abre/vincula manutenção em cópia transacional.
- `changeStatus`, `setDeadline`: registram motivo e trilha; resolução direta sem decisão é rejeitada.
- `decide(ops, id, input)`: valida responsabilidade (`company`, `driver`, `insurer`, `none`), valor aprovado, fundamento, nota pública, referência, confirmação e, quando aplicável, `driverHeard`/`insuranceAccepted`. Cria título via `F.createTitle` uma vez, com `incidentId`, ciclo e referência da decisão. Não movimenta dinheiro.
- `resolve(ops, id, input)`: exige decisão e parecer final. Não liquida títulos nem encerra serviços.
- `manifest(ops, id, {driverId, message, reference?})`: valida titularidade e gera pedido de suporte vinculado. Referência repetida não cria pedido duplicado.
- `forDriver(ops, driverId)`: devolve cópia pública só do titular; oculta código de evidência, referência do seguro, fundamento interno e histórico reservado da gestão.
- `agendaItems(ops)`: pendências determinísticas por prazo, com origem, motorista e carro. Não há dado reservado de seguro no texto da agenda.

`prototype/incidents.js` fornece `incidentsPanel()`, `incidentAction`, `incidentSubmit` e `driverOccurrencesView()`. A gestão encontra o acompanhamento em Frota e cuidados; o motorista usa uma entrada simples em Mais.

Os campos `actor`, o seletor Gestão/Motorista e os filtros locais verificam fluxo do protótipo. **Não são autenticação ou autorização de produção.** A implantação precisa identificar o usuário no servidor, aplicar permissões por motorista, validar a origem das requisições, guardar evidências privadamente e impedir alterações concorrentes. O cliente não pode escolher seu próprio papel ou identidade no sistema operacional futuro.

## Verificação

`tests/incidents.test.mjs` cobre vínculo incorreto, histórico de um ciclo anterior, datas e prazos, ausência de cobrança automática, manutenção vinculada, decisão obrigatória, papel da gestão, oportunidade de manifestação, aceite da seguradora, título idempotente, informações públicas/privadas, pedido do motorista e resultado/caixa do ressarcimento separados de aluguel.
