# Trabalho na RODAVOLT

- Esta é a nova plataforma: `https://github.com/carlaobh20/RODAVOLT.git`. Não confundir com `RodaVolt-System` nem editar a referência em Downloads.
- O usuário autorizou edição local, commits e sincronização ao GitHub. Trabalhar em `dev`, preservar mudanças existentes, conferir remoto e diff antes de push. Nunca usar force push ou reset destrutivo. Não inferir autorização para deploy ou promoção de produção.
- Entrega atual: planejamento, protótipo e homologação operacional local (v5). Ler `README.md`, `docs/DECISOES.md` e o PRD atual antes de ampliar escopo. Distinguir requisitos confirmados de sugestões e dados demonstrativos.
- Node 22. Não há dependências nesta fase. `npm run check` antes de commit. Editar fontes; regenerar `index.html` e `prototype/preview.html` com `npm run build`.
- Fórmulas empresariais vivem em `src/growth.js`, estratégia/adaptadores em `src/strategy.js`, motores especializados em `src/legacy/expansion.js`; realizados e eventos em `src/control.js`; telas não duplicam o motor. Testar diferenças entre caixa, resultado e patrimônio.
- Dados do protótipo são fictícios. Não apresentar estoque, cobranças ou contratos como produção. Não guardar documentos pessoais em localStorage.
- O serviço de homologação local aplica sessões e comandos por motorista. Não confundir isso com produção homologada. Não conectar ao banco antigo nem aplicar migrations remotas por consequência deste trabalho.
- Não versionar chaves, `.env`, documentos pessoais, dependências ou capturas temporárias de teste.

- V3: interface reconstruída em 18/10/2026. Sete entradas por rotina; simulador contínuo, kanban, loja de perfumes/acessórios e app com análise manual de corrida. Ler `docs/CENTRO-DE-ESTRATEGIA.md` para a referência visual do simulador antigo. Brasil/BRL são fixos.
- `prototype/simulator.js` e `prototype/driver.js` são inseridos no controlador de `prototype/app.js` pelo build. `prototype/strategy.js` da v2 foi removido. Verificar a sintaxe do script completo gerado.
- Regras operacionais em `src/operations.js`, relatório em `src/planning.js`, análise pessoal em `src/driver.js`. Não misturar ganhos do motorista com receita da locadora. Estado local v3 separado do anterior.

- V4: novas telas Painel ativo, Agenda e Meu advogado; financeiro ampliado. Motores em `src/finance.js`, `src/coordination.js`, `src/inspection.js`, `src/live.js`. Respectivos trechos `prototype/*.js` e CSS são inseridos pelo build. Não duplicar caixa ou conciliar para criar receita novamente.
- Pacote jurídico: `src/legal-pack.js` mantém cinco minutas de revisão profissional; `npm run contracts:export` gera `docs/contratos/*.md`. `src/coordination.js` instala novas versões sem alterar documentos anteriores. Os textos não são aprovação jurídica nem assinatura; dados pessoais de qualificação ficam fora da prévia. Consulte `docs/PACOTE-CONTRATUAL.md`.
- Banco/rastreador/assinatura sem fornecedor escolhido; usuário pediu pensar no sistema antes de integrar. Posições sempre demonstrativas, dado antigo explícito. Fotos na prévia são temporárias em memória; no serviço ficam privadas em `.local/rodavolt/files`, nunca no localStorage/Git. Leia `docs/OPERACAO.md`.

- Piloto: 100% da margem da loja para o motorista, caução obrigatória e avaliação humana. `src/program.js` controla critérios/caução/créditos; `prototype/program.js/css` é inserido pelo build. Não voltar à hipótese antiga de 20% de comissão. Abatimento e lucro pago não podem duplicar benefício. Caução e crédito pendente são passivos, nunca receita/capital livre.

- Combos/lojinha: `src/shop.js` controla custódia por motorista, trânsito, conferência, reserva, pedido e entrega; `prototype/shop.js/css` entram no build. Novas vendas/transferências da UI passam pelo motor da loja, preservando titularidade e snapshots; não usar kit agregado como estoque individual.
- Pix continua fictício. Confirmação na gestão acerta apenas as saleIds do pedido em cópia transacional; comprovante não é confirmação. Entrega não baixa estoque/caixa novamente. Cobrança contratual, encerramento e exceções da loja foram implementados para homologação local: ler `docs/AUDITORIA-DE-FLUXOS.md`, `docs/COBRANCAS.md` e `docs/DEVOLUCAO.md`.
- Calendários de plano/livro/seed devem ser compatíveis; usar `S.assertCalendar` antes de referência/reforecast. Caução e devolução respeitam competência e cronologia. Não usar valor recebido no futuro para liberar carro no passado.


- V5: `src/rental.js` preserva preço/versão/ciclo e emite aluguéis idempotentes. Pagamento VENCIDO foi confirmado pelo usuário. Dia e proporcionalidade são escolhas explícitas; não inventar multa, juros, reajuste ou retenção de caução.
- `src/closure.js` conduz devolução física, vistoria, chaves, kit e demonstrativo. Mover o kanban não contorna essa jornada. Dívidas não somem e disponibilidade física não quita obrigações.
- `src/incidents.js` separa ocorrência, prazo, manifestação e decisão humana. Ressarcimento não é aluguel; valor proposto não é dívida. `src/maintenance.js` concentra a ampliação de planos de manutenção por carro, km e prazo quando integrada.
- `C.reverseEntry` e `F.reversePayment` preservam origens e conciliações. Recebimentos acumulados em `charge.paidAmount` não podem ser sobrescritos. Acerto encerrado exige revisão própria antes de reabrir aluguel. Repasse de crédito baixa obrigação sem despesa duplicada.
- Serviço local: `npm run operate` em `http://127.0.0.1:4174/operacao`; `npm run dev` 4173 permanece prévia separada. `server/api.mjs`, `domain.mjs`, `store.mjs` usam os mesmos motores e persistem em `.local/rodavolt`, ignorada. Não versionar essa pasta, backups, contas, senhas ou arquivos.
- A gestão usa estado completo com revisão; motorista usa comandos permitidos e titularidade derivada da sessão, nunca do driverId recebido do navegador. Gravação atômica, revisão/409 e idempotência precisam ser preservadas. HTTP/loopback é somente homologação; não publicar sem ciclo próprio de segurança/infraestrutura.
- Finanças pessoais do serviço são por `user.id`, exclusivas do titular; não retornam na visão/backup da gestão. Backup operacional inclui arquivos e exclui personal/senhas; restauração revoga acessos de motorista, exige reautenticação e novo vínculo consciente, preservando arquivos originais.
