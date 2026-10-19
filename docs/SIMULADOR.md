# Simulador v3 · fluxo contínuo

O desenho recupera a ordem de leitura da referência antiga. `src/growth.js` mantém o motor por carro; `src/planning.js` prepara relatórios e agregações, sem fórmulas duplicadas nas telas. `prototype/simulator.js` apresenta os dados em uma página.

Para Maringá/PR, a tela apresenta referências datadas para frota 100% elétrica. Um comando explícito aplica somente a média das revisões programadas do BYD Dolphin Mini ao rascunho; preço do carro, IPVA, consumo, recarga e demais premissas seguem como hipóteses até cotação. O motorista paga as recargas no piloto, e o simulador separa seu custo do caixa da locadora. A [ficha de calibração](CALIBRACAO-MARINGA.md) reúne fontes, limites e dados necessários para decidir. O quadro de sensibilidade recalcula cinco cenários com o mesmo motor e busca o aluguel semanal que zera o fluxo do primeiro mês após custos e parcela; esse ponto de equilíbrio não representa payback nem preço de mercado.

## Cálculo

Mês zero: capital menos abertura, compra/preparação/kit. Não há receita ou parcela operacional nesse mês. Capital insuficiente bloqueia a aquisição, respeitando reserva fixa e por carro.

Aluguel: dias do calendário menos parada, vezes ocupação, valor semanal / 7; perda esperada reduz recebido. Loja: venda por dia alugado com custo, comissão, taxas e perda parametrizados. Custos por carro incluem manutenção mensal simples, manutenção adicional por km e pneus/km, além de seguro, IPVA/licenciamento provisionados, rastreador, limpeza e outros. Empresa tem administração e equipe adicional por escala.

Financiamento Price por veículo: juros sobre saldo, principal programado e parcela separados; extra respeita caixa e dívida. Compra adicional ocorre no fechamento, faturando no mês seguinte. Aporte é capital externo explícito; retirada é fluxo ao proprietário. Reserva faz parte do caixa e não é despesa. Rendimento usa saldo inicial positivo do mês.

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
