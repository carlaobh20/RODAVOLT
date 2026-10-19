# Calibração do primeiro carro · Maringá/PR

Pesquisa em 18/10/2026. Esta ficha transforma referências públicas em entradas rastreáveis do simulador. **O modelo do carro ainda não foi escolhido**; o HB20 abaixo é somente uma comparação. Nenhum preço público substitui cotação, apólice, contrato de crédito ou orientação do contador.

| Campo | Referência encontrada | Uso no simulador | Situação |
|---|---|---|---|
| Preço do carro | Hyundai HB20 Comfort 1.0 MT 2026/27: preço público sugerido a partir de R$ 96.140 | Botão opcional preenche `price=96140` | Referência de outro carro possível, não proposta aceita |
| Oferta promocional | Hyundai anuncia R$ 83.641,80 para canais CNPJ/MEI elegíveis, até 04/11/2026 ou fim do estoque | **Não** aplicada automaticamente | Elegibilidade, disponibilidade e custo final não confirmados |
| IPVA | Fazenda do Paraná: 1,9% do valor venal para automóveis no exercício de 2026 | Botão opcional preenche R$ 1.826,66/ano (= 1,9% de R$ 96.140) apenas como aproximação | Base venal real e regra/guia de 2027 por conferir; não é guia de pagamento |
| Aluguel semanal concorrente | Zarp tem página para Maringá, com grupos, quilometragem e descontos promocionais | Link para pesquisa; `weekly` permanece editável | Comparar proposta equivalente, inclusive manutenção, proteção, franquia, carro reserva e limites de km |
| Financiamento | A página do fabricante tem ofertas com estrutura e condições específicas | `monthlyRate`, prazo, entrada e tarifas permanecem hipóteses | Cotar CET e cronograma real; o motor principal usa Price, sem parcela balão |
| Seguro, manutenção, rastreador, licenciamento, tributos da empresa, kit e demanda | Sem orçamento ou regra validada para o negócio | Permanecem hipóteses demonstrativas | Pedir cotações e aprovação profissional antes de usar para investir |

Fontes primárias consultadas:

- [Hyundai · HB20, versões e ofertas](https://www.hyundai.com.br/veiculos/novo-hyundai-hb20.html). A página informa preço de entrada de R$ 96.140 e descreve condições e prazo da oferta para CNPJ/MEI. Registrar uma proposta nominal antes de substituir a referência.
- [Secretaria da Fazenda do Paraná · IPVA 2026](https://www.fazenda.pr.gov.br/Noticia/Com-aliquota-de-19-e-desconto-vista-Fazenda-divulga-datas-do-IPVA-2026). Alíquota de 1,9% do valor venal, sem assumir que preço de compra e base de cálculo coincidam.
- [Localiza Zarp · agência Maringá](https://zarp.localiza.com/ofertas/aluguel-de-carros-para-uber-maringa). Ofertas mudam por data, modelo, km, promoções e disponibilidade. Não importar preço de anúncio como receita contratada da RODAVOLT.

## Como usar para uma decisão

1. Comece no simulador com uma **cópia do cenário**. O botão “Aplicar só preço e IPVA estimado” altera apenas esses dois campos do rascunho, sem mudar o plano de referência ou o livro realizado.
2. Substitua preço/versão pela proposta do carro efetivo; lance entrada, CET, parcelas/tarifas da proposta, seguro para a finalidade de locação e aplicativos, km/semana e manutenção esperada. O simulador não reproduz crédito com parcela balão: nesses casos, não use a parcela Price como se fosse a proposta.
3. Defina uma oferta semanal comparável ao mercado local e testável com candidatos. Insira capital que estará de fato disponível; caução do motorista e créditos da loja são passivos, não capital livre.
4. Compare o primeiro mês, a menor folga sobre a reserva, o caixa e o patrimônio em cinco choques isolados. O “aluguel semanal de equilíbrio” zera o **fluxo do primeiro mês após custos e parcela**; não recupera investimento, cobre risco ou valida o preço de mercado.
5. Congele um plano somente após conferir fontes, datas e orçamento. Depois do primeiro ciclo real, concilie extrato, cobrança, despesas, estoque e saldo, e use “Planejado × realizado” para investigar desvios antes de expansão.

Com a referência de R$ 96.140 e IPVA indicativo de R$ 1.826,66, mas **mantendo todas as demais hipóteses demonstrativas** (capital R$ 90 mil, aluguel R$ 1.050/semana, juros 1,4% ao mês e seguro R$ 350/mês), o motor calculou em 18/10/2026: R$ 398,07 após custos e parcela no primeiro mês; aluguel de equilíbrio de R$ 931,13/semana; e **−R$ 419,67** nesse primeiro fluxo se a ocupação cair para 70%. São resultados condicionais, não retorno prometido nem recomendação de compra. Em particular, o benefício integral da margem da loja ao motorista faz “loja sem vendas” não melhorar o caixa da locadora nessa configuração.

## Evidência necessária antes de usar dados reais

- Proposta assinável do veículo (modelo, ano, versão, preço e impostos); documento do carro quando adquirido.
- Proposta de crédito com CET, entrada, todas as parcelas, tarifas e eventual residual; simular à vista também.
- Apólice/cotação com uso para locação e motorista de aplicativo, franquia, assistência e limites.
- Três preços semanais comparáveis em Maringá com quilometragem, proteções e benefícios discriminados; validar aceitação por motoristas.
- Orçamento de revisão/pneus, licença/IPVA efetivos, rastreador e custos administrativos; contador valida tributos da locação e da loja.
- Lista de SKUs, custo, preço, fornecedor, quantidade e perda do combo piloto; sem tratar venda projetada como venda garantida.

## Teste de ponta a ponta

O ambiente protegido `4174/operacao` permite ensaiar com contas e documentos **fictícios**: interessado → avaliação → contrato → caução → vistoria → entrega → aluguel semanal vencido → pedido da loja → confirmação manual → crédito/abatimento → extrato/conciliação → manutenção/ocorrência → devolução e acerto → planejado × realizado. Dois acessos simultâneos devem provocar aviso de revisão, sem sobrescrever; reenvio de pagamento não pode duplicar caixa. Execute `npm run check` e confira o percurso em navegador isolado. Isso testa a integração **interna** entre módulos, não banco/Pix/assinatura/telemetria ou uso entre celulares reais.

Para o piloto efetivo, registrar um ciclo completo em infraestrutura preparada para produção, fornecedores em sandbox e depois transações pequenas, dados reais protegidos, assinatura válida e revisão do advogado/contador. Só após conciliar banco, estoque e fechamento sem divergência a simulação pode ser calibrada com realizados confiáveis.
