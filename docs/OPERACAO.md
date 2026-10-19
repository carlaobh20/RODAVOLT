# Operação RODAVOLT · v5 local

## O dia em andamento

1. Um interessado entra no kanban e recebe próxima ação e data.
2. A gestão confere documentação e define o carro previsto, respeitando disponibilidade.
3. Em Meu advogado, escolhe modelo, preenche a minuta, confere versão e registra revisão. A fila de envio é distinta da assinatura.
4. No app, o motorista acompanha a contratação e lê somente seus documentos. As duas partes precisam registrar a simulação para concluir o contrato do exemplo.
5. O motorista realiza vistoria de entrega: hodômetro, carga da bateria (%), itens, avarias e vistas. Envio cria pendência para a gestão. Correção devolve ao perfil; aprovação libera só o gate da vistoria.
6. A gestão configura e confere a agenda de aluguel da versão assinada. O pagamento é pela semana já utilizada, conforme escolha do proprietário; vencimento e regras parciais ficam explícitos. O kanban só entrega se documentos, caução, contrato, agenda, vistoria nova e disponibilidade estiverem conferidos. Outro motorista não ocupa o mesmo veículo.
7. Cobrança, comprovante, baixa e conciliação são etapas separadas. Solicitações, revisões, contas e contratos geram agenda.
8. Painel ativo reúne posição demonstrativa, idade do dado, carro, motorista, aluguel, dívida, documentos e vistoria. Histórico mantém horário da amostra.
9. A devolução exige agendamento, vistoria própria, recebimento do carro/chaves, contagem do kit e demonstrativo. Só depois o vínculo é encerrado. Dinheiro não é quitado nem compensado automaticamente; manutenção pode manter o carro indisponível.

## O que funciona na prévia

| Área | Ações locais disponíveis |
|---|---|
| Financeiro | Cobranças por contrato, pagar/receber, baixar por conta, estornar última baixa elegível com origem, consultar livro e saldos, repassar crédito e devolver aluguel/caução com conferência |
| Conciliação | Extrato fictício, criar movimento de exemplo, sugerir equivalentes, confirmar vínculo 1:1, desfazer, baixar título pelo extrato ou lançar movimento não registrado |
| Agenda | Semana/mês, compromisso com responsável e lembrete, editar/concluir manual, pendências derivadas com atalho à origem |
| Meu advogado | Cinco modelos, nova versão de modelo/documento, prévia completa, placeholders, revisão, fila, envio e partes simulados, recusa/cancelamento, vigência e histórico |
| Motorista | Contratação, documentos, agenda, registros/metas/corrida pessoais, aluguel, comprovante, ajuda, vistoria, combo/estoque e vendas do próprio vínculo |
| Vistoria | Rascunho, oito itens, avarias, carga da bateria (%)/km, cinco vistas, envio e parecer; imagens temporárias na prévia e arquivos privados no serviço local |
| Devolução | Agenda, vistoria de retorno, carro/chaves, kit bom/avariado, acerto final e caução separados |
| Ocorrências | Multa, sinistro e avaria, prazo, manifestação do motorista, análise e título somente após decisão humana |
| Loja | Combo, divergência, reserva/expiração, conferência, entrega, pagamento tardio e devolução/reembolso com origem |
| Painel ativo | Mapa OSM, marcador/lista, contexto por carro/vínculo, relógio/percurso fictícios, alerta de velocidade, perda de sinal e histórico |

## O que depende de implantação

Banco real e conciliação com conexão autorizada; Pix/carteiras e extrato efetivos; assinatura eletrônica; revisão profissional das minutas; rastreador/telemetria real; notificações em segundo plano; operação offline e fechamento contábil/fiscal homologados. Login e arquivos privados já têm implementação local, mas publicação, infraestrutura remota, retenção, monitoramento e segurança de produção dependem de ciclo próprio.

Nenhum fornecedor foi escolhido pelo proprietário. Não pedir chave ou credencial para avaliar o desenho. Nenhum botão desta homologação envia dinheiro ao banco, assina contrato real ou rastreia pessoas. Na prévia 4173, os perfis demonstram navegação; no serviço 4174, cada conta entra com seu próprio acesso.

## Contratos e modelos

Locação semanal, entrega/devolução, custódia de perfumes/acessórios, aditivo e distrato. Os cinco modelos receberam textos extensos para conferência do advogado e podem ser baixados na biblioteca; cópias estáticas estão em `docs/contratos/`. Os modelos curtos anteriores e documentos já gerados preservam suas versões. Ainda faltam qualificação privada, escolhas comerciais reais, análise jurídica e assinatura efetiva. O nome “Meu advogado” identifica a área de organização; não significa atendimento de um profissional ou análise jurídica automática. Documento revisado congela rótulos do perfil/veículo e modelo/versão usados. Ver [pacote contratual](PACOTE-CONTRATUAL.md).

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

A lojinha mostra cada produto e suas unidades disponíveis. Uma venda cria pedido e reserva; Pix fictício conferido pela gestão baixa as unidades, registra o bruto, CMV e obrigação/crédito do motorista juntos. Apenas esse pedido é acertado, sem puxar vendas manuais ou de outro perfil. “Entreguei o produto” encerra a entrega sem nova baixa. Cancelar pedido sem pagamento libera a reserva; a reserva também expira. Venda paga tem jornada própria de devolução e reembolso, preservando recebimento, CMV e crédito. Lucro já usado ou pago precisa ser estornado/recuperado de forma explícita antes do reembolso correspondente.

O fluxo recomendado de produção é Pix por pedido na conta da RODAVOLT, com confirmação autenticada do banco/PSP. Cliente usa seu banco, sem conta de loja obrigatória. A prévia não emite QR real, não cobra nem recebe avisos bancários. QR/link do catálogo é etapa opcional posterior. O acerto manual anterior continua disponível para dinheiro recebido pelo motorista, com destino do lucro explícito.

A [auditoria de todos os fluxos](AUDITORIA-DE-FLUXOS.md) distingue funcionamento local de integração e homologação pendentes.


## Homologação com acesso individual

Execute `npm run build` e `npm run operate`; abra `http://127.0.0.1:4174/operacao`. O proprietário cria seu próprio acesso e, na gestão, cadastra uma conta para cada motorista do exemplo. Não há senha compartilhada pronta. A gestão abre o painel completo, cujas gravações passam pelo serviço. O motorista usa quatro abas e comandos específicos do seu vínculo.

O serviço conserva os dados em `.local/rodavolt`, ignorada pelo Git. Sessão HttpOnly, CSRF, senhas scrypt, gravação atômica, revisão e idempotência fazem parte da implementação local. Um conflito 409 exige atualizar a visão antes de continuar; não ignorar o aviso nem sobrescrever uma mudança alheia. Encerrar o processo revoga sessões em memória, mas não apaga os registros.

A base inicia com pessoas/valores fictícios, calendário nov/2026 e data de referência 25/01/2027. O serviço usa `America/Sao_Paulo` como fuso demonstrativo da operação; escolha efetiva e notificações ainda precisam ser conferidas para o primeiro carro. O processo escuta só nesta máquina (`127.0.0.1`, HTTP); isso não publica um aplicativo para o celular do motorista.

Finanças pessoais são da conta do motorista: jornadas, metas e decisões não são retornadas à gestão nem incluídas em seu backup. O acesso a arquivos operacionais é filtrado pelo vínculo; use arquivos de teste na homologação. A prévia 4173 continua separada, com localStorage e fotos temporárias; não inserir documentos pessoais nela.

## Cópia de segurança e recuperação

A gestão exporta o backup da operação e arquivos. A cópia contém dados operacionais e deve ser guardada em local controlado; senhas e finanças pessoais não são incluídas. Restaurar exige conferir a cópia e a revisão atual, encerra sessões e revoga os acessos de motorista. O proprietário entra novamente e recria os vínculos de acesso após conferir os cadastros restaurados. Arquivos originais são preservados, evitando apagar evidências por uma tentativa de recuperação.

A restauração local e os cenários de concorrência são verificados em testes; recuperação fora desta máquina, proteção do dispositivo, retenção, monitoramento e continuidade precisam de homologação própria antes de depender dessa base na operação.

## Fechamento dos novos fluxos

Cobrança posterior e parcialidades: [COBRANCAS.md](COBRANCAS.md). Devolução física e acerto: [DEVOLUCAO.md](DEVOLUCAO.md). Multas/sinistros com manifestação e decisão: [OCORRENCIAS.md](OCORRENCIAS.md). Os testes e a evidência de navegador de cada rodada ficam em [VALIDACAO.md](VALIDACAO.md); esses registros não substituem conferência jurídica, contábil ou uso com o motorista real.

A vistoria do acesso individual também usa quatro passos: painel, itens, fotos privadas e revisão/envio. O motorista pode salvar para continuar depois; a gestão confere os arquivos pelo painel protegido.
