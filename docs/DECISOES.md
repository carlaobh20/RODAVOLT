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

O pedido de auditoria abrangeu todos os módulos e encontrou falhas corrigidas de datas/saldos/calendários/vínculos. Na rodada inicial da auditoria, cobrança recorrente por novo contrato e encerramento completo ficaram registrados como pendências prioritárias. A implementação v5 abaixo fecha esses fluxos localmente, mantendo regras explícitas e sem retenção automática de caução. Ver a matriz, achados, evidências e critérios em AUDITORIA-DE-FLUXOS.md.


## V5 · implementação autorizada após a auditoria

O proprietário autorizou seguir e implementar os fluxos apontados. O escopo entregue continua local: código, testes, protótipo com acesso individual e sincronização de `dev`. Essa autorização não implica deploy, promoção para produção, migrations remotas ou conexão ao banco antigo.

Pagamento **vencido**, pela semana já utilizada, foi confirmado pelo proprietário. Dia de vencimento, primeira/última semana e data de entrega são conferidos por contrato. A possibilidade antecipada é uma alternativa explícita; não é o padrão confirmado. Preço/versão/ciclo são preservados e a primeira cobrança é mostrada antes de salvar. Nenhuma regra de juros, multa ou retenção foi inventada.

A devolução reúne vistoria, recebimento físico, chaves, kit e demonstrativo; a mudança de etapa não pode liberar o carro antes dessas conferências. Dívida, crédito, caução e eventual restituição de aluguel permanecem separados. Reembolso de venda, pagamento tardio, quarentena e estornos têm origem/histórico. Crédito disponível pode ser repassado; isso baixa obrigação e não repete a despesa.

Multas/sinistros/avarias têm fluxo próprio com prazo e manifestação. A proposta de valor não se transforma em débito. Atribuição de responsabilidade é humana; título de ressarcimento fica separado de aluguel, e caução não é retida automaticamente.

Foi criada uma base de homologação local em Node 22 sem dependências: `npm run operate`, porta 4174, acesso inicial criado pelo proprietário e contas de motorista vinculadas pela gestão. O serviço usa sessões HttpOnly, CSRF, scrypt, gravação atômica, revisão e idempotência. A prévia estática 4173 continua separada; não se importa ou apaga sua sessão silenciosamente.

A área pessoal do motorista é separada por conta, sem leitura nem backup pela gestão. O backup operacional inclui arquivos, exclui senhas/personal e restauração revoga os acessos de motorista. O proprietário entra novamente e recria os vínculos após conferir os cadastros; arquivos originais são preservados.

O serviço em HTTP/127.0.0.1 não está publicado para celular ou internet. Fixtures e datas operacionais continuam demonstrativas. Banco/Pix, assinatura, telemetria e push permanecem sem fornecedores escolhidos; uso com o primeiro carro, revisão jurídica/contábil, recuperação externa e facilidade para motoristas reais ainda dependem de homologação.

## Decisão sobre frota elétrica · 18/10/2026

Confirmado: comprar somente carros 100% elétricos e operar em Maringá/PR. No piloto, o motorista paga as recargas; a locadora não registra esse gasto como despesa ou receita própria. Consumo em kWh/100 km, preço efetivo em R$/kWh, perdas e eventual participação futura da empresa são parâmetros explícitos. Modelo, carregador, tarifa, seguro e proposta de compra permanecem abertos. Vistorias passam a registrar carga da bateria (%), cabo/porta e alertas; não converter percentual antigo de combustível em carga. Revisões seguem manual e prazo do veículo escolhido.

## Kanban editável · 18/10/2026

O proprietário pediu liberdade para criar e apagar colunas. O quadro inicia com as cinco etapas conhecidas, mas seus nomes, ordem e existência são editáveis. Exclusão exige destino para os cartões, sem apagar motorista, contrato ou histórico. Coluna personalizada não altera a situação operacional; as transições para rodando e encerrado continuam sujeitas aos gates de contrato, vistoria, carro e devolução.

## Regra opcional de expansão · 19/10/2026

O proprietário pediu simular compras recorrentes de carros quando o caixa atingir um valor X, escolhendo pagamento à vista ou financiado e preenchendo as condições. A regra do rascunho inicial permanece desligada. Para os carros adicionais, a simulação permite repetir as condições do primeiro, pagar à vista ou informar entrada, juros e prazo próprios; preço diferente é opcional. O gatilho de caixa é conferido no fechamento mensal, e a compra só ocorre se também couberem desembolso e reserva após a compra. O carro novo só gera aluguel no mês seguinte. Resultados e eventos demonstrativos deixam visíveis os motivos de compra ou espera. Nenhuma compra ou financiamento é contratado pelo simulador.
