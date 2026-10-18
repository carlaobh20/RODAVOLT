# Plano de execução v2

**17/10/2026.** Compra desejada em novembro de 2026; dia, veículo, capital e condições ainda não definidos. Datas são janelas propostas, sujeitas a decisões de negócio, fornecedor, testes e capacidade de execução.

## Ordem de construção

| Janela | Entrega | Critério verificável |
|---|---|---|
| Agora | Desenho v2, PRD, simulador de crescimento, comparação e app expandido | Protótipo navegável, matemática testada, limites identificados |
| 19–25/10 | Plano real e definição do primeiro vínculo | Cotações de carros/seguro/crédito, capital e reserva, regras da loja, contador e contrato; cenário sem loja e sob estresse |
| 26/10–01/11 | Fundação operacional e registros | Banco separado, identidade, autorização, anexos privados, livro financeiro, carro, aquisição e dívida; testes de integridade |
| 02–08/11 | Contrato, entrega e controle semanal | Motorista, documento versionado, vistoria, caução, cobrança/baixa parcial, estorno, despesas, manutenção e portal de consulta |
| 09–15/11 | App transacional e loja | Comprovante/conferência, ocorrência, atendimento, kit, venda, comissão, repasse, inventário, acerto e devolução |
| 16–30/11 | Fechamento confiável e comparação em produção | Conciliação, plano publicado, realizado por fontes, revisão com saldos completos, exportação/restauração e homologação do primeiro carro |
| Após estabilização | Integrações selecionadas e expansão | Pix, assinatura, importação bancária, alertas, políticas de equipe e evolução de projeções com evidência real |

Compra física e liberação de locação são marcos diferentes. Se a compra ocorrer cedo, o piloto deve aguardar contrato, cobertura, entrega, acesso e controles essenciais. A loja só entra no carro depois de estoque, termos e acerto homologados.

## Backlog orientado a jornadas

1. Cadastrar fontes das premissas e congelar uma primeira versão real do plano.
2. Criar identidade/perfis, empresa e arquivos privados; negar acesso indevido por API e por arquivo.
3. Implementar livro de registros com competência, vencimento, confirmação, anexo, centro, origem, revisão e estorno.
4. Registrar aquisição e financiamento por veículo; testar preço, entrada, tarifas, principal e parcelas.
5. Contratar e entregar: análise do motorista, contrato/aditivo, seguro, caução e vistoria.
6. Cobrar e receber: períodos semanais, baixas parciais, comprovante em conferência, conciliação e estorno.
7. Cuidar do carro: km, preventiva por km/data, relato, orçamento, autorização, serviço e despesa única.
8. Operar loja: compra, lote, transferência, kit/custódia, venda, recebimento, comissão, repasse, perdas e inventário.
9. Encerrar: vistoria comparativa, kit, avarias, multas, saldos e devolução de caução.
10. Fechar o período e explicar plano × realizado; revisar o futuro com recebíveis, dívidas, obrigações e estoque reais.

## Condições para dados reais

Salvamento e autorização no servidor, arquivos privados, dinheiro em decimal/centavos, transações e idempotência, integridade de contrato/estoque, backup e restauração. A demonstração estática não deve armazenar CNH, contratos assinados ou dados bancários pessoais.

## Liberação do primeiro aluguel

Veículo e cobertura adequados conferidos; motorista aprovado e acesso próprio; contrato válido; caução segregada; cobrança reproduzível; vistoria de entrega com evidência; manutenção programada; responsável pela conferência financeira; teste de uma semana e de devolução; kit só se o controle da loja estiver pronto.

## Validação

Motor por casos independentes, identidades de caixa e patrimônio e continuidade por snapshot. Financeiro por baixas parciais/estorno/transferência/caução. Banco por acesso permitido/negado e concorrência. Produto por tarefas completas em desktop e celular. Integrações em sandbox com repetição/falha/reprocessamento.

Metas de interface, velocidade e acessibilidade serão medidas no piloto. O plano não declara pronto o que depende de backend, fornecedor ou documento ainda não escolhido.

## Local → GitHub

Trabalho em `dev`, preservando alterações locais. Conferir remoto, executar verificações, revisar diff, commitar e sincronizar. Não fazer force push nem promover produção por inferência. A v1 permanece no histórico; a v2 é a proposta corrente. Não foi criado agendamento de comandos.
