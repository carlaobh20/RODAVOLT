# Simulador empresarial v2 · crescimento, comparação e revisão

**17/10/2026.** Substitui o modelo de frota fixa da v1. Implementação em `src/growth.js`; realizados demonstrativos em `src/control.js`. Todos os padrões numéricos são exemplos editáveis, sem cotações, regime tributário confirmado ou recomendação de compra.

## 1. O que veio do legado

Foram lidos o motor `src/features/estrategia/intelligence/simulacaoEmpresarial.ts`, tipos, fluxo detalhado e timeline na cópia local `RODAVOLT - SYSTEM`. A pasta inicialmente enviada em Downloads deixou de estar disponível; a cópia local foi a referência da leitura aprofundada. Seu papel é referência de domínio, sem migração de banco.

Preservados conceitualmente: capital inicial, aquisição à vista/financiada, acompanhamento por veículo, meta e horizonte, reinvestimento, reserva de segurança, rendimento do caixa, custo da empresa, amortização extraordinária, fluxo, dívida e patrimônio. Reimplementados com testes independentes. Não é cópia certificada do motor antigo nem equivalência numérica exata.

Diferenças deliberadas: mês zero sem operação; novos carros operam no mês seguinte; calendário civil real; principal separado de despesa; retiradas explícitas; reserva aplicada a todas as estratégias de amortização; patrimônio com caixa e estoque; custos de aquisição reconhecidos; alíquotas de faturamento e resultado separadas; observado, estimado e projetado identificados.

## 2. Ordem dos acontecimentos

1. No mês zero, receber capital próprio, pagar abertura e adquirir a frota inicial que caiba sem quebrar a reserva. Não gerar receita ou parcela de operação no mês zero.
2. No mês civil, identificar os veículos já em operação e aplicar aportes explícitos e rendimento sobre caixa positivo de abertura.
3. Projetar aluguel proporcional, perda definitiva, loja, custos por km e fixos, tributos, depreciação e parcelas de cada dívida.
4. Registrar uma retirada opcional, limitada ao caixa livre positivo e à reserva.
5. Usar a prioridade escolhida: comprar primeiro ou amortizar primeiro. Ambas respeitam caixa, reserva e limites configurados.
6. Reconhecer preparação/tarifas da aquisição no resultado e liberar eventual diferença da provisão tributária. A liberação final não dispara uma rodada adicional de compras no mesmo mês.
7. Guardar caixa, frota, dívida, valor gerencial dos ativos, estoque, patrimônio e snapshot para continuidade.

O motor não inventa crédito ou aporte para cobrir déficit. A operação pode consumir a reserva e ficar negativa; compras e amortizações discricionárias não podem quebrar o piso.

## 3. Entradas disponíveis

Capital inicial; abertura; frota inicial/meta; preço, forma de compra, entrada, juros mensais, prazo, tarifas à vista, preparação e estoque inicial; horizonte de até 120 meses; reserva fixa e por carro; limite de compras por mês; aportes mensais e em mês escolhido; retirada percentual do caixa livre; reinvestimento; rendimento anual; preço semanal, ocupação dos dias disponíveis, dias parados, perda definitiva, km/dia; manutenção e pneus/km; seguro, IPVA, licenciamento, rastreador, limpeza, outros; administração e equipe adicional por escala; inflação de custos e reajuste de aluguel; depreciação mensal; vendas diárias, custo, comissão, taxas e perdas da loja; tributos estimados.

Amortização extra: desligada, mensal, semestral, mês escolhido ou sobra após a meta. Prioridade: crescer ou amortizar. Financiamentos são Price com parcela mantida após amortização; a antecipação reduz prazo/juros, sem recálculo de uma nova parcela contratual. Cada dívida guarda sua taxa, inclusive ao reestimar o futuro com novas condições para novos carros.

## 4. Definições matemáticas

```text
dias_alugados/carro = (dias_civis − dias_parados) × ocupação
aluguel_faturado = carros_operando × dias_alugados × aluguel_semanal / 7
aluguel_recebido = aluguel_faturado × (1 − perda_definitiva)
km = carros_operando × dias_alugados × km_dia
margem_loja = venda_bruta − mercadoria − comissão − taxas − perdas
custos = fixos_por_carro + empresa + equipe_por_escala + manutenção/km + pneus/km
parcela = juros + principal_amortizado
resultado = recebido + margem_loja + rendimento − custos − tributos − juros − depreciação − despesas_aquisição

caixa_final = abertura + aportes + rendimento + caixa_operacional
              − parcelas − retiradas − capital_das_compras − amortização_extra
reserva = reserva_fixa + reserva_por_carro × carros_ao_final
caixa_acima_da_reserva = caixa_final − reserva
patrimônio_estimado = caixa + valor_gerencial_carros + estoque_estimado − dívida
```

IPVA e licenciamento são rateados por 12 para a comparação; manutenção/pneus são custos esperados. O modelo não é agenda de pagamentos bancários. Aluguel proporcional por dia não substitui regras do contrato real sobre cobrança semanal e proporcionalidade. A taxa anual do rendimento é convertida de modo composto. Caixa negativo não recebe nem paga o rendimento positivo escolhido.

Depreciação composta mensal estima valor gerencial. Não é laudo de mercado, valor fiscal nem avaliação da empresa. Estoque é mantido no nível de capital inicial por carro no cenário. O patrimônio não inclui passivos operacionais, cauções ou contas a receber ainda não modelados. Tributos usam bases simplificadas configuráveis, sem enquadramento automático. A receita de loja é bruta para a alíquota de faturamento; comissão não reduz essa base. Juros/tarifas informados não são CET calculado.

O resultado reconhece custos não recuperáveis da aquisição; a saída da preparação já está no capital usado para comprar e não é deduzida duas vezes do caixa. A identidade patrimônio + retiradas − capital aportado = resultado acumulado é testada no cenário normalizado.

## 5. Fluxo e análises

Projeção de frota, caixa/dívida e patrimônio/capital; marcos de aquisição; metas atingidas ou não; tabela de fluxo por mês; visão por ano civil e memória de cálculo do mês. Fluxos anuais são somados; saldos anuais são o último mês. Compras no fim do mês e carros operando são colunas distintas.

Estratégias demonstradas: manter frota, reinvestir, amortizar R$ 1 mil/mês antes de crescer e estressar ocupação/paradas/perdas. Sem probabilidade atribuída. Cenários não constituem recomendação automática.

## 6. Plano original, realizado e revisão

`freezePlan` copia premissas e resultados para uma versão independente. Editar o rascunho ou registrar uma despesa não modifica essa versão. O protótipo permite versões e escolha da referência na auditoria; a aplicação real exigirá histórico imutável no servidor, autor, fonte e aprovação.

`control.js` contém um livro de registros fictícios entre novembro de 2026 e janeiro de 2027. A data é uma janela ilustrativa futura em relação ao planejamento de outubro de 2026. Não representa uma operação já existente. Cada lançamento tem identificador, categoria, centro e origem. Um novo registro atualiza os saldos e desvios. O exemplo de aquisição cria ativo, dívida, entrada/estoque e preparação; parcelas ou novos aluguéis não são inventados como realizados.

Comparação usa período e definição iguais. Valor ausente fica nulo; percentual contra plano zero fica “não aplicável”. A cor não classifica automaticamente o desvio como bom ou ruim. A base de avaliação gerencial dos ativos observados fica independente da premissa de outro plano comparado.

A revisão recebe o snapshot do fechamento escolhido: caixa, carros/idade, saldo e condições das dívidas, capital e retiradas. O primeiro mês revisado é o seguinte ao fechamento. A curva original permanece. Para produção, o fechamento também deve carregar recebíveis/pagáveis, obrigações, estoque real e comprovação da conciliação; o protótipo ainda não cobre essa agenda integral.

## 7. Limites e evolução

O protótipo não implementa sazonalidade, atraso com recuperação futura, sinistro em data escolhida, venda/renovação de carro, SAC, impostos brasileiros efetivos, calendário real de tributos, impostos de alienação, receita de financiamento ou VPL completo da frota dinâmica. Não reapresenta o VPL da antiga frota fixa como equivalente à estratégia de crescimento.

Antes de apoiar uma compra real: cotações de carros, histórico/inspeção, seguro para a atividade, proposta de crédito/CET, contador, preço de locação local, capacidade operacional e reserva do proprietário. Para pilotar: fechar uma semana e comparar com o plano; depois revisar hipóteses em 30/60/90 dias sem apagar versões anteriores.

## 8. Verificações

Testes cobrem mês zero, calendário, início da operação, caixa e patrimônio, aquisição bloqueada, reserva em todas as estratégias, reinvestimento/desligamento, Price, juros/principal, amortização, aportes, retiradas, equipe por escala, imutabilidade por cópia, dados ausentes, revisão por snapshot, taxa contratada preservada, agregação anual, lançamento observado, aquisição e estoque/comissão. Não certificam a viabilidade econômica de um investimento real.
