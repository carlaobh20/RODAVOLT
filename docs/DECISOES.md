# Decisões v3 · 18/10/2026

## Confirmado pelo proprietário

Reconstruir interface e organização do zero. Simulador muito próximo do antigo e com todo o fluxo visível. Kanban para fluxo dos motoristas. Loja de perfumes, carregadores e acessórios. App do motorista mais completo, inclusive avaliação de corrida por km e objetivos. Pesquisa na internet e GitHub. Brasil/BRL e aluguel semanal permanecem fixos. Trabalho nesta pasta, branch dev, commit/push autorizados; sem autorização implícita para deploy ou banco antigo.

## Escolhas desta reconstrução

- Nova interface e controlador. Versão anterior recuperável no histórico Git; armazenamento v3 separado, sem apagar dados de outros aplicativos.
- Reusar matemática financeira já verificada, com manutenção mensal e novos relatórios completos; descartar a experiência fragmentada de abas.
- Sete entradas na gestão, separando ação diária de planejamento.
- Kanban com gates explícitos e verificação de veículo disponível, sem score automático de pessoas.
- Tratar comprovação/recebimento, venda/acerto e abertura/conclusão de serviço como eventos diferentes, idempotentes onde necessário.
- Perfume 30ml, carregador USB-C e cabo são exemplos do novo catálogo. Preço/custo/comissão de 20% são demonstrativos, ainda a validar comercialmente.
- Análise de corrida manual no protótipo. O fluxo calcula e registra a escolha; leitura automática da tela de outra plataforma é uma implementação nativa separada, não uma capacidade desta página.
- Ganhos e metas do motorista separados das telas administrativas e das receitas da empresa.

## Pendências comerciais

Cidade/estado, veículo e financiamento efetivos, capital/reserva, seguro/franquia, limites de km, caução, regras de atraso/devolução, responsabilidade por manutenção/combustível, fornecedores de perfumes/acessórios, nota fiscal/garantia, comissão e custódia do kit, regime tributário e minuta jurídica.

Não preencher essas decisões como fatos por meio dos dados ilustrativos. O protótipo deve servir para revisar as escolhas antes da compra inicial.
