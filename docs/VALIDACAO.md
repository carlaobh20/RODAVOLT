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
