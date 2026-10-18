# Centro de Estratégia integrado

Revisão de 17/10/2026 solicitada pelo proprietário: integrar todas as áreas do centro antigo no aplicativo novo e remover o cartão “Minha operação / Brasil”. A operação é exclusivamente brasileira, em BRL, com locação semanal. Não há escolha de país ou de operação.

## Paridade de produto

A referência lida é `RODAVOLT - SYSTEM/src/features/estrategia`, fornecida pelo proprietário. A pasta antiga foi apenas consultada. As instruções históricas dentro dela não substituem o pedido atual. Não foi acessado seu banco.

| Área antiga e fontes | Entrega no aplicativo novo |
|---|---|
| `CentroDeEstrategiaPage.tsx` | Um Centro de Estratégia com as cinco áreas originais, acessível na navegação principal |
| `SimulacaoEmpresarial`, `PainelDePremissas`, `FormaAquisicaoCard`, `AquisicaoInicialAlerta` | Central de decisão com aquisição à vista/financiada, capacidade inicial viável, capital, reserva, custos, financiamento, rendimento, loja, tributos, aportes, retirada e horizonte |
| `VisaoExecutivaCard`, `DinheiroDoBolsoCard` | Capital aportado, lucro acumulado, ROI, retiradas, capital ainda não devolvido e payback por retiradas. Lucro retido e devolução de dinheiro ficam separados |
| `AmortizacaoCard` e comparação amortizar/comprar | Estratégias de amortização mensal, semestral, evento único e após meta; comparação entre manter, amortizar e comprar com mesmas premissas/horizonte |
| `MargemDeSegurancaCard`, `margemDeSeguranca.ts` | Equilíbrio de ocupação e aluguel, folga equivalente em dias, reserva e primeiro déficit. Equilíbrio resolvido no motor completo novo, sem duplicar a fórmula antiga simplificada |
| `MomentoIdealDeCompraCard`, `momentoDeCompra.ts` | Uma compra adicional agora, em 3 ou em 6 meses, horizonte comum de 24 meses, com estoque, preparação e reserva |
| Fluxos e gráficos: `FluxoDetalhadoTable`, `FluxoDeCaixaChart`, `EvolucaoDoCaixaChart`, `SaldoDevedorPatrimonioChart`, `EvolucaoPatrimonioCard`, `LinhaDoTempo` | Fluxo mensal, ano civil, memória de caixa por mês, gráficos de frota, caixa/dívida e patrimônio/aportes; marcos de aquisições |
| Cenários empresariais | Cenários nomeados com cópias de premissas, carregar/excluir, comparativo; versões preservadas do plano continuam separadas dos realizados |
| `MasterPlanForm` | Missão e visão opcionais, nove frentes futuras, incluindo novas cidades brasileiras |
| `RoadmapAutomatico`, `GrowthTimeline`, respectivos motores | Próximo marco, capital adicional, resultado incremental e estágios de 1 a 1.000 carros, com tamanho da amostra e fontes demonstrativas |
| Marcos tipados do modelo antigo | Criar/editar/excluir, gatilhos de frota, caixa livre, caixa total, lucro, ROI, receita, tempo e conclusão manual; data prevista não vira realização |
| `CapitalAllocationCenter`, `capitalAllocation.ts` | Compra contabilizada, resultado dos registros, ROI, ranking, melhores/menores retornos, payback estimado, abertura dos lançamentos por veículo |
| `ExpansaoDaFrota`, `motor.ts`, `estrategias.ts` | Capacidade estática nas três estratégias, fração de capital e multiplicador de reserva visíveis, Price/SAC, próxima entrada |
| `estadoReal.ts`, `capitalReciclavel.ts` | Adaptador ao fechamento do livro novo: caixa, ativos, dívida e contratos. Candidatos explícitos à venda com preço hipotético, dívida, taxa e líquido. Venda potencial não soma ao caixa |
| `crescimentoComposto.ts`, `capacidadeDeCompra.ts` | Crescimento pelas três estratégias, com caixa ou caixa + venda recorrente, frota existente opcional, dívida individual, trava por reserva/DSCR, próximo veículo, fluxo e eventos explicados |
| `IntelligenciaDeRenovacao`, `comparadorMomentosDeVenda.ts`, `analiseDecisaoVenda.ts` | Manter versus vender em até 12 datas trimestrais, mesmo horizonte, melhor alternativa nas premissas, três gráficos, tabela e memória mensal com venda, reinvestimento e bloqueios |
| `PoliticasForm`, `types.ts` | Todos os 14 limites originais, sem valores presumidos; políticas livres adicionais, conferência do rascunho e aplicação explícita de reserva/teto financiável |

## Implementação e correções

`src/legacy/expansion.js` contém a transposição dos motores puros de amortização, estratégias, capacidade, expansão, crescimento composto, comparação e análise de venda. As anotações TypeScript foram retiradas uma vez; não há compilador ou dependência do projeto antigo no build. Os adaptadores para o livro novo e as análises empresariais ficam em `src/strategy.js`. `prototype/strategy.js` é inserido pelo build no controlador da interface, sem duplicar cálculos financeiros.

Correções deliberadas em relação ao legado:

- Mês zero não gera receita/despesa operacional. Um carro novo opera no mês seguinte à compra.
- A primeira parcela SAC, usada na trava DSCR, vem da tabela SAC.
- Venda abaixo da dívida reconhece o desembolso negativo; não zera artificialmente a diferença.
- Déficit de caixa mostra a necessidade de financiamento, sem creditar um aporte inexistente nem afirmar autofinanciamento completo.
- Dívidas do fechamento preservam juros e prestação contratados; apenas o cronograma remanescente é reconstruído.
- A compra isolada agora/3/6 usa o motor empresarial novo e a mesma política de reserva.
- Crescimento tem limite de 1.000 aquisições por execução. Cenário acima do limite gera erro explícito, sem travar a página ou truncar resultados silenciosamente.
- ROI da frota sem valor de compra completo fica sem base. Marcas temporais do plano e eventos registrados são conceitos distintos.

## Limites e diferenças de origem

A entrega integra as funcionalidades de planejamento ao **protótipo**, com persistência local e eventos demonstrativos. Não transfere os dados nem a infraestrutura de autenticação/banco do sistema antigo. Missão, políticas, cenários e marcos são salvos no mesmo estado local do aplicativo; a visualização em conversa está sujeita ao limite de armazenamento do ambiente.

A central de decisão usa o motor empresarial completo v2: dias por calendário, paradas, perdas, loja, tributos estimados, depreciação, aportes e retiradas. As análises especializadas de expansão/renovação preservam o modelo mais restrito do legado: 52/12 semanas, valor dos carros constante, sem loja/depreciação/tributos. Essas diferenças estão visíveis na interface. Não comparar diretamente patrimônios de modelos com escopos diferentes.

Capacidade estática mede entradas de um lote novo; o composto inclui reserva e DSCR. Na partida por fechamento, somente a fração de caixa da estratégia entra no patrimônio do cenário; o caixa que ficou fora não desapareceu da empresa. Receita futura do RV-001 usa o contrato demonstrativo; carros adicionais sem contrato cadastrado entram com receita zero. Custos futuros continuam premissas, não gastos confirmados.

Capital reciclável é estudo de candidatos, não venda registrada. Venda recorrente do composto abrange os carros projetados; não vende a frota existente. A renovação é um estudo independente de um carro hipotético e uma geração de venda/reinvestimento. O motor multiciclo do legado não alimentava a tela original e não foi exposto como funcionalidade nova.

Marketing, tecnologia e políticas livres ficam sem avaliação automática por falta de classificação correspondente no livro. Campo vazio continua não definido. Políticas são limites do proprietário, sem nota subjetiva de risco.

## Verificação

`npm run check`: testes dos motores e adaptadores, build e sintaxe das fontes. O build também verifica a sintaxe do JavaScript completo gerado, evitando que a composição de arquivos produza uma página vazia. Testes cobrem Price/SAC, trava DSCR, identidades de caixa/patrimônio, mês zero, venda abaixo da dívida, frota existente, política sem base, marcos, alocação, reserva, déficit e limites de execução.
