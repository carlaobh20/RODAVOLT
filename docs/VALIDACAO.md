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

## App simples com visual do Finanças Pessoais · 18/10/2026

**172 testes aprovados em `npm run check`**, com build dos dois HTMLs, sintaxe das fontes e do controlador integral gerado. Os seis novos testes de `applyAvailableCredit` cobrem vários créditos em uma confirmação, limite da cobrança e sobra para outra semana, titularidade, reenvio idempotente, cobrança já paga, prévia em cópia e centavos. O uso do crédito conserva o caixa e reduz a obrigação, sem criar recebimento bancário.

Referência visual consultada diretamente no checkout oficial do Finanças Pessoais na Mesa: CSS, tokens Tailwind, AppShell e Dashboard móvel. Nenhum arquivo desse projeto foi alterado. A adaptação conserva as quatro abas e tamanhos maiores de leitura/toque; não conecta contas ou dados entre aplicativos.

Conferido em navegador, com transações de teste em sessões `?qa=1` isoladas:

- Home, venda por produto, confirmação e estoque: perfume de R$89 mostra lucro de R$57 a conferir. A gestão confere o acerto, o motorista vê prévia R$1.050 − R$57 = R$993, confirma e o início passa a mostrar R$993. O comprovante mantém o saldo em aberto e mostra que aguarda conferência.
- Vistoria móvel em quatro passos, preenchimento dos oito itens, erro claro por falta de fotos, cinco ilustrações marcadas como exemplo, resumo com km/combustível preservados e envio aguardando conferência. O motor continua exigindo aprovação humana. Teste isolado do controlador também preservou campos e fotos ao ir/voltar entre etapas.
- Corrida de R$32 abaixo da meta e R$45 atingindo a meta; a decisão produz confirmação legível e fica no histórico pessoal.
- Perfil ativo e candidato têm caminhos distintos. Contratos/documento correto continuam acessíveis por Mais; o texto e assinatura são demonstrativos.
- Visual claro/escuro em desktop e tela de 320px, além do fluxo móvel em 390px. A barra inferior permanece fixa, títulos/campos se reorganizam, ícones têm rótulos e não foi observado corte horizontal nas telas examinadas.
- Trocar tema durante a corrida preservou a oferta digitada de R$45 e seu resultado. A alteração não remonta os formulários. O tema é separado do painel administrativo.

Revisão independente conferiu as páginas para os cinco perfis, navegação, valores após crédito e preservação das funções. O histórico pago agora identifica o valor como aluguel quitado, evitando confusão com saldo devedor.

Persistem os limites do protótipo: dados fictícios, fotos temporárias, sem integrações ou segurança multiusuário. Não houve teste de usabilidade com motoristas reais; o piloto deve confirmar entendimento dos textos, facilidade de toque e tempo para concluir cada tarefa. Não houve publicação em produção.

## Auditoria geral e combos · 18/10/2026

**223 testes aprovados em `npm run check`**, build e sintaxe integral. Foram adicionados 28 testes da loja, seis do acerto por pedido, dez de cronologia/contabilidade/calendário e sete de vínculos/agenda/vistoria. O [relatório completo](AUDITORIA-DE-FLUXOS.md) registra achados corrigidos, limites e os fluxos ainda incompletos.

Navegador isolado: enviar 2 perfumes, 2 carregadores e 2 cabos mantém estoque vendável de abertura em 4/5/6; confirmar recebimento muda para 6/7/8; pedido de um perfume reserva uma unidade; conferência de pagamento fictício gera R$57 de crédito, estoque 5/7/8 e nenhuma venda manual pendente indevidamente acertada. Marcar entrega não baixa outra unidade. Prévia do passageiro informa Pix não conectado, sem cadastro ou cobrança real.

O uso explícito dos R$57 no aluguel de R$1.050 resultou em R$993 tanto no app quanto no painel ativo; crédito disponível zerado. Os movimentos de teste não foram gravados na sessão principal.

Regressões provam que caução futura não libera entrega anterior; devolução não usa recebimento posterior ou obrigação já reservada; meses vazios preservam lucro/depreciação; calendários incompatíveis são rejeitados; cuidados do carro atual entram na agenda correta; ex-motorista não vistoria carro de outro; parecer antigo não muda km/liberação do novo ciclo. Painel ativo usa aluguel líquido e rótulo de contrato cancelado foi corrigido.

Lembretes locais passaram a ter consumidor periódico com filtro por perfil e deduplicação por sessão; isso não homologa avisos em segundo plano ou no celular. Não foram homologados banco, Pix, assinatura, GPS, autenticação, concorrência entre dispositivos ou recuperação. A auditoria não encerra as pendências de emissão recorrente de aluguel, devolução final ou reembolso de venda paga.
