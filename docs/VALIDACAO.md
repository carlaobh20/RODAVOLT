# Validação da reconstrução v3

18/10/2026 · planejamento e protótipo local. Interface v2 substituída; histórico preservado no Git.

## Automatizado

`npm run check`: **92 testes aprovados**, build dos dois HTMLs, verificação de sintaxe das fontes e do script completo montado. Cobertura: mês zero, calendário, capital/reserva, crescimento, financiamento Price/SAC, juros/principal, amortização, caixa/resultado/patrimônio, projeção por fechamento, agregação anual e CSV; kanban com condições de entrega, disponibilidade por carro, cobrança e comprovante, manutenção, vistoria, estoque e acerto idempotentes; cálculo pessoal de corrida com trajeto completo, tempo, custos e metas.

O teste de estoque verifica uma venda de R$ 89: caixa +R$ 71,20, estoque −R$ 32 e resultado/patrimônio +R$ 39,20, sem pagar CMV duas vezes. Outra verificação preserva o estoque consumido ao reestimar o futuro. O capital inicial financia a central e o kit. `git diff --check` sem erro.

## Jornadas conferidas no navegador

Sessão `?qa=1` isolada para movimentos demonstrativos, sem gravar os testes operacionais na sessão principal:

- Novo painel e seus destinos; saldo de abertura com estoque central financiado.
- Simulador: recálculo automático ao alterar aluguel semanal; fluxo mensal com Hoje + 60 meses, além de visão anual e memória de cálculo.
- Kanban: arrastar interessado para documentação; bloqueio ao avançar sem conferência; edição válida avança candidato para contrato/entrega. Erros aparecem dentro do formulário aberto.
- Motorista: oferta de R$ 32 fica abaixo da meta diária convertida por km; R$ 45 atende às metas; registro pessoal da decisão.
- Venda de perfume baixa kit de 4 para 3; comissão de R$ 17,80 e acerto único no livro. Caixa sobe R$ 71,20, com CMV sem nova saída de caixa.
- Comprovante aparece em conferência na gestão, sem tratar envio como dinheiro recebido.
- Pedido de manutenção do motorista aparece na gestão; resposta registrada no histórico local.
- Comparação preserva PLANO-001 e reestima o futuro a partir de janeiro/2027, mantendo os registros passados.
- Cenário “Plano inicial · primeiro carro” preservado após recarregar a sessão principal.
- Inspeção visual em desktop e molduras de 390 e 320 px, incluindo análise de corrida. Tabelas extensas e kanban têm rolagem horizontal deliberada.
- Nenhum erro de console na sessão final examinada.

## Limites

Valores, datas, nomes, carros e lançamentos são fictícios. Persistência no navegador e exportação local; sem segurança multiusuário. Não homologados autenticação, banco, permissões por motorista, anexos reais, assinatura, Pix/conciliação bancária, emissão fiscal, telemetria, operação offline ou desempenho sob carga. A análise de corrida é manual: não lê nem aceita/recusa ofertas no Uber/99. Produção depende dessas etapas e de validação das regras e custos reais.

O PRD, o plano de execução e a matriz do legado descrevem o que existe e o que continua proposto. Nenhuma conexão ao banco antigo, migration remota ou publicação de produção foi feita nesta entrega.

## Ampliação v4 · 18/10/2026

`npm run check`: **142 testes aprovados** após financeiro, jurídico/agenda, telemetria e vistoria. Build e sintaxe integral aprovados. Inclui baixa/estorno de conciliação sem duplicar caixa, equivalente a título aberto, saldo negativo, corte por data, principal limitado à dívida, versões jurídicas imutáveis, assinatura parcial, compromisso derivado sem baixa, posição inválida/antiga/fora de ordem, vistoria incompleta, segurança, correção, entrega por carro e novo ciclo após encerramento.

Conferido em sessão isolada de navegador: Painel ativo carrega tiles e marcador com contexto; perda de sinal mostra posição desatualizada e avanço renova a amostra. Financeiro vincula extrato mantendo caixa R$57.352,32; criar conta de R$250 mantém caixa, liquidar reduz a R$57.102,32. Agenda registra compromisso de entrega para Camila. Minuta JUR-2 passa por revisão e fila; registro pelo perfil Camila fica parcialmente assinado enquanto falta locadora. Vistoria de entrega enviada pelo perfil aparece na gestão e recebe parecer. Nenhum erro de console nessa jornada.

Banco, assinatura e rastreador não foram escolhidos pelo proprietário. Nada foi conectado; o mapa usa coordenadas fictícias e relógio de exemplo. Fotos reais persistentes, assinatura efetiva, banco remoto, notificações externas e segurança individual continuam não homologados. Prévia local de arquivo expira ao recarregar; arquivo/foto não é salvo no estado local.

## Modelo do piloto · resultado final desta entrega

**166 testes aprovados** em `npm run check`, incluindo o novo motor `src/program.js`. Conferidos: 100% da margem para o motorista; acerto bruto com obrigação, repasse líquido sem crédito, abatimento parcial e sobra, saldo por motorista, caução idempotente sem receita, reforecast com passivos protegidos e todos os gates de uma entrega completa.

No navegador QA: venda de um perfume gera R$57 de crédito após o acerto; o perfil Marcos aplica esse crédito; a carteira mostra aluguel original R$1.050, abatido R$57 e restante R$993. Benefícios planejados aparecem sem alegar acesso provisionado. As inspeções móveis anteriores em 390px e 320px são verificações visuais do protótipo, não homologação de app nativo/fotos persistentes.

Resultados da seção v3 e da primeira revisão v4 são históricos. A regra vigente da loja passou de comissão percentual para margem integral do motorista. Integrações, revisão jurídica efetiva, notificações externas e segurança de produção seguem pendentes.
