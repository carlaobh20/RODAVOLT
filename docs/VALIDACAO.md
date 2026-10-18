# Validação da reconstrução v2

**17/10/2026 · escopo de planejamento e protótipo local.** A v1 foi substituída e permanece no histórico Git.

## Automatizado

`npm run check`: **31 testes aprovados**, geração dos arquivos e verificação de sintaxe. A suíte cobre calendário/mês zero; início da operação; identidades de caixa e patrimônio; reserva e compra bloqueada; reinvestimento; Price e quitação; amortização e juros; aportes/retiradas; equipe por escala; plano preservado; dados ausentes/base zero; revisão por snapshot; taxa contratada preservada; visão anual; realizado e aquisição; avaliação independente; estoque e comissão. `git diff --check` sem erro.

## Jornadas verificadas no navegador

Testes de interação em uma sessão QA isolada, sem alterar o estado salvo da prévia principal:

- Projeção inicial com 60 meses, crescimento por carro, caixa/dívida, patrimônio/capital e marcos.
- Aporte mensal de R$ 1.500 recalcula o rascunho de 8 para 10 carros finais nas premissas do exemplo; a referência BASE-001 permanece independente.
- Despesa demonstrativa de R$ 250 reduz o caixa de janeiro de aproximadamente R$ 58.718 para R$ 58.468; a revisão começa nesse saldo.
- Registrar uma aquisição de exemplo reduz o caixa em R$ 31.300 e aumenta a frota observada de 1 para 2, com dívida correspondente.
- Plano mensal e visão anual renderizam; salvar outra versão mantém BASE-001 e BASE-002 acessíveis na auditoria.
- Jornada pessoal registra ganhos de R$ 320, combustível de R$ 85 e outras despesas de R$ 20, resultando em R$ 215 antes do aluguel; não lança receita da locadora.
- Venda de duas águas à empresa baixa o kit de 12 para 10 e calcula R$ 1,60 de comissão; acerto registra receita, custo e comissão, sem compensar aluguel.
- Comprovante fica em conferência; a gestão confirma e o aluguel recebido de janeiro passa de R$ 3.150 para R$ 4.200 no exemplo.
- Solicitação de manutenção aparece na central e pode passar para atendimento.
- Checklist de vistoria e protocolo de suporte são registrados, com retorno na interface.
- Inspeção visual de composição no desktop e em moldura de 320px.

## Limites da verificação

O protótipo usa dados fictícios e persistência local. Não foram homologados banco, autenticação/autorização, arquivo/foto, assinatura, Pix, emissão fiscal, telemetria, acessibilidade integral, operação offline ou desempenho sob carga. Não é uma auditoria completa do legado. A matemática normalizada não substitui cotações, contrato, seguro e orientação contábil reais.
