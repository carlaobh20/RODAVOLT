# RODAVOLT · PRD v5 local

18/10/2026. Substitui o desenho v2. Direção do proprietário: começar novamente, reduzir confusão, recuperar a experiência completa do simulador antigo, incluir kanban, ajustar a loja para perfumes/acessórios e ampliar o app do motorista com decisão de corrida por objetivos.

## Produto e organização

Brasil e BRL fixos, locação semanal a motoristas de aplicativo. Uma operação pequena deve conseguir controlar o primeiro carro sem navegar numa estrutura de empresa grande. A mesma informação precisa suportar crescimento posterior.

Dez entradas na gestão: Painel ativo; Agenda e compromissos; Meu advogado; Visão do dia; Motoristas; Frota e cuidados; Financeiro; Loja no carro; Simulador de crescimento; Planejado × realizado. Histórico e exportação são utilitários. O app do motorista tem sua própria experiência, sem revelar o caixa da locadora.

A interface deve facilitar estas perguntas: o que conferir hoje? Quem está aguardando qual etapa? Qual carro pode ser entregue? O aluguel entrou? Quem ficou com o dinheiro da venda? Quanto sobra ao comprar outro carro? Quanto o motorista realmente ganha nesta corrida?

## Rotina da locadora

A tela inicial mostra recebido, caixa, aberto e frota; prioriza cobrança, cadastro, revisão e solicitações. Cada ação leva ao registro correspondente. Caixa abre a composição e o livro de origens. Valores do exemplo são rotulados como demonstrativos.

Kanban: Interessados → Documentação → Contrato e entrega → Rodando → Encerrados. Todo cartão possui nome, interesse, próxima ação, data e conferências. Arrastar e mover por formulário são equivalentes. Conferir documentação é decisão humana. Entrega requer documentos, contrato e vistoria conferidos; veículo precisa existir, estar disponível e sem vínculo concorrente. Encerrar o cartão não quita obrigações financeiras silenciosamente.

Frota: aquisição com desembolso/dívida rastreáveis, valor estimado, vínculo, hodômetro, manutenção e checklist. Ordem aberta bloqueia nova entrega; conclusão registra custo uma única vez e libera conforme vínculo. Hodômetro não retrocede. Carros adicionais podem ser vinculados a motoristas distintos.

Financeiro: cobranças semanais separadas de recebimentos; comprovante é pendência, não baixa. Conferência repetida não duplica receita. Despesa tem fonte, mês, centro e natureza. Principal reduz dívida, não lucro. Aporte não é faturamento. Correções locais usam estorno vinculado e histórico, preservando conciliação. Regras fiscais e operação real ainda exigem homologação.

## Loja no carro

Catálogo confirmado: perfumaria e acessórios, com perfumes de bolso, carregadores veiculares e cabos como exemplos. Preços/custos/comissão são hipóteses demonstrativas, não condições comerciais aprovadas.

Cada SKU tem preço, custo, estoque central e kit. Transferência conserva quantidade. Venda baixa o kit e preserva preço, custo, comissão e quem recebeu. Dinheiro com motorista gera repasse líquido; recebido pela empresa pode gerar comissão a pagar. Acerto explícito gera lançamentos idempotentes. Não descontar comissão no aluguel sem registros correspondentes.

Lote, validade e garantia têm campos/snapshots no catálogo e nas vendas; devolução, avaria, inventário e retorno do kit têm controle local. Na implantação real, validar fornecedores, compras/entrada fiscal, tributação e custódia de múltiplos lotes simultâneos do mesmo SKU. O registro atual de lote por SKU não equivale a rastreabilidade completa por unidade.

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

Plataforma para homologação local, com dados fictícios e duas entradas separadas. A prévia estática 4173 persiste no navegador e seu seletor Gestão/Motorista demonstra interface. O serviço local 4174 aplica login individual, projeções/comandos por titular, arquivos privados e persistência. Não está publicado para a internet. Banco/Pix, assinatura, conciliação real, telemetria, notificações externas e app nativo automático dependem de fornecedores e homologação própria.

## Ampliação confirmada pelo proprietário · v4

Financeiro com entradas, saídas e conciliação bancária. Agenda e compromissos. Aba Meu advogado com todos os modelos, elaboração/versionamento, fila, partes e assinatura. Fluxo do interessado à entrega e devolução. Vistoria no app do motorista. Painel ativo com todos os carros registrados no mapa e clique para contexto do veículo/motorista. Banco e rastreador ainda não escolhidos: validar primeiro o sistema, integrar depois.

Financeiro: compromisso não altera caixa; baixa cria um lançamento idempotente; extrato é evidência separada. Vínculo de conciliação exige conta, sentido e centavos equivalentes, um movimento por registro. Desfazer preserva extrato/livro. Extrato de título ainda aberto precisa dar baixa nesse título, sem receita solta duplicada. Cadastro de carro continua responsável por criar ativo e dívida; principal não pode superar a dívida. Saldo negativo e divergência de abertura continuam visíveis.

Meu advogado: locação semanal, entrega/devolução, custódia do kit, aditivo e distrato. Cinco textos completos para revisão profissional estão disponíveis na biblioteca, com download de modelo e rascunho preenchido; a versão curta antiga é preservada. Modelos/textos e documentos têm versões preservadas. Campos pendentes impedem revisão; revisão manual antecede fila e envio simulado. Cada parte tem registro separado. Contrato concluído só libera o gate do motorista/carro corretos, durante vigência; assinar não entrega o carro. Nome/modelo/placa da versão ficam preservados. Antes do uso real, o pacote exige escolhas comerciais, dados de qualificação em ambiente privado, revisão por advogado e assinatura válida. Ver `docs/PACOTE-CONTRATUAL.md`.

Vistoria: rascunho → enviada → correção/aprovada. Tipo entrega/periódica/devolução, carro/vínculo, km, combustível, oito itens, avarias e cinco vistas. Foto local temporária não é enviada nem salva em localStorage; imagem demonstrativa é marcada como ilustração. Conferência humana é distinta de envio. Segurança pendente impede aprovação. Encerrar vínculo ou aprovar devolução invalida a entrega anterior.

Painel ativo: mapa geográfico, posições e percurso fictícios, idade do dado e sem conexão/desatualizado claramente identificados; clique abre contexto, documentos, vistorias, financeiro e histórico. Não animar demonstração como telemetria real. Telemetria depende do rastreador e do serviço contratados; não rastrear a pessoa fora do veículo por inferência.

Agenda: compromisso manual tem data/hora, responsável, vínculo, observações, lembrete e estado. Pendência derivada não se conclui apenas no calendário; o atalho leva à origem. Contas liquidadas deixam de aparecer como pendência. Motorista consulta apenas os compromissos/documentos do perfil selecionado na demonstração. Alertas funcionam dentro do app aberto; notificações externas são futuras.

Aceites adicionais: conciliar não altera caixa; pagamento reduz caixa uma vez; só assinatura de ambas as partes muda contrato para concluído; vistoria enviada não libera entrega; outro motorista/carro não reaproveita contrato/vistoria; posição antiga permanece desatualizada; encerramento exige nova vistoria de entrega.

## Programa do primeiro carro · orientação confirmada

O proprietário financiará o estoque inicial e reposições propostas. A loja deve elevar renda do motorista e poderá reduzir sua semana de aluguel. Toda margem disponível após os custos diretos definidos pertence ao motorista. No exemplo da venda, preço R$89, custo R$32 e margem R$57, sem taxa/tributo adicional de venda. Taxas, tributação, avarias, devoluções e responsabilização precisam de condições comerciais/profissionais definidas antes do uso real.

Acerto distingue duas opções: bruto conferido na empresa gera obrigação/crédito de R$57; retenção do lucro pelo motorista gera somente repasse líquido de R$32 e nenhum crédito adicional. Aplicar R$57 numa cobrança de R$1.050 deixa R$993 a receber em dinheiro; o crédito não aparece como entrada bancária. Margem não usada permanece obrigação. Caução tem saldo próprio por motorista, referência idempotente e devolução limitada ao saldo; nunca é receita, desconto automático ou crédito de compras.

Motoristas → Piloto e benefícios concentra parecer humano, caução e créditos. No app, Benefícios RODAVOLT mostra ganho da loja, extrato do crédito, uso opcional e próximos benefícios. Critérios de entrada: expectativas/entrevista, regras, segurança, orçamento da atividade, disponibilidade/comunicação e treinamento do kit. Cada conferência exige registro objetivo; documentação e aprovação não são automatizadas.

Acesso ao app de finanças pessoais é um benefício definido para implementação, sem provisionamento nesta prévia. Novos apps são planejados; parcerias somente depois do piloto. Contratos precisam de regras claras, versões, obrigações, caução e encerramento revisados por profissional. Não prometer blindagem absoluta ou que o motorista nunca sairá.

## App do motorista simples · design do Finanças Pessoais

Orientação confirmada: pessoas com pouca familiaridade com tecnologia precisam encontrar uma tarefa e concluí-la com poucos passos. O proprietário pediu o design do projeto Finanças Pessoais. A referência é o checkout oficial da Mesa, lido sem alterações: `src/index.css`, `tailwind.config.js`, `src/components/AppShell.tsx` e o Dashboard móvel. Reaproveitar a linguagem visual; os dados, contas e integrações dos dois produtos permanecem independentes.

Quatro abas: Início, Aluguel, Lojinha e Mais. No início ativo, mostrar saldo a pagar depois dos créditos, vencimento e quatro ações: Vendi um produto, Conferir uma corrida, Fazer vistoria e Pedir ajuda. Cadastro em andamento mostra o próximo passo para receber o carro. Textos principais de 16px ou maiores, botões de 48px ou maiores, ícones acompanhados de nomes e formulários em uma coluna. Configurações, cálculos, caução e históricos ficam disponíveis por escolha do motorista, sem menu lateral duplicado.

Aparência: branco, cartões cinza com cantos de 24px e sem sombra, títulos arredondados, ações pretas em pílula, ícones de linha e navegação inferior fixa com indicador discreto. Tema claro/escuro segue a paleta do Finanças Pessoais; trocar tema não descarta formulário em preenchimento. Manter controles legíveis em vez dos rótulos pequenos da referência.

Vistoria em quatro passos: painel, itens, fotos e resumo/envio. Guardar campos válidos entre etapas e permitir sair sem prender o usuário em um campo inválido; orientar que o último rascunho válido foi preservado. O envio continua aguardando conferência. Na prévia estática, fotos são temporárias; o serviço local permite arquivos privados vinculados à vistoria.

Uma ação para usar os créditos disponíveis, com prévia do desconto e do saldo antes de confirmar. Reutilizar o motor contábil: respeitar titularidade, centavos, limite da cobrança, sobra para outra semana e reenvio idempotente. Explicar em linguagem simples venda bruta, custo e lucro; venda pendente não é desconto liberado, e lucro já pago não pode ser usado de novo.

Aceite: contratos/assinatura de teste, compromissos, manutenção, ajuda/respostas, produtos/reposição, benefícios, metas, análise de corrida e registro do dia continuam acessíveis. A gestão, simulador e plano preservado não são redesenhados nesta etapa. Validar no navegador e nos testes; a facilidade para motoristas reais ainda depende de teste com usuários do piloto.

## Combo e compra simples no carro

Confirmado: o proprietário envia um combo com vários produtos e quantidades; o motorista precisa enxergar seu estoque item por item e vendê-lo até consumir as unidades. Reposição é outro combo. A conferência oferece “Recebi tudo” ou relato das quantidades boas recebidas e da diferença. Envio tira da central para trânsito; recebido entra na custódia do motorista; diferença continua rastreada e não é perda automática nem dívida do motorista.

Fluxo de pagamento proposto: venda assistida pelo motorista, Pix específico por pedido e recebimento na conta da RODAVOLT. Cliente paga pelo app do banco, sem cadastro na loja. QR impresso para abrir catálogo é opcional futuro. Banco/provedor ainda não escolhido; nenhum QR pagável é gerado no protótipo.

Pedido reserva estoque; cancelar antes de pagar libera a reserva. Pagamento fictício conferido pela gestão registra caixa, CMV e crédito de margem apenas das vendas daquele pedido, sem acertar vendas manuais pendentes. Entrega é outra confirmação, que não movimenta dinheiro ou estoque outra vez. Preço/custo e motorista/carro da venda são preservados. O lucro registrado não significa que ainda está disponível se já foi usado no aluguel.

Venda paga não pode ser apagada ou cancelada por botão. Devolução/reembolso preserva recebimento, CMV e margem. Crédito já usado ou lucro já pago exige estorno/recuperação explícita antes do reembolso correspondente. Expiração libera reserva; pagamento tardio vira obrigação até devolução conferida. Esses caminhos já existem localmente; com o fornecedor escolhido, expiração bancária, pagamento tardio e reembolso precisam de homologação real. O serviço local aplica titularidade e gravação serializada; a prévia estática continua sem autenticação.

A auditoria completa e os próximos critérios de aceite estão em [AUDITORIA-DE-FLUXOS.md](AUDITORIA-DE-FLUXOS.md).


## Cobrança contratual e devolução v5

Escolha confirmada pelo proprietário: o motorista paga a semana já utilizada (vencido). Na configuração por contrato revisado/assinado, a gestão confere data de entrega, dia de vencimento, primeira/última semana proporcional ou inteira e referência das condições. A alternativa antecipada permanece uma configuração explícita, sem alterar silenciosamente o documento. A interface apresenta a primeira cobrança antes de salvar.

A entrega exige agenda válida da mesma versão, carro e ciclo. Emissão até uma data é idempotente e não recebe dinheiro. Preço é preservado; calendário incompatível e contrato alterado impedem emissão incoerente. As quatro cobranças de abertura não são duplicadas: continuidade exige cobertura histórica conferida e primeiro vencimento posterior.

Devolução segue agendamento → vistoria de retorno aprovada → recebimento físico de carro/chaves/km/combustível → retorno do kit bom/avariado → demonstrativo → encerramento. O kanban não contorna esses passos. Devolução não quita dívidas, não compensa caução/crédito e não encerra manutenção. Um carro recebido pode continuar indisponível por manutenção.

A última cobrança é ajustada conforme a regra conferida. Cobranças originais e pagamentos permanecem no histórico. Valor recebido a maior vira obrigação separada; sua devolução baixa caixa e passivo sem nova despesa. O pagamento da última parcial mantém o dia semanal combinado. Reajuste, multa, juros e cobrança após vigência não são inventados pelo sistema.

## Exceções financeiras e de estoque

A gestão pode estornar a última baixa elegível preservando lançamento original, evidência de conciliação e motivo. Recebimentos parciais/reabertos acumulam `paidAmount`; uma nova baixa não apaga a anterior. Abatimento de crédito tem estorno próprio; lucro pago exige recuperação confirmada para voltar a ficar disponível. Repasse de crédito disponível baixa obrigação sem despesa repetida. Aluguel já incluído em acerto encerrado exige revisão do acerto antes de reabrir crédito ou pagamento.

Venda paga admite retorno parcial por produto. Produto bom volta à central; avariado vai para quarentena até decisão humana de reposição ou baixa do custo, sem cobrança automática ao motorista. Pagamento fora do prazo não revive reserva nem cria ganho; é obrigação de devolver. No encerramento, conferir inclusive kit vazio e resolver pedidos/combos/acertos pendentes.

Multas, sinistros e avarias têm motorista/carro/ciclo, data, prazo, proposta de valor, manifestação e análise. Valor proposto não é dívida. Somente decisão manual fundamentada cria título vinculado; responsabilidade do motorista exige oportunidade de manifestação e seguradora exige aceite conferido. Ressarcimento usa natureza própria, separada de aluguel. Resolver uma ocorrência não paga título nem libera manutenção.

## Acesso, persistência e privacidade locais

O proprietário cria sua conta no primeiro acesso do serviço e cadastra os acessos dos motoristas. O servidor deriva a identidade do motorista da sessão, filtra visão/arquivos e permite comandos específicos; não aceita edição integral do livro por motorista. A gestão salva a operação completa com revisão esperada. Concorrência desatualizada devolve 409; idempotência impede repetir a mesma mutação.

Senhas são protegidas por scrypt; sessões HttpOnly e CSRF protegem o uso local. Gravação em `.local/rodavolt` é atômica e serializada. Não há banco remoto nem uso do projeto antigo. HTTP em loopback é homologação na máquina, sem promessa de segurança de publicação ou acesso do celular pela rede.

Jornadas, metas e decisões pessoais no serviço pertencem à conta `user.id`; a gestão não as recebe nem as inclui em backup. A cópia operacional inclui arquivos e trilha, exclui senhas e personal. Restaurar revoga sessões/acessos de motorista e exige reautenticação do proprietário e novo vínculo consciente. Arquivos originais são preservados. A política de retenção e recuperação externa ainda precisa de definição.

## Aceites complementares de homologação

- Duas semanas e dois motoristas produzem cobranças corretas; repetir não duplica cobrança nem caixa.
- Devolver no meio da semana preserva original, proporcionalidade e saldo. Retorno físico é obrigatório para liberar vínculo; dívida permanece rastreável.
- Reembolso não remove crédito já usado/pago sem estorno ou recuperação; quarentena não gera débito de motorista automaticamente.
- Estorno de baixa preserva original/conciliação e reabre somente o saldo correto; nova baixa acumula recebimentos.
- Acesso de motorista não lê outro vínculo, arquivos de terceiros ou finanças pessoais alheias. A gestão não recebe a área pessoal.
- Dois logins concorrentes não sobrescrevem revisão antiga; reenvio idempotente não repete efeito.
- Backup/restauração é verificado sem senhas/personal e exige recriar acessos de motorista; a restauração não apaga arquivos originais.
- Testes locais, build e sintaxe passam; evidências e contagem final constam em `VALIDACAO.md`. Aprovação local não declara produção, integrações ou piloto real homologados.
