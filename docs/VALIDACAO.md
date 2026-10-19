# Validação da reconstrução v3

## Calibração Maringá/PR · 18/10/2026

`npm run check` passou com **373 testes**, build dos dois HTMLs e sintaxe completa. Dois testes adicionais verificam os cenários de sensibilidade contra `S.simulate`, a erosão de caixa no primeiro mês e o ponto de equilíbrio semanal. O fluxo interno pré-existente de acesso, cobrança, estoque, vistoria, fechamento, backup e concorrência continua coberto pelos testes HTTP locais; nenhum teste chama banco, Pix, assinatura ou rastreador reais.

A pesquisa pública está em [CALIBRACAO-MARINGA.md](CALIBRACAO-MARINGA.md). O cenário opcional altera apenas a revisão programada por km de referência; seguro, financiamento, aluguel e custos de operação não foram cotados. A checagem visual no navegador desta rodada foi recusada pela autorização de acesso à origem local, portanto a nova seção do simulador não foi homologada visualmente nesta rodada. Build e testes não substituem essa inspeção.

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
- Vistoria móvel em quatro passos, preenchimento dos oito itens, erro claro por falta de fotos, cinco ilustrações marcadas como exemplo, resumo com km/carga da bateria preservados e envio aguardando conferência. O motor continua exigindo aprovação humana. Teste isolado do controlador também preservou campos e fotos ao ir/voltar entre etapas.
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

## Implementação v5 local · fechamento de 18/10/2026

Esta seção atualiza o estado da entrega; as rodadas acima preservam a evidência histórica de quando ainda havia pendências.

**368 testes aprovados em `npm run check`**, build dos dois HTMLs e sintaxe do controlador completo. São 145 regressões novas sobre os 223 anteriores: 21 de cobranças, 17 de encerramento, 18 de ocorrências, 17 de manutenção, 25 de devoluções da loja, 13 de créditos/acertos, 12 de estorno de baixa, 8 de serviço/persistência, 3 de segurança, 5 de portal do motorista, 1 de restauração das fotos, 3 de fuso e 2 de formulários do portal. Os testes HTTP usam diretórios temporários, contas fictícias e portas locais; não utilizam banco ou serviços externos.

Implementado e exercitado:

- Cobrança semanal pelo contrato, pagamento vencido confirmado pelo proprietário, regras explícitas de primeira/última semana, previsão antes de salvar, geração sem duplicação e acerto final sem apagar originais.
- Devolução com vistoria do ciclo, recebimento físico, retorno do kit/quarentena e encerramento; dívida, crédito, excesso de aluguel pago e caução continuam separados. Avaria de segurança exige manutenção.
- Reembolsos parciais, Pix tardio, expiração de reserva, recuperação de lucro pago e estorno explícito de crédito. Caixa, resultado e patrimônio não recebem o mesmo efeito duas vezes.
- Estorno de baixa com origem, reabertura do compromisso, recebimentos acumulados e conciliação original preservada.
- Multas/sinistros/avarias com prazo, manifestação e decisão humana antes de criar título. Planos de manutenção por km/data com custo efetivo lançado somente na conclusão da OS.
- Serviço local com login individual, senha com scrypt, sessão HttpOnly, CSRF, comandos autorizados por motorista, arquivos privados, finanças pessoais separadas por usuário e gravação atômica com revisão/idempotência.
- Conflito entre dois acessos, reenvio, falha antes do commit, reinício do serviço, backup com checksum e restauração. Restaurar revoga os acessos de motorista para evitar reutilizar IDs de outra pessoa; as cinco fotos preservam bytes/vínculos com os novos identificadores. Backup da gestão não contém senhas nem finanças pessoais.
- Horários da operação com fuso explícito, independentes do fuso do dispositivo. Motorista encerrado consulta saldos/documentos/ajuda sem voltar à jornada de contratação.

Percursos de navegador executados em ambientes isolados:

1. Em `4173/?qa=1`, configurar continuidade de Marcos a partir de 25/01, preservar abertura até 24/01 e conferir primeiro período 25–31/01, vencimento 01/02 e R$1.050. Ativar e emitir até 08/02 criou duas cobranças; a receber passou de R$1.050 para R$3.150 e caixa permaneceu R$57.100,32.
2. Na mesma sessão, agendar devolução, preencher quatro passos da vistoria com cinco ilustrações identificadas, enviar, conferir na gestão, receber carro/chaves e retornar 4 perfumes/5 carregadores/6 cabos. Encerrar só ficou disponível depois das conferências; acerto mostrou R$1.200 em aluguéis (abertura e um dia proporcional), preservados depois do encerramento. Sem caução ou recebimento inventados.
3. Em serviço temporário `4175`, login de conta fictícia, acesso ao painel completo, criação de um interessado e recarga. Cadastro permaneceu após resposta de gravação e nova leitura do servidor. Também foi testado o acesso do motorista: criação de vistoria, avanço painel → checklist → fotos, orientação ao faltar foto e salvamento para continuar depois. A revisão final mantém quatro passos também no portal autenticado; formulários com campo chamado `id` têm regressões para impedir envio silenciosamente ignorado. Esse serviço e seus dados de teste são descartados ao terminar a verificação.

O serviço permanente de homologação local usa `4174/operacao`, sem conta/senha padrão; o proprietário cria o primeiro acesso pela tela. A prévia em 4173 preserva a sessão `rodavolt-v3` e seus cenários. Movimentos de teste não foram gravados nessa sessão.

Limites: armazenamento local em arquivo transacional serializado, um processo por diretório e conexões apenas em 127.0.0.1. Não é banco relacional distribuído nem implantação de produção. Contratos/assinaturas e confirmações financeiras continuam demonstrativos; datas da operação são as do exemplo. Não foram homologados fornecedores de banco/Pix, assinatura, telemetria, push, uso entre dispositivos reais, infraestrutura pública, recuperação em desastre nem uma semana com o primeiro carro/motorista. Lotes são anotações do SKU e snapshots, sem compras por múltiplos lotes. Benefícios em outros aplicativos e parcerias continuam dependendo de provisionamento próprio. Não houve deploy, migração remota ou alteração no sistema antigo.
# Pacote contratual para conferência profissional · 18/10/2026

- Cinco minutas extensas adicionadas como novas versões: locação semanal, entrega/devolução, custódia do kit, aditivo e distrato. Os modelos curtos e contratos anteriores são preservados. Biblioteca e ficha do documento permitem baixar texto para revisão externa; `npm run contracts:export` gera os cinco arquivos em `docs/contratos/`.
- O pacote cobre cobrança vencida, caução segregada, uso, manutenção, seguro, sinistro, multas, rastreador/privacidade, loja com 100% da margem do motorista, devolução, contestação e quitação limitada. Valores comerciais não confirmados e dados reais de qualificação ficam apontados para preenchimento e revisão, sem serem tratados como aprovados.
- `npm run check`: **371 testes aprovados**, build e sintaxe integral. Os três novos testes conferem versão/preservação, regras confirmadas e sincronia dos arquivos de entrega ao advogado. A assinatura e o envio continuam demonstrativos; revisão por advogado, dados privados, apólice e fornecedor de assinatura seguem pendentes antes de uso real.
