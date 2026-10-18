# Cobrança semanal por contrato

A cobrança posterior à semana utilizada é a escolha confirmada pelo proprietário. A agenda permite antecipação como alternativa explícita por vínculo; nenhuma alteração modifica o contrato assinado. Dia de vencimento, primeira/última semana incompleta, início e referência da conferência precisam ser informados. Valores e pessoas continuam fictícios.

## Fluxo de gestão e motorista

1. Concluir a versão do contrato de locação em Meu advogado.
2. No Financeiro, configurar a agenda pelo motorista/contrato, conferir a primeira semana e salvar.
3. Entregar o carro após os demais controles. A agenda ativa acompanha o mesmo motorista, carro, versão e ciclo.
4. Emitir vencimentos até uma data. A mesma cobrança aparece na gestão, no app e na agenda; não há recebimento automático.
5. Conferir recebimento ou aplicar crédito da lojinha pelos motores financeiros existentes.
6. No encerramento, conferir o último dia utilizado. O ajuste preserva cobranças e recebimentos; eventual excesso recebido vira obrigação separada para devolução conferida.

Não há multa, juros, reajuste ou compensação de caução automáticos. A conferência da agenda no protótipo não substitui um acordo contratual nem uma assinatura real.

## Definições de período

O dia escolhido marca o começo das semanas completas e seu vencimento semanal. Um início fora desse dia forma uma primeira semana curta até a véspera do próximo dia escolhido. Em pagamento posterior, o vencimento é o próximo dia semanal combinado; uma devolução no meio da semana reduz seu valor conforme a regra escolhida, sem antecipar esse vencimento. No antecipado, é o primeiro dia do período.

Exemplo demonstrativo: R$1.050, entrega na quarta-feira 27/01/2027 e vencimento às segundas. A primeira semana cobre 27–31/01, cinco dias. Se proporcional, vale R$750 e vence em 01/02 no pagamento posterior. A semana seguinte cobre 01–07/02 e vence em 08/02, por R$1.050. No antecipado, os mesmos períodos vencem em 27/01 e 01/02.

Entrega e devolução contam como dias utilizados. Proporcional é `arredondar_centavos(valor_semanal × dias / 7)`. A regra da última semana prevalece quando a primeira também é a última. Essas regras precisam estar coerentes com o contrato revisado. A interface mostra os valores antes de salvar.

## Motor e integração

`src/rental.js` expõe `RodavoltRental` e `prototype/rental.js` adiciona `rentalPanel`, `rentalAction` e `rentalSubmit` ao controlador.

- `configure(ops, {driverId, contractId, startDate, paymentTiming, dueWeekday, firstWeek, lastWeek, confirmedConditions, openingCoverageThrough?})`: exige contrato revisado e assinado. `paymentTiming` é `arrears` ou `advance`; `dueWeekday` é 0–6; regras parciais são `proportional` ou `full`. Preço vem da versão assinada. Não se reconfigura silenciosamente uma agenda existente.
- `prepareActivation(ops, driverId, on)`: valida configuração, data efetiva, carro, calendário, ciclo e versão, sem modificar o estado. Usar antes de alterar o vínculo.
- `activate(ops, driverId, on)`: após vincular o carro, ativa e emite os vencimentos até a entrega. Pagamento posterior normalmente não emite uma cobrança no primeiro dia.
- `generateThrough(ops, date, {driverId?})`: emite vencimentos de agendas ativas; chave determinística por agenda/período. Repetir não duplica dívida nem dinheiro.
- `previewFinalization(ops, {driverId, vehicleId?, endDate, closureId?})`: prévia sem mutação. Retorna `charges`, `refundLiability`, `requiresConfiguration` e `reason`.
- `finalize(ops, {driverId, vehicleId?, endDate, closureId?, reference?, note?})`: confirma em cópia transacional. A referência deve ser única; reenvio equivalente devolve o acerto preservado. Não quita dívidas e não devolve dinheiro.

As cobranças possuem `rentalScheduleId`, `contractId`, `contractVersion`, `deliveryCycle`, `periodStart`, `periodEnd`, `date` e `amount`. O valor emitido original permanece em `amount`. Encerramentos registram `adjustedAmount`, `adjustmentAmount`, `finalPeriodEnd` e ajuste rastreável em `ops.rental.adjustments`. O saldo compartilhado considera valor ajustado, crédito e dinheiro já registrado. Cobranças futuras sem valor após ajuste permanecem no histórico como concluídas por ajuste, sem recebimento fictício.

Recebimento excedente, inclusive crédito da lojinha já aplicado, gera `ops.rental.refundObligations` por cobrança, com `amount`, `paid`, `date` e referência. O lançamento `rentAdjustment` reduz receita e aumenta a obrigação sem caixa; `rentalRefund` devolve a obrigação sem reduzir o resultado uma segunda vez. Não se reutiliza o excesso como crédito da loja nem se compensa caução.

As quatro cobranças da abertura têm cobertura histórica demonstrativa. A configuração de continuidade exige a gestão informar `openingCoverageThrough`, iniciar no dia seguinte e escolher primeiro vencimento posterior aos vencimentos preservados. Não se duplicam nem se reescrevem os quatro exemplos. Um encerramento desse histórico sem agenda retorna `requiresConfiguration: true` e aviso explícito; preserva saldos e não inventa proporcionalidade.

## Verificação

`tests/rental.test.mjs` verifica duas semanas e dois motoristas, reenvio, contrato/preço/carro/ciclo, primeiras e últimas semanas, antecipado/posterior, calendário, histórico preservado, dívida aberta, acerto parcial, obrigação de devolução e idempotência. Esses testes verificam o protótipo local; banco, execução agendada remota, identidade e recebimentos reais continuam dependendo da implantação.
