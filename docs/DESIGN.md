# Desenho do produto

## Direção

Identidade RODAVOLT: verde profundo, acento lima, superfícies discretas, tipografia legível e números alinhados. Compatível com tema claro e escuro. O produto deve passar clareza sobre dinheiro, documentos e tarefas, sem exigir interpretação de “inteligências” ou dezenas de indicadores.

Protótipo: abra `index.html`. As áreas de gestão e motorista são selecionadas no cabeçalho. Sete destinos principais organizam o negócio; manutenção permanece no carro. O simulador abre como ponto inicial desta fase; na operação real a visão geral assume a entrada.

## Mapa de telas e estados

| Tela | Conteúdo principal | Ação prioritária |
|---|---|---|
| Visão geral antes de operar | Preparação, cotações e pendências | Simular |
| Visão geral em operação, futura | Cobranças, carro parado, revisão e saldo | Resolver pendência no registro original |
| Simulador | Compra/aluguel e custos progressivos; caixa e resultado | Editar, comparar e salvar cenário |
| Ficha do carro | Aquisição, contrato atual, custos, km, manutenção e vistoria | Registrar serviço/ocorrência |
| Motorista | Cadastro, documentos, etapa e vínculo | Conferir e contratar |
| Contrato | Condições comerciais, documento, versões e encerramento | Revisar, assinar e acompanhar |
| Financeiro | Contas/caixa/resultado e caução separada | Conferir recebimento e pagar despesa |
| Lojinha | Central, kit, vendas, comissão e repasse | Repor e conferir acerto |
| Motorista/Início | Próxima cobrança e pendência principal | Consultar e agir |
| Motorista/Carro | Km, revisão, documentos e vistoria | Solicitar manutenção |
| Motorista/Pagar | Período, vencimento, forma e histórico | Pagar ou informar comprovante |
| Motorista/Loja | Kit disponível e comissão | Registrar venda |
| Motorista/Docs | Contrato, aditivos e documentos próprios | Consultar e baixar |

O protótipo demonstra a direção, não implementa todos os formulários dessa tabela. Consulta de documentos e pagamentos é ilustrativa; não há PDF ou Pix real. Os únicos registros alterados são exemplos em memória e premissas de cenário salvas no ambiente.

## Princípios de interação

O básico fica visível; custos e configurações avançados abrem por grupo. Valores mostram unidade e período: semanal, mensal, anual e por km. Campos anuais não se misturam com mensais sem rótulo. Indicadores de caixa e resultado não compartilham o mesmo nome.

Uma tarefa começa no objeto correspondente: manutenção no carro, assinatura no contrato, baixa no recebível, contagem no kit. A visão geral apenas reúne e direciona. O motorista recebe ações curtas, em vez do mesmo dashboard do proprietário.

Estados operacionais futuros: sem dados, carregando, erro, pendente de sincronização, salvo, em conferência e confirmado. O exemplo de comprovante termina em “em conferência”; o exemplo de transferência altera localização sem registrar receita.

No celular, colunas empilham; navegação não depende de hover; campos numéricos permanecem legíveis. Alvos de toque, foco, rótulos, contraste e leitores de tela serão validados no piloto. Cores são acompanhadas por texto de estado.

## Validação com o proprietário

Percorrer: alterar preço/aluguel → comparar estresse → abrir carro e manutenção → examinar contrato → abrir app do motorista → simular venda → conferir estoque na gestão → conferir cobrança em análise. A ordem permite avaliar a proposta com tarefas, sem transformar preferência estética em aprovação de regras financeiras.
