# Plano de execução · primeiro carro em novembro de 2026

**Ponto de partida:** 17/10/2026. O usuário pretende comprar no mês seguinte, sem data de entrega definida. As datas abaixo são um plano de trabalho, não promessa de operação pronta. Contrato, cobertura de seguro, veículo, motorista, fornecedores e resultado da validação determinam a liberação.

## 1. Estratégia

Construir por jornadas completas. Primeiro validar a economia de um carro; depois implementar sua entrega, cobrança e controle; só então automatizar serviços externos. Cada etapa termina com uma demonstração e critérios de aceite. A loja pode ser ativada depois do aluguel se o controle de consignação ainda não estiver homologado.

| Janela proposta | Entrega | Dependência e saída verificável |
|---|---|---|
| Agora · 17–18/10 | PRD, referência do legado, desenho e simulador demonstrativo | Entrega desta conversa; referências e limites documentados |
| 19–25/10 | Estudo real de aquisição | Três cotações, seguro adequado, proposta de financiamento quando houver, contador e responsabilidades definidas; cenário sem loja e estresse comparados |
| 26/10–01/11 | Fundação + jornada de entrega | Projeto de banco separado, autenticação, permissão proprietário/motorista, carro, documentos, cadastro, rascunho/versão de contrato e vistoria |
| 02–08/11 | Financeiro e piloto interno | Cobrança semanal, recebimentos parciais, caução, despesas, dívida, manutenção e portal de consulta; ensaio completo com dados de teste |
| 09–15/11 | Portal transacional + loja | Relato de manutenção, comprovante em conferência, kit, venda, comissão, repasse, devolução e inventário; termo de loja validado |
| 16–30/11 | Estabilização e automações selecionadas | Conferência diária do primeiro carro, correções, exportação/backup e planejado × realizado; integrar Pix/assinatura somente com fornecedor homologado |

Se a compra ocorrer no início de novembro, priorizar os controles de entrega e financeiro e ajustar a data da locação ao aceite do piloto. A compra física e a liberação do sistema são marcos distintos. Não omitir um controle essencial para cumprir uma data arbitrária.

## 2. Sequência de implementação

| Item | Trabalho concreto | Critério principal |
|---|---|---|
| RV-01 | Revisar premissas e custos da primeira compra | Fontes/data e custos ausentes identificados |
| RV-02 | Refinar simulador para vencimentos reais e 13 semanas | Atraso e perda definitiva separados; reserva não duplicada |
| RV-03 | Criar ambiente e identidade de acesso | Recuperação de acesso e negação entre motoristas testadas |
| RV-04 | Cadastro de carro e histórico de km | Identificador único e correções auditadas |
| RV-05 | Cadastro e convite do motorista | Confirmação documental e vínculo próprio |
| RV-06 | Contrato comercial e documentos versionados | Regras semanais e sobreposição de veículo validadas |
| RV-07 | Vistoria/entrega/devolução | Fotos privadas, checklist e evidências acessíveis às partes |
| RV-08 | Recebíveis, baixas, despesas e caução | Pagamento parcial/estorno e caução separados do faturamento |
| RV-09 | Manutenção por km/data e ocorrência | Serviço gera uma única despesa; status do carro consistente |
| RV-10 | Portal mobile com permissões reais | Consulta e ações do vínculo certo, inclusive URL direta |
| RV-11 | Produtos, central, custódia e transferência | Estoque total preservado ao transferir |
| RV-12 | Venda, custo, comissão e repasse | Acerto reproduzível e estoque sem saldo negativo |
| RV-13 | Visão geral e planejado × realizado | Números rastreáveis até registros de origem |
| RV-14 | Exportação, backup e restauração | Recuperação ensaiada em ambiente separado |
| RV-15 | Integrações escolhidas | Sandbox, assinatura de webhook, repetição e falha testados |

RV-11/12 dependem da definição consignação versus venda ao motorista. RV-15 depende de conta comercial e credenciais do provedor; essas escolhas não impedem o protótipo e a validação interna. O piloto pode iniciar com conferência manual de pagamentos e documento assinado fora da plataforma, desde que as evidências estejam corretamente registradas e o fluxo autorizado pelas partes.

## 3. O que reunir antes da compra

Cidade/estado de operação e fuso; capital disponível e reserva intocável; compra à vista ou proposta detalhada de financiamento; modelos, ano, km, manutenção pregressa e inspeção; elegibilidade do carro nas plataformas pretendidas conferida à época; três cotações comparáveis de seguro para a atividade; aluguel semanal praticável e responsabilidade pelos custos; regime da empresa e orientação contábil; minuta contratual revisada; estratégia de seleção do primeiro motorista.

Para a loja: lista curta de SKUs, custo e preço, comissão/base, titular do recebimento, política de perdas/validade, capacidade do kit e rotina de contagem. Ainda não há fornecedor, preço ou margem confirmados.

## 4. Liberação de uma locação real

- Veículo adquirido, inspecionado, documentado e com cobertura adequada confirmada.
- Motorista conferido e com acesso individual; tentativas de ler dados de outro motorista negadas pelo servidor e arquivos privados.
- Contrato válido e evidência de assinatura; regras de seguro, caução, km e devolução compreendidas pelas partes.
- Agenda de cobrança reproduzível; pagamento parcial e estorno conferidos com saldos corretos.
- Vistoria e km de entrega registrados, próxima manutenção definida.
- Caução e reserva segregadas na gestão do caixa.
- Kit só embarca após contagem, termo, venda/repasse/comissão e devolução testados.
- Exportação e restauração de backup ensaiadas; responsável por conferir a operação definido.

## 5. Validação proporcional ao risco

Motor financeiro: casos pequenos independentes e reconciliação com cronograma real de financiamento. Banco: transações, isolamento por vínculo/empresa, negativa de permissão, concorrência de estoque e de contrato. Produto: ensaio de aquisição/entrega/semana/devolução em desktop e celular. Integrações: sandbox com repetição de eventos, erro de rede e estorno.

Não replicar centenas de testes baseados em procurar texto no código. Testar comportamento: valor devido, estoque remanescente, acesso permitido/negado e evidência preservada.

## 6. Rotina local → GitHub

1. Conferir mudanças locais e a branch/remoto antes de editar; atualizar sem sobrescrever trabalho.
2. Trabalhar em `dev`, com commits por entrega coerente.
3. Executar verificações relevantes e revisar o diff, incluindo gerados.
4. Commit e push para `carlaobh20/RODAVOLT` após trabalho validado; sem force push.
5. Quando houver aplicação publicada, mudanças em produção passam por revisão e promoção consciente. Push de desenvolvimento não equivale a deploy homologado.

Essa rotina atende à sincronização pedida. Não foi criado agendamento para executar comandos sem relação com uma tarefa em andamento.

## 7. Custos de construção e operação

O protótipo não exige serviço contratado. A aplicação operacional precisará de hospedagem, banco/armazenamento, envio de mensagens quando adotado, domínio, suporte e backup. Pix e assinatura podem cobrar por uso. Seguro, contador, manutenção e compra de mercadoria são custos do negócio, não da aplicação.

Levantar cotações e planos conforme fornecedores escolhidos; não embutir valores de SaaS ou tarifas não verificados no orçamento. Limitar escopo do primeiro piloto para caber na data e no capital definidos. Revisar prioridades semanalmente com base em demonstração e pendências reais.
