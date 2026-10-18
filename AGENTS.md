# Trabalho na RODAVOLT

- Esta é a nova plataforma: `https://github.com/carlaobh20/RODAVOLT.git`. Não confundir com `RodaVolt-System` nem editar a referência em Downloads.
- O usuário autorizou edição local, commits e sincronização ao GitHub. Trabalhar em `dev`, preservar mudanças existentes, conferir remoto e diff antes de push. Nunca usar force push ou reset destrutivo. Não inferir autorização para deploy ou promoção de produção.
- Entrega atual: planejamento e protótipo. Ler `README.md`, `docs/DECISOES.md` e o PRD atual antes de ampliar escopo. Distinguir requisitos confirmados de sugestões e dados demonstrativos.
- Node 22. Não há dependências nesta fase. `npm run check` antes de commit. Editar fontes; regenerar `index.html` e `prototype/preview.html` com `npm run build`.
- Fórmulas empresariais vivem em `src/growth.js`, estratégia/adaptadores em `src/strategy.js`, motores especializados em `src/legacy/expansion.js`; realizados e eventos em `src/control.js`; telas não duplicam o motor. Testar diferenças entre caixa, resultado e patrimônio.
- Dados do protótipo são fictícios. Não apresentar estoque, cobranças ou contratos como produção. Não guardar documentos pessoais em localStorage.
- A implementação operacional futura terá permissões no banco e separação por motorista. Não conectar ao banco antigo nem aplicar migrations remotas como parte do protótipo.
- Não versionar chaves, `.env`, documentos pessoais, dependências ou capturas temporárias de teste.

- V3: interface reconstruída em 18/10/2026. Sete entradas por rotina; simulador contínuo, kanban, loja de perfumes/acessórios e app com análise manual de corrida. Ler `docs/CENTRO-DE-ESTRATEGIA.md` para a referência visual do simulador antigo. Brasil/BRL são fixos.
- `prototype/simulator.js` e `prototype/driver.js` são inseridos no controlador de `prototype/app.js` pelo build. `prototype/strategy.js` da v2 foi removido. Verificar a sintaxe do script completo gerado.
- Regras operacionais em `src/operations.js`, relatório em `src/planning.js`, análise pessoal em `src/driver.js`. Não misturar ganhos do motorista com receita da locadora. Estado local v3 separado do anterior.

- V4: novas telas Painel ativo, Agenda e Meu advogado; financeiro ampliado. Motores em `src/finance.js`, `src/coordination.js`, `src/inspection.js`, `src/live.js`. Respectivos trechos `prototype/*.js` e CSS são inseridos pelo build. Não duplicar caixa ou conciliar para criar receita novamente.
- Banco/rastreador/assinatura sem fornecedor escolhido; usuário pediu pensar no sistema antes de integrar. Posições sempre demonstrativas, dado antigo explícito. Fotos só temporárias em memória, nunca no localStorage/Git. Leia `docs/OPERACAO.md`.

- Piloto: 100% da margem da loja para o motorista, caução obrigatória e avaliação humana. `src/program.js` controla critérios/caução/créditos; `prototype/program.js/css` é inserido pelo build. Não voltar à hipótese antiga de 20% de comissão. Abatimento e lucro pago não podem duplicar benefício. Caução e crédito pendente são passivos, nunca receita/capital livre.

- Combos/lojinha: `src/shop.js` controla custódia por motorista, trânsito, conferência, reserva, pedido e entrega; `prototype/shop.js/css` entram no build. Novas vendas/transferências da UI passam pelo motor da loja, preservando titularidade e snapshots; não usar kit agregado como estoque individual.
- Pix continua fictício. Confirmação na gestão acerta apenas as saleIds do pedido em cópia transacional; comprovante não é confirmação. Entrega não baixa estoque/caixa novamente. Cobrança recorrente e encerramento completo ainda pendentes: ler `docs/AUDITORIA-DE-FLUXOS.md`.
- Calendários de plano/livro/seed devem ser compatíveis; usar `S.assertCalendar` antes de referência/reforecast. Caução e devolução respeitam competência e cronologia. Não usar valor recebido no futuro para liberar carro no passado.
