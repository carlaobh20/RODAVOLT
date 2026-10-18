/* Port of pure strategy engines from the owner-provided RodaVolt-System. See docs/CENTRO-DE-ESTRATEGIA.md. */
(function(scope){const L={SEMANAS_POR_MES:52/12,calcularCapitalReciclavel:veiculos=>{if(veiculos.length)throw new Error("Use o adaptador de ativos para capital reciclável.");return {totalLiquido:0,veiculos:[]};}};

// shared/lib/amortizacao.ts
(function(){const {}=L;
// Matemática de amortização de financiamento — extraída de
// features/estrategia/intelligence/simulacaoEmpresarial.ts (2026-08-10, Épico 4 "Ativo
// Financeiro") pra virar utilitário compartilhado: o simulador hipotético (/estrategia) só
// conhecia Price; agora o financiamento REAL de cada veículo (features/frota) também precisa
// dessa conta, e Carlos pediu explicitamente a opção Price/SAC. É fórmula financeira genérica,
// não lógica de nenhum dos dois domínios — não fazia sentido um depender do outro pra isso.

/** Parcela fixa da Tabela Price (sistema francês de amortização). */
function calcularParcelaPrice(valorFinanciado        , taxaAmPct        , prazoMeses        )         {
  if (prazoMeses <= 0 || valorFinanciado <= 0) return 0;
  const i = taxaAmPct / 100;
  if (i === 0) return valorFinanciado / prazoMeses;
  return (valorFinanciado * i) / (1 - Math.pow(1 + i, -prazoMeses));
}

/**
 * Gera a tabela mês a mês (Price ou SAC) do início ao fim do financiamento.
 * Price: parcela fixa, juros decrescente, amortização crescente (calcularParcelaPrice).
 * SAC: amortização fixa (valorFinanciado / prazoMeses), juros e parcela decrescentes.
 * Genérica o bastante pra alimentar tanto o financiamento real por veículo (frota) quanto,
 * futuramente, qualquer outro lugar que precise da mesma conta.
 */
function gerarTabelaAmortizacao(
  valorFinanciado        ,
  taxaAmPct        ,
  prazoMeses        ,
  sistema
)                     {
  if (valorFinanciado <= 0 || prazoMeses <= 0) return [];

  const i = taxaAmPct / 100;
  const linhas                     = [];
  let saldoDevedor = valorFinanciado;

  if (sistema === 'price') {
    const parcela = calcularParcelaPrice(valorFinanciado, taxaAmPct, prazoMeses);
    for (let mes = 1; mes <= prazoMeses; mes++) {
      const juros = saldoDevedor * i;
      const amortizacao = Math.min(parcela - juros, saldoDevedor);
      saldoDevedor = Math.max(0, saldoDevedor - amortizacao);
      linhas.push({ mes, juros, amortizacao, parcela: amortizacao + juros, saldoDevedor });
    }
  } else {
    const amortizacaoFixa = valorFinanciado / prazoMeses;
    for (let mes = 1; mes <= prazoMeses; mes++) {
      const juros = saldoDevedor * i;
      const amortizacao = Math.min(amortizacaoFixa, saldoDevedor);
      saldoDevedor = Math.max(0, saldoDevedor - amortizacao);
      linhas.push({ mes, juros, amortizacao, parcela: amortizacao + juros, saldoDevedor });
    }
  }

  return linhas;
}

Object.assign(L,{calcularParcelaPrice,gerarTabelaAmortizacao});})();

// features/estrategia/expansao/intelligence/estrategias.ts
(function(){const {}=L;

// Épico 9 — Motor de Expansão, Fase 1.1 (correção pedida pelo Carlos 2026-08-11: "não invente
// números arbitrários e apresente como regra financeira universal" + "os parâmetros devem
// aparecer claramente na interface"). As 3 estratégias continuam sendo multiplicadores
// determinísticos sobre a MESMA premissa base do cenário (Regra dos 3 — 3 estratégias fixas e
// nomeadas não justificam uma tabela configurável nova) — a mudança desta revisão é que os 3
// números de cada estratégia agora são EXIBIDOS na tela (ver ExpansaoDaFrota.tsx, card
// "Parâmetros da estratégia"), não só documentados em comentário. O usuário vê exatamente por
// que "Conservadora" dá 1 carro e "Agressiva" dá 2, em vez de confiar numa conta escondida.
//
// Direção de cada estratégia (pedida explicitamente pelo Carlos):
// Conservadora = maior reserva, menor uso do capital, menor alavancagem.
// Balanceada   = reserva e uso do capital intermediários.
// Agressiva    = maior uso do capital, menor reserva, maior velocidade de expansão.
// Os valores exatos (50/75/100% e 1,5×/1×/0,5×) continuam sendo uma escolha de engenharia desta
// sessão, não uma norma de mercado — por isso ficam visíveis e editáveis-por-leitura na tela, não
// escondidos.

const ESTRATEGIAS                                                   = {
  conservadora: { fracaoCapitalUsavel: 0.5, multiplicadorReserva: 1.5 },
  balanceada: { fracaoCapitalUsavel: 0.75, multiplicadorReserva: 1.0 },
  agressiva: { fracaoCapitalUsavel: 1.0, multiplicadorReserva: 0.5 },
};

// Importante (correção da seção 7/8 do Carlos): capital reciclável (venda de veículo já
// sinalizada) NUNCA entra automaticamente no capitalParaAquisicao de nenhuma estratégia — mesmo
// a Agressiva. É mostrado como informação separada ("Capital reciclável potencial") em toda
// estratégia; se o usuário quiser contar com ele, ele mesmo soma ao editar capital_disponivel.
// Equity/capital reciclável só viram caixa quando o veículo é de fato vendido — tratá-los como
// caixa automaticamente seria exatamente o erro que o Carlos apontou.

Object.assign(L,{ESTRATEGIAS});})();

// features/estrategia/expansao/intelligence/capacidadeDeCompra.ts
(function(){const {}=L;
// Épico 10 — Fase 3.2 (2026-08-12). Fonte única do gate "dá pra comprar mais um veículo agora?".
//
// ORIGEM (auditoria pedida antes de mexer): a mesma checagem de 2 etapas existia, escrita à mão,
// em 2 lugares:
//   1) `crescimentoComposto.ts` (Épico 9, `tentarComprar`, closure local, não exportada) —
//      reserva mínima primeiro, depois DSCR projetado do próximo mês (NOI projetado incluindo o
//      veículo candidato / parcelas projetadas incluindo a 1ª parcela do candidato), contra
//      `cenario.dscr_minimo_atencao`. `noiAtual` ali soma receita−custo de cada veículo ativo
//      (Fase 2.1: por veículo, não uniforme) e SUBTRAI `cenario.contador_mensal` — uma despesa
//      fixa da empresa que só existe no modelo do Épico 9.
//   2) `cicloDeVenda.ts` (Épico 10 Fase 2, `podeComprar`, closure local, não exportada) — MESMA
//      fórmula de 2 etapas, contra `opcoes.dscrMinimoAtencao`. `noiAtual` ali é
//      `ativos().length × (receitaMensal − custoMensal)` (frota uniforme, sem contador mensal —
//      esse conceito não existe no cenário do Épico 10).
// `comparadorMomentosDeVenda.ts` (Épico 10 Fase 1) tinha só a metade 1 (reserva) — a auditoria da
// Fase 3.1 (relatório `relatorio-epico10-fase3.1-auditoria-2026-08-12.md`) mostrou isso causando
// recomendações que o motor com DSCR bloquearia (caixa negativo em cenários de reserva baixa +
// economia marginal do veículo).
//
// DECISÃO (Fase 3.2, opção 1 escolhida pelo Carlos): extrair o NÚCLEO da fórmula (a comparação
// matemática em si — reserva, depois DSCR) pra esta função pura, e fazer os 3 lugares chamarem
// ela. O que NÃO foi unificado, de propósito: como cada motor CALCULA noiAtual/parcelasAtivas
// (isso depende da forma de cada cenário — `contador_mensal` só existe no Épico 9, frota
// uniforme vs. por veículo real são coisas diferentes dos 2 motores) — a função abaixo só recebe
// os números já prontos, nunca lê `cenario.*` diretamente, então nenhum dos dois formatos de
// cenário precisa mudar.

/**
 * Gate de 2 etapas — reserva mínima primeiro (mais barato de checar, e histórico: era a única
 * trava que existia), DSCR projetado depois, só se a reserva passar. Mesma ordem, mesma fórmula,
 * nos 3 lugares que chamam esta função.
 */
function avaliarCapacidadeDeCompra(p                              )                              {
  const eps = p.epsilonCaixa ?? 1;
  const custoMinimo = p.entrada + p.reservaMinima;
  if (p.caixa + eps < custoMinimo) return { pode: false, motivo: 'reserva' };

  const noiProjetado = p.noiAtual + p.noiMarginalCandidato;
  const parcelasProjetadas = p.parcelasAtivasProjetadas + p.parcelaCandidato;
  const dscrProjetado = parcelasProjetadas > 0 ? noiProjetado / parcelasProjetadas : null;

  if (dscrProjetado !== null && dscrProjetado < p.dscrMinimoAtencao) {
    return { pode: false, motivo: 'dscr', dscrProjetado };
  }
  return { pode: true };
}

Object.assign(L,{avaliarCapacidadeDeCompra});})();

// features/estrategia/expansao/intelligence/motor.ts
(function(){const {gerarTabelaAmortizacao,SEMANAS_POR_MES,calcularCapitalReciclavel,ESTRATEGIAS}=L;

// Épico 9 — Motor de Expansão, Fase 1 (revisado na Fase 1.1, 2026-08-11, com as correções
// pedidas pelo Carlos após o primeiro relatório de entrega — ver comentários marcados
// "[Fase 1.1]" abaixo). Responde a pergunta central: "com o capital que eu tenho HOJE, quantos
// veículos cabem, e como fica a estrutura (parcela, DSCR, quitação, equity) ao longo do
// horizonte?" — uma pergunta de CAPACIDADE ESTÁTICA (quanto cabe agora), não de crescimento
// composto reinvestindo lucro mês a mês (isso já existe e não é duplicado aqui — é o motor do
// Épico 3, simularCrescimentoEmpresarial). "Próximo marco" (calcularProximoMarco, abaixo) é o
// primeiro passo em direção a projeção de expansão composta pedida na seção 9 do brief de
// fechamento: quando o CAIXA OPERACIONAL do lote já comprado, sozinho, cobre o próximo veículo —
// sem inventar uma data quando isso não acontece dentro do horizonte.
//
// Reaproveita: gerarTabelaAmortizacao (shared/lib/amortizacao.ts, mesmo motor usado pelo
// financiamento real dos veículos e pelo simulador hipotético do Épico 3) e SEMANAS_POR_MES
// (mesma constante do Épico 3).

function calcularExpansao(
  cenario                 ,
  veiculosFrotaAtual           ,
  estrategia                    ,
  hoje       = new Date()
)                    {
  const mult = ESTRATEGIAS[estrategia];

  // [Fase 1.1] Capital reciclável é SEMPRE só informativo — nunca soma ao pool de aquisição de
  // nenhuma estratégia (correção da seção 7/8: equity/venda futura não é caixa até se realizar).
  const capitalReciclavelPotencial = calcularCapitalReciclavel(veiculosFrotaAtual, cenario.venda_custos_pct, hoje).totalLiquido;
  const capitalParaAquisicao = cenario.capital_disponivel * mult.fracaoCapitalUsavel;
  const reservaAplicada = cenario.reserva_minima * mult.multiplicadorReserva;
  const custoMinimoParaComprar = cenario.entrada_por_veiculo + reservaAplicada;

  // Capacidade estática: quantos veículos cabem de uma vez, comprados no mês 0. O loop só compra
  // enquanto sobra >= entrada + reserva — nunca deixa o caixa remanescente abaixo da reserva
  // aplicada (validado explicitamente no cenário de teste do Carlos: capital 100k / reserva 30k /
  // entrada 36k não pode gerar saldo negativo).
  let veiculosAdicionados = 0;
  let caixaRestante = capitalParaAquisicao;
  while (caixaRestante >= custoMinimoParaComprar) {
    if(veiculosAdicionados>=1000)throw new RangeError("Cenário ultrapassa 1.000 veículos; revise capital e entrada.");
    caixaRestante -= cenario.entrada_por_veiculo;
    veiculosAdicionados += 1;
  }
  const caixaRestanteInicial = caixaRestante;

  const valorFinanciadoPorVeiculo = Math.max(0, cenario.preco_veiculo - cenario.entrada_por_veiculo);
  const tabela = gerarTabelaAmortizacao(
    valorFinanciadoPorVeiculo,
    cenario.taxa_juros_am_pct,
    cenario.prazo_financiamento_meses,
    cenario.sistema_amortizacao
  );
  const parcelaMensalPorVeiculo = tabela.length > 0 ? tabela[0].parcela : 0;

  const aluguelMensalPorVeiculo = cenario.aluguel_semanal_por_veiculo * SEMANAS_POR_MES;
  const ocupacao = cenario.ocupacao_pct / 100;
  const ipvaMensalPorVeiculo = cenario.ipva_anual_por_veiculo / 12;

  const meses                = [];
  let caixaOperacionalAcumulado = 0;
  let mesEmQueProximoVeiculoCabe                = null;

  for (let mes = 0; mes <= cenario.horizonte_meses; mes++) {
    // Veículos comprados no mês 0; tabela é 1-indexada pela 1ª parcela (mês seguinte à compra).
    const linha = mes >= 1 && mes <= tabela.length ? tabela[mes - 1] : null;

    const receitaIncremental = mes === 0 ? 0 : veiculosAdicionados * aluguelMensalPorVeiculo * ocupacao;
    const despesaOperacionalIncremental = mes === 0 ? 0 :
      veiculosAdicionados *
        (cenario.seguro_mensal_por_veiculo +
          ipvaMensalPorVeiculo +
          cenario.rastreador_mensal_por_veiculo +
          cenario.manutencao_por_km * cenario.km_mensal_por_veiculo) +
      cenario.contador_mensal;

    const parcelasIncrementais = linha ? linha.parcela * veiculosAdicionados : 0;
    const saldoDevedorIncremental = linha
      ? linha.saldoDevedor * veiculosAdicionados
      : mes === 0
        ? valorFinanciadoPorVeiculo * veiculosAdicionados
        : 0;

    const noi = receitaIncremental - despesaOperacionalIncremental;
    const dscr = parcelasIncrementais > 0 ? noi / parcelasIncrementais : null;
    const statusDscr                            =
      dscr === null
        ? null
        : dscr >= cenario.dscr_minimo_saudavel
          ? 'saudavel'
          : dscr >= cenario.dscr_minimo_atencao
            ? 'atencao'
            : 'insuficiente';

    // Fase 1: sem curva de depreciação para a frota nova — o valor incremental fica no preço de
    // aquisição (o simulador hipotético do Épico 3 já modela depreciação para cenários
    // hipotéticos; replicar essa curva aqui sem ter sido pedida seria inventar uma premissa nova).
    const valorFrotaIncremental = veiculosAdicionados * cenario.preco_veiculo;
    const equityIncremental = valorFrotaIncremental - saldoDevedorIncremental;

    // [Fase 1.1] Fluxo de caixa livre do mês (o que sobra depois de pagar a parcela) — negativo
    // se a parcela+despesa superar a receita. Acumulado desde o mês 0.
    const fluxoLivreMensal = receitaIncremental - despesaOperacionalIncremental - parcelasIncrementais;
    caixaOperacionalAcumulado += fluxoLivreMensal;

    // Venda programada (seção 13 do brief original): credita o valor líquido no caixa
    // operacional acumulado no mês configurado.
    if (cenario.venda_programada_mes === mes && cenario.venda_valor_estimado !== null) {
      const custosVenda = cenario.venda_valor_estimado * (cenario.venda_custos_pct / 100);
      caixaOperacionalAcumulado += cenario.venda_valor_estimado - custosVenda;
    }

    // [Fase 1.1] Próximo marco: primeiro mês em que (sobra inicial + caixa operacional já
    // acumulado) cobre a entrada + reserva de mais 1 veículo. Só primeira ocorrência conta.
    if (mesEmQueProximoVeiculoCabe === null && caixaRestanteInicial + caixaOperacionalAcumulado >= custoMinimoParaComprar) {
      mesEmQueProximoVeiculoCabe = mes;
    }

    meses.push({
      mes,
      veiculosNovos: veiculosAdicionados,
      compradosNoMes: mes === 0 ? veiculosAdicionados : 0,
      caixaDisponivelParaAquisicao: caixaRestanteInicial,
      receitaIncremental,
      despesaIncremental: despesaOperacionalIncremental,
      parcelasIncrementais,
      caixaOperacionalAcumulado,
      saldoDevedorIncremental,
      valorFrotaIncremental,
      equityIncremental,
      patrimonioTotalIncremental: caixaOperacionalAcumulado + equityIncremental,
      dscr,
      statusDscr,
    });
  }

  const proximoMarco               =
    mesEmQueProximoVeiculoCabe !== null
      ? { possivel: true, mesesAteProximoVeiculo: mesEmQueProximoVeiculoCabe }
      : { possivel: false, motivo: 'Não há capital suficiente nas premissas atuais dentro do horizonte configurado.' };

  return {
    estrategia,
    meses,
    veiculosAdicionadosTotal: veiculosAdicionados,
    capitalUsadoTotal: veiculosAdicionados * cenario.entrada_por_veiculo,
    capitalDisponivelParaAquisicao: capitalParaAquisicao,
    reservaMinimaAplicada: reservaAplicada,
    capitalReciclavelPotencial,
    parcelaMensalPorVeiculo,
    valorFinanciadoPorVeiculo,
    avisoCapitalInsuficienteParaUmVeiculo: veiculosAdicionados === 0,
    proximoMarco,
  };
}

/** Roda as 3 estratégias fixas sobre o mesmo cenário — a "comparação de estratégias" pedida na tela. */
function compararEstrategias(
  cenario                 ,
  veiculosFrotaAtual           ,
  hoje       = new Date()
)                                                {
  return {
    conservadora: calcularExpansao(cenario, veiculosFrotaAtual, 'conservadora', hoje),
    balanceada: calcularExpansao(cenario, veiculosFrotaAtual, 'balanceada', hoje),
    agressiva: calcularExpansao(cenario, veiculosFrotaAtual, 'agressiva', hoje),
  };
}

Object.assign(L,{calcularExpansao,compararEstrategias});})();

// features/estrategia/expansao/intelligence/crescimentoComposto.ts
(function(){const {calcularParcelaPrice,gerarTabelaAmortizacao,calcularResumoFinanciamentoReal,resolverValorAtualVeiculo,calcularReceitaMensalEquivalente,SEMANAS_POR_MES,ESTRATEGIAS,avaliarCapacidadeDeCompra}=L;

// Épico 9 — Motor de Expansão, Fase 2 (Crescimento Composto, 2026-08-11). A Fase 1
// (intelligence/motor.ts) responde "quantos veículos cabem AGORA" — capacidade estática, 1 lote
// comprado no mês 0. Esta Fase 2 responde "como a frota evolui reciclando o próprio resultado
// operacional e produto de venda em novas compras" — mês a mês, comprando/vendendo veículos
// PROJETADOS (nunca escritos em `veiculos`, seção 8 do brief) enquanto a estratégia permitir.
//
// Reaproveita sem duplicar: calcularParcelaPrice/gerarTabelaAmortizacao (shared/lib/amortizacao,
// mesmo motor da Fase 1 e do financiamento real), SEMANAS_POR_MES (Épico 3), ESTRATEGIAS (mesmos
// 3 parâmetros visíveis da Fase 1 — nenhum multiplicador novo escondido).
//
// Escopo desta implementação (autorizado explicitamente pelo Carlos, seção 2 do brief da Fase 2):
// só os métodos 'caixa_operacional' e 'caixa_e_venda' estão implementados. 'caixa_aporte' é
// recusado abaixo — não existe simulação de novo aporte externo nesta fase (fica pra Fase 3).
//
// Fase 2.1, Parte 2 (2026-08-11) — MUDANÇA em relação à Fase 2: a frota REAL já existente na
// empresa agora entra na simulação desde o mês 0, não só como número agregado de caixa. Cada
// veículo real continua sendo simulado mês a mês com a PRÓPRIA tabela de amortização real
// (calcularResumoFinanciamentoReal — não a tabela hipotética do cenário) e a PRÓPRIA receita real
// (contrato ativo, se houver). Isso fecha as limitações #1 e #2 do relatório da Fase 2: "frota
// real não entra na projeção" e "DSCR usa aproximação". O que NÃO muda: veículos reais nunca são
// "comprados" ou "vendidos" por este motor — só os PROJETADOS (origem: 'projetado') entram no
// audit trail de compra/venda e no `resultado.veiculos` retornado.

const EPS = 1e-6;

/**
 * Fase 2.1, Parte 2 — monta a frota real no formato que o motor de crescimento consome.
 * Reaproveita sem duplicar: calcularResumoFinanciamentoReal (frota/intelligence, dívida exata),
 * resolverValorAtualVeiculo (shared/lib, mercado→FIPE→compra), calcularReceitaMensalEquivalente
 * (shared/lib, mesmo cálculo do Yield do Ativo). Nenhuma tabela nova, nenhum cálculo de negócio
 * novo — só reconstrói o que já existe no formato que `calcularCrescimentoComposto` precisa.
 *
 * Exclui veículos com status 'encerrado' (mesma convenção de calcularEstadoRealFrota — não fazem
 * mais parte da frota ativa da empresa).
 */
function calcularCrescimentoComposto(
  cenario                 ,
  estrategia                    ,
  horizonte                      ,
  frotaReal                            = []
)                               {
  if (cenario.metodo_crescimento === 'caixa_aporte') {
    throw new Error(
      'Método "caixa + venda + novo aporte" ainda não foi implementado (Fase 2 só cobre caixa operacional e venda programada). Escolha outro método.'
    );
  }

  const mult = ESTRATEGIAS[estrategia];
  const permiteVenda = cenario.metodo_crescimento === 'caixa_e_venda' && cenario.vender_apos_meses !== null && cenario.valor_venda_por_veiculo !== null;

  const capitalInicialAquisicao = cenario.capital_disponivel * mult.fracaoCapitalUsavel;
  const reservaAplicada = cenario.reserva_minima * mult.multiplicadorReserva;
  const custoMinimoParaComprar = cenario.entrada_por_veiculo + reservaAplicada;

  const valorFinanciadoPorVeiculo = Math.max(0, cenario.preco_veiculo - cenario.entrada_por_veiculo);
  const tabelaPadrao = gerarTabelaAmortizacao(valorFinanciadoPorVeiculo, cenario.taxa_juros_am_pct, cenario.prazo_financiamento_meses, cenario.sistema_amortizacao);
  const parcelaPrimeiraMensal = tabelaPadrao[0]?.parcela ?? 0;

  const aluguelMensalPorVeiculo = cenario.aluguel_semanal_por_veiculo * SEMANAS_POR_MES;
  const ocupacao = cenario.ocupacao_pct / 100;
  const ipvaMensalPorVeiculo = cenario.ipva_anual_por_veiculo / 12;
  const custoOperacionalUnitario =
    cenario.seguro_mensal_por_veiculo + ipvaMensalPorVeiculo + cenario.rastreador_mensal_por_veiculo + cenario.manutencao_por_km * cenario.km_mensal_por_veiculo;
  const receitaUnitaria = aluguelMensalPorVeiculo * ocupacao;

  // `veiculosComprados` é só o que ESTA simulação compra (retornado em `resultado.veiculos`,
  // mesma semântica da Fase 2 — nunca inclui frota real). `frotaCompleta` é o conjunto de
  // trabalho mês a mês: começa com a frota real (Fase 2.1) e cresce com cada compra.
  const veiculosComprados                     = [];
  const tabelasPorVeiculo = new Map                            ();
  const eventos                      = [];
  const meses                   = [];

  // Cada veículo real "entra" na simulação como se tivesse sido comprado no mês 0 (mesmo grau
  // de graça de 1 mês que um veículo projetado tem no mês da própria compra — zero parcela em
  // mesReferencia=0, primeira parcela simulada só em mesReferencia=1), mas com a tabela JÁ
  // FATIADA a partir da parcela seguinte à última paga de verdade (mesesDecorridos). É isso que
  // faz a parcela nº mesesDecorridos+1 (a próxima que realmente vai vencer) cair exatamente em
  // mesReferencia=1 — sem recontar nenhuma parcela que o veículo já pagou antes de hoje.
  const frotaCompleta                     = frotaReal.map((vr, idx) => {
    const numero = -(idx + 1); // negativo — nunca colide com proximoNumero (sempre >= 1)
    tabelasPorVeiculo.set(numero, vr.tabela.slice(vr.mesesDecorridos));
    return {
      numero,
      origem: 'real',
      identificador: vr.identificador,
      mesCompra: 0,
      precoCompra: 0,
      entrada: 0,
      valorFinanciado: vr.saldoDevedorAtual,
      vendidoNoMes: null,
      receitaMensal: vr.receitaMensalReal,
      custoOperacionalMensal: custoOperacionalUnitario,
      valorAtual: vr.valorAtual,
    };
  });

  let caixaExpansao = 0;
  let proximoNumero = 1;
  let ultimoMotivoBloqueio                                                     = null;

  function parcelaAtivaNoMes(v                  , mesReferencia        )                                                          {
    const tabela = tabelasPorVeiculo.get(v.numero) ?? tabelaPadrao;
    const r = mesReferencia - v.mesCompra;
    if (r < 1 || r > tabela.length) return { juros: 0, amortizacao: 0, parcela: 0 };
    const linha = tabela[r - 1];
    return { juros: linha.juros, amortizacao: linha.amortizacao, parcela: linha.parcela };
  }

  // Só chamada para veículos origem 'projetado' (venda programada nunca vende frota real nesta
  // fase — ver loop de vendas abaixo) — por isso pode seguir usando o financiamento hipotético
  // do cenário como piso do "antes da 1ª parcela", sem precisar de v.valorFinanciado aqui.
  function saldoDevedorAntes(v                  , mesReferencia        )         {
    const tabela = tabelasPorVeiculo.get(v.numero) ?? tabelaPadrao;
    const r = mesReferencia - v.mesCompra;
    if (r <= 1) return valorFinanciadoPorVeiculo;
    if (r - 2 >= tabela.length) return 0;
    return tabela[r - 2].saldoDevedor;
  }

  // Seção 6/30 — regra explícita de expansão: nunca "cabe, então compra" sem checar (1) reserva
  // mínima da estratégia e (2) capacidade de dívida projetada (DSCR do próximo mês, incluindo o
  // veículo novo, não pode furar dscr_minimo_atencao do cenário). Loop compra quanto couber no
  // mesmo mês (pode ser >1), cada compra decrementando o caixa — sempre termina porque entrada > 0.
  //
  // Fase 3.2 (Épico 10, 2026-08-12) — o gate em si (reserva, depois DSCR) foi extraído pra
  // `avaliarCapacidadeDeCompra` (capacidadeDeCompra.ts), a mesma função que `cicloDeVenda.ts` e
  // `comparadorMomentosDeVenda.ts` agora chamam (fonte única — auditoria
  // `relatorio-epico10-fase3.1-auditoria-2026-08-12.md`). O que fica só aqui: como montar
  // `noiAtual`/`parcelasAtivasProjetadas` a partir da frota REAL por veículo (Fase 2.1) e o
  // desconto de `contador_mensal` — específico do modelo do Épico 9, a função compartilhada não
  // sabe disso, só recebe o NOI já pronto. `epsilonCaixa: EPS` (1e-6) preserva a tolerância
  // exata já validada deste motor (os outros 2 arquivos usam 1, o default da função).
  function tentarComprar(mes        , veiculosAtivos                    ) {
    for (;;) {
      if(veiculosComprados.length>=1000)throw new RangeError("Cenário ultrapassa 1.000 aquisições; revise as premissas.");
      const parcelasAtivasProjetadas = veiculosAtivos.reduce((soma, v) => soma + parcelaAtivaNoMes(v, mes + 1).parcela, 0);
      // Fase 2.1 — NOI por veículo (não mais uniforme): cada veículo real contribui sua própria
      // receita real (contrato ativo, ou 0) menos a mesma premissa de custo operacional; isso é
      // o que torna o DSCR de compra sensível à frota real de verdade, não só à projetada.
      const noiAtual = veiculosAtivos.reduce((soma, v) => soma + (v.receitaMensal - v.custoOperacionalMensal), 0) - cenario.contador_mensal;
      const resultado = avaliarCapacidadeDeCompra({
        caixa: caixaExpansao,
        entrada: cenario.entrada_por_veiculo,
        reservaMinima: reservaAplicada,
        noiAtual,
        noiMarginalCandidato: receitaUnitaria - custoOperacionalUnitario,
        parcelasAtivasProjetadas,
        parcelaCandidato: parcelaPrimeiraMensal,
        dscrMinimoAtencao: cenario.dscr_minimo_atencao,
        epsilonCaixa: EPS,
      });

      if (!resultado.pode) {
        if (resultado.motivo === 'reserva') {
          if (ultimoMotivoBloqueio !== 'reserva_insuficiente') {
            eventos.push({
              mes,
              tipo: 'compra_bloqueada',
              veiculoNumero: proximoNumero,
              motivoBloqueio: 'reserva_insuficiente',
              descricao: `Caixa disponível (${fmt(caixaExpansao)}) não cobre entrada + reserva mínima (${fmt(custoMinimoParaComprar)}).`,
              numeros: { caixaDisponivel: caixaExpansao, entradaNecessaria: cenario.entrada_por_veiculo, reservaMinima: reservaAplicada, gap: custoMinimoParaComprar - caixaExpansao },
            });
            ultimoMotivoBloqueio = 'reserva_insuficiente';
          }
        } else {
          if (ultimoMotivoBloqueio !== 'limite_de_divida') {
            const noiProjetado = noiAtual + (receitaUnitaria - custoOperacionalUnitario);
            const parcelasProjetadas = parcelasAtivasProjetadas + parcelaPrimeiraMensal;
            eventos.push({
              mes,
              tipo: 'compra_bloqueada',
              veiculoNumero: proximoNumero,
              motivoBloqueio: 'limite_de_divida',
              descricao: `DSCR projetado do próximo mês com este veículo (${resultado.dscrProjetado.toFixed(2)}×) ficaria abaixo do mínimo de atenção (${cenario.dscr_minimo_atencao.toFixed(2)}×). Caixa disponível, mas a dívida bloqueia.`,
              numeros: { dscrProjetado: resultado.dscrProjetado, dscrMinimoAtencao: cenario.dscr_minimo_atencao, parcelasProjetadas, noiProjetado },
            });
            ultimoMotivoBloqueio = 'limite_de_divida';
          }
        }
        return;
      }

      const numero = proximoNumero++;
      const tabela = gerarTabelaAmortizacao(valorFinanciadoPorVeiculo, cenario.taxa_juros_am_pct, cenario.prazo_financiamento_meses, cenario.sistema_amortizacao);
      tabelasPorVeiculo.set(numero, tabela);
      const veiculo                   = {
        numero,
        origem: 'projetado',
        identificador: null,
        mesCompra: mes,
        precoCompra: cenario.preco_veiculo,
        entrada: cenario.entrada_por_veiculo,
        valorFinanciado: valorFinanciadoPorVeiculo,
        vendidoNoMes: null,
        receitaMensal: receitaUnitaria,
        custoOperacionalMensal: custoOperacionalUnitario,
        valorAtual: cenario.preco_veiculo,
      };
      veiculosComprados.push(veiculo);
      frotaCompleta.push(veiculo);
      veiculosAtivos.push(veiculo);
      caixaExpansao -= cenario.entrada_por_veiculo;
      ultimoMotivoBloqueio = null;

      eventos.push({
        mes,
        tipo: 'compra_autorizada',
        veiculoNumero: numero,
        descricao: `Veículo #${numero} comprado. Caixa disponível ${fmt(caixaExpansao + cenario.entrada_por_veiculo)}, entrada ${fmt(cenario.entrada_por_veiculo)}, reserva mínima ${fmt(reservaAplicada)} preservada.`,
        numeros: { caixaAntes: caixaExpansao + cenario.entrada_por_veiculo, entrada: cenario.entrada_por_veiculo, caixaDepois: caixaExpansao, reservaMinima: reservaAplicada },
      });
    }
  }

  for (let mes = 0; mes <= horizonte; mes++) {
    if (mes === 0) caixaExpansao = capitalInicialAquisicao;

    const veiculosAtivos = frotaCompleta.filter((v) => v.vendidoNoMes === null);
    const caixaInicial = caixaExpansao;

    // 1) Vendas programadas deste mês (seção 11/13) — proventos entram no caixa ANTES da
    // tentativa de compra do mesmo mês, permitindo reciclagem imediata (venda → caixa → compra
    // no mesmo mês, se der). Fase 2.1: nunca vende frota real (`origem === 'real'`) — este motor
    // só compra/vende os veículos que ele mesmo projeta.
    let produtoLiquidoVendas = 0;
    let veiculosVendidosNoMes = 0;
    if (permiteVenda) {
      for (const v of [...veiculosAtivos]) {
        if (v.origem !== 'projetado') continue;
        const r = mes - v.mesCompra;
        if (r === cenario.vender_apos_meses) {
          const saldoDevedor = saldoDevedorAntes(v, mes);
          const custosVenda = cenario.valor_venda_por_veiculo  * (cenario.venda_custos_pct / 100);
          const liquido = cenario.valor_venda_por_veiculo - saldoDevedor - custosVenda;
          v.vendidoNoMes = mes;
          caixaExpansao += liquido;
          produtoLiquidoVendas += liquido;
          veiculosVendidosNoMes += 1;
          veiculosAtivos.splice(veiculosAtivos.indexOf(v), 1);
          eventos.push({
            mes,
            tipo: 'venda',
            veiculoNumero: v.numero,
            descricao: `Veículo #${v.numero} vendido por ${fmt(cenario.valor_venda_por_veiculo )}. Saldo devedor quitado ${fmt(saldoDevedor)}, custos de venda ${fmt(custosVenda)}. Capital líquido reciclado: ${fmt(liquido)}.`,
            numeros: { valorVenda: cenario.valor_venda_por_veiculo , saldoDevedor, custosVenda, liquido },
          });
        }
      }
    }

    // 2) Tenta comprar com o caixa já atualizado pela venda deste mês.
    tentarComprar(mes, veiculosAtivos);

    // 3) Port correction: only vehicles bought before this month generate operating flows.
    // Legacy convention (superseded): novo veículo já gera receita no
    // próprio mês da compra, mesma convenção da Fase 1; sua 1ª parcela só vence no mês seguinte,
    // porque a tabela de amortização é 1-indexada a partir do mês da compra). Fase 2.1: receita e
    // custo agora são somados por veículo (cada um com seu próprio valor), não mais
    // `quantidade × valor uniforme` — é isso que permite um veículo real com contrato ativo
    // contribuir sua receita de verdade, e um real sem contrato contribuir R$ 0 de verdade.
    const receita = veiculosAtivos.filter(v=>v.mesCompra<mes).reduce((soma, v) => soma + v.receitaMensal, 0);
    const custosOperacionais = mes===0?0:veiculosAtivos.filter(v=>v.mesCompra<mes).reduce((soma, v) => soma + v.custoOperacionalMensal, 0) + cenario.contador_mensal;
    let jurosDoMes = 0;
    let amortizacaoDoMes = 0;
    let parcelasDoMes = 0;
    for (const v of veiculosAtivos) {
      const { juros, amortizacao, parcela } = parcelaAtivaNoMes(v, mes);
      jurosDoMes += juros;
      amortizacaoDoMes += amortizacao;
      parcelasDoMes += parcela;
    }

    const fluxoDeCaixa = receita - custosOperacionais - parcelasDoMes;
    caixaExpansao += fluxoDeCaixa;

    const dividaTotal = veiculosAtivos.reduce((soma, v) => soma + saldoDevedorNoFimDoMes(v, mes, tabelasPorVeiculo, tabelaPadrao), 0);
    // Fase 2.1 — valor da frota agora vem de v.valorAtual (preco_veiculo fixo para projetado,
    // resolverValorAtualVeiculo para real). Veículo real sem valor conhecido (null) não soma
    // aqui — sua dívida acima já entrou em dividaTotal, só o lado do ativo fica de fora (Parte 4:
    // nunca inventamos o valor que falta).
    const valorFrotaTotal = veiculosAtivos.reduce((soma, v) => soma + (v.valorAtual ?? 0), 0);
    const equityTotal = valorFrotaTotal - dividaTotal;
    const noiDoMes = receita - custosOperacionais;
    const dscr = parcelasDoMes > 0 ? noiDoMes / parcelasDoMes : null;

    meses.push({
      mes,
      frotaTotal: veiculosAtivos.length,
      veiculosComprados: veiculosComprados.filter((v) => v.mesCompra === mes).length,
      veiculosVendidos: veiculosVendidosNoMes,
      caixaInicial,
      receita,
      custosOperacionais,
      jurosDoMes,
      amortizacaoDoMes,
      fluxoDeCaixa,
      produtoLiquidoVendas,
      caixaFinal: caixaExpansao,
      dividaTotal,
      equityTotal,
      patrimonioLiquido: caixaExpansao + equityTotal,
      dscr,
    });
  }

  const mesInicial = meses[0];
  const mesFinal = meses[meses.length - 1];
  const receitaAcumulada = meses.reduce((s, m) => s + m.receita, 0);
  const fluxoDeCaixaAcumulado = meses.reduce((s, m) => s + m.fluxoDeCaixa, 0);
  const patrimonioInicial = mesInicial.patrimonioLiquido;
  const patrimonioFinal = mesFinal.patrimonioLiquido;

  // Port correction: report the worst unfunded cash deficit. No contribution is silently credited.
  const capitalExternoNecessario = Math.max(0, -Math.min(...meses.map(m=>m.caixaFinal)));
  const capitalTotalMovimentado = veiculosComprados.reduce((s, v) => s + v.entrada, 0);
  const crescimentoAutofinanciadoPct = capitalTotalMovimentado > 0 && capitalExternoNecessario === 0 ? 100 : null;

  return {
    estrategia,
    horizonte,
    metodo: cenario.metodo_crescimento,
    meses,
    veiculos: veiculosComprados,
    eventos,
    proximoVeiculo: calcularProximoVeiculo(meses, veiculosComprados.length, cenario, custoMinimoParaComprar, ultimoMotivoBloqueio, horizonte),
    frotaInicial: mesInicial.frotaTotal,
    frotaFinal: mesFinal.frotaTotal,
    veiculosCompradosTotal: veiculosComprados.length,
    veiculosVendidosTotal: veiculosComprados.filter((v) => v.vendidoNoMes !== null).length,
    receitaAcumulada,
    fluxoDeCaixaAcumulado,
    dividaFinal: mesFinal.dividaTotal,
    equityFinal: mesFinal.equityTotal,
    caixaFinal: mesFinal.caixaFinal,
    patrimonioFinal,
    patrimonioInicial,
    crescimentoPatrimonialPct: patrimonioInicial > EPS ? ((patrimonioFinal - patrimonioInicial) / patrimonioInicial) * 100 : null,
    capitalExternoNecessario,
    crescimentoAutofinanciadoPct,
    frotaRealIntegrada: frotaReal.length,
    frotaRealSemValorConhecido: frotaReal.filter((v) => v.valorAtual === null).length,
  };
}

/** Executa as 3 estratégias sobre o mesmo cenário — tabela de comparação da seção 24. */
function compararCrescimentoComposto(
  cenario                 ,
  horizonte                      ,
  frotaReal                            = []
)                                                           {
  return {
    conservadora: calcularCrescimentoComposto(cenario, 'conservadora', horizonte, frotaReal),
    balanceada: calcularCrescimentoComposto(cenario, 'balanceada', horizonte, frotaReal),
    agressiva: calcularCrescimentoComposto(cenario, 'agressiva', horizonte, frotaReal),
  };
}

// Fase 2.1 — usa v.valorFinanciado (por veículo) em vez de um valor global: para origem
// 'projetado' é o financiamento hipotético do cenário (igual à Fase 2); para origem 'real' é o
// saldoDevedorAtual já calculado por calcularResumoFinanciamentoReal (mesmo número exibido na
// ficha do veículo), garantindo que o "antes da 1ª parcela simulada" bate com o real.
function saldoDevedorNoFimDoMes(v                  , mes        , tabelasPorVeiculo                                 , tabelaPadrao                    )         {
  const tabela = tabelasPorVeiculo.get(v.numero) ?? tabelaPadrao;
  const r = mes - v.mesCompra;
  if (r < 1) return v.valorFinanciado;
  if (r > tabela.length) return 0;
  return tabela[r - 1].saldoDevedor;
}

// Seção 19 — "Próximo Veículo": estimativa (não certeza) de quando o próximo veículo caberia
// além do horizonte simulado, projetando linearmente o fluxo de caixa médio dos últimos meses.
// Marcado como ESTIMATIVA na interface — não é o mesmo tipo de garantia que um mês já simulado.
function calcularProximoVeiculo(
  meses                  ,
  veiculosComprados        ,
  cenario                 ,
  custoMinimoParaComprar        ,
  ultimoMotivoBloqueio                                                    ,
  horizonte
)                          {
  const ultimoMes = meses[meses.length - 1];
  const numero = veiculosComprados + 1;
  const capitalDisponivelProjetado = ultimoMes.caixaFinal;
  const gap = Math.max(0, custoMinimoParaComprar - capitalDisponivelProjetado);

  if (gap <= EPS) {
    return { possivel: true, numero, mesEstimado: horizonte, capitalNecessario: custoMinimoParaComprar, capitalDisponivelProjetado };
  }

  const janela = meses.slice(-Math.min(3, meses.length));
  const fluxoMedio = janela.reduce((s, m) => s + m.fluxoDeCaixa, 0) / janela.length;

  if (fluxoMedio <= EPS) {
    const motivo = ultimoMotivoBloqueio === 'limite_de_divida' ? 'limite de dívida' : cenario.metodo_crescimento === 'caixa_operacional' ? 'aguardando caixa operacional' : 'aguardando venda';
    return { possivel: false, motivo, capitalNecessario: custoMinimoParaComprar, capitalDisponivelProjetado, gap };
  }

  const mesesNecessarios = Math.ceil(gap / fluxoMedio);
  return { possivel: true, numero, mesEstimado: horizonte + mesesNecessarios, capitalNecessario: custoMinimoParaComprar, capitalDisponivelProjetado };
}

function fmt(v        )         {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

Object.assign(L,{calcularCrescimentoComposto,compararCrescimentoComposto});})();

// features/estrategia/expansao/intelligence/comparadorMomentosDeVenda.ts
(function(){const {gerarTabelaAmortizacao,SEMANAS_POR_MES,avaliarCapacidadeDeCompra}=L;

// Épico 10 — "Inteligência de Renovação e Reciclagem de Capital", Fase 1. Responde à pergunta
// central pedida pelo Carlos: "quando vender um carro para reciclar capital e maximizar o
// patrimônio?" — via um MOTOR DETERMINÍSTICO (nenhuma IA, nenhuma inferência de mercado), que
// simula, mês a mês, um único veículo sob cada momento de venda candidato (incluindo "nunca
// vender") até um horizonte fixo, e compara o patrimônio final resultante entre eles.
//
// Regra fundamental do brief: "não criar uma IA que inventa uma recomendação" — toda
// recomendação sai de números já calculados linha a linha, auditáveis (ver
// `explicarMelhorEscolha`, que só concatena deltas de campos já existentes em
// `ResultadoMomentoDeVenda`, nunca gera texto a partir de heurística separada).
//
// Fase 1 NÃO usa FIPE/scraping/mercado/ML/IA generativa (fora de escopo explícito do brief). O
// valor de venda é sempre PREMISSA do usuário — nunca inferido (DEC-022).
//
// ESCOPO DESTA FASE (decisão registrada aqui, não pedida explicitamente linha a linha no brief,
// mas necessária pra implementar sem inventar infraestrutura genérica demais — Regra dos 3):
// 1 veículo por vez, não uma otimização multi-frota. A pergunta é "quando vender ESTE carro",
// não "qual a alocação ótima de N carros" — isso é uma generalização sem caso de uso concreto
// ainda. Por isso este motor NÃO reaproveita o loop de compounding de N-veículos de
// crescimentoComposto.ts (que resolve um problema diferente: crescimento composto de uma frota
// inteira a partir de capital externo `cenario.capital_disponivel`) — reaproveita só as peças
// matemáticas comuns: gerarTabelaAmortizacao (shared/lib/amortizacao) e SEMANAS_POR_MES
// (Épico 3, mesma constante usada em todo o resto do app).
//
// REINVESTIMENTO (seção 11 do brief: "1 → venda → 2 novos" — "o algoritmo precisa capturar
// isso"): no mês da venda, o capital líquido reciclado (mais qualquer caixa operacional já
// acumulado por este veículo até ali) financia, em loop, a ENTRADA de quantos veículos
// idênticos (mesmo cenário) couberem sem violar a reserva mínima — pode ser 0, 1 ou mais que 1,
// dependendo do quanto sobrou. Fase 1 modela só ESSA rodada única de reinvestimento: os
// veículos de reposição são projetados até o horizonte, mas não são candidatos a uma nova
// decisão de venda dentro desta mesma simulação (isso seria um otimizador recursivo
// multi-geração — fora do escopo de "quando vender ESTE carro").
//
// RESERVA MÍNIMA só governa a decisão de reinvestir (é uma escolha de compra, controlável) — não
// trava o caixa operacional do próprio veículo original, que já é seu, sunk, e continua rodando
// independente do saldo de caixa acumulado (não existe "não posso mais operar o carro que já é
// meu" por falta de reserva).

function custoOperacionalMensal(c                     )         {
  return c.seguroMensalPorVeiculo + c.ipvaAnualPorVeiculo / 12 + c.rastreadorMensalPorVeiculo + c.manutencaoPorKm * c.kmMensal;
}

function receitaMensalPorVeiculo(c                     )         {
  return c.aluguelSemanalPorVeiculo * SEMANAS_POR_MES * (c.ocupacaoPct / 100);
}

function parcelaNoMes(v                 , mes        )                                                          {
  const r = mes - v.mesCompra;
  if (r < 1 || r > v.tabela.length) return { juros: 0, amortizacao: 0, parcela: 0 };
  const linha = v.tabela[r - 1];
  return { juros: linha.juros, amortizacao: linha.amortizacao, parcela: linha.parcela };
}

/** Saldo devedor IMEDIATAMENTE ANTES da parcela do mês de referência — mesma convenção usada em
 * crescimentoComposto.ts (`saldoDevedorAntes`): é o saldo com que a venda precisa quitar a dívida
 * naquele mês, antes de a parcela daquele mês ser descontada. */
function saldoDevedorAntesDoMes(v                 , mes        )         {
  const r = mes - v.mesCompra;
  if (v.tabela.length === 0) return 0;
  if (r <= 1) return v.tabela[0].saldoDevedor + v.tabela[0].amortizacao; // = valor financiado original
  if (r - 2 >= v.tabela.length) return 0;
  return v.tabela[r - 2].saldoDevedor;
}

/** Saldo devedor no FIM do mês de referência (depois da parcela daquele mês, se houve). */
function saldoDevedorFimDoMes(v                 , mes        )         {
  const r = mes - v.mesCompra;
  if (v.tabela.length === 0) return 0;
  if (r < 1) return v.tabela[0].saldoDevedor + v.tabela[0].amortizacao;
  if (r > v.tabela.length) return 0;
  return v.tabela[r - 1].saldoDevedor;
}

/**
 * Simula UM momento de venda candidato (ou `null` = nunca vender) para o veículo descrito em
 * `cenario`, mês a mês até `cenario.horizonteMeses`.
 */
function simularMomentoDeVenda(cenario                     , mesVenda               , reinvestir          = true)                          {
  const valorFinanciadoOriginal = Math.max(0, cenario.precoVeiculo - cenario.entrada);
  const tabelaOriginal = gerarTabelaAmortizacao(valorFinanciadoOriginal, cenario.taxaJurosAmPct, cenario.prazoFinanciamentoMeses, cenario.sistemaAmortizacao);
  const custoMensal = custoOperacionalMensal(cenario);
  const receitaMensal = receitaMensalPorVeiculo(cenario);

  let veiculoOriginal                         = { mesCompra: 0, tabela: tabelaOriginal };
  const veiculosReinvestidos                    = [];

  const meses                    = [];
  const eventos                       = [];

  let caixa = 0;
  let receitaAcumulada = 0;
  let custosOperacionaisAcumulados = 0;
  let jurosAcumulados = 0;
  let amortizacaoAcumulada = 0;
  let capitalReciclado = 0;
  let capitalRecicladoUsadoEmNovaAquisicao = 0;

  for (let mes = 0; mes <= cenario.horizonteMeses; mes++) {
    // 1) Venda do veículo original, se este é o mês candidato.
    if (veiculoOriginal !== null && mesVenda !== null && mes === mesVenda) {
      const saldoDevedor = saldoDevedorAntesDoMes(veiculoOriginal, mes);
      const custosVenda = cenario.valorVenda * (cenario.vendaCustosPct / 100);
      const liquido = cenario.valorVenda - saldoDevedor - custosVenda;
      caixa += liquido;
      capitalReciclado += liquido;
      eventos.push({ tipo: 'venda', mes, valorVenda: cenario.valorVenda, saldoDevedor, custosVenda, liquido });
      veiculoOriginal = null;

      // 2) Reinvestimento — só neste mês (rodada única, ver cabeçalho do arquivo): compra, em
      // loop, quantos veículos idênticos couberem sem deixar o caixa abaixo da reserva mínima E
      // sem furar o DSCR projetado. Fase 2 (item 17 do brief) — `reinvestir=false` isola o
      // EFEITO PURO da venda, sem reciclagem. Fase 3.2 (auditoria
      // `relatorio-epico10-fase3.1-auditoria-2026-08-12.md`, categoria C): até aqui só a reserva
      // travava — o mesmo gate de `cicloDeVenda.ts`/`crescimentoComposto.ts` (extraído pra
      // `avaliarCapacidadeDeCompra`, única fonte de verdade) agora também trava por DSCR, pra
      // este motor nunca recomendar um reinvestimento que os outros dois bloqueariam.
      const valorFinanciadoNovo = Math.max(0, cenario.precoVeiculo - cenario.entrada);
      const parcelaCandidato = gerarTabelaAmortizacao(valorFinanciadoNovo, cenario.taxaJurosAmPct, cenario.prazoFinanciamentoMeses, cenario.sistemaAmortizacao)[0]?.parcela ?? 0;
      while (reinvestir) {
        if(veiculosReinvestidos.length>=1000)throw new RangeError("Renovação ultrapassa 1.000 veículos; revise as premissas.");
        const parcelasAtivasProjetadas = veiculosReinvestidos.reduce((s, v) => s + parcelaNoMes(v, mes + 1).parcela, 0);
        const noiAtual = veiculosReinvestidos.length * (receitaMensal - custoMensal);
        const check = avaliarCapacidadeDeCompra({
          caixa,
          entrada: cenario.entrada,
          reservaMinima: cenario.reservaMinima,
          noiAtual,
          noiMarginalCandidato: receitaMensal - custoMensal,
          parcelasAtivasProjetadas,
          parcelaCandidato,
          dscrMinimoAtencao: cenario.dscrMinimoAtencao,
        });
        if (!check.pode) {
          eventos.push(
            check.motivo === 'reserva'
              ? { tipo: 'bloqueio_reserva', mes, caixaDisponivel: caixa, custoMinimo: cenario.entrada + cenario.reservaMinima }
              : { tipo: 'bloqueio_dscr', mes, dscrProjetado: check.dscrProjetado, dscrMinimoAtencao: cenario.dscrMinimoAtencao }
          );
          break;
        }
        caixa -= cenario.entrada;
        capitalRecicladoUsadoEmNovaAquisicao += cenario.entrada;
        const tabelaNova = gerarTabelaAmortizacao(valorFinanciadoNovo, cenario.taxaJurosAmPct, cenario.prazoFinanciamentoMeses, cenario.sistemaAmortizacao);
        veiculosReinvestidos.push({ mesCompra: mes, tabela: tabelaNova });
        eventos.push({ tipo: 'reinvestimento', mes, entradaUtilizada: cenario.entrada });
      }
    }

    // 3) Operação do mês — soma sobre todos os veículos ativos (original, se ainda não vendido, + reinvestidos).
    const ativos                    = [...(veiculoOriginal ? [veiculoOriginal] : []), ...veiculosReinvestidos];
    const receita = ativos.filter(v=>v.mesCompra<mes).length * receitaMensal;
    const custosOperacionais = ativos.filter(v=>v.mesCompra<mes).length * custoMensal;
    let jurosDoMes = 0;
    let amortizacaoDoMes = 0;
    for (const v of ativos) {
      const p = parcelaNoMes(v, mes);
      jurosDoMes += p.juros;
      amortizacaoDoMes += p.amortizacao;
    }
    const parcelaDoMes = jurosDoMes + amortizacaoDoMes;
    caixa += receita - custosOperacionais - parcelaDoMes;

    receitaAcumulada += receita;
    custosOperacionaisAcumulados += custosOperacionais;
    jurosAcumulados += jurosDoMes;
    amortizacaoAcumulada += amortizacaoDoMes;

    const saldoDevedorTotal = ativos.reduce((s, v) => s + saldoDevedorFimDoMes(v, mes), 0);
    const equity = ativos.length * cenario.precoVeiculo - saldoDevedorTotal;
    const patrimonio = caixa + equity;

    meses.push({
      mes,
      frotaAtiva: ativos.length,
      receita,
      custosOperacionais,
      jurosDoMes,
      amortizacaoDoMes,
      saldoDevedor: saldoDevedorTotal,
      caixa,
      equity,
      patrimonio,
    });
  }

  const mesFinal = meses[meses.length - 1];
  const retornoOperacionalAcumulado = receitaAcumulada - custosOperacionaisAcumulados - jurosAcumulados;
  const crescimentoPatrimonialMultiplo = cenario.entrada > 0 ? mesFinal.patrimonio / cenario.entrada : null;

  return {
    mesVenda,
    meses,
    eventos,
    receitaAcumulada,
    custosOperacionaisAcumulados,
    jurosAcumulados,
    amortizacaoAcumulada,
    parcelasPagasAcumuladas: jurosAcumulados + amortizacaoAcumulada,
    patrimonioFinalNoHorizonte: mesFinal.patrimonio,
    caixaFinal: mesFinal.caixa,
    equityFinal: mesFinal.equity,
    capitalReciclado,
    capitalRecicladoUsadoEmNovaAquisicao,
    frotaFinalUnidades: mesFinal.frotaAtiva,
    crescimentoPatrimonialMultiplo,
    retornoOperacionalAcumulado,
    retornoDoCapitalMultiplo: crescimentoPatrimonialMultiplo,
  };
}

const fmt = (n        ) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const rotuloMes = (m               ) => (m === null ? 'nunca vender (manter até o fim)' : `vender no mês ${m}`);

/**
 * Roda `simularMomentoDeVenda` para cada mês candidato (mais `null` = nunca vender) e compara
 * o patrimônio final no horizonte entre todos — a métrica principal da seção 8 do brief.
 */
function compararMomentosDeVenda(cenario                     , mesesCandidatos          )                            {
  const candidatos                    = [...mesesCandidatos, null];
  const porMomento = candidatos.map((m) => simularMomentoDeVenda(cenario, m));

  const melhor = porMomento.reduce((a, b) => (b.patrimonioFinalNoHorizonte > a.patrimonioFinalNoHorizonte ? b : a));
  const piorEntreCandidatos = porMomento.reduce((a, b) => (b.patrimonioFinalNoHorizonte < a.patrimonioFinalNoHorizonte ? b : a));
  const manterAteFim = porMomento.find((r) => r.mesVenda === null) ;

  const explicacao           = [];
  explicacao.push(
    `A melhor opção simulada é ${rotuloMes(melhor.mesVenda)}: patrimônio de ${fmt(melhor.patrimonioFinalNoHorizonte)} no mês ${cenario.horizonteMeses}, contra ${fmt(piorEntreCandidatos.patrimonioFinalNoHorizonte)} da pior opção simulada (${rotuloMes(piorEntreCandidatos.mesVenda)}) — uma diferença de ${fmt(melhor.patrimonioFinalNoHorizonte - piorEntreCandidatos.patrimonioFinalNoHorizonte)}.`
  );
  if (melhor.mesVenda !== null) {
    const diffVsManter = melhor.patrimonioFinalNoHorizonte - manterAteFim.patrimonioFinalNoHorizonte;
    explicacao.push(
      diffVsManter >= 0
        ? `${rotuloMes(melhor.mesVenda)} supera "nunca vender" em ${fmt(diffVsManter)} — o capital líquido reciclado (${fmt(melhor.capitalReciclado)}) financiou ${melhor.eventos.filter((e) => e.tipo === 'reinvestimento').length} reinvestimento(s), levando a frota final a ${melhor.frotaFinalUnidades} veículo(s) contra ${manterAteFim.frotaFinalUnidades} de quem nunca vendeu.`
        : `Mesmo sendo a melhor entre as opções DE VENDA simuladas, ${rotuloMes(melhor.mesVenda)} ainda fica ${fmt(Math.abs(diffVsManter))} abaixo de "nunca vender" neste cenário.`
    );
  } else {
    explicacao.push(`"Nunca vender" foi a melhor opção simulada — nenhum momento de venda testado gerou reciclagem de capital suficiente para superar manter o veículo até o fim do horizonte.`);
  }

  return { porMomento, melhorMesVenda: melhor.mesVenda, explicacao };
}

Object.assign(L,{simularMomentoDeVenda,compararMomentosDeVenda});})();

// features/estrategia/expansao/intelligence/analiseDecisaoVenda.ts
(function(){const {simularMomentoDeVenda}=L;

// Épico 10 — Fase 2. Transforma "qual mês de venda produz maior patrimônio?" (Fase 1) em "qual
// decisão de renovação produz maior patrimônio E POR QUÊ?" — tudo construído EM CIMA da Fase 1
// (`simularMomentoDeVenda`, já validado 63/63), sem duplicar o motor: reconciliação e
// decomposição são derivadas dos campos que a Fase 1 já calcula (`meses[]`/`eventos[]`), não uma
// segunda implementação da mesma matemática.
//
// PROVA MATEMÁTICA CENTRAL DESTE ARQUIVO (item 8 do brief — "o motor precisa identificar
// quantitativamente o peso de cada fator", não uma atribuição inventada):
//
// O "efeito líquido de venda" sobre o PATRIMÔNIO (não o caixa) é:
//   caixa: +liquido = +(valorVenda − saldoDevedor − custosVenda)
//   equity: −(valorAtivo − saldoDevedor)  [o veículo vendido sai do pool de equity]
//   soma:    valorVenda − saldoDevedor − custosVenda − valorAtivo + saldoDevedor
//          = valorVenda − custosVenda − valorAtivo
// O saldoDevedor CANCELA EXATAMENTE. Ou seja: o impacto da venda EM SI sobre o patrimônio não
// depende de quanto da dívida já foi amortizada — é uma constante do cenário (valorVenda,
// vendaCustosPct e precoVeiculo não mudam com o mês escolhido). O momento da venda não muda
// "quanto patrimônio a venda gera" — muda "quanto CAIXA a venda libera" (saldo devedor menor =
// mais caixa livre), o que por sua vez afeta quanto pode ser reinvestido. Essa é a resposta
// rigorosa ao item 8: o "Fator B" (venda liberou capital) tem efeito patrimonial DIRETO igual a
// zero; seu efeito é indireto, via Fator C/D (reinvestimento). Ver `testarCausalidade` abaixo,
// que usa exatamente esta identidade (validada numericamente no script de validação).
//
// A mesma lógica prova que AMORTIZAÇÃO e a ENTRADA de uma nova compra são patrimonialmente
// neutras (dinheiro só muda de "bucket": caixa ⇄ equity, 1:1) — por isso não aparecem como termos
// na reconciliação do item 6: seu efeito líquido em Δpatrimônio é sempre 0, matematicamente.

const EPS = 1;

// ---------------------------------------------------------------------------------------------
// 6. RECONCILIAÇÃO PATRIMONIAL (item 6 do brief)
// ---------------------------------------------------------------------------------------------

function reconciliarPatrimonioMensal(cenario                     , resultado                         )                        {
  const linhas                        = [];
  for (let i = 0; i < resultado.meses.length; i++) {
    const m = resultado.meses[i];
    // ACHADO da validação (não um bug do motor — uma sutileza da reconciliação): o motor nunca
    // debita `cenario.entrada` do caixa para o veículo ORIGINAL (ele já é seu, antes do mês 0 —
    // só o reinvestimento debita entrada explicitamente). Mas a equity dele (precoVeiculo −
    // valorFinanciado = entrada) já entra no cálculo desde o mês 0. Ou seja, a entrada já foi
    // "gasta" antes da janela desta simulação, e o que ela comprou (entrada de equity no carro)
    // já está contado no mês 0. Por isso o patrimônio de referência ANTES do mês 0 é `entrada`
    // (o que você já tinha investido no carro), não 0 — testado explicitamente: com essa base, a
    // identidade fecha em todos os meses; com 0, sobra um resíduo de exatamente `entrada` só no
    // mês 0. Mesma convenção já usada em `crescimentoPatrimonialMultiplo` (Fase 1).
    const patrimonioInicial = i === 0 ? cenario.entrada : resultado.meses[i - 1].patrimonio;
    const deltaPatrimonio = m.patrimonio - patrimonioInicial;
    const resultadoOperacional = m.receita - m.custosOperacionais;
    const resultadoFinanceiro = -m.jurosDoMes;
    const variacaoEconomicaDoAtivo = 0;
    const eventosVendaNoMes = resultado.eventos.filter((e) => e.tipo === 'venda' && e.mes === m.mes);
    const efeitoLiquidoDeVenda = eventosVendaNoMes.reduce((s, e) => (e.tipo === 'venda' ? s + (e.valorVenda - e.custosVenda - cenario.precoVeiculo) : s), 0);
    const outrosEfeitos = deltaPatrimonio - resultadoOperacional - resultadoFinanceiro - variacaoEconomicaDoAtivo - efeitoLiquidoDeVenda;
    linhas.push({
      mes: m.mes,
      patrimonioInicial,
      patrimonioFinal: m.patrimonio,
      deltaPatrimonio,
      resultadoOperacional,
      resultadoFinanceiro,
      variacaoEconomicaDoAtivo,
      efeitoLiquidoDeVenda,
      outrosEfeitos,
      identidadeFechou: Math.abs(outrosEfeitos) < EPS,
    });
  }
  return linhas;
}

// ---------------------------------------------------------------------------------------------
// 7. DECOMPOSIÇÃO DE UM MOMENTO DE VENDA (item 7 do brief)
// ---------------------------------------------------------------------------------------------

function decomporMomentoDeVenda(cenario                     , mesVenda        )                    {
  const comReinvestimento = simularMomentoDeVenda(cenario, mesVenda, true);
  const semReinvestimento = simularMomentoDeVenda(cenario, mesVenda, false);
  const eventoVenda = comReinvestimento.eventos.find((e) => e.tipo === 'venda' && e.mes === mesVenda);
  if (!eventoVenda || eventoVenda.tipo !== 'venda') throw new Error(`Nenhum evento de venda no mês ${mesVenda} — mesVenda fora do horizonte?`);

  const caixaAntesDoMes = mesVenda === 0 ? 0 : comReinvestimento.meses[mesVenda - 1].caixa;
  const patrimonioAntesDaVenda = mesVenda === 0 ? 0 : comReinvestimento.meses[mesVenda - 1].patrimonio;
  const quantidadeNovosVeiculos = comReinvestimento.eventos.filter((e) => e.tipo === 'reinvestimento' && e.mes === mesVenda).length;

  return {
    mesVenda,
    patrimonioAntesDaVenda,
    saldoDevedor: eventoVenda.saldoDevedor,
    valorVenda: eventoVenda.valorVenda,
    capitalLiquido: eventoVenda.liquido,
    caixaImediatamenteAposVenda: caixaAntesDoMes + eventoVenda.liquido,
    quantidadeNovosVeiculos,
    patrimonioGeradoPelosNovosVeiculos: comReinvestimento.patrimonioFinalNoHorizonte - semReinvestimento.patrimonioFinalNoHorizonte,
    patrimonioFinal: comReinvestimento.patrimonioFinalNoHorizonte,
  };
}

function compararDoisMomentos(cenario                     , mesA        , mesB        )                        {
  const a = simularMomentoDeVenda(cenario, mesA, true);
  const b = simularMomentoDeVenda(cenario, mesB, true);
  return {
    mesA,
    mesB,
    diferencaCaixa: b.caixaFinal - a.caixaFinal,
    diferencaEquity: b.equityFinal - a.equityFinal,
    diferencaDivida: b.meses[b.meses.length - 1].saldoDevedor - a.meses[a.meses.length - 1].saldoDevedor,
    diferencaFrota: b.frotaFinalUnidades - a.frotaFinalUnidades,
    diferencaReceita: b.receitaAcumulada - a.receitaAcumulada,
    diferencaCustos: b.custosOperacionaisAcumulados - a.custosOperacionaisAcumulados,
    diferencaJuros: b.jurosAcumulados - a.jurosAcumulados,
    diferencaPatrimonio: b.patrimonioFinalNoHorizonte - a.patrimonioFinalNoHorizonte,
  };
}

// ---------------------------------------------------------------------------------------------
// 8. TESTE CAUSAL (item 8 do brief)
// ---------------------------------------------------------------------------------------------

function testarCausalidade(cenario                     , mesA        , mesB        )              {
  const decompA = decomporMomentoDeVenda(cenario, mesA);
  const decompB = decomporMomentoDeVenda(cenario, mesB);
  const resultadoA = simularMomentoDeVenda(cenario, mesA, true);
  const resultadoB = simularMomentoDeVenda(cenario, mesB, true);

  const deltaPatrimonioFinal = resultadoB.patrimonioFinalNoHorizonte - resultadoA.patrimonioFinalNoHorizonte;
  const fatorA = decompB.patrimonioAntesDaVenda - decompA.patrimonioAntesDaVenda;
  const deltaCaixaLiberado = decompB.capitalLiquido - decompA.capitalLiquido;
  const deltaCD = decompB.patrimonioGeradoPelosNovosVeiculos - decompA.patrimonioGeradoPelosNovosVeiculos;
  const residuo = deltaPatrimonioFinal - fatorA - deltaCD;

  const efeitoPorVeiculoA = decompA.quantidadeNovosVeiculos > 0 ? decompA.patrimonioGeradoPelosNovosVeiculos / decompA.quantidadeNovosVeiculos : null;
  const efeitoPorVeiculoB = decompB.quantidadeNovosVeiculos > 0 ? decompB.patrimonioGeradoPelosNovosVeiculos / decompB.quantidadeNovosVeiculos : null;

  let conclusao        ;
  if (Math.abs(fatorA) < EPS && Math.abs(deltaCD) > EPS) {
    conclusao = `A diferença é explicada quase inteiramente pela reciclagem de capital (fatores C/D) — a operação isolada do veículo original (fator A) contribui perto de zero.`;
  } else if (Math.abs(deltaCD) < EPS && Math.abs(fatorA) > EPS) {
    conclusao = `A diferença é explicada quase inteiramente por operar o veículo original por mais tempo antes de vender (fator A) — a reciclagem não teve efeito relevante aqui.`;
  } else {
    conclusao = `Combinação dos fatores: ${fatorA >= 0 ? 'operar mais tempo antes de vender' : 'operar menos tempo antes de vender'} contribuiu ${fmt(fatorA)}, e a reciclagem de capital (compra de novos veículos + tempo deles operando) contribuiu ${fmt(deltaCD)}.`;
  }

  return {
    mesA,
    mesB,
    deltaPatrimonioFinal,
    fatorA_operacaoAntesDaVenda: fatorA,
    fatorB_capitalLiberado: { deltaCaixaLiberado, efeitoPatrimonialDireto: 0 },
    fatoresCD_efeitoDaReciclagem: {
      efeitoTotalA: decompA.patrimonioGeradoPelosNovosVeiculos,
      efeitoTotalB: decompB.patrimonioGeradoPelosNovosVeiculos,
      delta: deltaCD,
      quantidadeVeiculosA: decompA.quantidadeNovosVeiculos,
      quantidadeVeiculosB: decompB.quantidadeNovosVeiculos,
      efeitoPorVeiculoA,
      efeitoPorVeiculoB,
    },
    residuo,
    identidadeFechou: Math.abs(residuo) < EPS,
    conclusao,
  };
}

const fmt = (n        ) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ---------------------------------------------------------------------------------------------
// 22-24. SENSIBILIDADE E BREAK-EVEN (itens 22-25 do brief)
// ---------------------------------------------------------------------------------------------

/** Varia `cenario.valorVenda` sobre `valores`, recalculando o patrimônio final para um mês de venda fixo. */
function sensibilidadeValorDeVenda(cenario                     , mesVenda        , valores          )                       {
  return valores.map((valorVenda) => {
    const r = simularMomentoDeVenda({ ...cenario, valorVenda }, mesVenda, true);
    return { valorTestado: valorVenda, patrimonioFinal: r.patrimonioFinalNoHorizonte, frotaFinal: r.frotaFinalUnidades, capitalReciclado: r.capitalReciclado, capitalUsadoEmNovaAquisicao: r.capitalRecicladoUsadoEmNovaAquisicao };
  });
}

/** Varia `cenario.aluguelSemanalPorVeiculo` sobre `valores`, recalculando o patrimônio final para um mês de venda fixo. */
function sensibilidadeAluguel(cenario                     , mesVenda        , valores          )                       {
  return valores.map((aluguelSemanalPorVeiculo) => {
    const r = simularMomentoDeVenda({ ...cenario, aluguelSemanalPorVeiculo }, mesVenda, true);
    return { valorTestado: aluguelSemanalPorVeiculo, patrimonioFinal: r.patrimonioFinalNoHorizonte, frotaFinal: r.frotaFinalUnidades, capitalReciclado: r.capitalReciclado, capitalUsadoEmNovaAquisicao: r.capitalRecicladoUsadoEmNovaAquisicao };
  });
}

/**
 * Busca o `valorVenda` em que `patrimonio(mesA) == patrimonio(mesB)` (item 24/25 do brief), FIXO
 * o resto do cenário — variando só o preço de venda que se APLICA IGUALMENTE aos dois meses
 * (não dá pra ter um valorVenda diferente por mês simulado sem inventar um 2º cenário; a pergunta
 * do brief é "em que preço as duas estratégias empatam", não "que combinação de 2 preços
 * diferentes empata" — ambos os candidatos usam o MESMO valorVenda de premissa).
 *
 * ACHADO da validação (achado real, não hipotético — pegou uma raiz errada na 1ª versão deste
 * arquivo): `g(valorVenda) = patrimonio(mesB) − patrimonio(mesA)` NÃO é contínua. Cada candidato
 * tem seu próprio limiar de reinvestimento (o loop `while caixa >= entrada + reserva`), e esses
 * limiares batem em valores de `valorVenda` DIFERENTES para mesA e mesB — perto desses pontos,
 * g() pode SALTAR de positivo pra negativo sem nunca passar por zero de verdade. Uma bisseção
 * ingênua (só olhando o sinal dos extremos do intervalo) converge pra dentro desse salto e reporta
 * uma "raiz" que não é raiz nenhuma — foi exatamente o que aconteceu na 1ª versão: convergiu em
 * valorVenda≈167.902 com g(167.902)≈+23.343 (não zero), porque o salto real ficava entre 167.902
 * e 170.000. Corrigido com: (1) varredura fina primeiro, pra achar TODOS os intervalos onde o
 * sinal muda; (2) bisseção dentro de cada intervalo já estreito; (3) VERIFICAÇÃO pós-bisseção —
 * só aceita a raiz se g(raiz) estiver de fato perto de 0 (não apenas se o intervalo encolheu).
 */
function calcularPontoIndiferencaVenda(
  cenario                     ,
  mesA        ,
  mesB        ,
  faixa                   = [0, 300_000],
  opcoes                                                                                          = {}
)                     {
  const pontosDeVarredura = opcoes.pontosDeVarredura ?? 400;
  const iteracoesBissecao = opcoes.iteracoesBissecao ?? 40;
  // Tolerância absoluta pra aceitar uma raiz: intencionalmente pequena frente à escala de
  // patrimônio deste cenário (dezenas a centenas de milhares) — separa um cruzamento real de um
  // salto de degrau que passa perto de 0 por coincidência.
  const toleranciaAbsoluta = opcoes.toleranciaAbsoluta ?? 1_000;

  const g = (valorVenda        ) => {
    const a = simularMomentoDeVenda({ ...cenario, valorVenda }, mesA, true);
    const b = simularMomentoDeVenda({ ...cenario, valorVenda }, mesB, true);
    return b.patrimonioFinalNoHorizonte - a.patrimonioFinalNoHorizonte;
  };

  const [lo0, hi0] = faixa;
  const passo = (hi0 - lo0) / pontosDeVarredura;
  const amostras                             = [];
  for (let i = 0; i <= pontosDeVarredura; i++) {
    const v = lo0 + i * passo;
    amostras.push({ v, g: g(v) });
  }

  const raizesValidas           = [];
  for (let i = 1; i < amostras.length; i++) {
    const anterior = amostras[i - 1];
    const atual = amostras[i];
    if (anterior.g === 0) { raizesValidas.push(anterior.v); continue; }
    if (Math.sign(anterior.g) === Math.sign(atual.g)) continue; // sem troca de sinal neste sub-intervalo.

    let lo = anterior.v, hi = atual.v, gLo = anterior.g;
    for (let it = 0; it < iteracoesBissecao; it++) {
      const meio = (lo + hi) / 2;
      const gMeio = g(meio);
      if (gMeio === 0) { lo = hi = meio; break; }
      if (Math.sign(gMeio) === Math.sign(gLo)) { lo = meio; gLo = gMeio; } else { hi = meio; }
    }
    const candidato = (lo + hi) / 2;
    const gCandidato = g(candidato);
    // Verificação: só aceita se g(candidato) está de fato perto de 0 — rejeita saltos de degrau
    // que cruzam o sinal sem nunca chegar perto de zero de verdade.
    if (Math.abs(gCandidato) < toleranciaAbsoluta) raizesValidas.push(candidato);
  }

  if (raizesValidas.length === 0) {
    const semTrocaDeSinal = amostras.every((a) => Math.sign(a.g) === Math.sign(amostras[0].g));
    return {
      encontrado: false,
      motivo: semTrocaDeSinal
        ? `g(valorVenda) não muda de sinal na faixa [${fmt(lo0)}, ${fmt(hi0)}] — uma estratégia domina a outra em toda a faixa testada (mês ${amostras[0].g >= 0 ? mesB : mesA} sempre melhor).`
        : `Existe(m) troca(s) de sinal na faixa, mas causada(s) por salto(s) de degrau de reinvestimento — nenhuma raiz verificada ficou a menos de ${fmt(toleranciaAbsoluta)} de g=0. Reduza o passo da varredura ou estreite a faixa perto do salto para investigar melhor.`,
      faixaTestada: faixa,
    };
  }

  const valorVendaDeIndiferenca = raizesValidas[0];
  return {
    encontrado: true,
    valorVendaDeIndiferenca,
    precisao: toleranciaAbsoluta,
    nota: `Encontrado por varredura fina (${pontosDeVarredura} pontos) + bisseção (${iteracoesBissecao} iterações), com verificação pós-bisseção (|g(raiz)| < ${fmt(toleranciaAbsoluta)}). Válido só dentro da faixa testada [${fmt(faixa[0])}, ${fmt(faixa[1])}].${raizesValidas.length > 1 ? ` ATENÇÃO: ${raizesValidas.length} pontos de indiferença válidos encontrados nesta faixa (função não monotônica) — retornando o primeiro; ver \`outrosPontosEncontrados\` para os demais.` : ''}`,
    outrosPontosEncontrados: raizesValidas.slice(1),
  };
}

Object.assign(L,{reconciliarPatrimonioMensal,decomporMomentoDeVenda,compararDoisMomentos,testarCausalidade,sensibilidadeValorDeVenda,sensibilidadeAluguel,calcularPontoIndiferencaVenda});})();

scope.RodavoltLegacy=L;})(globalThis);
