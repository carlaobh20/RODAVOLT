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

## V4 · operação, documentos e painel ativo

Requisitos confirmados em 18/10: financeiro/entradas/saídas/conciliação, agenda, Meu advogado, fluxo completo de contratação/entrega, vistoria no app e painel de mapa/telemetria. O proprietário respondeu que banco e rastreador não foram escolhidos: pensar no sistema antes das integrações. Nenhum fornecedor foi contratado ou conectado.

Manter v3 e cenários locais; ampliar ops com finance/legal/agenda/live/inspections e perfis demonstrativos, sem apagar sessão. Preservar matemática do simulador. Contratos e vistorias passam a ser as fontes dos gates; checkbox de cadastro não conclui assinatura nem vistoria. O mapa usa tiles OSM com atribuição e cache normal; percurso/posições são explicitamente fictícios.

Arquivos de foto são temporários desta sessão e não são enviados nem persistidos. Apenas slot/origem de exemplo fica no estado. Assinatura é registro de simulação, sem executar compromisso real. Segurança individual, armazenamento privado, eventos remotos, notificações e banco real seguem como etapas de implantação.

## Modelo do piloto confirmado pelo proprietário

Começar com um carro e um kit de perfumes/carregadores alimentado pela RODAVOLT. O objetivo da loja é agregar renda ao motorista: **100% da margem pertence a ele**, com possibilidade de crédito no aluguel semanal. Isso substitui a hipótese antiga de comissão de 20%; registros/cenários históricos preservam seus valores originais. Não aplicar o mesmo ganho como dinheiro pago e abatimento outra vez.

Caução é requisito de acesso, registrada e conciliável, sem ser receita nem lucro. Valor de R$1.500 é somente exemplo; valor e condições definitivos ainda serão escolhidos e revisados. Seleção usa critérios de rotina verificáveis e parecer humano, sem pontuação automática. A entrada exige seleção/documentação, contrato vigente do mesmo carro, caução, vistoria nova aprovada e veículo disponível.

Benefícios previstos: renda da loja, app de finanças pessoais e novos aplicativos. Acesso aos outros aplicativos ainda não foi provisionado. Parcerias ficam para etapa posterior. O programa busca retenção por previsibilidade, transparência e valor ao motorista; não promete ausência de rotatividade ou conflitos.

O rascunho do simulador inicia agora com um carro, reinvestimento desativado e margem integral do motorista; a cópia anterior é preservada, assim como o plano de referência. Crescimento continua simulável por ação explícita. Cauções/créditos pendentes são obrigações protegidas no fechamento, não capital livre para novas compras.
