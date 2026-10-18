# Simulador · especificação financeira

**Versão:** 0.1 · **Data:** 17/10/2026. Todos os valores iniciais do protótipo são hipóteses editáveis. Não são cotações, alíquotas confirmadas, oferta de aluguel nem recomendação de compra.

## 1. O que decidir

- Quanto capital próprio precisa sair antes de o carro rodar?
- O aluguel cobre custos, perda de recebimento, dívida e desgaste do ativo?
- Quanto uma parada, um sinistro, a inadimplência ou a queda das vendas muda o resultado?
- Quanto sobra com e sem a lojinha?
- Qual a diferença entre comprar à vista e financiar, considerando o mesmo horizonte?
- O que muda quando um segundo carro dilui o custo administrativo?
- Ao vender o carro e quitar a dívida, quanto capital foi recuperado?

A compra permanece decisão humana. Caixa positivo não significa retorno econômico suficiente. Mostrar origem de cada premissa, data, confiança documental (cotado/estimado/realizado) e versão do cálculo, sem gerar nota subjetiva de risco.

## 2. Entradas do modelo proposto

| Grupo | Entradas |
|---|---|
| Aquisição | Preço, inspeção pré-compra, transferência, preparação, acessórios, tarifas, forma de pagamento, entrada, financiamento, taxa, prazo, seguros e encargos contratados |
| Operação | Início, dia de vencimento, aluguel semanal, dias disponíveis, ocupação dos dias disponíveis, paradas, km por dia alugado, km incluídos/excedente e reajuste |
| Veículo | Seguro para uso real, IPVA/tributos locais, licenciamento, rastreador, manutenção por km, pneus por km, limpeza, estacionamento, guincho e franquia/provisão de sinistro |
| Empresa | Contabilidade, software, banco, equipe/tempo do proprietário, aluguel de espaço, outros fixos, aportes e retiradas |
| Recebimento | Atraso temporário, prazo de recuperação, perda definitiva, tarifas e diferenças entre faturamento e recebimento |
| Lojinha | Venda bruta diária, custo mercadoria, preço, comissão e sua base, taxas, perdas, estoque inicial, capital de giro, prazo de fornecedores e repasse |
| Saída | Horizonte, valor de revenda estimado, despesas de venda, saldo da dívida, estoque recuperável, reserva liberada e taxa de desconto |
| Tributação | Regime validado pelo contador, bases diferentes para locação e comércio, tributos sobre receita/resultado/alienação conforme aplicáveis |

Responsável por combustível/recarga deve ser explícito. No exemplo, é o motorista. Franquia de seguro, custo de um evento e período de parada não devem ser substituídos por um percentual genérico sem explicação. Na evolução operacional, custos de peças, pneus e sinistros são estimativas separadas de reservas de caixa.

## 3. O motor que já existe no protótipo

Código: `src/simulator.js`. Projeção determinística, frota fixa adquirida no mês zero, início em novembro de 2026, meses civis reais e premissas constantes. Não simula crescimento automático ou compra de novos veículos. Dinheiro calculado em ponto flutuante para desenho; produção exigirá decimal/centavos e política de arredondamento.

As fórmulas abaixo são as implementadas. `N` é quantidade de carros, `D` é dias do mês, `S` é parada por carro/mês, `O` é ocupação percentual dos dias disponíveis, `L` é preço semanal, `P` é perda definitiva percentual.

```text
dias_alugados_por_carro = max(0, D − S) × O / 100
aluguel_faturado = (L / 7) × dias_alugados_por_carro × N
aluguel_recebido = aluguel_faturado × (1 − P / 100)
km = dias_alugados_por_carro × km_por_dia × N
manutencao = km × custo_manutencao_por_km
pneus = km × custo_pneus_por_km

fixos = N × (seguro_mensal + IPVA_anual/12 + licenciamento_anual/12
             + rastreador_mensal + outros_por_carro) + administracao_empresa

vendas_loja = dias_alugados_por_carro × vendas_por_dia × N
margem_loja_antes_tributos = vendas_loja − mercadoria − comissao − taxas − perdas
tributos_estimados = (aluguel_faturado + vendas_loja) × aliquota / 100

caixa_operacional = aluguel_recebido + margem_loja_antes_tributos
                    − fixos − manutencao − pneus − tributos_estimados
caixa_livre = caixa_operacional − parcela_financiamento
resultado_estimado = caixa_operacional − juros_financiamento − depreciacao
```

O exemplo usa uma alíquota única sobre faturamento bruto e reconhece perda definitiva de aluguel imediatamente. Isso permite ver a diferença entre faturado e recebido, mas **não implementa o regime fiscal brasileiro nem contas a receber por atraso**. Separar essas dimensões é requisito da versão operacional. Os custos anuais são rateados e manutenção/pneus tratados como gasto esperado mensal; o gráfico é uma projeção normalizada, não extrato bancário com vencimentos.

Não usar `semana × 4` para converter receita mensal. No protótipo, `semanal / 7 × dias` é uma aproximação econômica proporcional. O contrato real pode cobrar por períodos semanais inteiros e regras específicas de entrada/devolução. A versão operacional gera agenda de cobranças no calendário, respeitando essas regras, e não copia esta aproximação como faturamento.

### Aquisição e dívida

```text
principal = N × preco × (1 − entrada_percentual/100), se financiado
capital_proprio_inicial = N × preco − principal
                         + N × (preparacao + reserva + estoque_inicial)
                         + tarifas_pagas_a_vista

parcela_Price = principal × i / [1 − (1+i)^(-prazo)]
se i = 0: parcela = principal / prazo
juros_mes = saldo_devedor_anterior × i
amortizacao_mes = parcela_mes − juros_mes
saldo_devedor = saldo_devedor_anterior − amortizacao_mes
```

As tarifas informadas são pagas à vista e não são somadas novamente ao principal. A última parcela é limitada ao saldo com juros e as parcelas cessam na quitação. Após a compra à vista, campos de taxa/entrada/prazo não afetam o cálculo.

O CET incorpora encargos além dos juros; o simulador recebe juros mensais e tarifas separadamente e **não calcula nem valida o CET bancário**. Preencher conforme proposta documentada e verificar outros custos. Referência: [Banco Central, educação financeira](https://liftchallenge.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf).

### Depreciação e saída

```text
depreciacao_mensal = N × preco × (1 − residual_percentual/100) / horizonte
saida_terminal = revenda_bruta × (1 − custo_venda_percentual/100)
                 − saldo_devedor_final + reserva_inicial + estoque_inicial
saldo_final_apos_capital = − capital_proprio_inicial + soma(caixa_livre) + saida_terminal
ROI_total = saldo_final_apos_capital / capital_proprio_inicial × 100
taxa_desconto_mensal = (1 + taxa_desconto_anual)^(1/12) − 1
VPL = − capital_proprio_inicial
      + soma(caixa_livre_mes / (1 + taxa_desconto_mensal)^mes)
      + saida_terminal / (1 + taxa_desconto_mensal)^horizonte
```

Residual é uma premissa de preço ao final do horizonte. Alterar o horizonte sem rever o residual não mantém uma curva de desvalorização constante. A depreciação aqui é gerencial e linear, sem equivalência presumida com depreciação fiscal. Revenda não inclui imposto sobre ganho de capital; reserva e estoque inicial são recuperados integralmente por hipótese. Não há receitas de rendimento financeiro.

O payback mostrado ocorre no primeiro mês em que o caixa operacional livre acumulado recupera o capital inicial, **sem revenda nem liberação da reserva**. Se não ocorrer dentro do horizonte, mostrar “não alcançado”, nunca extrapolar automaticamente. O aluguel de equilíbrio resolve caixa livre zero no primeiro mês e inclui a contribuição da loja. Se a base de receita for zero ou negativa, mostrar “não calculável”.

O campo de aporte adicional informa déficits operacionais além da reserva própria inicial. Não executa aportes nem calcula juros emergenciais. A série acumulada exibida inclui o capital inicial e não inclui venda final; VPL/ROI incluem a saída terminal identificada.

## 4. Cenários disponíveis

| Premissa | Base | Estresse | Otimista |
|---|---:|---:|---:|
| Ocupação dos dias disponíveis | 92% | 78% | 97% |
| Parada por carro/mês | 2 dias | 6 dias | 1 dia |
| Perda definitiva do aluguel | 3% | 8% | 1% |

Nenhum cenário tem probabilidade atribuída. Preço semanal, preço do carro e outros custos são mantidos. O usuário deve substituir as hipóteses por evidências da operação local. Lojinha pode ser desativada colocando vendas/dia em zero; se também não houver kit, zerar estoque inicial.

Exemplo padrão: carro de R$ 75 mil à vista, aluguel de R$ 750/semana, 36 meses, reserva de R$ 6 mil, custos e loja parametrizados. O motor retorna aproximadamente **R$ 916 de caixa livre médio/mês**, **R$ 186 de resultado estimado/mês** e **VPL de −R$ 16,9 mil** a 12% a.a. Esses números servem para demonstrar a separação de conceitos; não avaliam um veículo cotado pelo usuário.

## 5. Evolução necessária antes de apoiar a compra real

1. Cadastrar pelo menos três alternativas reais; anexar cotação, data, km, histórico, seguro para o uso pretendido e inspeção.
2. Deixar cada custo com responsável e base. Comparar cenário sem loja; o negócio principal não deve depender de vendas ainda não verificadas.
3. Separar reserva de manutenção, despesa esperada e pagamento real. Modelo de caixa por vencimento com IPVA/seguro em datas concretas.
4. Atrasos de 7/15/30 dias com recuperação posterior e perdas definitivas separadas. Fluxo semanal de 13 semanas para o capital de giro.
5. Simular evento de sinistro em um mês escolhido: franquia, guincho, reparo, dias parados e cobertura confirmada, sem duplicar custos já lançados.
6. Separar tributação de locação, comércio e alienação conforme orientação do contador. Possibilidade de impostos fixos e cumulativos sem mascarar a base.
7. Financiamentos com cronograma real, seguros/encargos embutidos, SAC ou outra estrutura quando aplicável. Amortização extraordinária somente depois de validação do modelo básico.
8. Margem por SKU, comissão por regra, prazos de fornecedor e repasse; giro de estoque e perdas por validade.
9. Sensibilidade preço semanal × ocupação, custos/km e preço de revenda; cenário sem motorista por 30 dias. Limites de capital e reserva definidos pelo proprietário.
10. Salvar versão, fonte das premissas e resultados; comparar planejado × realizado após 30/60/90 dias, sem alterar retroativamente o cenário aprovado.

## 6. Verificação

Testes automatizados cobrem calendário comum/bissexto, perdas, margens/tributos, administração não multiplicada, investimento inicial, dívida Price com/sem juros, quitação, resultado versus principal, revenda e dívida final, payback, desconto composto, equilíbrio e limites de entrada. São verificações matemáticas do modelo simplificado; não substituem cotações, exame do carro, validação jurídica ou contábil.
