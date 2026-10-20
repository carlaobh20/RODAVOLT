# Simulador · conta mensal e crescimento da frota

O desenho recupera a ordem de leitura da referência antiga. `src/growth.js` mantém o motor por carro; `src/planning.js` prepara relatórios e agregações, sem fórmulas duplicadas nas telas. `prototype/simulator.js` apresenta os dados em uma página.

## Leitura simples do primeiro mês

O aluguel pode ser informado por semana ou por mês. O motor permanece semanal, conforme o contrato: um valor mensal informado é convertido por `12/52`, e a tela mostra a equivalência antes de projetar. O mês efetivo ainda considera seus dias, paradas, ocupação e perda de recebimento. Assim, R$ 1.500,00 por mês não é tratado como R$ 1.500,00 por semana.

Antes dos gráficos, a tela mostra quanto entrou, quanto foi perdido ou pago, a parcela, o saldo do primeiro mês e o aluguel aproximado que equilibraria a operação sob as mesmas hipóteses. Cada custo ativo aparece com seu valor, incluindo loja e benefício do motorista, seguro, tributos, manutenção, pneus, administração e juros/principal. Compra inicial, preparação, estoque e reserva aparecem separados: reserva não é despesa, e entrada não é custo mensal recorrente. O detalhamento usa `P.monthlyExplanation`, que reconcilia os itens ao `cashAfterDebt` do mesmo motor.

A grade antiga de dezenas de premissas avançadas saiu da página. Um comando permite ajustar uma premissa adicional de cada vez, inclusive zerar custos opcionais. Valores já salvos não são apagados nem desligados silenciosamente: continuam na conta e no detalhamento. Fluxos, gráficos, sensibilidade e estudos especializados ficam na seção expansível “Ver fluxo completo, gráficos e projeções”.

Para Maringá/PR, a tela apresenta referências datadas para frota 100% elétrica. Um comando explícito aplica somente a média das revisões programadas do BYD Dolphin Mini ao rascunho; preço do carro, IPVA, consumo, recarga e demais premissas seguem como hipóteses até cotação. O motorista paga as recargas no piloto, e o simulador separa seu custo do caixa da locadora. A [ficha de calibração](CALIBRACAO-MARINGA.md) reúne fontes, limites e dados necessários para decidir. O quadro de sensibilidade recalcula cinco cenários com o mesmo motor e busca o aluguel semanal que zera o fluxo do primeiro mês após custos e parcela; esse ponto de equilíbrio não representa payback nem preço de mercado.

## Cálculo

Mês zero: capital menos abertura, compra/preparação/kit. Não há receita ou parcela operacional nesse mês. Capital insuficiente bloqueia a aquisição, respeitando reserva fixa e por carro.

Aluguel: dias do calendário menos parada, vezes ocupação, valor semanal / 7; perda esperada reduz recebido. Loja: venda por dia alugado com custo, comissão, taxas e perda parametrizados. Custos por carro incluem manutenção mensal simples, manutenção adicional por km e pneus/km, além de seguro, IPVA/licenciamento provisionados, rastreador, limpeza e outros. Empresa tem administração e equipe adicional por escala.

Financiamento Price por veículo: juros sobre saldo, principal programado e parcela separados; extra respeita caixa e dívida. Compra adicional ocorre no fechamento, faturando no mês seguinte. Aporte é capital externo explícito; retirada é fluxo ao proprietário. Reserva faz parte do caixa e não é despesa. Rendimento usa saldo inicial positivo do mês.

## Comprar outro carro quando o caixa chegar a X

A regra é opcional e fica desligada no rascunho inicial. O usuário define o saldo de caixa que dispara a compra, a meta de frota, o limite de compras por mês e a forma de adquirir os **próximos** carros. Pode repetir as condições do primeiro carro, pagar à vista ou financiar com entrada, juros e prazo próprios. O preço futuro pode ser diferente; zero no campo de preço adicional mantém o preço do primeiro carro. Preparação, tarifas aplicáveis e kit seguem as premissas gerais.

No fechamento de cada mês, após a operação e eventuais retiradas ou amortizações prioritárias, cada compra exige **ambas** as condições: caixa antes da compra maior ou igual ao gatilho escolhido e caixa após desembolso suficiente para a reserva fixa, reserva por carro e obrigações. O teste é repetido para cada carro do mês. Um gatilho de zero significa comprar assim que a entrada ou preço à vista mais a reserva couber; não autoriza gastar caução ou crédito do motorista. A meta de frota e o limite mensal também bloqueiam compras adicionais.

O resultado mostra custo em caixa, entrada ou preço à vista, dívida nova, parcela nova, mês da primeira compra e histórico de compras simuladas. Carro comprado no fechamento só fatura no mês seguinte. Contratos de financiamento dos carros existentes preservam suas condições quando o usuário altera as premissas dos próximos. O modelo **não** executa compra ou crédito real e não promete financiamento aprovado.

Resultado: receita recebida e margem da loja menos operação, juros, depreciação e tributos estimados. Principal não reduz lucro. Preparação/tarifas são reconhecidas como despesas na aquisição e já integram o desembolso; não são pagas duas vezes.

## Tabela antes dos gráficos

Hoje → fluxo por ano civil (padrão) ou mês a mês. Colunas: período, frota, entradas, despesas, parcela, amortização programada, extra e total, saldo da dívida, juros da dívida, juros do caixa, IR estimado, lucro, aportes, compras, retiradas, caixa final e carros comprados.

Entradas = aluguel recebido + vendas brutas. Despesas = operação + custo de mercadoria + comissão + taxa + perda de mercadoria + tributo sobre faturamento. IR estimado sobre resultado fica separado. Todo fluxo anual soma movimentos; caixa, dívida, frota e patrimônio carregam o último fechamento. Anos parciais informam número de meses. CSV preserva todas as colunas e neutraliza textos que poderiam iniciar fórmulas de planilha.

Memória de cada mês fecha:

`caixa final = abertura + aportes + rendimento + recebido + vendas - custos da loja - operação - tributos - parcelas - compras - extra - retiradas`

## Retorno e dinheiro do bolso

Recuperação econômica = lucro acumulado positivo limitado ao capital aportado. É a interpretação econômica do cartão antigo, agora explicitamente nomeada. Saques efetivos são a soma de retiradas e aparecem separados. Payback econômico e devolução de caixa não são intercambiáveis.

ROI acumulado = lucro acumulado / capital aportado. Primeiro mês e final do horizonte são identificados. Patrimônio = caixa + carros estimados + kit estimado - dívida; não é avaliação de mercado da empresa.

## Comparação e renovação

Manter, amortizar e comprar compartilham o mesmo ponto de partida. Comprar agora/3/6 meses isola uma compra adicional, com o mesmo fim em 24 meses. O estudo de renovação adapta o motor antigo: Price/SAC matemático, custo/venda/DSCR e horizonte comum. Esse estudo especializado não inclui loja, tributos e depreciação; a diferença é indicada antes dos resultados.

## Limites

Determinístico e normalizado. Não modela regime fiscal completo, vencimento diário de obrigações, provisões contábeis de produção, sinistro probabilístico, cotação de mercado ou crédito concedido. Nenhuma simulação realiza compra. Padrões são hipóteses ilustrativas.

## Estoque inicial e reposição

As premissas incluem kit por carro e estoque central. Ambos consomem capital no início e entram no patrimônio como estoque, sem reduzir lucro nessa compra inicial. No cenário demonstrativo, o kit custa R$ 292 e a central R$ 1.374. A projeção considera reposição mensal das mercadorias vendidas para manter o giro; o acerto no realizado baixa o CMV sem descontar o custo duas vezes do caixa. Valores são hipóteses editáveis, não cotações.

## Piloto e obrigações

Novo rascunho: um carro, sem reinvestimento automático e 100% da margem da loja ao motorista. A base antiga de comissão bruta continua disponível somente como comparação de cenário. Na projeção, a margem considera mercadoria, taxas, perdas e tributo de faturamento da loja antes do benefício; isso evita projetar a margem como lucro da locadora.

Ao reestimar pelo fechamento, cauções e créditos do motorista permanecem no passivo. Não aumentam patrimônio, capital próprio ou dinheiro disponível para compra/amortização/retirada. A identidade é patrimônio + retiradas − capital = resultado acumulado. Rendimento do caixa usa apenas a parcela sem essas obrigações. O período de avaliação real e os critérios comerciais para expandir serão definidos com os dados do primeiro carro.
