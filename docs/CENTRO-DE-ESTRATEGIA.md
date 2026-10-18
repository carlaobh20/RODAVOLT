# O simulador antigo na experiência nova

A interface v2 do Centro foi descartada após nova revisão do proprietário em 18/10/2026. Sua função útil passa a viver em Simulador de crescimento e Planejado × realizado, sem hub ou navegação estratégica duplicada.

Fonte lida: `RODAVOLT - SYSTEM/src/features/estrategia/components/SimulacaoEmpresarial.tsx`, `PainelDePremissas.tsx`, `FluxoDetalhadoTable.tsx` e seus componentes de caixa, patrimônio, amortização e momento de compra. A referência antiga foi apenas lida, sem editar ou conectar seu banco.

| Experiência antiga | Nova experiência |
|---|---|
| Margem de segurança antes das premissas | Ocupação/aluguel de equilíbrio, quebra de reserva e déficit no topo |
| Premissas compactas na largura toda | Seis grupos visíveis com recálculo automático, sem botão Simular |
| Manutenção mensal por carro | Campo simples recuperado, separado do custo adicional por km |
| À vista/Price, entrada em reais | Mesmas escolhas e valor financiado explicado |
| Amortização e reinvestimento | Estratégias nunca, após meta, mensal, semestral e evento único; reserva protegida |
| Visão executiva com dez indicadores | Dez indicadores com mês/horizonte/base explicitados |
| Dinheiro do bolso | Recuperação econômica pelo lucro e retiradas efetivas separadas |
| Hoje + tabela anual/mensal antes dos gráficos | Todas as colunas antigas, mais frota/aportes/compras/retiradas |
| Gráficos de fluxo/dívida/caixa/patrimônio | Mesmos assuntos com valores exatos disponíveis no fluxo |
| Comprar agora/esperar3/6 | Compra isolada no mesmo horizonte de comparação |
| Linha do tempo de todos os meses | Cartões mensais com entrada, pagamentos, lucro, caixa, frota e memória |
| Cenários preservados | Cópias nomeadas, carregar rascunho, referência explícita e CSV |
| Estudo de venda/renovação | Análise especializada disponível no fim da página, com limites informados |

Correções matemáticas continuam: sem receita no mês zero; aquisição opera no mês seguinte; principal não reduz lucro; reserva não é despesa; venda abaixo da dívida não ganha caixa artificialmente; déficit não vira aporte oculto. Não reproduzir erros do legado para obter os mesmos números.

Planejamento mestre, políticas extensas e índice de capital da v2 deixaram de ser telas principais nesta reconstrução. A rotina do primeiro carro e a leitura do fluxo têm prioridade; os requisitos úteis poderão ser reintroduzidos depois de validação, em vez de inflar novamente o menu. A matemática especializada existente permanece como biblioteca testada.
