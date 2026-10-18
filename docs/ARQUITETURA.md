# Arquitetura v4

## Entrega local

Node22, build sem dependências e aplicação estática. `scripts/build.mjs` combina fontes e verifica a sintaxe do script completo antes de gerar os HTMLs. `scripts/serve.mjs` fornece a prévia local.

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

A interface estática não aplica isolamento de segurança. Nenhum documento pessoal deve ser inserido aqui. Trocar Gestão/Motorista demonstra navegação, não autenticação. Recebimentos e vendas do exemplo não são operações bancárias. O histórico local não é uma trilha inviolável.

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

Inicializadores idempotentes ampliam a sessão v3 já existente; formato externo e chave local permanecem para preservar plano e dados ilustrativos. `driverProfiles` mantém jornadas/metas de cada perfil de exemplo. As telas filtram documentos, cobranças e chamados; isso não substitui permissões no servidor.

Arquivos de foto ficam em `Map` e object URLs somente durante a sessão da página; estado persistido contém slots/origem, sem conteúdo, nome de arquivo ou object URL. Ao recarregar, a prévia temporária expira. Uma vistoria com arquivos temporários expirados precisa selecionar novamente antes do envio. Imagens de exemplo são SVGs ilustrativos explicitamente marcados. O protótipo não é repositório de evidências.

Mapa carrega somente tiles visíveis via HTTPS em tile.openstreetmap.org, com atribuição; sem chave nem dados pessoais. Sem fornecedor de GPS conectado. Eventos de demonstração não alteram hodômetro operacional nem financeiro. API futura deve guardar fixTime/serverTime/validade/precisão e não reinterpretar posição antiga como atual. Provedor de banco/assinatura/GPS será escolhido depois, com credenciais no servidor, webhooks autenticados, idempotência e acesso por vínculo.

`src/program.js` controla seleção manual, caução e crédito da margem. O livro distingue rentalReceived de rentalRevenue, storeGross de storeReceived e liabilities de dívida dos carros. Abatimento reconhece aluguel sem criar banco; shopSettlement registra repasse líquido sem repetir receita. Novo passivo acompanha snapshot e reduz patrimônio/caixa disponível no reforecast. Dados anteriores não são reescritos.
