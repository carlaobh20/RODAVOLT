# Referências pesquisadas

Consulta em **17/10/2026**. Fontes oficiais de fornecedores foram usadas como referências de capacidade e padrão de fluxo. Não houve avaliação contratada, acesso a contas pagas, ranking independente ou certificação de que são os “melhores” para toda operação. A recomendação é uma síntese para a necessidade da RODAVOLT.

| Fonte | Capacidade observada | Adaptação proposta |
|---|---|---|
| [Fleetio · manutenção](https://www.fleetio.com/solutions/fleet-maintenance-software) | Planos preventivos, inspeção, ordens e histórico de custos | Unir ocorrência, serviço, km e custo na ficha do carro |
| [Fleetio · custo total de propriedade](https://www.fleetio.com/blog/calculating-total-cost-of-ownership-for-fleet) | Custo do veículo considera aquisição, depreciação, manutenção e paradas | Separar custo econômico e caixa no simulador |
| [HQ Rental Software](https://hqrentalsoftware.com/) | Gestão de locação com contratos digitais, pagamentos e disponibilidade | Conectar contrato, carro e recebíveis sem múltiplos cadastros |
| [Localiza Zarp · perguntas frequentes](https://zarp.localiza.com/faq) | Oferta para motorista de aplicativo com condições, km, manutenção e proteções | Explicitar responsabilidades, limites e custos do aluguel semanal |
| [Samsara · Driver App](https://kb.samsara.com/hc/en-us/articles/4423183155341-Get-Started-with-the-Samsara-Driver-App/) | Inspeções e comunicação pelo aplicativo do motorista | Relato de manutenção com evidência no celular |
| [Zoho Inventory · transferências](https://www.zoho.com/us/inventory/help/warehouses/transfer-orders.html) | Origem, destino e acompanhamento da movimentação de mercadoria | Central → kit/veículo com rastreabilidade e confirmação |

Os fornecedores têm escopos diferentes: manutenção de frota, locadora, portal do motorista e estoque. A RODAVOLT reúne somente os fluxos úteis ao negócio inicial. Não presume copiar suas interfaces, integrar APIs, adotar seus preços ou oferecer suas coberturas.

Para crédito, o [material de educação financeira do Banco Central](https://liftchallenge.bcb.gov.br/content/cidadaniafinanceira/documentos_cidadania/Cuidando_do_seu_dinheiro_Gestao_de_Financas_Pessoais/caderno_cidadania_financeira.pdf) explica que o CET incorpora juros e outros encargos. Por isso o simulador não apresenta juros informados como CET calculado.

Para arquitetura, a [documentação de RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) e de [Storage](https://supabase.com/docs/guides/storage/security/access-control) orienta a separação por acesso. A implementação concreta exigirá consulta atualizada e testes no ambiente escolhido.

Preços anunciados por locadoras variam por cidade, grupo, km e condições promocionais. Nenhum preço promocional de concorrente foi usado como evidência do preço que a RODAVOLT conseguirá cobrar. As premissas do desenho são explicitamente fictícias.
