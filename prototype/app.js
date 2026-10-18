(function () {
  'use strict';
  const root=document.getElementById('rodavolt-app');
  const content=root.querySelector('#rv-content');
  const engine=globalThis.RodavoltSimulator;
  const currency=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
  const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(n);
  const num=n=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(n);
  const names={today:'Visão geral',simulator:'Simulador',fleet:'Frota & manutenção',drivers:'Motoristas',contracts:'Contratos',finance:'Financeiro',shop:'Lojinha',plan:'Plano de lançamento',driver:'App do motorista'};
  let page='simulator',driverTab='Início',params={...engine.defaults},saved=null;
  let saleCount=0,transfers=0,incident=false,paymentSubmitted=false;
  let toastTimer;
  const products=[{name:'Água mineral 500 ml',price:4,cost:1.6,qty:12,central:48},{name:'Barra de cereal',price:5,cost:2.5,qty:8,central:32},{name:'Bala de menta',price:3,cost:1.2,qty:10,central:50}];
  function loadState(state) {
    try{
      if(state?.modelContent?.params) params=engine.validate(state.modelContent.params);
      if(state?.privateContent?.page && names[state.privateContent.page])page=state.privateContent.page;
      if(state?.privateContent?.driverTab && ['Início','Carro','Pagar','Loja','Docs'].includes(state.privateContent.driverTab))driverTab=state.privateContent.driverTab;
      if(state?.modelContent?.saved) saved=engine.validate(state.modelContent.saved);
    }catch{params={...engine.defaults};}
  }
  if(window.openai?.widgetState)loadState(window.openai.widgetState);
  else try{loadState(JSON.parse(localStorage.getItem('rodavolt-planning-v1')||'null'));}catch{}
  function persist(){
    const state={modelContent:{params,saved},privateContent:{page,driverTab}};
    if(window.openai?.setWidgetState)Promise.resolve(window.openai.setWidgetState(state)).catch(()=>{});
    else try{localStorage.setItem('rodavolt-planning-v1',JSON.stringify(state));}catch{}
  }
  window.addEventListener('openai:set_globals',event=>{if(event.detail?.globals?.widgetState){loadState(event.detail.globals.widgetState);render();}});
  function toast(text){const el=root.querySelector('#rv-toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true;},5500);}
  const heading=(eyebrow,title,subtitle,actions='')=>`<div class="rv-heading"><div><span class="rv-eyebrow">${eyebrow}</span><h1>${title}</h1><p class="rv-subtitle">${subtitle}</p></div>${actions?`<div class="rv-actions">${actions}</div>`:''}</div>`;
  const button=(text,action,primary=false)=>`<button type="button" class="rv-button ${primary?'rv-primary':''}" data-action="${action}">${text}</button>`;
  const badge=(text,amber=false)=>`<span class="rv-badge ${amber?'rv-amber':''}">${text}</span>`;
  const kpi=(label,value,detail)=>`<div class="rv-kpi"><small>${label}</small><strong>${value}</strong><span>${detail}</span></div>`;
  const row=(name,value,total=false)=>`<div class="rv-flow-line ${total?'rv-total':''}"><span>${name}</span><strong>${value}</strong></div>`;
  function field(key,label,step=1,help=''){
    const limits={fleet:[1,1000],price:[1,10000000],downPct:[0,100],term:[1,360],horizon:[1,120],occupancy:[0,100],stoppedDays:[0,28],lossPct:[0,100],monthlyRate:[0,20],taxPct:[0,100],cogsPct:[0,100],commissionPct:[0,100],paymentFeePct:[0,100],storeLossPct:[0,100],residualPct:[0,100],saleFeePct:[0,100],discountAnnual:[0,100]};
    const [min,max]=limits[key]||[0,1000000];
    const increment=['fleet','term','horizon'].includes(key)?1:'any';
    return `<label class="rv-field">${label}<input type="number" data-param="${key}" value="${params[key]}" min="${min}" max="${max}" step="${increment}">${help?`<small>${help}</small>`:''}</label>`;
  }
  function simulator(){
    return heading('LABORATÓRIO DO NEGÓCIO','Antes de comprar,<br>encontre o seu número.','Um carro, todos os custos e uma decisão com contexto. Premissas demonstrativas, em reais.',button('Salvar cenário','save',true))+
    `<div class="rv-tabs" aria-label="Cenários de simulação"><button type="button" data-preset="base" aria-pressed="true">Base</button><button type="button" data-preset="stress" aria-pressed="false">Estresse</button><button type="button" data-preset="optimistic" aria-pressed="false">Otimista</button><button type="button" data-action="compare">Comparar os três ↗</button>${saved?'<button type="button" data-action="restore">Abrir cenário salvo</button>':''}</div>
    <div id="rv-compare" hidden></div>
    <div class="rv-sim-grid">
      <section class="rv-panel" aria-label="Premissas da simulação">
        <div class="rv-panel-header"><h2>Monte sua operação</h2><small>Início · nov/2026</small></div><p id="rv-input-error" class="rv-warning" role="alert" hidden>Confira o campo destacado. Os resultados mantêm os últimos valores válidos.</p>
        <div class="rv-field-grid">${field('price','Valor do carro · R$',500)}${field('weekly','Aluguel semanal · R$',10)}
        <label class="rv-field">Forma de compra<select data-param="financed"><option value="false" ${params.financed?'':'selected'}>À vista</option><option value="true" ${params.financed?'selected':''}>Financiado · Price</option></select></label>${field('fleet','Quantidade de carros',1)}
        ${field('occupancy','Ocupação disponível · %',1,'Aplicada aos dias sem parada.')}${field('stoppedDays','Dias parados por mês',1)}
        </div>
        <div id="rv-loan-fields" ${params.financed?'':'hidden'}><details open><summary>Financiamento</summary><div class="rv-field-grid">${field('downPct','Entrada · %',1)}${field('monthlyRate','Juros efetivos · % a.m.',.05)}${field('term','Parcelas · meses',1)}${field('financingFees','Tarifas à vista · R$',50)}</div><p class="rv-mini-note">Use os juros e as tarifas da proposta. O cálculo não substitui o CET informado pelo banco.</p></details></div>
        <details open><summary>Rodagem & custos do carro</summary><div class="rv-field-grid">${field('kmPerDay','Km por dia alugado',10)}${field('maintenanceKm','Manutenção · R$/km',.01)}${field('tiresKm','Pneus · R$/km',.005)}${field('insurance','Seguro mensal · R$',10)}${field('annualTax','IPVA anual · R$',100)}${field('annualLicense','Licenciamento anual · R$',10)}${field('tracker','Rastreador mensal · R$',10)}${field('other','Outros por carro/mês · R$',10)}</div></details>
        <details><summary>Empresa, recebimento & capital</summary><div class="rv-field-grid">${field('lossPct','Receita não recebida · %',.5)}${field('taxPct','Tributos estimados · %',.5,'Sobre aluguel faturado + vendas.')}${field('admin','Administração/mês · R$',50,'Custo da empresa, sem multiplicar.')}${field('setup','Preparação por carro · R$',100)}${field('reserve','Reserva própria por carro · R$',500)}${field('stockCapital','Estoque inicial por carro · R$',50)}</div></details>
        <details><summary>Lojinha dentro do carro</summary><div class="rv-field-grid">${field('storeDaily','Vendas/dia alugado · R$',5)}${field('cogsPct','Custo mercadoria · %',1)}${field('commissionPct','Comissão motorista · %',1,'Percentual da venda bruta.')}${field('paymentFeePct','Taxas de pagamento · %',.5)}${field('storeLossPct','Perdas de mercadoria · %',.5)}</div></details>
        <details><summary>Horizonte & saída do investimento</summary><div class="rv-field-grid">${field('horizon','Horizonte · meses',1)}${field('residualPct','Revenda ao final · %',1,'Percentual do valor de compra.')}${field('saleFeePct','Despesa de revenda · %',.5)}${field('discountAnnual','Desconto anual para VPL · %',.5)}</div></details>
        <p class="rv-mini-note">Custos por carro, exceto administração. Combustível/recarga por conta do motorista nesta hipótese. Anuais e manutenção são normalizados mensalmente; a operação real terá datas de pagamento.</p>
      </section>
      <section aria-label="Resultado da simulação"><div id="rv-results" aria-live="polite"></div></section>
    </div>`;
  }
  function updateResults(){
    const target=root.querySelector('#rv-results');if(!target)return;
    try{
      const r=engine.simulate(params),m=r.months[0];
      const avg=key=>r.months.reduce((s,x)=>s+x[key],0)/r.months.length;
      target.innerHTML=`<div class="rv-result-hero"><span class="rv-eyebrow">CAIXA LIVRE MÉDIO ESTIMADO</span><div class="rv-big-number">${currency(r.avgCash)}<small> / mês</small></div><div class="rv-caption">Após custos, tributos estimados e parcelas.</div><div class="rv-result-duo"><div><small>Capital próprio inicial</small><strong>${currency(r.initial)}</strong></div><div><small>Resultado após depreciação</small><strong>${currency(r.avgResult)}<small>/ mês · estimado</small></strong></div></div></div>
      <div class="rv-panel rv-flow"><div class="rv-panel-header"><h2>Por onde o dinheiro passa</h2><small>Média mensal</small></div>
      ${row('Aluguel recebido',currency(r.avgRental))}${row('Margem da lojinha¹',currency(r.avgStore))}${row('Fixos + manutenção + pneus','− '+currency(avg('fixed')+avg('maintenance')+avg('tires')))}${row('Tributos estimados','− '+currency(r.avgTax))}${row('Parcelas do financiamento','− '+currency(r.avgDebt))}${row('Caixa livre',currency(r.avgCash),true)}
      <div class="rv-health ${r.avgCash<0?'rv-negative':''}">${r.avgCash>=0?'↗ Caixa médio positivo nas premissas atuais':'↘ Necessidade de aporte nas premissas atuais'}</div>
      <p class="rv-mini-note">¹ Após mercadoria, comissão, taxas e perdas; tributos na linha abaixo. Receita prevista não é recebimento confirmado.</p>
      </div>
      <div class="rv-panel rv-flow"><div class="rv-panel-header"><h2>Capital ao longo do tempo</h2><small>${r.p.horizon} meses</small></div><svg class="rv-chart" role="img" aria-label="Fluxo acumulado do investimento, sem revenda, em reais" id="rv-cash-chart"></svg><div class="rv-chart-labels"><span>Sem revenda · capital inicial incluído</span></div>
      ${row('Aluguel semanal de equilíbrio²',r.breakEvenWeekly===null?'Não calculável':currency(r.breakEvenWeekly))}${row('Payback operacional sem revenda',r.payback?`${r.payback} meses`:`Não alcançado em ${r.p.horizon} meses`)}${row('VPL com revenda e quitação da dívida',currency(r.npv))}
      <details><summary>Premissas e detalhes do retorno</summary>${row('Parcela contratada',currency(r.installment))}${row('Revenda líquida + reservas − dívida',currency(r.terminal))}${row('Saldo final após recuperar capital',currency(r.finalWealth))}${row('ROI total no horizonte',num(r.roiPct)+'%')}${row('Km previstos no primeiro mês',num(m.km)+' km')}${row('Aportes extras se faltar caixa',currency(r.additionalFunding))}<p class="rv-mini-note">² Equilíbrio de caixa no primeiro mês. Revenda ao final, sem imposto sobre ganho de capital; reserva e estoque iniciais recuperados integralmente. VPL e ROI não são garantia de retorno. Depreciação linear estimada; tributos simplificados.</p></details>
      ${r.warnings.map(w=>`<p class="rv-warning">${w}</p>`).join('')}
      </div>`;
      drawChart(r);
    }catch(error){target.innerHTML='<div class="rv-panel" role="alert"></div>';target.firstChild.textContent=error.message;}
  }
  function drawChart(r){
    const svg=root.querySelector('#rv-cash-chart');if(!svg)return;
    const width=Math.max(230,Math.round(svg.getBoundingClientRect().width)||300),height=175;
    const l=57,rr=12,t=20,b=32,w=width-l-rr,h=height-t-b;
    const values=[-r.initial,...r.months.map(m=>m.accumulated)],min=Math.min(0,...values),max=Math.max(0,...values);
    const span=Math.max(max-min,1),lo=min-span*.09,hi=max+span*.09;
    const x=i=>l+i/(values.length-1)*w,y=v=>t+(hi-v)/(hi-lo)*h;
    const compact=n=>`${n<0?'−':''}${num(Math.abs(n)/1000)}k`;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const path=values.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
    const ticks=[min,(min+max)/2,max];
    svg.innerHTML=`<title>Caixa acumulado sem revenda</title><desc>Começa em ${currency(-r.initial)} e termina em ${currency(values.at(-1))} antes da revenda.</desc>
    <text x="0" y="10">R$</text><text x="${width-4}" y="${height-1}" text-anchor="end">Mês</text>
    ${ticks.map(v=>`<line x1="${l}" x2="${width-rr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--rv-line)"/><text x="${l-8}" y="${y(v)+4}" text-anchor="end">${compact(v)}</text>`).join('')}
    <line x1="${l}" x2="${width-rr}" y1="${y(0)}" y2="${y(0)}" stroke="var(--rv-muted)" stroke-dasharray="3 3"/>
    <path d="${path}" fill="none" stroke="var(--rv-green)" stroke-width="2.5"/>
    <circle cx="${x(values.length-1)}" cy="${y(values.at(-1))}" r="3" fill="var(--rv-green)"/>
    <text x="${l}" y="${height-13}">0</text><text x="${x(Math.floor(r.p.horizon/2))}" y="${height-13}" text-anchor="middle">${Math.floor(r.p.horizon/2)}</text><text x="${width-rr}" y="${height-13}" text-anchor="end">${r.p.horizon}</text>`;
  }
  function compare(){
    const variations=[['Estresse',{occupancy:78,stoppedDays:6,lossPct:8}],['Base',{occupancy:92,stoppedDays:2,lossPct:3}],['Otimista',{occupancy:97,stoppedDays:1,lossPct:1}]];
    const el=root.querySelector('#rv-compare');el.hidden=false;
    el.innerHTML=`<div class="rv-panel" style="margin-bottom:18px"><h2>Mesmo carro, três condições de operação</h2><div class="rv-table-wrap"><table><thead><tr><th>Cenário</th><th>Ocupação / parada / perda</th><th>Caixa livre/mês</th><th>VPL</th></tr></thead><tbody>${variations.map(([label,changes])=>{const r=engine.simulate({...params,...changes});return `<tr><td>${label}</td><td>${changes.occupancy}% / ${changes.stoppedDays}d / ${changes.lossPct}%</td><td>${currency(r.avgCash)}</td><td>${currency(r.npv)}</td></tr>`;}).join('')}</tbody></table></div><p class="rv-mini-note">Outros custos e preço semanal mantidos. São hipóteses demonstrativas, sem probabilidade atribuída.</p></div>`;
  }
  function today(){return heading('O ESSENCIAL, EM UM LUGAR','Seu negócio começa<br>com uma boa decisão.','A operação ainda não começou. Estes são os passos para preparar o primeiro carro.',button('Abrir simulador','go-simulator',true))+
    `<div class="rv-kpis">${kpi('Veículos em operação','0','Modo pré-operação')}${kpi('Capital definido','A definir','Preencher com cotações reais')}${kpi('Primeira compra','Nov/26','Mês planejado pelo proprietário')}</div>
    <div class="rv-two"><section class="rv-panel"><div class="rv-panel-header"><h2>Antes da primeira entrega</h2>${badge('Planejamento')}</div><ul class="rv-checklist">${['Comparar 3 carros com cotações reais','Cotar seguro para uso em locação/app','Definir reserva de caixa e manutenção','Validar contrato e regras da lojinha','Selecionar motorista e conferir documentos'].map((t,i)=>`<li><label><input type="checkbox" data-check="${i}">${t}</label></li>`).join('')}</ul></section><section class="rv-panel"><h2>O que acompanhar depois</h2><div class="rv-list-row"><div>Caixa dos próximos 30 dias<small>Recebimentos, contas e reserva</small></div></div><div class="rv-list-row"><div>Carro parado ou revisão próxima<small>Prioridades que afetam receita</small></div></div><div class="rv-list-row"><div>Contrato e estoque do motorista<small>Um histórico por relacionamento</small></div></div></section></div>`;}
  function fleet(){return heading('FROTA & MANUTENÇÃO','Cada carro tem<br>a sua própria conta.','Exemplo da ficha do primeiro veículo. Compra, disponibilidade, custos e histórico juntos.')+
    `<section class="rv-panel"><div class="rv-vehicle"><div><span class="rv-eyebrow">VEÍCULO DEMONSTRATIVO / RV-001</span><strong>Hatch compacto · 2023</strong><small>Flex · exemplo sem modelo de compra escolhido</small></div><span class="rv-license">ABC1D23</span></div>
    <div class="rv-kpis">${kpi('Custo de aquisição',currency(params.price),'Premissa do simulador')}${kpi('Quilometragem','42.380 km','Dado fictício para desenho da ficha')}${kpi('Próxima revisão','45.000 km','Ou data limite, o que chegar primeiro')}</div>
    <div class="rv-tabs" aria-label="Detalhes do carro"><button type="button" data-fleet="overview" aria-pressed="true">Visão do carro</button><button type="button" data-fleet="maintenance" aria-pressed="false">Manutenção</button><button type="button" data-fleet="inspection" aria-pressed="false">Vistorias</button></div><div id="rv-fleet-detail">${fleetDetail('overview')}</div></section>`;}
  function fleetDetail(tab){
    if(tab==='maintenance')return `<div class="rv-list-row"><div>Troca de óleo + filtros<small>Exemplo · revisão preventiva a cada 10.000 km</small></div>${badge('Em planejamento',true)}</div><div class="rv-list-row"><div>Pneus e alinhamento<small>Inspeção de desgaste na entrega e na devolução</small></div>${button('Registrar ocorrência','incident')}</div><p class="rv-mini-note">Na versão operacional: orçamento → aprovação → serviço → comprovante → lançamento financeiro. Uma ocorrência crítica tira o carro da disponibilidade.</p>`;
    if(tab==='inspection')return `<div class="rv-list-row"><div>Vistoria de entrega<small>Fotos de todos os lados, hodômetro, combustível e acessórios</small></div>${badge('Modelo do checklist')}</div><div class="rv-list-row"><div>Vistoria de devolução<small>Comparação com a entrega e concordância das partes</small></div>${badge('Modelo do checklist')}</div>${button('Ver no app do motorista','go-driver')}`;
    return `<div class="rv-two"><div>${row('Status de demonstração','Alugado')}${row('Motorista vinculado','Marcos Oliveira')}${row('Contrato','RV-2026-001')}${row('Aluguel semanal',currency(params.weekly))}</div><div>${row('Documentos','CRLV · seguro · compra')}${row('Centro de resultado','Veículo RV-001')}${row('Cobertura do seguro','A confirmar por cotação')}${row('Linha do tempo','Compra → entrega → revisão')}</div></div>`;
  }
  function drivers(){return heading('MOTORISTAS','Uma parceria.<br>Um histórico completo.','Cadastro, documentos e vínculo com o carro, com acesso ao que importa para cada pessoa.')+
    `<div class="rv-two"><section class="rv-panel"><div class="rv-panel-header"><h2><span class="rv-avatar">MO</span>Marcos Oliveira</h2>${badge('Exemplo')}</div>${row('Etapa','Em análise documental')}${row('CNH / EAR','Conferência pendente')}${row('Contato','Cadastrado no convite')}${row('Veículo de exemplo','RV-001 · ABC1D23')}${row('Contrato','RV-2026-001')}${row('Comissão lojinha',`${params.commissionPct}% da venda bruta`)}<p class="rv-mini-note">Nome fictício. A liberação real depende da revisão dos documentos, do contrato e da vistoria.</p></section><section class="rv-panel"><h2>Jornada de entrada</h2><div class="rv-list-row">1. Cadastro e documentos</div><div class="rv-list-row">2. Análise e condições combinadas</div><div class="rv-list-row">3. Contrato e caução registrados</div><div class="rv-list-row">4. Vistoria e entrega do kit</div><div class="rv-list-row">5. Acesso ao app do motorista</div>${button('Explorar app do motorista','go-driver',true)}</section></div>`;}
  function contracts(){return heading('CONTRATOS','O combinado,<br>bem documentado.','Uma ficha para condições comerciais, documentos, assinaturas e encerramento.')+
    `<div class="rv-two"><section class="rv-panel"><div class="rv-panel-header"><h2>RV-2026-001</h2>${badge('Rascunho demonstrativo',true)}</div>${row('Locatário','Marcos Oliveira')}${row('Veículo','RV-001 · ABC1D23')}${row('Cobrança','Semanal · dia fixo acordado')}${row('Aluguel',currency(params.weekly))}${row('Caução','Valor e regras a definir')}${row('Franquia de km','A definir no contrato')}${row('Seguro, multas e avarias','Responsabilidades explícitas')}${row('Lojinha','Termo do kit + comissão + acertos')}<p class="rv-mini-note">Na operação, o contrato será um documento versionado, revisado juridicamente e ligado às cobranças. Aqui não há minuta jurídica nem assinatura real.</p></section><section class="rv-panel"><h2>Da assinatura à devolução</h2><div class="rv-list-row"><div>Versões e aceite<small>Documento final, evidências e signatários</small></div></div><div class="rv-list-row"><div>Vistorias anexadas<small>Entrega, revisão e devolução</small></div></div><div class="rv-list-row"><div>Acerto final<small>Aluguel proporcional, caução e divergências</small></div></div><div class="rv-list-row"><div>Histórico preservado<small>Aditivos sem sobrescrever o acordo anterior</small></div></div>${button('Ver documentos no app','driver-docs')}</section></div>`;}
  function finance(){return heading('FINANCEIRO','Entrou. Saiu.<br>Quanto ficou?','Visão ilustrativa de cobrança semanal. Valores operacionais são fictícios; as projeções ficam no simulador.')+
    `<div class="rv-kpis">${kpi('Aluguel da semana',currency(params.weekly),'Uma cobrança demonstrativa')}${kpi('Caução','Separada','Obrigação a devolver, conforme contrato')}${kpi('Comissão da lojinha',money(saleCount*products[0].price*.2),'Exemplo de comissão de 20%')}</div>
    <section class="rv-panel"><div class="rv-panel-header"><h2>Contas a receber e pagar</h2>${badge('Amostra de funcionamento')}</div><div class="rv-table-wrap"><table><thead><tr><th>Movimento</th><th>Vencimento</th><th>Centro</th><th>Valor</th><th>Estado</th></tr></thead><tbody><tr><td>Aluguel · Marcos<small>RV-2026-001 / semanal</small></td><td>09/11/2026</td><td>RV-001</td><td>${currency(params.weekly)}</td><td>${badge(paymentSubmitted?'Em conferência':'Aberto',true)}</td></tr><tr><td>Seguro<small>Exemplo mensal por veículo</small></td><td>10/11/2026</td><td>RV-001</td><td>− ${currency(params.insurance)}</td><td>${badge('A pagar',true)}</td></tr><tr><td>Administração<small>Compartilhada pela empresa</small></td><td>15/11/2026</td><td>Empresa</td><td>− ${currency(params.admin)}</td><td>${badge('A pagar',true)}</td></tr></tbody></table></div><p class="rv-mini-note">Pagamento informado pelo motorista exige confirmação. O sistema real terá baixas parciais, estornos, conciliação e extrato de caução. Parcelas de principal alteram dívida; juros afetam resultado.</p></section>`;}
  function shop(){return heading('LOJINHA NO CARRO','O estoque viaja.<br>O controle fica com você.','Modelo proposto: mercadoria consignada, venda registrada pelo motorista e comissão no acerto semanal.',button('Transferir 6 águas ao carro','transfer',true))+
    `<div class="rv-kpis">${kpi('Vendas nesta demonstração',money(saleCount*4),`${saleCount} ${saleCount===1?'unidade':'unidades'} de água`)}${kpi('Comissão a pagar',money(saleCount*.8),'20% da venda bruta neste exemplo')}${kpi('Águas no carro',String(products[0].qty+transfers*6-saleCount),'Saldo por movimentações')}</div><section class="rv-panel"><div class="rv-panel-header"><h2>Central → kit do RV-001</h2>${badge('Custódia de Marcos')}</div><div class="rv-table-wrap"><table><thead><tr><th>Produto</th><th>Na central</th><th>No carro</th><th>Preço de venda</th><th>Custo unitário</th></tr></thead><tbody>${products.map((p,i)=>`<tr><td>${p.name}</td><td>${p.central-(i===0?transfers*6:0)}</td><td>${p.qty+(i===0?transfers*6-saleCount:0)}</td><td>${money(p.price)}</td><td>${money(p.cost)}</td></tr>`).join('')}</tbody></table></div><div class="rv-actions" style="margin-top:18px">${button('Registrar venda no app','driver-shop')}${button('Simular margem da loja','go-simulator')}</div><p class="rv-mini-note">Transferência muda a localização da mercadoria; não gera receita. Venda gera baixa, comissão e valor a acertar. Contagem física, validade, perdas e devoluções terão histórico próprio.</p></section>`;}
  function driver(){
    const labels={Início:['Sua operação, no bolso.','A próxima cobrança, o carro e as pendências aparecem primeiro. O motorista vê apenas seus próprios dados.'],Carro:['Cuidar antes de parar.','Hodômetro, documentos do carro, vistorias e solicitação de manutenção em uma tela.'],Pagar:['Cobrança sem dúvida.','Valor, período, vencimento e comprovante juntos. Enviar um comprovante não confirma a baixa.'],Loja:['Vendeu, registrou.','O motorista registra a venda, acompanha o kit e vê a comissão acumulada.'],Docs:['O acordo sempre à mão.','Contrato, aditivos e documentos disponíveis em uma área organizada.']};
    return heading('RODAVOLT · MOTORISTA','Tudo para rodar<br>com tranquilidade.','Prévia do app no celular · Marcos Oliveira · dados de demonstração')+
    `<div class="rv-phone-stage"><section class="rv-phone" aria-label="App do motorista RODAVOLT"><div class="rv-phone-status">9:41 <span aria-hidden="true"></span> 100%</div><div class="rv-phone-header"><div><small class="rv-eyebrow">RODAVOLT / MOTORISTA</small><h2>${driverTab==='Início'?'Olá, Marcos.':({Pagar:'Pagamentos',Docs:'Documentos',Carro:'Meu carro',Loja:'Minha lojinha'})[driverTab]}</h2></div><span class="rv-avatar">MO</span></div><div class="rv-phone-content">${driverContent()}</div><div class="rv-phone-nav" aria-label="Navegação do motorista">${['Início','Carro','Pagar','Loja','Docs'].map(t=>`<button type="button" data-driver-tab="${t}" aria-pressed="${t===driverTab}">${t}</button>`).join('')}</div></section><aside class="rv-mobile-context"><span class="rv-eyebrow">${driverTab.toUpperCase()}</span><h2>${labels[driverTab][0]}</h2><p>${labels[driverTab][1]}</p><div class="rv-list-row"><div>Instalável pelo navegador<small>Proposta PWA para começar</small></div></div><div class="rv-list-row"><div>Mesmo dado da gestão<small>Permissões próprias por motorista</small></div></div><div class="rv-list-row"><div>Ações curtas e claras<small>Sem painel complexo no celular</small></div></div></aside></div>`;
  }
  function driverContent(){
    if(driverTab==='Início')return `<div class="rv-result-hero"><span class="rv-eyebrow">SEU PRÓXIMO ALUGUEL</span><div class="rv-big-number">${currency(params.weekly)}</div><div class="rv-caption">09 nov · período 02 a 08/11/2026</div>${button('Ver cobrança','driver-pay',true)}</div><div class="rv-panel"><h3>Seu carro está com você.</h3><div class="rv-list-row"><div>Hatch compacto · 2023<small>ABC1D23 · revisão aos 45.000 km</small></div></div>${button('Ver meu carro','driver-car')}</div><div class="rv-panel"><h3>Seu kit da lojinha</h3><p class="rv-mini-note">Águas, barras e balas. Registre as vendas para acompanhar sua comissão.</p>${button('Abrir lojinha','driver-shop')}</div>`;
    if(driverTab==='Pagar')return `<div class="rv-panel"><span class="rv-eyebrow">ALUGUEL SEMANAL</span><h2 style="font-size:29px;margin:12px 0">${currency(params.weekly)}</h2>${row('Vencimento','09/11/2026')}${row('Período','02 a 08/11/2026')}${row('Situação',paymentSubmitted?'Em conferência':'Em aberto')}<p class="rv-mini-note">No app real: Pix com identificador e confirmação pelo provedor. Este exemplo não gera cobrança.</p>${button('Simular envio de comprovante','submit-payment',true)}</div><div class="rv-panel"><h3>Caução e histórico</h3><p class="rv-mini-note">Extrato separado do aluguel, com saldo e condições de devolução.</p></div>`;
    if(driverTab==='Carro')return `<div class="rv-panel"><span class="rv-license">ABC1D23</span><h2 style="margin-top:14px">Hatch compacto · 2023</h2>${row('Último hodômetro','42.380 km')}${row('Próxima revisão','45.000 km')}${row('CRLV e seguro','Documentos do veículo')}${button(incident?'Ocorrência registrada no exemplo':'Solicitar manutenção','incident',true)}<p class="rv-mini-note">${incident?'Solicitação demonstrativa aberta. A equipe precisa analisar o relato.':'No fluxo real: descrição, fotos, prioridade e acompanhamento.'}</p></div><div class="rv-panel"><h3>Vistoria</h3><p class="rv-mini-note">Checklist com fotos, km, combustível e avarias. Na entrega e na devolução.</p></div>`;
    if(driverTab==='Docs')return `<div class="rv-panel"><h3>Meu contrato</h3><div class="rv-list-row"><div>RV-2026-001<small>Modelo de navegação · rascunho</small></div></div>${row('Aluguel semanal',currency(params.weekly))}${row('Anexos','Vistoria + termo da lojinha')}<p class="rv-mini-note">O documento assinado ficará disponível para consulta e download na versão operacional.</p></div><div class="rv-panel"><h3>Meus documentos</h3><div class="rv-list-row">CNH com EAR ${badge('A conferir',true)}</div><div class="rv-list-row">Cadastro e contatos</div></div>`;
    return `<div class="rv-panel"><h3>Comissão acumulada</h3><h2 style="font-size:29px;margin-top:10px">${money(saleCount*.8)}</h2><p class="rv-mini-note">20% da venda bruta · acerto semanal de exemplo.</p></div><div class="rv-panel"><h3>Registrar venda</h3><div class="rv-product"><div>Água mineral 500 ml<small>${products[0].qty+transfers*6-saleCount} no kit · ${money(products[0].price)}/un.</small></div>${button('+ Vender 1','sell',true)}</div><p class="rv-mini-note">Venda demonstrativa em dinheiro. Comissão ${money(.8)}; valor a repassar ${money(3.2)} por unidade.</p></div><div class="rv-panel"><h3>Reposição & acerto</h3><p class="rv-mini-note">Solicitar kit, confirmar recebimento e conferir vendas, perdas e repasses da semana.</p></div>`;
  }
  function plan(){return heading('DO PLANO À PRIMEIRA ENTREGA','Começar pequeno.<br>Nascer bem estruturado.','Sequência proposta a partir de 17/10/2026. O prazo depende dos fornecedores, documentos e validação de cada etapa.')+
    `<div class="rv-two"><section class="rv-panel"><div class="rv-step"><small>19–25 OUT · DECISÃO</small><h3>Simular antes de comprar</h3><p>Cotações de carros e seguro, financiamento, custo por km e margem da lojinha. Comparação base e estresse.</p></div><div class="rv-step"><small>26 OUT–01 NOV · FUNDAÇÃO</small><h3>Construir o fluxo principal</h3><p>Acesso, cadastro de carro e motorista, contrato, cobrança e vistoria de entrega.</p></div><div class="rv-step"><small>02–08 NOV · PILOTO</small><h3>Preparar uma operação real</h3><p>Caixa, contas, caução, histórico e manutenção. Validar a jornada com um único carro.</p></div><div class="rv-step"><small>09–15 NOV · MOTORISTA & LOJA</small><h3>Rodar com controle</h3><p>Portal mobile, kit consignado, vendas, comissão, reposição e acerto. Sem cobrança ou assinatura automáticas até homologação.</p></div><div class="rv-step"><small>16–30 NOV · ESTABILIZAÇÃO</small><h3>Conferir planejado × realizado</h3><p>Conciliação, alertas, despesas reais e correções. A primeira entrega depende dos critérios de aceite.</p></div></section><section class="rv-panel"><h2>Critérios para liberar o piloto</h2><ul class="rv-checklist">${['Custos reais e reserva definidos','Contrato validado e assinado','Seguro adequado ao uso confirmado','Pagamento e caução conferidos','Vistoria e documentos disponíveis','Acesso isolado do motorista testado','Kit contado e termo de entrega pronto'].map(x=>`<li>${x}</li>`).join('')}</ul><p class="rv-mini-note">Mapa de produto e plano proposto; não é um sistema operacional pronto.</p></section></div>`;}
  function render(){
    root.querySelector('#rv-breadcrumb').textContent=names[page];
    root.querySelectorAll('[data-page]').forEach(b=>b.setAttribute('aria-current',b.dataset.page===page?'page':'false'));
    root.querySelectorAll('[data-area]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.area==='driver')===(page==='driver'))));
    const views={today,simulator,fleet,drivers,contracts,finance,shop,plan,driver};
    content.innerHTML=views[page]();
    if(page==='simulator'){
      updateResults();
      root.querySelectorAll('[data-preset]').forEach(b=>{
        const values={base:[92,2,3],stress:[78,6,8],optimistic:[97,1,1]}[b.dataset.preset];
        b.setAttribute('aria-pressed',String(params.occupancy===values[0]&&params.stoppedDays===values[1]&&params.lossPct===values[2]));
      });
    }
  }
  root.addEventListener('input',event=>{
    const input=event.target;if(!input.dataset.param)return;
    const key=input.dataset.param;
    if(key==='financed')return;
    if(!input.validity.valid||input.value===''){
      input.setAttribute('aria-invalid','true');root.querySelector('#rv-input-error').hidden=false;root.querySelector('[data-action="save"]').disabled=true;return;
    }
    input.removeAttribute('aria-invalid');params[key]=Number(input.value);
    const invalid=root.querySelector('[data-param][aria-invalid="true"]');
    root.querySelector('#rv-input-error').hidden=!invalid;root.querySelector('[data-action="save"]').disabled=!!invalid;
    updateResults();persist();
  });
  root.addEventListener('change',event=>{
    const input=event.target;
    if(input.dataset.param==='financed'){params.financed=input.value==='true';root.querySelector('#rv-loan-fields').hidden=!params.financed;updateResults();persist();}
  });
  root.addEventListener('click',event=>{
    const el=event.target.closest('button');if(!el)return;
    if(el.dataset.page){page=el.dataset.page;render();persist();return;}
    if(el.dataset.area){page=el.dataset.area==='driver'?'driver':'simulator';render();persist();return;}
    if(el.dataset.driverTab){driverTab=el.dataset.driverTab;render();persist();return;}
    if(el.dataset.fleet){root.querySelector('#rv-fleet-detail').innerHTML=fleetDetail(el.dataset.fleet);root.querySelectorAll('[data-fleet]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));return;}
    if(el.dataset.preset){
      const presets={base:{occupancy:92,stoppedDays:2,lossPct:3},stress:{occupancy:78,stoppedDays:6,lossPct:8},optimistic:{occupancy:97,stoppedDays:1,lossPct:1}};
      Object.assign(params,presets[el.dataset.preset]);
      root.querySelectorAll('[data-param]').forEach(input=>{if(input.dataset.param!=='financed')input.value=params[input.dataset.param];});
      root.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));
      updateResults();persist();return;
    }
    const action=el.dataset.action;if(!action)return;
    if(action==='save'){saved={...params};persist();render();toast('Cenário salvo neste ambiente de demonstração.');return;}
    if(action==='restore'){params={...saved};render();persist();toast('Cenário salvo reaberto.');return;}
    if(action==='compare'){compare();return;}
    if(action==='sell'){
      if(products[0].qty+transfers*6-saleCount<=0){toast('Sem água no kit. Registre uma reposição na gestão.');return;}
      saleCount++;render();toast('Venda de exemplo registrada: R$ 4,00. Comissão: R$ 0,80.');return;
    }
    if(action==='transfer'){
      if(products[0].central-transfers*6<6){toast('Estoque central insuficiente para esta transferência.');return;}
      transfers++;render();toast('6 águas transferidas da central para o kit do carro, nesta demonstração.');return;
    }
    if(action==='incident'){incident=true;if(page==='driver')render();toast('Solicitação de manutenção registrada apenas nesta demonstração.');return;}
    if(action==='submit-payment'){paymentSubmitted=true;render();toast('Comprovante simulado enviado para conferência. A cobrança continua sem baixa.');return;}
    const destinations={'go-simulator':['simulator',null],'go-driver':['driver','Início'],'driver-pay':['driver','Pagar'],'driver-car':['driver','Carro'],'driver-shop':['driver','Loja'],'driver-docs':['driver','Docs']};
    if(destinations[action]){[page,driverTab]=[destinations[action][0],destinations[action][1]||driverTab];render();persist();}
  });
  let resizeTimer;
  if(globalThis.ResizeObserver)new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(page==='simulator')drawChart(engine.simulate(params));},80);}).observe(content);
  render();
  if(globalThis.Tweak){
    const design={radius:14,density:'Confortável'};
    const tweak=new Tweak({container:root,onChange:()=>{root.style.setProperty('--rv-radius',`${design.radius}px`);content.style.padding=design.density==='Compacta'?'22px 20px':'';}});
    tweak.addSlider(design,'radius',{min:4,max:22,step:2,unit:'px',label:'Cantos dos painéis'});
    tweak.addSelect(design,'density',{options:['Confortável','Compacta'],label:'Densidade da gestão'});
  }
})();
