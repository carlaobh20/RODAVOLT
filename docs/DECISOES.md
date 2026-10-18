# Decisões v3 · 18/10/2026

## Confirmado pelo proprietário

Reconstruir interface e organização do zero. Simulador muito próximo do antigo e com todo o fluxo visível. Kanban para fluxo dos motoristas. Loja de perfumes, carregadores e acessórios. App do motorista mais completo, inclusive avaliação de corrida por km e objetivos. Pesquisa na internet e GitHub. Brasil/BRL e aluguel semanal permanecem fixos. Trabalho nesta pasta, branch dev, commit/push autorizados; sem autorização implícita para deploy ou banco antigo.

## Escolhas desta reconstrução

- Nova interface e controlador. Versão anterior recuperável no histórico Git; armazenamento v3 separado, sem apagar dados de outros aplicativos.
- Reusar matemática financeira já verificada, com manutenção mensal e novos relatórios completos; descartar a experiência fragmentada de abas.
- Sete entradas na gestão, separando ação diária de planejamento.
- Kanban com gates explícitos e verificação de veículo disponível, sem score automático de pessoas.
- Tratar comprovação/recebimento, venda/acerto e abertura/conclusão de serviço como eventos diferentes, idempotentes onde necessário.
- Perfume 30ml, carregador USB-C e cabo são exemplos do novo catálogo. Preço e custo são demonstrativos, ainda a validar comercialmente. A regra atual do piloto é margem integral para o motorista, conforme decisão posterior registrada abaixo.
- Análise de corrida manual no protótipo. O fluxo calcula e registra a escolha; leitura automática da tela de outra plataforma é uma implementação nativa separada, não uma capacidade desta página.
- Ganhos e metas do motorista separados das telas administrativas e das receitas da empresa.

## Pendências comerciais

Cidade/estado, veículo e financiamento efetivos, capital/reserva, seguro/franquia, limites de km, caução, regras de atraso/devolução, responsabilidade por manutenção/combustível, fornecedores de perfumes/acessórios, nota fiscal/garantia, forma de acerto e custódia do kit, regime tributário e minuta jurídica.

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

## App do motorista simples · 18/10/2026

O proprietário aprovou a direção desta versão e pediu que o app do motorista fosse o mais simples possível para pessoas com pouca familiaridade com tecnologia. A simplificação preserva os controles: muda a linguagem, a ordem das ações e a quantidade de informação mostrada de cada vez.

Quatro abas fixas: Início, Aluguel, Lojinha e Mais. O início do motorista ativo prioriza saldo do aluguel e quatro ações — venda, análise de corrida, vistoria e ajuda. A contratação aparece como caminho principal para candidatos e permanece disponível enquanto houver pendência. Metas, registro do dia, compromissos, contratos, manutenção, históricos e benefícios ficam acessíveis em Mais ou no contexto da tarefa; nenhum segundo menu compete com a navegação.

Texto principal de 16px, botões grandes, formulários em uma coluna e palavras do cotidiano. A vistoria passa a ter quatro passos, com rascunho, revisão antes de enviar e fotos temporárias. Confirmações deixam claro o que foi registrado e o próximo passo.

O crédito da lojinha usa uma confirmação com prévia do saldo, desconto e restante do aluguel. O acerto continua distinguindo dinheiro recebido, custo do estoque e lucro do motorista; receber em dinheiro e usar desconto não duplicam benefício. Comprovante depende de conferência e assinatura continua sendo teste. A interface simples permanece um protótipo local, sem criar integrações ou permissões de produção.

O proprietário pediu o design do projeto Finanças Pessoais no app do motorista. Consultar o checkout oficial da Mesa apenas como referência visual; nenhuma alteração ou integração nesse projeto faz parte desta entrega. Adotar branco/cinza/preto, cards de 24px sem sombra, pílulas, títulos arredondados, ícones de linha e barra inferior; manter tamanho de leitura e simplicidade das quatro abas. Claro/escuro são preferências visuais locais, sem conexão com a conta do Finanças Pessoais.

## Combos, venda e auditoria de fluxo

O proprietário confirmou entrega de combo multproduto, saldo por produto no app e consumo conforme as vendas. A implementação local agora separa central, trânsito, recebido, reservado e vendido por motorista, preservando o kit de abertura das sessões existentes. Divergência é conferência pendente; não vira perda/desconto automaticamente.

Recomendação desenhada no protótipo: motorista escolhe produto/quantidade e apresenta Pix específico; passageiro paga pelo banco sem cadastro de loja; confirmação vai para a RODAVOLT. A prévia usa pagamento fictício conferido pela gestão, sem QR pagável. Crédito só surge após a conferência; entrega não repete estoque/caixa. O fornecedor não foi selecionado.

O pedido de auditoria abrangeu todos os módulos e encontrou falhas corrigidas de datas/saldos/calendários/vínculos. Cobrança recorrente por novo contrato e encerramento completo ficaram registrados como pendências prioritárias, sem inventar regras de primeira/última semana ou retenção de caução. Ver a matriz, achados, evidências e critérios em AUDITORIA-DE-FLUXOS.md.
