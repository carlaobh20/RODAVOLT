# RODAVOLT · PRD v1

**Data:** 17/10/2026 · **Estado:** proposta para validação de produto · **Mercado inicial confirmado:** Brasil, BRL, aluguel semanal para motoristas de aplicativo. **Primeira aquisição desejada:** novembro de 2026, sem dia definido.

## 1. Problema e proposta

O proprietário precisa saber quanto custa comprar, manter e alugar cada carro; cobrar o motorista; preservar contratos e evidências; acompanhar manutenção e controlar mercadoria dentro dos veículos. O motorista precisa consultar seus compromissos e resolver tarefas pelo celular.

A RODAVOLT conecta **simulação → compra → motorista → contrato → entrega → cobrança → manutenção → devolução**, com uma segunda cadeia para a lojinha: **compra de produto → central → kit no carro → venda → comissão → acerto**.

A primeira versão deve atender um único carro com rigor financeiro e expandir sem refazer o domínio. A simplicidade vem de reduzir telas e ações duplicadas. As regras de dinheiro, estoque e contrato continuam completas.

## 2. Resultados esperados

1. Antes da compra, comparar veículos e condições com custos e riscos explícitos.
2. Identificar caixa e resultado por carro, por contrato e pela empresa.
3. Rastrear toda cobrança até o pagamento e todo serviço até sua despesa.
4. Saber onde está a mercadoria e quem deve repassar cada valor.
5. Dar ao motorista autonomia para consultar e informar sem expor os dados da empresa ou de terceiros.

Métricas do negócio: receita faturada e recebida; atraso por vencimento; dias alugados/dias civis; dias indisponíveis/dias civis; custo de manutenção por km; resultado por carro; caixa livre da empresa; margem da lojinha após comissão; diferença de inventário; tempo de resolução de ocorrências.

Metas de produto a validar no piloto: consultar uma cobrança em até 3 toques; registrar uma venda simples em até 20 segundos; nenhum lançamento de serviço digitado duas vezes; 100% dos movimentos de estoque com origem, destino ou motivo; 100% das baixas de cobrança com evidência. Não são resultados já medidos.

## 3. Pessoas, acesso e dados

| Perfil | Pode fazer | Limite |
|---|---|---|
| Proprietário | Premissas, compras, custos, banco, contratos, estoque, equipe | Todo o negócio da própria empresa |
| Operação | Motoristas, entrega, vistoria, manutenção, estoque | Sem alterar condições financeiras sensíveis sem permissão |
| Financeiro | Contas, pagamentos, conciliação, comissão, relatórios | Sem administrar usuários/permissões |
| Motorista | Próprio carro, cobranças, contrato, documentos, vendas e suporte | Apenas vínculo próprio, inclusive quando acessa URL direta |
| Contador, futuro | Exportação ou leitura financeira autorizada | Sem credencial compartilhada nem administração |

Para o primeiro carro, proprietário e motorista bastam. Outros perfis entram quando houver pessoas reais para utilizá-los. Permissões no banco, nos arquivos e nas operações; esconder um botão não é autorização.

## 4. Navegação

Gestão: **Visão geral · Simulador · Frota & manutenção · Motoristas · Contratos · Financeiro · Lojinha**. Configurações ficam em uma área secundária na aplicação operacional.

O carro reúne detalhes, documentos, resultado, serviços e vistorias. O financeiro reúne contas, caixa, conciliação e resultado. O contrato reúne condições comerciais, documento, assinatura e aditivos. Pendências dessas áreas alimentam uma única visão geral.

Motorista: **Início · Carro · Pagar · Loja · Docs**. Suporte contextual no carro ou na cobrança; contatos e perfil em uma área secundária. O portal será instalável como PWA; aplicativo nativo fica condicionado à necessidade real de recursos do dispositivo.

## 5. Escopo por módulo

### 5.1 Visão geral

Antes de operar, exibir preparação e pendências reais, sem métricas inventadas. Depois, mostrar saldo disponível com caução separada, vencimentos de 7/30 dias, cobranças vencidas, revisões próximas, carros indisponíveis, contratos/documentos a vencer e reposições necessárias. Cada pendência abre o registro original e tem responsável.

**Aceite:** uma cobrança atrasada aparece uma vez, abre a cobrança correta e some quando liquidada. Ausência de dado aparece como ausência, sem virar zero ou estimativa.

### 5.2 Simulador — prioridade inicial

Compra à vista/financiada, custos iniciais e recorrentes, custo por km, ociosidade, paradas, perda de receita, tributos parametrizados, estoque inicial, giro, comissão, reserva, horizonte e revenda. Comparação entre cotações de carros e entre condições de operação. Salvar versões, origem e data das premissas; realizar estresses; mostrar valor de equilíbrio e necessidade de caixa.

**Saídas:** caixa mês a mês, resultado após depreciação e juros, dívida, patrimônio, capital próprio, VPL, payback sem/com saída identificado, custo por km e sensibilidades. Nunca confundir principal com despesa ou caução com receita.

**Aceite:** o usuário troca aluguel ou custo e todos os resultados mudam pelo mesmo motor; compara cenários mantendo o que não foi alterado; identifica qual cotação falta. Simular não cria carro, dívida, cobrança ou compra. Ver [modelo financeiro](SIMULADOR.md).

### 5.3 Frota e manutenção

Cadastro: identificação, placa/chassi, modelo/ano, combustível, km, compra, preparação, financiamento, documentos, seguro, localização de guarda e status. Disponível, reservado, alugado, manutenção, indisponível e vendido são estados operacionais, não calculados apenas pela existência de contrato.

Planos preventivos por km **ou data, o que ocorrer primeiro**, óleo/filtros, pneus, garantia, orçamento e fornecedor. Ocorrências corretivas, aprovações, prazo, custo, comprovantes e dias de parada. Hodômetro auditável, com correção por evento justificado; nunca reduzir silenciosamente.

**Aceite:** finalizar um serviço cria a despesa vinculada uma única vez; o financeiro recebe o custo correto; alerta de revisão se recalcula; km contraditório é sinalizado. Carro em serviço crítico não pode ser entregue sem liberação.

### 5.4 Motoristas

Cadastro, contatos, contato de emergência se necessário, CNH/EAR e validade, documentos mínimos, conferência, histórico de vínculo, condições comerciais, pendências, comunicação registrada e convite para acesso próprio. Funil inicial simples: cadastro → análise → aprovado → contratado → encerrado. Não criar pontuação subjetiva de crédito/risco na primeira fase.

**Aceite:** verificar documentos e registrar decisão com autor/data. Encerrar contrato retira acesso ao carro e estoque atual, preservando o histórico permitido de cobranças e documentos do próprio motorista.

### 5.5 Contratos completos

Dados das partes, veículo, vigência, preço semanal, vencimento e período, regras de proporcionalidade, reajuste, km/franquia/excedente, caução, responsabilidades por combustível/recarga, seguro e franquia, manutenção, multas, avarias, indisponibilidade, rescisão, atraso, devolução e solução de divergências. Condições dependem de validação jurídica, sem valores legais presumidos.

Documento gerado a partir de modelo versionado, aditivos, signatários, evidências de assinatura e vistorias anexadas. Termo da lojinha com custódia, precificação, perdas, comissão e acertos. Assinatura será integrada a fornecedor após escolha e homologação; o protótipo não assina.

Estados: rascunho → em revisão → aguardando assinatura → assinado → vigente → em encerramento → encerrado, com cancelamento auditado quando cabível. Contratos futuros podem reservar intervalo; impedir sobreposição do mesmo carro. Alteração após assinatura exige aditivo/novo documento, sem substituir evidência anterior.

**Aceite:** ativação exige documento válido, vínculo consistente e vistoria/entrega conforme política. Gerar cobranças respeita calendário e nunca duplica períodos. Encerramento calcula saldo, analisa caução, kit e avarias e preserva trilha.

### 5.6 Financeiro completo para a operação

Contas a receber/pagar, parcelas, recorrências, recebimento parcial, desconto autorizado, juros/multa contratados, reembolso, cancelamento, estorno, bancos/caixa, transferências, conciliação manual inicial, extrato por motorista, categorias e centro por veículo/empresa/loja. Anexos, datas de competência, vencimento, pagamento e registro distintas.

Caixa projetado 13 semanas, realizado por período, resultado gerencial por competência, reserva de manutenção, financiamento com principal/juros, aquisição como investimento, caução como obrigação, comissão como despesa/passivo, retiradas/aportes do proprietário separados. Não prometer escrituração fiscal/contábil oficial.

Pix com identificador, integração bancária/OFX e automações só depois do fluxo manual confiável. Comprovante enviado pelo motorista vira **em conferência**, nunca pago automaticamente. Comissão e aluguel têm saldos separados; compensação exige regra explícita, aprovação e registro dos dois lados.

**Aceite:** uma cobrança de R$ 750 recebida em R$ 500 + R$ 250 tem saldo 250 e depois zero; estorno de 250 reabre saldo; webhook repetido não duplica baixa. Transferência entre contas não vira receita/despesa. Caução de R$ 1.500 não aumenta faturamento. Período fechado só muda por ajuste rastreável.

### 5.7 Lojinha e estoque

**Proposta de negócio, a confirmar:** consignação; a RODAVOLT mantém a propriedade, o motorista guarda e vende ao passageiro e recebe comissão. O dinheiro pode entrar na conta da empresa ou ser recebido pelo motorista; os acertos devem refletir cada modalidade.

Produtos/SKU, categoria, unidade, custo por compra, preço vigente, mínimo, lotes e validade para perecíveis. Localizações: central, em trânsito, kit/veículo e quarentena quando necessário. Movimentos: compra, transferência enviada/recebida, venda, devolução, perda, ajuste e estorno. Nenhuma alteração direta de saldo.

Custódia tem motorista, carro, período e aceite. A troca de motorista exige contagem e transferência de responsabilidade. Venda armazena preço e custo vigentes; mudança de preço não reescreve o passado. Comissão preserva a regra da venda.

**Aceite:** transferir 12 águas da central ao carro mantém o total; vender 2 baixa somente o kit e registra receita, custo, comissão, recebimento/valor a repassar. Pagamento direto à empresa não cria dívida de repasse do motorista; dinheiro em mãos cria. Perda não vira venda. Pedido de reposição não baixa estoque até a confirmação apropriada. Dois registros concorrentes não vendem a última unidade duas vezes. Ajuste de inventário exige motivo e autor.

## 6. Jornadas principais

**Primeiro carro:** preencher cenário → anexar cotações → comparar estresse → decidir manualmente → cadastrar compra real → revisar seguro/documentos → cadastrar e conferir motorista → preparar e assinar contrato → registrar caução → vistoriar → entregar carro e kit → gerar agenda de cobranças.

**Semana normal:** cobrança vence → recebimento conferido/conciliado → motorista registra vendas e km → sistema identifica revisão/reposição → fechar acerto de loja → conferir resultado e caixa. O acerto preserva períodos e pode ser reaberto por correção autorizada.

**Problema no carro:** relato com fotos → classificar e, se crítico, marcar indisponível → aprovar orçamento → executar serviço → confirmar comprovante → registrar despesa e km → liberar carro → recalcular manutenção.

**Devolução:** agendar → vistoria comparativa → conferir km/multas → contar kit → fechar vendas/comissão/repasse → calcular cobranças finais → tratar caução → emitir termo final → encerrar acessos do vínculo.

## 7. Qualidade e segurança

Responsivo a partir de 320px; rotulagem de campos, foco e teclado, contraste compatível com WCAG AA como meta de validação. Português brasileiro, moeda BRL; datas operacionais com fuso da operação brasileira a definir. Cálculo financeiro sem depender do fuso do computador. Não presumir que o fuso do proprietário é o da operação.

Salvar dinheiro em centavos ou decimal exato no banco; arredondar e distribuir resíduos de parcelas de modo documentado. Chaves de idempotência para pagamentos, serviço→despesa e venda→estoque. Transações e bloqueios protegem estoque, contratos e acertos. Auditoria de alterações sensíveis, arquivos privados, recuperação de senha, acesso revogado no servidor e exportação/backup restaurável.

Meta de percepção: tarefas usuais em até 2 segundos em conexão móvel razoável; medir no piloto. Não certificar performance pelo protótipo estático. Sem dado pessoal em cache offline na primeira entrega; qualquer rascunho offline futuro tem estado “pendente de envio” e política explícita.

## 8. Prioridade e limites

| Fase | Resultado obrigatório |
|---|---|
| P0 · antes da compra | Simulação com cotações, regra de negócio, contrato e seguro encaminhados |
| P1 · primeiro aluguel | Acesso, carro, motorista, contrato, entrega, cobrança, despesas, caução, manutenção mínima e portal de consulta |
| P1-L · antes de vender no carro | Produtos, kit, venda, custo/comissão, recebimento, repasse, inventário e termo |
| P2 · depois do piloto | Provedor Pix/assinatura, conciliação importada, alertas, planejado × realizado, relatórios e reposição |
| P3 · com evidência de necessidade | Aplicativo nativo, telemetria, integrações externas, expansão e inteligência avançada |

Fora do lançamento: marketplace de locações, motor próprio de assinatura, integração presumida com Uber/99, mapa de demanda sem fonte, pontuação de motorista, agentes autônomos que compram carros, oficina própria completa, data lake, multiempresa comercial como SaaS e ERP fiscal completo. Cadastro mínimo de empresa prepara o isolamento; não cria produto SaaS agora.

## 9. Estado desta entrega

Disponível: desenho navegável dos dois lados; motor demonstrativo de cenários; salvar/restaurar premissas localmente; comparação base/estresse/otimista; venda e transferência fictícias na sessão; testes do motor; documentação.

Planejado: toda persistência operacional, autenticação, permissões reais, documentos, assinatura, cobrança, integração, backup e publicação. Não há migração do banco antigo. O piloto só pode usar dados reais após implementação e validação desses requisitos.
