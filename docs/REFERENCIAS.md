# Pesquisa aplicada · 18/10/2026

Consulta a fontes oficiais e repositórios, usada como referência de produto. Não copiamos interfaces, instalamos os sistemas nem importamos bases de terceiros. Nenhuma comparação de “melhor do mercado” foi assumida sem avaliação.

| Fonte | Observação verificada | Aplicação nesta proposta |
|---|---|---|
| [Fleetio · inspeções](https://www.fleetio.com/features/vehicle-inspections) | Checklists e falhas de inspeção conectados ao fluxo de manutenção | Pedido do motorista, vistoria, ordem, custo e disponibilidade ligados ao carro |
| [Fleetbase no GitHub](https://github.com/fleetbase/fleetbase) | Plataforma modular de operações de logística e frota, com aplicações operacionais | Separar rotina do proprietário e experiência do motorista, conservando registros compartilhados quando apropriado |
| [Kanboard no GitHub](https://github.com/kanboard/kanboard) | Software de gestão pelo método kanban | Etapas visuais, cartões com próxima ação e alternativa ao arraste por formulário. Implementação própria, sem dependência PHP |
| [Driversnote · registro de trajetos](https://www.driversnote.com/tracking) | Organização/classificação de trajetos e histórico de deslocamentos | Jornada pessoal separada do financeiro da locadora e registros de km por finalidade |
| [GigU · Brasil](https://gigu.app/br) | Análise de corridas com custos pessoais e ganho líquido | Metas, custo de rodar e oferta mínima. O protótipo RODAVOLT usa entrada manual e não afirma possuir leitura automática |
| [GigU · lucro líquido](https://gigu.app/br/blog/lucro-liquido-saiba-quanto-voce-realmente-ganha-em-cada-corrida) | Custos configurados e lucro líquido por hora na avaliação da oferta | Evitar confundir receita da corrida com lucro; incluir aluguel, combustível e custos pagos pelo motorista |
| [StopClub · cálculo de ganhos](https://site.stopclub.com.br/app-km) | Exibição de R$/km e R$/hora quando uma oferta aparece | Referência para o futuro recurso nativo. Nesta entrega, calculadora e decisão são manuais e explicitamente identificadas |

A referência determinante do simulador é o código antigo fornecido pelo proprietário. Sua sequência de leitura e colunas foram auditadas, preservando as correções matemáticas descritas em SIMULADOR.md.

## Ampliação operacional v4

Fontes de banco, assinatura, rastreamento e mapa pesquisadas em documentação primária estão em [OPERACAO.md](OPERACAO.md). Nenhum fornecedor foi selecionado pelo proprietário. As referências orientam estrutura e fronteiras, sem conectar contas ou serviços.
