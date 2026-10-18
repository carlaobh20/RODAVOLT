# RODAVOLT · PRD v2

**17/10/2026 · proposta reconstruída após revisão do proprietário.** Substitui o desenho v1. Mercado confirmado: Brasil, reais, aluguel semanal para motoristas de aplicativo. Compra inicial pretendida em novembro de 2026. Esta entrega é planejamento e protótipo; produção depende das etapas de implementação.

## 1. Direção do produto

A RODAVOLT é uma plataforma de gestão e crescimento de uma operação de locação. Ela precisa explicar o negócio em quatro perspectivas conectadas:

1. **Plano:** capital, aquisição, financiamento, reserva, custos, reinvestimento e crescimento no tempo.
2. **Operação:** carro, motorista, contrato, vistoria, manutenção e mercadoria em custódia.
3. **Controladoria:** faturamento, recebimento, despesa, competência, dívida, caixa e patrimônio com origem verificável.
4. **Experiência do motorista:** cumprir compromissos, administrar a jornada, consultar documentos, cuidar do carro e operar a loja pelo celular.

A simplificação anterior foi excessiva para a intenção do proprietário. A nova proposta mantém profundidade nos registros e nas análises, organiza os detalhes por assunto e torna os números rastreáveis.

## 2. Princípio central: origem, natureza e estado

Todo valor relevante precisa informar **período, origem, natureza e estado**. Exemplos: aluguel faturado não é aluguel recebido; valor estimado do carro não é cotação de venda; compra simulada não é carro adquirido; comprovante recebido não é pagamento conferido; mercadoria no carro não é venda.

Um indicador abre a composição e a composição abre os registros. A trilha inclui identificador, centro de resultado, contrato/veículo/motorista, competência, vencimento, confirmação, documento, autor, revisões e eventuais estornos. Dados ausentes permanecem ausentes, sem preenchimento com zero.

## 3. Resultados esperados

- Simular uma estratégia completa de crescimento e entender o caixa necessário a cada etapa.
- Salvar um plano sem que alterações futuras apaguem a referência original.
- Comparar plano e realizado com a mesma definição de indicador e o mesmo período.
- Reestimar o futuro usando o último fechamento confiável, mantendo a comparação anterior.
- Saber o resultado de cada carro e a posição consolidada da empresa.
- Dar autonomia ao motorista sem compartilhar os dados pessoais de sua jornada com a gestão financeira da locadora.
- Controlar a loja desde a compra até o repasse, com estoque e comissão reproduzíveis.

Métricas: caixa livre e comprometido, inadimplência por vencimento, receita faturada/recebida, dias disponíveis/alugados/parados, custo por km, manutenção por carro, dívida e juros, patrimônio estimado, crescimento realizado, erro de projeção, margem e perdas da loja, tempo de solução de ocorrências e integridade dos fechamentos.

## 4. Arquitetura de informação

| Área | Telas e aprofundamentos |
|---|---|
| Visão executiva | Caixa, frota, receita, patrimônio, plano × registros e decisões pendentes |
| Plano de crescimento | Premissas, projeção, marcos de aquisição, dívida/amortização, fluxo mensal, ano a ano, estratégias e versões |
| Projetado × realizado | Comparação por período/indicador/carro, desvio R$/%, fontes, causas e projeção revisada |
| Frota & manutenção | Aquisição, centro de resultado, financiamento, documentos, km, disponibilidade, plano preventivo, serviços e histórico |
| Motoristas | Cadastro, conferência, documentos, vínculo, pendências e relacionamento |
| Contratos & vistorias | Condições, documento/versionamento, assinatura, aditivos, entrega/devolução e acerto final |
| Financeiro | Contas, cobranças, pagamentos, conciliação, caixa/resultado, dívida, caução, reservas, aportes, retiradas e fechamento |
| Lojinha & acertos | SKU/lote, compra, central, trânsito, kit, custódia, venda, comissão, repasse, inventário e acerto |
| Central de pendências | Solicitações, serviços, reposições, comprovantes, documentos e responsáveis |
| Auditoria & dados | Origem de indicadores, eventos, versões, consistência, exportação e governança |

No celular do motorista, cinco destinos principais: **Início, Jornada, Carteira, Loja e Mais**. Carro, manutenção, vistorias, documentos e suporte têm telas próprias acessíveis por ações contextuais e pelo menu Mais.

## 5. Planejamento e crescimento

### Requisitos

Capital inicial; custo de abertura; aquisição à vista ou financiada; entrada; taxa e prazo; preparação e estoque inicial; frota inicial e meta; horizonte; ocupação, paradas, aluguel, km e perdas; custos por carro e empresa; contratação adicional por escala; reserva fixa e por veículo; aportes mensais/pontuais; retenção ou retirada de caixa livre; rendimento; reajustes; depreciação; loja; tributação parametrizada; amortização extraordinária e prioridade entre crescer e amortizar.

O motor acompanha cada veículo e seu financiamento. Compras simuladas dependem de capital e reserva, com limite de aquisições por mês. Crescimento não ocorre apenas multiplicando a receita do primeiro carro por uma meta. Veículo adquirido no fim de um mês só opera no seguinte. O mês zero é a aquisição e a posição inicial, sem uma mensalidade operacional extra.

### Entregas visuais

Frota ao longo do tempo; caixa e dívida; patrimônio e capital aportado; marcos de compra; fluxo mensal detalhado; fechamento anual; inspeção da identidade de caixa em um mês; comparação entre manter frota, reinvestir, priorizar dívida e estressar a operação. Meta não alcançada aparece como não alcançada.

### Critérios de aceite

- Caixa de fechamento fecha com abertura + fluxos; parcela fecha com juros + principal.
- Toda forma de amortização e compra respeita a reserva, salvo que a própria operação deficitária pode consumi-la; o desvio é sinalizado.
- Nenhum capital externo é inventado. Aporte e retirada são escolhas explícitas e separadas do resultado.
- Projeção negativa não desaparece ao desligar reinvestimento.
- O valor dos ativos e a tributação estimada mostram premissas e limitações.
- Cenários e simulações não executam compras, pagamentos ou solicitações reais de crédito.

## 6. Projetado × realizado e revisão

Um plano publicado guarda versão, data, autor, premissas/fontes e resultados do motor. O proprietário pode criar outra versão e escolher a referência da comparação. Alterar o rascunho ou incluir lançamentos não modifica um plano preservado.

Comparar valores compatíveis por mês, carro ou grupo: aluguel recebido, vendas, custos operacionais, parcelas, investimento em aquisições, caixa, frota, dívida e patrimônio. Exibir desvio absoluto, percentual quando a base permitir e fonte. Gastos maiores não são automaticamente classificados como ruins; caixa maior pode resultar de uma compra adiada.

A revisão usa um fechamento com caixa reconciliado, ativos e idade, dívida por contrato, estoque e demais saldos necessários. Somente o período futuro recebe novas premissas. Dados históricos e plano original permanecem. A aplicação operacional deve incluir recebíveis, pagamentos futuros e obrigações que o protótipo normalizado ainda não modela.

**Aceite:** incluir despesa de R$ 250 reduz o caixa demonstrativo em R$ 250; o desvio muda e o plano fica idêntico. Registrar um carro altera frota, caixa e dívida. A revisão começa no mês seguinte com os saldos observados. Indicador sem registro retorna “sem dado”; plano igual a zero não produz percentual infinito. Saldos anuais são o último fechamento, nunca a soma de saldos mensais.

## 7. Financeiro e fechamento

Cadastros de contas, categorias e centros; contas a pagar/receber; cobrança semanal com identificação de período; recorrência; competência e regime de caixa; baixas parciais; juros/multa conforme contrato; descontos autorizados; estorno; reembolso; conciliação manual e importada; transferências bancárias; dívida com principal e juros; investimentos em carros; reservas; caução; aportes e retiradas.

Caução é obrigação, sem reconhecimento de receita. Reserva pertence ao caixa próprio, sem duplicação como despesa. Compra do carro é investimento, entrada não é custo operacional e principal da parcela não reduz lucro. Comissão tem obrigação e pagamento rastreáveis. Compensar comissão com aluguel exige regra explícita e registros dos dois lados.

Fechamento operacional: pendências → conferência → conciliação → validação de saldos → fechamento com autor e data. Correção após fechamento gera ajuste autorizado e histórico, não edição silenciosa. O painel deve identificar extrato faltante, documento ausente e movimento ainda não conciliado.

**Aceite operacional:** cobrança de R$ 750 com baixas de R$ 500 e R$ 250 tem saldo correto; estorno reabre o saldo correspondente; webhook repetido não duplica baixa. Transferência entre contas não infla receita/despesa. A consulta de um saldo leva à sua composição e aos documentos.

## 8. Carros, motoristas e contratos

Carro: aquisição e sua origem, placa/chassi, modelo/ano, combustível, km, custo, documentos, apólice, financiamentos, status, vínculo, estoque e resultado. O cadastro de um carro não prova disponibilidade; contrato, vistoria e manutenção também influenciam a liberação.

Motorista: cadastro, contato, CNH/EAR e validade, conferência documental, histórico de vínculos, condições, convite para acesso individual e pendências. Decisão de aceitação tem autor/motivo; não há score subjetivo automático.

Contrato: partes, veículo, vigência, valor e calendário, proporcionalidade, reajuste, franquia/km excedente, caução, seguro/franquia, responsabilidades por revisões/combustível/recarga, limpeza, multas, avarias, indisponibilidade, rescisão e devolução. Documento versionado, aditivos, signatários e evidências. Termo da loja específico. A minuta e as regras dependem de revisão jurídica.

Vistoria: entrega, periódica, ocorrência e devolução; fotos padronizadas, avarias, km, combustível, acessórios, estoque e concordância das partes. Comparação preserva evidência anterior. Sobreposição de contratos do mesmo carro é impedida no servidor/banco.

Manutenção: preventiva por km ou data, o que vencer primeiro; corretiva por relato; prioridade, indisponibilidade, orçamento, aprovação, fornecedor, serviço, comprovante, custo, garantia e liberação. Fechar serviço gera despesa uma vez. Corrigir km exige evento justificado.

## 9. App do motorista completo

| Tela | O que o motorista controla | Relação com a gestão |
|---|---|---|
| Início | Próximo aluguel, pendências, revisão, atalhos e comissão | Mostra apenas seu vínculo |
| Jornada | Ganhos manuais, km, combustível, despesas e resultado pessoal; evolução e metas futuras | Dados pessoais separados; sem receita presumida da locadora |
| Carteira | Cobranças, período, vencimento, comprovante, histórico, caução, comissão e repasse | Comprovante em análise até conferência |
| Carro | Dados, documentos, hodômetro, revisão e histórico | Atualização operacional validada |
| Manutenção | Relato, prioridade, fotos e acompanhamento | Solicitação com responsável e andamento |
| Vistorias | Checklist, km, fotos, combustível e aceite | Evidência ligada ao contrato |
| Loja | Kit, produto/preço, venda, quantidade, recebimento, comissão, reposição e acerto | Baixa de estoque e obrigações correspondentes |
| Documentos | Contrato, termos, versões, aditivos e próprios documentos | Acesso privado por vínculo |
| Suporte | Assunto, relato, anexos, protocolo e resposta | Atendimento com contexto e histórico |
| Conta | Dados de contato, preferências e privacidade | Identidade própria, sem credencial compartilhada |

**Aceite:** ações de exemplo percorrem as áreas correspondentes da gestão; comprovante não vira pago por envio; ganho pessoal não entra em aluguel; venda informa quem recebeu e quanto repassar; motorista não vê dados de outro motorista nem o financeiro consolidado em produção.

## 10. Loja, custódia e acerto

Proposta de consignação ainda sujeita a confirmação comercial. Cada SKU tem custo, preço, unidade, lote/validade quando aplicável e mínimo. Localizações: central, trânsito e kit por veículo/motorista/período. Transferir preserva a quantidade total e só muda localização/custódia.

Venda preserva custo, preço, comissão e base vigentes naquele instante. Recebimento pelo motorista gera repasse; recebimento pela empresa pode gerar comissão a pagar. Acerto identifica período, vendas, perdas, devoluções, comissão, valores recebidos por cada parte e comprovante de repasse. Sem desconto silencioso no aluguel.

Reposição: pedido → separação → trânsito → recebimento conferido. Inventário físico explica ajustes por motivo/autor. Troca de motorista exige termo e contagem. Perda não vira venda. Venda concorrente não deixa o kit negativo.

O kit do protótipo usa comissão de 20% como regra demonstrativa, independente da premissa de outro cenário. Alterar a comissão hipotética do simulador não reescreve vendas operacionais. Na versão real, regras do contrato do kit serão parametrizadas e versionadas.

## 11. Segurança, qualidade e integridade

Perfis proprietário, operação, financeiro e motorista; isolamento por empresa e vínculo no banco e nos arquivos. A UI não é a barreira de segurança. Contratos, fotos e documentos em armazenamento privado. Revogação de acesso verificada no servidor. Trilhas sem credenciais ou dados pessoais excessivos.

Transações e idempotência para venda/estoque, pagamento, aquisição, manutenção→despesa e acerto. Dinheiro em centavos ou decimal exato no banco; política de arredondamento; restrições de integridade e concorrência. Datas operacionais com fuso brasileiro a definir, preservando timestamps UTC. Backup com restauração ensaiada e exportação do proprietário.

Meta de experiência: responsivo a partir de 320px, foco/teclado e leitores de tela, contraste AA, estados de erro/carregamento/conferência claros. Nenhum estado “salvo” antes de confirmação na versão operacional. PWA não implica GPS de fundo ou funcionamento offline completo.

## 12. O que esta reconstrução entrega

**Funcional localmente:** motor novo de crescimento; fluxo mensal/anual; reserva, aportes, retiradas, equipe por escala, amortização e estratégias; plano salvo por versão; livro demonstrativo editável; compra operacional ilustrativa; comparação e revisão; memória de cálculo; app com jornada, comprovante, solicitação, vistoria, venda, reposição, documentos e suporte; gestão com conferência/acerto; eventos locais.

**Ainda não implementado:** identidade e autorização reais, banco, anexos reais, assinatura, Pix, integração bancária, fechamento contábil/fiscal, telemetria e validação jurídica. Privacidade e auditoria do protótipo são demonstrações de produto, não garantias de segurança de uma aplicação estática. Eventos e ações da loja em aberto não entram no período financeiro até o acerto demonstrativo.

**Critério de lançamento:** implementar os fluxos acima com persistência, autorização e integridade, homologar com um carro e um motorista e conferir os saldos/evidências de uma semana completa e de uma devolução. A primeira compra e a ativação da locação são decisões separadas.
