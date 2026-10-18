# Desenho v4 · gestão e app do motorista

A direção visual anterior foi descartada. Nova base clara com verde profundo, tipografia legível, respiro, linhas discretas e ações explícitas. A gestão organiza as rotinas do proprietário; Painel ativo, Agenda e Meu advogado ampliam os destinos da reconstrução inicial.

Visão do dia é o ponto de entrada: indicadores rastreáveis e fila acionável, com carro e loja ao lado. Nenhum seletor de país/operação: Brasil e BRL são fixos.

Motoristas: cinco colunas de kanban com nomes de etapas reais, cartões compactos, responsável/próxima ação/data, arraste e formulário acessível. A lista é alternativa para busca/teclado e telas menores. Gate de entrega explica o bloqueio dentro do painel, sem perder o preenchimento.

Simulador: página contínua inspirada na referência enviada. Premissas na largura toda em seis grupos, sem botão Simular; tabela antes de gráficos; resultados com bases claras. Detalhes avançados agrupam apenas variáveis opcionais. Linha do tempo mostra todos os meses. Não existe uma coleção de abas para esconder fluxos.

Motorista: uma navegação própria com quatro abas fixas — Início, Aluguel, Lojinha e Mais. Não há um menu lateral duplicando as opções do app. O início do motorista ativo mostra o saldo do próximo aluguel e quatro ações: Vendi um produto, Conferir uma corrida, Fazer vistoria e Pedir ajuda. Um candidato acompanha a contratação e suas pendências. Crédito disponível e próximo compromisso aparecem quando houver algo para fazer.

A linguagem usa tarefas do dia: “Anotar meu dia”, “Km no painel”, “Quanto sobrou” e “Desconto no aluguel”. Texto principal parte de 16px, campos usam uma coluna e as ações principais têm pelo menos 48px de altura. Detalhes de cálculo, histórico, caução e configurações menos frequentes ficam em seções que o motorista pode abrir. A tela ocupa a largura disponível no celular, com foco visível, botão Voltar ao início e confirmação após concluir uma tarefa.

O aluguel exibe o saldo depois dos créditos já aplicados. O motorista vê uma prévia com saldo, desconto e quanto falta pagar antes de confirmar o uso do lucro da loja. O mesmo benefício só é usado uma vez: dinheiro recebido não gera outro desconto. A explicação do acerto distingue valor da venda, custo do estoque e lucro, sem tratar vendas pendentes como crédito disponível.

A vistoria é guiada em quatro passos: painel do carro, itens, fotos e resumo para conferir/enviar. O motorista pode guardar o rascunho e continuar depois; fotos permanecem temporárias nesta demonstração. Contratos, assinatura de teste, compromissos, manutenção, ajuda e respostas, produtos/reposição, benefícios, metas, análise de corrida e registro do dia continuam acessíveis. A simplificação altera a apresentação e mantém esses controles.

Formulários em painéis nativos de diálogo, rótulos explícitos, foco visível, erro no formulário e status de gravação. Tabelas largas rolam horizontalmente dentro do seu próprio contêiner. Kanban possui rolagem horizontal em telas estreitas; o restante deve refluír desde 320px. Navegação lateral e cabeçalho permanecem disponíveis no desktop; menu abre no celular.

Não usar indicadores sem origem nem “pago” antes da conferência. O aviso de demonstração é persistente, mas a rotina usa linguagem do negócio, sem detalhes de implementação desnecessários.

## Referência solicitada: Finanças Pessoais

O app do motorista adota o sistema visual do projeto local oficial Finanças Pessoais, consultado sem edição: `src/index.css`, `tailwind.config.js`, `src/components/AppShell.tsx` e `src/pages/Dashboard.tsx`. Fundo branco (#fff), cards cinza (#f2f2f2), controles cinza (#e3e3e3), texto/ação preto (#141414), bordas #dadada, cantos de 24px e sem sombras. Títulos usam a mesma família arredondada (SF Pro Rounded/ui-rounded/Nunito/sistema); corpo usa a fonte do sistema.

Cabeçalho com saudação e nome, ações circulares, ícones de linha e abas inferiores brancas com pequena linha no item ativo. Botões principais em pílula preta. A paleta escura também segue a referência (#16171c no fundo e #2a2e38 nos cartões), com troca de tema sem remontar formulários. O visual verde continua na gestão; no motorista, cores de status servem à informação. Rótulos e alvos permanecem maiores que na referência para atender o público do piloto.
