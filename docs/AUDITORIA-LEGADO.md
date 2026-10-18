# Releitura do legado · v2

Referência original indicada: `Downloads/RodaVolt-System-main`. A primeira leitura acessou essa pasta; ela deixou de estar presente. A releitura aprofundada desta versão usou a cópia `Documents/ChatGPT/RODAVOLT - SYSTEM`. Nenhuma cópia, banco ou implantação do legado foi alterada. Não foi feita homologação completa de segurança ou resultados históricos.

## Correção de direção

Na v1, crescimento e projeção empresarial foram adiados. O proprietário pediu explicitamente recuperá-los. A v2 os traz para o centro do produto e acrescenta o confronto com registros operacionais. A quantidade de itens do menu deixou de ser o objetivo da simplificação; a prioridade é profundidade com organização.

## Mapeamento concreto

| Origem lida | O que foi aproveitado | Nova entrega |
|---|---|---|
| `features/estrategia/types.ts` | Capital, aquisição, meta, reserva, rendimento, custo empresarial, amortização | Premissas completas e parâmetros explícitos |
| `features/estrategia/intelligence/simulacaoEmpresarial.ts` | Acompanhamento por carro, compra com caixa, financiamento, reinvestimento e estratégias | `src/growth.js`, novo motor e testes independentes |
| `features/estrategia/components/FluxoDetalhadoTable.tsx` | Operação, juros/principal, amortização extra, caixa e compras | Fluxo detalhado e memória por mês |
| `features/estrategia/intelligence/fluxoAnual.ts` e tabela | Leitura anual do fluxo e saldos | Agregação anual de fluxos com saldos de fechamento |
| `features/estrategia/intelligence/growthTimeline.ts` | Marcos e distinção entre observação e extrapolação | Marcos simulados e comparação contra registros |
| Ficha de frota, motorista, contratos e vistorias | Vínculo e histórico por objeto | Telas integradas e fontes de resultado |
| Portal do motorista | Carro, pagamentos, documentos, loja e suporte | Jornada pessoal, carteira aprofundada e fluxos de ação conectados à gestão |
| Lojinha administrativa e catálogo/carrinho | SKU, pedido e movimentação | Custódia por kit, venda ao passageiro, comissão, recebedor e acerto |

## Diferenças intencionais do novo motor

O legado percorre `mes = 0` até o horizonte inclusive com operação no loop; a v2 usa mês zero apenas como posição inicial. A aquisição ao final do mês só gera operação no seguinte. Semanas fixas por mês foram substituídas por dias civis. O novo modelo separa resultado, principal, caixa, capital próprio, valor dos ativos e retirada.

Todas as modalidades de amortização preservam a reserva; perder dinheiro na operação continua reduzindo caixa. Dívidas existentes mantêm sua taxa ao gerar uma revisão. Preparação e tarifas não recuperáveis são reconhecidas sem dupla saída de caixa. Esses comportamentos são testados diretamente; não se afirma equivalência exata com os números do legado.

A versão original do plano é uma referência independente do rascunho. O realizado nasce de registros e aquisições observados, não de percentuais artificiais aplicados à curva original. A revisão usa o snapshot desses saldos e não reescreve períodos passados.

## O que ainda não é migração

Não foram copiados bancos, credenciais, dados pessoais, arquivos, permissões ou processos em produção. Funções e conceitos foram estudados e reimplementados. Uma migração operacional futura exigirá inventário de dados, mapeamento, ensaio, reconciliação e autorização do ambiente de destino.

## Integração posterior das cinco áreas

O pedido seguinte incluiu todo o Centro de Estratégia. A paridade por componente, as correções e as diferenças entre os motores estão em [CENTRO-DE-ESTRATEGIA.md](CENTRO-DE-ESTRATEGIA.md). A preservação dos conceitos não implica migração do banco antigo: os registros disponíveis continuam demonstrativos.
