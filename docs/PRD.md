# RODAVOLT · PRD v4

18/10/2026. Substitui o desenho v2. Direção do proprietário: começar novamente, reduzir confusão, recuperar a experiência completa do simulador antigo, incluir kanban, ajustar a loja para perfumes/acessórios e ampliar o app do motorista com decisão de corrida por objetivos.

## Produto e organização

Brasil e BRL fixos, locação semanal a motoristas de aplicativo. Uma operação pequena deve conseguir controlar o primeiro carro sem navegar numa estrutura de empresa grande. A mesma informação precisa suportar crescimento posterior.

Dez entradas na gestão: Painel ativo; Agenda e compromissos; Meu advogado; Visão do dia; Motoristas; Frota e cuidados; Financeiro; Loja no carro; Simulador de crescimento; Planejado × realizado. Histórico e exportação são utilitários. O app do motorista tem sua própria experiência, sem revelar o caixa da locadora.

A interface deve facilitar estas perguntas: o que conferir hoje? Quem está aguardando qual etapa? Qual carro pode ser entregue? O aluguel entrou? Quem ficou com o dinheiro da venda? Quanto sobra ao comprar outro carro? Quanto o motorista realmente ganha nesta corrida?

## Rotina da locadora

A tela inicial mostra recebido, caixa, aberto e frota; prioriza cobrança, cadastro, revisão e solicitações. Cada ação leva ao registro correspondente. Caixa abre a composição e o livro de origens. Valores do exemplo são rotulados como demonstrativos.

Kanban: Interessados → Documentação → Contrato e entrega → Rodando → Encerrados. Todo cartão possui nome, interesse, próxima ação, data e conferências. Arrastar e mover por formulário são equivalentes. Conferir documentação é decisão humana. Entrega requer documentos, contrato e vistoria conferidos; veículo precisa existir, estar disponível e sem vínculo concorrente. Encerrar o cartão não quita obrigações financeiras silenciosamente.

Frota: aquisição com desembolso/dívida rastreáveis, valor estimado, vínculo, hodômetro, manutenção e checklist. Ordem aberta bloqueia nova entrega; conclusão registra custo uma única vez e libera conforme vínculo. Hodômetro não retrocede. Carros adicionais podem ser vinculados a motoristas distintos.

Financeiro: cobranças semanais separadas de recebimentos; comprovante é pendência, não baixa. Conferência repetida não duplica receita. Despesa tem fonte, mês, centro e natureza. Principal reduz dívida, não lucro. Aporte não é faturamento. Correções em produção exigirão estorno/histórico e conciliação.

## Loja no carro

Catálogo confirmado: perfumaria e acessórios, com perfumes de bolso, carregadores veiculares e cabos como exemplos. Preços/custos/comissão são hipóteses demonstrativas, não condições comerciais aprovadas.

Cada SKU tem preço, custo, estoque central e kit. Transferência conserva quantidade. Venda baixa o kit e preserva preço, custo, comissão e quem recebeu. Dinheiro com motorista gera repasse líquido; recebido pela empresa pode gerar comissão a pagar. Acerto explícito gera lançamentos idempotentes. Não descontar comissão no aluguel sem registros correspondentes.

Na implantação real: fornecedores, compras, entrada fiscal, lote/validade de perfume, garantia de acessórios, devolução, avaria, inventário, termo de custódia e acerto por vínculo/período. Esses controles precisam de movimentos transacionais no servidor.

## Simulador empresarial

Uma página contínua: margem de segurança → premissas em seis grupos → aquisição inviável → visão executiva → dinheiro do bolso → fluxo detalhado → gráficos → patrimônio em três momentos → amortizar/comprar → comprar agora/esperar → linha de todos os meses. A tabela precede os gráficos, como na referência original. Recalcular sem botão Simular; preservar foco e mostrar erro perto do campo/formulário.

Premissas: capital e reserva, frota inicial/meta, preço e entrada em reais, Price e juros/prazo, aluguel e ocupação/perda/paradas, manutenção mensal simples e custo adicional por km, custos por veículo/empresa, tributos estimados, loja, depreciação, renda do caixa, reinvestimento, amortização, aportes/retiradas, inflação, reajuste, horizonte e calendário.

Fluxo: Hoje e cada ano/mês; entradas, despesas, parcela, principal programado, extra/total, saldo da dívida, juros da dívida/caixa, IR estimado, lucro, aportes, compras, retiradas, caixa e carros comprados. Cabeçalho legível, indicação de compra/reserva, memória por mês e CSV com todas as colunas. Não somar saldos em visões anuais.

Retorno distingue recuperação econômica pelo lucro e dinheiro efetivamente distribuído. Meta não atingida permanece não atingida. Reservas não são duplicadas como despesas. Sem aportes inventados, sem receita extra no mês zero e sem receita de carro recém-comprado no próprio mês. Venda abaixo da dívida reconhece a diferença negativa.

Cenários nomeados são cópias; carregar altera só o rascunho. Plano de referência só muda por ação explícita; a referência anterior é preservada como cenário. Realizado deriva do livro. Nova previsão herda o fechamento e altera só o futuro.

## Motorista

Início com aluguel, revisão, meta e atalhos. Metas/custos pessoais, análise de corrida, jornada diária, carteira/comprovante, kit/venda/reposição, manutenção, vistoria, condições/documentos e suporte com protocolos/resposta.

“Vale a corrida?” recebe oferta líquida ao motorista, km/min de aproximação e viagem, espera, reposicionamento e pedágio não reembolsado. Calcula combustível, custo variável e aluguel proporcional ao tempo planejado. Mostra sobra, líquido/km, líquido/hora, oferta mínima e diferença para a meta. A oferta mínima satisfaz o maior requisito entre mínimos de km/hora e meta diária convertida pelos km/horas planejados. Quem decide aceitar é o motorista. O registro pessoal não executa aceitação em outra plataforma.

Jornada pessoal não é receita da locadora. Salvar a mesma data corrige o dia; aluguel rateado não é multiplicado pelo número de corridas. Os ganhos e decisões pessoais não aparecem nas telas administrativas.

## Aceites prioritários

1. Mover motorista sem documentos para entrega mostra erro e preserva etapa; liberar depois de conferir funciona; segundo vínculo no mesmo carro é impedido.
2. Despesa de R$250 reduz caixa em R$250 e muda desvio, sem alterar plano.
3. Comprovante não muda caixa; confirmação adiciona aluguel uma vez.
4. Venda de perfume baixa uma unidade, calcula comissão vigente e responsabilidade pelo recebimento. Acerto repetido não duplica lançamentos.
5. Simulador mostra Hoje + N meses, fluxo anual/mensal completo, identidade de caixa e principal/juros coerentes.
6. Corrida considera aproximação/espera/reposicionamento; informação inválida não produz infinito. Alterar objetivos muda a recomendação. A decisão continua manual.
7. Ordens, solicitações e vistorias percorrem gestão/motorista. Custo de ordem concluída entra uma vez.

## Limite desta entrega

Protótipo funcional, estático, persistência no navegador e dados fictícios. Banco, autenticação/autorização, arquivos privados, cobrança/Pix, assinatura, conciliação real e app nativo automático serão implementações próprias, com homologação. O seletor Gestão/Motorista é demonstração de interface, não barreira de segurança.

## Ampliação confirmada pelo proprietário · v4

Financeiro com entradas, saídas e conciliação bancária. Agenda e compromissos. Aba Meu advogado com todos os modelos, elaboração/versionamento, fila, partes e assinatura. Fluxo do interessado à entrega e devolução. Vistoria no app do motorista. Painel ativo com todos os carros registrados no mapa e clique para contexto do veículo/motorista. Banco e rastreador ainda não escolhidos: validar primeiro o sistema, integrar depois.

Financeiro: compromisso não altera caixa; baixa cria um lançamento idempotente; extrato é evidência separada. Vínculo de conciliação exige conta, sentido e centavos equivalentes, um movimento por registro. Desfazer preserva extrato/livro. Extrato de título ainda aberto precisa dar baixa nesse título, sem receita solta duplicada. Cadastro de carro continua responsável por criar ativo e dívida; principal não pode superar a dívida. Saldo negativo e divergência de abertura continuam visíveis.

Meu advogado: locação semanal, entrega/devolução, custódia do kit, aditivo e distrato. Modelos/textos e documentos têm versões preservadas. Campos pendentes impedem revisão; revisão manual antecede fila e envio simulado. Cada parte tem registro separado. Contrato concluído só libera o gate do motorista/carro corretos, durante vigência; assinar não entrega o carro. Nome/modelo/placa da versão ficam preservados. Não são minutas prontas para uso jurídico.

Vistoria: rascunho → enviada → correção/aprovada. Tipo entrega/periódica/devolução, carro/vínculo, km, combustível, oito itens, avarias e cinco vistas. Foto local temporária não é enviada nem salva em localStorage; imagem demonstrativa é marcada como ilustração. Conferência humana é distinta de envio. Segurança pendente impede aprovação. Encerrar vínculo ou aprovar devolução invalida a entrega anterior.

Painel ativo: mapa geográfico, posições e percurso fictícios, idade do dado e sem conexão/desatualizado claramente identificados; clique abre contexto, documentos, vistorias, financeiro e histórico. Não animar demonstração como telemetria real. Telemetria depende do rastreador e do serviço contratados; não rastrear a pessoa fora do veículo por inferência.

Agenda: compromisso manual tem data/hora, responsável, vínculo, observações, lembrete e estado. Pendência derivada não se conclui apenas no calendário; o atalho leva à origem. Contas liquidadas deixam de aparecer como pendência. Motorista consulta apenas os compromissos/documentos do perfil selecionado na demonstração. Alertas funcionam dentro do app aberto; notificações externas são futuras.

Aceites adicionais: conciliar não altera caixa; pagamento reduz caixa uma vez; só assinatura de ambas as partes muda contrato para concluído; vistoria enviada não libera entrega; outro motorista/carro não reaproveita contrato/vistoria; posição antiga permanece desatualizada; encerramento exige nova vistoria de entrega.

## Programa do primeiro carro · orientação confirmada

O proprietário financiará o estoque inicial e reposições propostas. A loja deve elevar renda do motorista e poderá reduzir sua semana de aluguel. Toda margem disponível após os custos diretos definidos pertence ao motorista. No exemplo da venda, preço R$89, custo R$32 e margem R$57, sem taxa/tributo adicional de venda. Taxas, tributação, avarias, devoluções e responsabilização precisam de condições comerciais/profissionais definidas antes do uso real.

Acerto distingue duas opções: bruto conferido na empresa gera obrigação/crédito de R$57; retenção do lucro pelo motorista gera somente repasse líquido de R$32 e nenhum crédito adicional. Aplicar R$57 numa cobrança de R$1.050 deixa R$993 a receber em dinheiro; o crédito não aparece como entrada bancária. Margem não usada permanece obrigação. Caução tem saldo próprio por motorista, referência idempotente e devolução limitada ao saldo; nunca é receita, desconto automático ou crédito de compras.

Motoristas → Piloto e benefícios concentra parecer humano, caução e créditos. No app, Benefícios RODAVOLT mostra ganho da loja, extrato do crédito, uso opcional e próximos benefícios. Critérios de entrada: expectativas/entrevista, regras, segurança, orçamento da atividade, disponibilidade/comunicação e treinamento do kit. Cada conferência exige registro objetivo; documentação e aprovação não são automatizadas.

Acesso ao app de finanças pessoais é um benefício definido para implementação, sem provisionamento nesta prévia. Novos apps são planejados; parcerias somente depois do piloto. Contratos precisam de regras claras, versões, obrigações, caução e encerramento revisados por profissional. Não prometer blindagem absoluta ou que o motorista nunca sairá.
