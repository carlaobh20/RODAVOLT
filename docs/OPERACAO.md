# Operação RODAVOLT · v4

## O dia em andamento

1. Um interessado entra no kanban e recebe próxima ação e data.
2. A gestão confere documentação e define o carro previsto, respeitando disponibilidade.
3. Em Meu advogado, escolhe modelo, preenche a minuta, confere versão e registra revisão. A fila de envio é distinta da assinatura.
4. No app, o motorista acompanha a contratação e lê somente seus documentos. As duas partes precisam registrar a simulação para concluir o contrato do exemplo.
5. O motorista realiza vistoria de entrega: hodômetro, combustível, itens, avarias e vistas. Envio cria pendência para a gestão. Correção devolve ao perfil; aprovação libera só o gate da vistoria.
6. O kanban só entrega o veículo se documentos, contrato vigente do mesmo carro, vistoria nova e disponibilidade estiverem conferidos. Outro motorista não ocupa o mesmo veículo.
7. Cobrança, comprovante, baixa e conciliação são etapas separadas. Solicitações, revisões, contas e contratos geram agenda.
8. Painel ativo reúne posição demonstrativa, idade do dado, carro, motorista, aluguel, dívida, documentos e vistoria. Histórico mantém horário da amostra.
9. A devolução é uma vistoria própria. Encerrar não quita dinheiro nem autoriza reaproveitar a entrega antiga no próximo ciclo.

## O que funciona na prévia

| Área | Ações locais disponíveis |
|---|---|
| Financeiro | Criar pagar/receber, vencimento/centro/favorecido, liquidar por conta, cancelar aberto, consultar livro e origem dos saldos |
| Conciliação | Extrato fictício, criar movimento de exemplo, sugerir equivalentes, confirmar vínculo 1:1, desfazer, baixar título pelo extrato ou lançar movimento não registrado |
| Agenda | Semana/mês, compromisso com responsável e lembrete, editar/concluir manual, pendências derivadas com atalho à origem |
| Meu advogado | Cinco modelos, nova versão de modelo/documento, prévia completa, placeholders, revisão, fila, envio e partes simulados, recusa/cancelamento, vigência e histórico |
| Motorista | Perfil demonstrativo, contratação, documentos, compromissos, jornada/metas/corrida, carteira e comprovante, pedidos, vistoria e kit do RV-001 |
| Vistoria | Rascunho, oito itens, avarias, combustível/km, cinco vistas, imagens de exemplo ou prévias locais temporárias, envio, parecer/correção/aprovação |
| Painel ativo | Mapa OSM, marcador/lista, contexto por carro/vínculo, relógio/percurso fictícios, alerta de velocidade, perda de sinal e histórico |

## O que depende de implantação

Banco real e conciliação com conexão autorizada; conta/carteiras e extrato efetivos; assinatura eletrônica com provedores e trilha de evidências; revisão profissional das minutas; rastreador/telemetria real; fotos privadas persistentes; autenticação e autorização por motorista; notificações em segundo plano; operação offline, estornos e fechamento contábil/fiscal homologados.

Nenhum fornecedor foi escolhido pelo proprietário. Não pedir chave ou credencial para avaliar o desenho. O protótipo não movimenta dinheiro, não assina contratos nem acompanha pessoas reais. Os perfis são uma ferramenta de demonstração, não login.

## Contratos e modelos

Locação semanal, entrega/devolução, custódia de perfumes/acessórios, aditivo e distrato. Texto é uma minuta demonstrativa com pontos a decidir. O nome “Meu advogado” identifica a área de organização; não significa atendimento de um profissional ou análise jurídica automática. Documento revisado congela rótulos do perfil/veículo e modelo/versão usados.

## Integrações futuras e pesquisa primária

- [Banco Central · Open Finance](https://www.bcb.gov.br/meubc/faqs/s/open-finance): autorização e etapas de conexão, ainda sem banco definido.
- [Pluggy · transações](https://docs.pluggy.ai/en/docs/products/transactions): referência de estrutura de movimento e sincronização; não foi escolhida como fornecedor.
- [Clicksign · documentação](https://developers.clicksign.com/): referência para envelopes, eventos e ambiente de teste; não conectada.
- [Traccar · API](https://www.traccar.org/traccar-api/) e [especificação oficial](https://raw.githubusercontent.com/traccar/traccar/master/openapi.yaml): referência de evento/posição, horários, validade e conexão. Uma futura integração precisa converter velocidade de nós para km/h.
- [OpenStreetMap · política de tiles](https://operations.osmfoundation.org/policies/tiles/): uso leve de viewport, atribuição, cache normal e sem prefetch/offline. Sem SLA; produção exige avaliar provedor adequado. [Atribuição](https://www.openstreetmap.org/copyright).

## Piloto, seleção e retenção

Começar com um carro e testar também o kit; usuário fornece estoque e deixa 100% da margem ao motorista. Motoristas → Piloto e benefícios organiza avaliação manual e caução. No app, Benefícios RODAVOLT exibe créditos e próximas vantagens.

Exemplo sem taxas adicionais: perfume R$89, custo R$32 e R$57 do motorista. Se o bruto foi conferido na empresa, R$57 ficam como crédito/obrigação; abatê-los no aluguel de R$1.050 deixa R$993 para pagamento. Se ele já reteve R$57, a empresa recebe R$32; não há outro crédito. O livro e a conciliação registram apenas o dinheiro correspondente. Mercadoria já financiada não é paga novamente como CMV.

Caução recebida é passivo, com devolução e conciliação próprias. Não constitui renda da empresa nem compõe o capital disponível para expansão no reforecast. Valor R$1.500 é ilustrativo; falta decisão comercial e revisão das condições. Nova entrega exige avaliação/documentação, contrato, caução, vistoria do ciclo e carro disponível.

Benefícios de outros apps e parcerias possuem estágio visível, sem ativação fictícia. Lealdade será avaliada pela rotina, comunicação, cuidado, transparência e benefício; não existe garantia de permanência ou de ausência de problemas. Minutas separam regras e proteção contratual de promessas de blindagem.

`src/program.js` concentra critérios, caução e créditos. O histórico preserva versões e escolhas anteriores. Dados de pessoas e transações continuam fictícios nesta entrega.

## Lojinha por combo

A gestão monta um envio com várias SKUs e um motorista/carro ativo. As unidades ficam em trânsito até a conferência. “Recebi tudo” libera o combo; uma diferença libera somente as quantidades confirmadas e mantém o restante pendente. Envio ainda não recebido pode ser cancelado, retornando à central; a gestão confere entregas restantes ou retornos com motivo.

A lojinha mostra cada produto e suas unidades disponíveis. Uma venda cria pedido e reserva; Pix fictício conferido pela gestão baixa as unidades, registra o bruto, CMV e obrigação/crédito do motorista juntos. Apenas esse pedido é acertado, sem puxar vendas manuais ou de outro perfil. “Entreguei o produto” encerra a entrega sem nova baixa. Cancelar pedido sem pagamento libera a reserva; venda paga exige futura jornada de devolução.

O fluxo recomendado de produção é Pix por pedido na conta da RODAVOLT, com confirmação autenticada do banco/PSP. Cliente usa seu banco, sem conta de loja obrigatória. A prévia não emite QR real, não cobra nem recebe avisos bancários. QR/link do catálogo é etapa opcional posterior. O acerto manual anterior continua disponível para dinheiro recebido pelo motorista, com destino do lucro explícito.

A [auditoria de todos os fluxos](AUDITORIA-DE-FLUXOS.md) distingue funcionamento local de integração e homologação pendentes.
