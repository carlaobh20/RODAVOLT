# Devolução do carro e encerramento do vínculo

O protótipo possui uma jornada local em `src/closure.js`, interface `prototype/closure.js` e regressões em `tests/closure.test.mjs`. Todos os registros continuam demonstrativos. O histórico usa motorista, veículo e ciclo de entrega, sem reaproveitar conferências de um vínculo anterior.

1. **Combinar a devolução:** data, hora e observação; cria compromisso na agenda do motorista e da gestão. Agendar não libera o carro nem encerra cobranças.
2. **Vistoriar o retorno:** motorista preenche a vistoria de devolução e a gestão aprova. Entrega e vistoria periódica não servem como retorno. Avarias são registradas; problema de segurança exige manutenção aberta antes de encerrar o vínculo.
3. **Receber fisicamente:** confirmar o mesmo motorista/carro, as chaves, o km e a carga da bateria (%) da vistoria aprovada, com data efetiva e parecer. Recebimento futuro não libera o carro hoje. Novas vendas e combos ficam suspensos quando o carro é recebido.
4. **Contar o kit:** cada produto precisa ter a quantidade conferida. Pedidos aguardando pagamento, pedidos pagos ainda não entregues e combos em trânsito precisam ser resolvidos. Produtos bons retornam à central; avariados ficam em quarentena, sem cobrança automática ou baixa patrimonial antecipada. Mesmo kit vazio exige conferência explícita.
5. **Conferir o demonstrativo:** aluguéis, outros valores a receber, crédito da loja, caução, ajuste de aluguel e outros compromissos a pagar aparecem separados. As regras contratuais da última semana determinam o ajuste; abertura sem agenda permanece preservada e exige conferência manual expressa. Nenhum valor é automaticamente compensado ou retido.
6. **Encerrar:** confirma o demonstrativo e o parecer final; finaliza a agenda de cobrança e libera o vínculo somente depois das conferências físicas. Manutenção aberta mantém o carro indisponível. Dívidas permanecem exigíveis em seus registros e obrigações continuam separadas. O demonstrativo final é preservado como fotografia do encerramento.
7. **Registrar a caução devolvida:** valor, data, conta e referência única. É movimentação financeira demonstrativa própria, limitada ao saldo e respeitando a cronologia. O botão não transfere dinheiro. Uma devolução posterior atualiza o saldo corrente sem reescrever o demonstrativo final.

O kanban deve consultar `guardForTransition` para qualquer saída de motorista ativo. A mudança para outra etapa não é um atalho para soltar o carro. A baixa financeira de cada obrigação segue seu próprio fluxo, com referência e conferência; a disponibilidade física não depende de apagar a dívida.

## Evidências locais

Os testes verificam idempotência, carro indisponível antes da conferência, motorista/carro/ciclo incorretos, reservas e trânsito, acerto de vendas manuais, preservação de caixa/resultado/patrimônio, produtos avariados sem débito automático, caução com data e saldo e integração com a última cobrança contratual. O exemplo mantém R$1.050 a receber, R$57 de crédito e R$1.500 de caução separados. Uma semana de R$1.050 paga e proporcionalizada para R$450 gera R$600 de obrigação a devolver, sem saída de caixa automática.
