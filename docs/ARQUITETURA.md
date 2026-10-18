# Arquitetura v5 · homologação local

## Entrega local

Node 22, sem dependências externas. `scripts/build.mjs` combina fontes e verifica a sintaxe do script completo antes de gerar os HTMLs. Existem duas entradas: `scripts/serve.mjs` fornece a prévia estática em 4173; `scripts/operate.mjs` inicia o serviço de homologação com acesso individual em 4174. Não há importação silenciosa entre as duas bases.

- `src/growth.js`: projeção por carro, caixa, dívida, resultado e planos.
- `src/control.js`: livro financeiro demonstrativo, aquisição e estoque/venda.
- `src/legacy/expansion.js`: matemática especializada de dívida/expansão/renovação transposta da referência.
- `src/strategy.js`: adaptadores/análises financeiras reutilizados pelo relatório.
- `src/planning.js`: relatórios mensal/anual, posição inicial, recuperação e CSV.
- `src/operations.js`: kanban, entrega, cobrança/comprovante, solicitação, manutenção, vistoria e acerto.
- `src/driver.js`: avaliação da corrida, custos/metas e resumo pessoal.
- `prototype/app.js`: controlador da nova interface.
- `prototype/simulator.js` e `prototype/driver.js`: trechos inseridos dentro do controlador pelo build.
- `prototype/shell.html`, `prototype/style.css`: nova estrutura visual.

Estado v3 em `rodavolt-v3` no navegador. A versão anterior não é lida nem apagada. Exportação JSON inclui dados locais, cenários e premissas; CSV inclui fluxo. O modo `?qa=1` inicia estado isolado sem persistência, para verificação sem alterar a sessão do proprietário.

## Implantação operacional proposta

Banco relacional com transações e autorização por perfil/vínculo. Usuários próprios para proprietário, operação, financeiro e motorista. Arquivos privados com acesso por vínculo e expiração de URL. Saldo reproduzível por movimentos em centavos/decimal exato, não valor solto editável. Idempotência para recebimento, estoque, acerto e ordem de manutenção. Auditoria, estorno, fechamento e backup restaurável.

Módulos: veículos/financiamentos; interessados/vínculos/checklists; contratos/termos; cobranças/baixas/conciliação; itens/localizações/movimentos/vendas/acertos; manutenção/indisponibilidade/vistorias; solicitações/respostas; cenários/versões/fechamentos; área pessoal de jornadas/metas/decisões.

A prévia estática em 4173 não aplica isolamento de segurança. Nenhum documento pessoal deve ser inserido aqui. Trocar Gestão/Motorista demonstra navegação, não autenticação. Recebimentos e vendas do exemplo não são operações bancárias. O histórico local não é uma trilha inviolável.

## Limites contábeis

O capital inicial financia o kit por carro e o estoque central, que permanecem como ativos. No acerto de uma venda confirmada, o valor bruto entra no caixa e a comissão sai; o CMV reduz estoque e lucro sem pagar novamente uma mercadoria já comprada. A revisão da projeção preserva o estoque do fechamento. Transferências entre central e kit não geram receita ou despesa. O histórico demonstrativo anterior à sessão é uma abertura normalizada, não uma reconstrução fiscal de compras.

A projeção mantém estoque de giro constante: o custo mensal das vendas representa reposição de mercadoria. O realizado baixa o custo das unidades vendidas no acerto; compras futuras, notas, impostos por regime e conciliação completa exigem movimentos transacionais na implementação operacional. Não tratar o demonstrador como DRE fiscal ou extrato bancário.

Reconhecimento contábil, regras tributárias e contratos dependem de validação profissional antes do uso real. Não foi conectado o banco do sistema antigo nem executada migration remota.

## Módulos operacionais v4

- `src/finance.js`: títulos, baixa, contas demonstrativas, extrato, correspondências e origem dos saldos; deriva caixa de `control.js`.
- `src/coordination.js`: modelos/documentos versionados, partes, fila e agenda com pendências derivadas.
- `src/inspection.js`: inspeção por perfil/veículo/ciclo, evidências tipadas, envio, correção e aprovação.
- `src/live.js`: posições fictícias e relógio de reprodução, validação/ordenação de pontos, idade do dado e projeção cartográfica.
- `prototype/finance.js`, `coordination.js`, `inspection.js`, `live.js`: trechos inseridos pelo build no mesmo controlador. Estilos próprios são concatenados.

Na prévia estática, inicializadores idempotentes ampliam a sessão v3 já existente; formato externo e chave local permanecem para preservar plano e dados ilustrativos. `driverProfiles` mantém jornadas/metas de cada perfil de exemplo. As telas filtram documentos, cobranças e chamados; isso não substitui permissões no servidor.

Na prévia estática, arquivos de foto ficam em `Map` e object URLs somente durante a sessão da página; estado persistido contém slots/origem, sem conteúdo, nome de arquivo ou object URL. Ao recarregar, a prévia temporária expira. Uma vistoria com arquivos temporários expirados precisa selecionar novamente antes do envio. Imagens de exemplo são SVGs ilustrativos explicitamente marcados. O protótipo não é repositório de evidências.

Mapa carrega somente tiles visíveis via HTTPS em tile.openstreetmap.org, com atribuição; sem chave nem dados pessoais. Sem fornecedor de GPS conectado. Eventos de demonstração não alteram hodômetro operacional nem financeiro. API futura deve guardar fixTime/serverTime/validade/precisão e não reinterpretar posição antiga como atual. Provedor de banco/assinatura/GPS será escolhido depois, com credenciais no servidor, webhooks autenticados, idempotência e acesso por vínculo.

`src/program.js` controla seleção manual, caução e crédito da margem. O livro distingue rentalReceived de rentalRevenue, storeGross de storeReceived e liabilities de dívida dos carros. Abatimento reconhece aluguel sem criar banco; shopSettlement registra repasse líquido sem repetir receita. Novo passivo acompanha snapshot e reduz patrimônio/caixa disponível no reforecast. Dados anteriores não são reescritos.

A apresentação simplificada do motorista vive em `prototype/driver.js` e `prototype/driver-simple.css`; a vistoria usa `prototype/inspection.js` e `prototype/inspection-mobile.css`. O build inclui os dois estilos depois da base da gestão, com regras limitadas a `.is-driver`. Tema claro/escuro usa tokens isolados; alternar a classe preserva formulários em edição. A preferência `driverTheme` é opcional no estado v3 e não muda dados empresariais.

A confirmação única de crédito usa `src/program.js:applyAvailableCredit`, que delega os lançamentos a `applyCredit`. A prévia é calculada em cópia do estado. Não há fórmula financeira paralela no controlador de tela. O servidor local permite `/_responsive/320?qa=1` e `/_responsive/390?qa=1` para testar no iframe com altura de viewport e estado isolado.

`src/shop.js` amplia a sessão com custódia por motorista, combos, trânsito/divergências, pedidos/reservas e entregas. O agregado legado `products.kit` permanece compatível; a migração preserva o kit inicial do DRV-1. Novas rotas usam o motor da loja para não vender a custódia de outro perfil. `prototype/shop.js/css` é incluído pelo build; o motorista conserva a aba Lojinha e a gestão ganha montagem/conferência de combos.

Confirmação de pagamento é aplicada em uma cópia do estado e só confirmada após todas as validações e o acerto das `saleIds` daquele pedido. O acerto de `program.js` aceita seleção opcional, preservando o comportamento manual anterior; lucro pago não gera novo crédito. Referência demonstrativa impede uso em outro pedido, e entrega tem idempotência própria. Na prévia estática, essa cópia não constitui controle concorrente de servidor. No serviço local, a alteração também passa pela fila de gravação, revisão e idempotência do servidor. Nenhuma das duas entradas recebe webhook bancário real.

`control.js` centraliza corte de caução e validação cronológica de devolução. Snapshots carregam calendário; `growth.js:assertCalendar` impede cruzar competências incompatíveis. Meses sem lançamentos preservam depreciação/snapshot com `hasRecords:false`, sem serem apresentados como valores operacionais observados.


## Motores de fechamento v5

- `src/rental.js`: condições explícitas por versão/ciclo, emissão semanal, histórico de abertura preservado, prévia/finalização e obrigação de aluguel recebido a maior. `amount` original permanece; `adjustedAmount` guarda o acerto. Vencimento posterior usa a semana utilizada, com dia semanal preservado.
- `src/closure.js`: agendamento, vistoria de retorno, recebimento físico, retorno bom/avariado do kit e demonstrativo. O gate do kanban impede soltar o carro sem essa jornada; saldo financeiro permanece após liberação física.
- `src/incidents.js`: multa, sinistro e avaria por motorista/carro/ciclo, prazo, manifestação e decisão manual. Título vinculado usa categoria própria de ressarcimento, sem transformar o fato em aluguel ou débito automático.
- `src/shop.js`: expiração de reservas, pagamento tardio como obrigação, reembolso, devolução física, quarentena, retorno do kit e snapshots de lote/validade/garantia. O catálogo ainda possui limitações para múltiplos lotes simultâneos por SKU.
- `src/program.js`: estorno explícito do abatimento, recuperação de lucro já pago, repasse de crédito disponível e devolução de aluguel. `src/finance.js:reversePayment` estorna a última baixa elegível, preservando origem, histórico e conciliação. O caixa recebido por cobrança é acumulado em vez de sobrescrito.
- `src/maintenance.js`: ampliação de planos de manutenção por carro, km e data, integrado aos cuidados, à agenda e à conclusão de OS com data e hodômetro. A validação está em `VALIDACAO.md`.

`rentAdjustment` reduz receita e aumenta obrigação sem caixa. `rentalRefund` reduz caixa e obrigação sem despesa novamente. `driverCreditPayout` baixa o crédito do motorista sem repetir a despesa reconhecida no ganho. Estorno é movimento negativo vinculado ao original, preservando o documento e evidência bancária; categorias protegidas seguem seu fluxo próprio.

## Serviço de homologação

`server/domain.mjs` carrega os mesmos motores em contexto sem acesso à rede ou sistema de arquivos. `server/api.mjs` aplica sessão, papel, comandos e validação. `server/store.mjs` serializa mutações em cópia, grava arquivo temporário, sincroniza e renomeia atomicamente; um lock impede duas instâncias usando o mesmo diretório. A base JSON fica em `.local/rodavolt/state.json`, com arquivos em `files/`. É persistência local, sem banco remoto ou migração do projeto antigo.

O proprietário cria sua conta na primeira abertura; contas de motorista são criadas e vinculadas pela gestão. Senhas usam scrypt com salt. Sessões ficam na memória do processo, expiram e usam cookie HttpOnly/SameSite=Strict; mutações autenticadas exigem CSRF. O serviço escuta somente em `127.0.0.1` por HTTP. Publicação exige ciclo próprio de infraestrutura, TLS, segurança e homologação.

A gestão recebe uma cópia operacional sem jornadas/decisões pessoais. Seu painel completo grava o estado por `PUT /api/workspace`, com revisão esperada e identificador de idempotência. Motoristas recebem projeção filtrada pelo vínculo da sessão e usam somente os comandos permitidos em `POST /api/command`; enviar outro `driverId` não amplia o escopo. Revisão divergente retorna 409 para recarregar antes de sobrescrever. Dois acessos concorrentes e reenvio fazem parte dos testes da base local.

Jornadas, metas e decisões do serviço ficam em `state.personal[user.id]`, separadas do livro e exclusivas da conta titular. Exportação pessoal exige o próprio acesso. Uploads/leituras de arquivos exigem sessão e vínculo; fotos de vistoria também conferem vistoria e vista. Os arquivos têm limite, tipo e hash; isso não constitui homologação de documentos reais.

O backup da gestão contém operação, arquivos e trilha, com verificação de integridade. Não contém senhas nem finanças pessoais. A restauração mantém a identidade do proprietário, revoga acessos de motorista e sessões, exige novo login e recriação consciente dos vínculos. Arquivos originais não são apagados pela restauração. A política de retenção, teste de recuperação fora desta máquina e monitoramento operacional ainda precisam ser definidos.

Não há promessa de banco, assinatura, Pix, rastreador, push, processamento fiscal ou app nativo conectado. O gateway local serve para homologar o fluxo com dados fictícios e rever limites antes da operação real.
