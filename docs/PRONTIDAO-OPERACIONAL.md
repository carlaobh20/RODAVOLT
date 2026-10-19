# RODAVOLT · prontidão para iniciar a operação

18/10/2026. Estado verificado no commit `7303d04` da branch `dev`. Esta lista distingue o que funciona na homologação local, o que impede o primeiro carro de rodar pela plataforma e o que pode vir depois. Os exemplos atuais usam pessoas, valores e calendário fictícios; `4173` é uma prévia e `4174` é um serviço apenas desta máquina.

## Situação atual

Fluxos locais implementados e testados: kanban do interessado à devolução; cadastro e acesso individual; contrato/termos versionados; caução separada do caixa livre; cobrança semanal vencida; contas, baixas, créditos e conciliação manual; combo da lojinha, pedido, devolução e repasse; vistoria guiada com fotos privadas no serviço local; manutenção, ocorrências, agenda, simulador e planejado × realizado. A última validação registrou 371 testes aprovados. Isso demonstra coerência local, não uso real entre dispositivos ou dinheiro efetivo.

## P0 · impede usar a plataforma com o primeiro carro e motorista real

| Frente | Falta concreta | Critério para considerar pronta |
|---|---|---|
| Operação efetiva | Definir cidade/UF e fuso, carro e documentos, preço semanal, data/dia de cobrança, primeira/última semana, km, caução, seguro/franquia, manutenção, atraso, devolução, capital/reserva e responsáveis | Quadro comercial aprovado, parâmetros reais cadastrados e dados fictícios removidos do ambiente operacional; simulação refeita com esses valores |
| Jurídico e privacidade | Advogado revisar cinco minutas, quadro comercial, responsabilidade, dados/rastreador e anexos; qualificação real em ambiente privado | Versão final identificada, aprovada e aceita por ambas as partes; cópia e trilha de assinatura recuperáveis por vínculo |
| Fiscal e contábil | Contador definir regime, notas, tributos, venda de produtos, estoque, reconhecimento e fechamento | Procedimento escrito, categorias e relatórios conferidos com o contador; nenhum relatório demonstrativo apresentado como escrituração fiscal |
| Infraestrutura | Serviço atual é JSON local, HTTP e loopback; não atende celular fora desta máquina, operação distribuída ou recuperação externa | Backend hospedado com TLS, banco transacional, arquivos privados, permissões por vínculo, backup/restauração testada, logs/monitoramento e plano de incidente |
| Identidade e dados | Acesso local não substitui cadastro real, recuperação de conta, retenção e auditoria de produção | Proprietário/motorista reais entram em seus próprios dispositivos; motorista só vê seus contratos, cobranças, fotos, kit e dados pessoais; acessos podem ser revogados e recuperados |
| Dinheiro e Pix | Não há banco, cobrança Pix pagável, confirmação autenticada nem conciliação conectada; comprovante não comprova crédito | Escolher conta/fornecedor; receber e identificar aluguel/loja sem duplicar; testar atraso, expiração, pagamento tardio, reembolso, estorno e extrato. Se o piloto usar conferência manual, documentar responsável e dupla conferência diária |
| Loja real | Catálogo e quantidades ainda são exemplos; não há entrada fiscal nem múltiplos lotes simultâneos por SKU | Cadastrar compras, custo/preço, lote/validade, fornecedor, local, quantidade e regras de nota/garantia; entregar combo real com recibo e conferir venda/retorno no estoque físico |
| Primeiro percurso | Não houve semana real nem teste de facilidade com o motorista escolhido | Do cadastro ao primeiro pagamento: assinatura válida, caução recebida, vistoria do carro efetivo, entrega, uma semana de cobrança, venda/reembolso de teste e consulta do saldo no celular; divergências resolvidas antes de ampliar |

## P1 · completar a visão pedida, sem bloquear necessariamente o piloto de um carro

| Frente | Condição de entrada | Resultado esperado |
|---|---|---|
| Telemetria e Painel ativo | Escolher rastreador, instalar, definir consentimento/aviso, zonas, precisão e retenção | Posição real com hora e estado de conexão; nunca apresentar ponto antigo como atual |
| Notificações | Infraestrutura e consentimento/canais definidos | Alertas úteis de cobrança, vistoria, revisão e solicitações sem depender do app aberto |
| Benefícios | Provisionar Finanças Pessoais e outros aplicativos, com contas e permissões separadas | Acesso real ao benefício prometido, sem compartilhar finanças pessoais com a gestão |
| Captura de ofertas | Avaliar viabilidade técnica e regras das plataformas/dispositivos | Cálculo por km/hora e objetivo com dados confiáveis; qualquer aceite de corrida continua decisão do motorista |
| Crescimento | Primeiro ciclo financeiro e de estoque conciliado | Comparar plano × realizado com números reais antes de comprar o segundo carro |

## Sequência de implantação

1. **Fechar o negócio do primeiro carro.** Reunir proprietário, advogado, contador e corretor/seguradora para preencher o quadro comercial. Contrato e simulador precisam usar os mesmos números.
2. **Preparar a versão operacional.** Migrar o estado fictício para base real vazia, manter motores e testes, criar cadastro privado de pessoas/carros, trilha e políticas de acesso/backup. Publicação só depois de avaliação de segurança; nunca expor o serviço local `4174` diretamente.
3. **Ligar pagamentos e assinatura.** Escolher fornecedores e homologar primeiro em sandbox, depois com transações pequenas de teste. Prever operação manual rastreável para indisponibilidade, sem marcar pagamento pelo mero comprovante.
4. **Cadastrar estoque e veículo reais.** Conferir documento/apólice, revisão, preço e custo por produto, compra e quantidade física. Validar fechamento diário entre caixa, extrato, kit e crédito do motorista.
5. **Piloto acompanhado.** Um carro, um motorista, kit pequeno. A gestão acompanha diariamente cobranças, posição do carro quando instalada, manutenção, suporte, vendas, devoluções e a compreensão do app pelo motorista. Encerrar ciclo e comparar resultado com o simulado antes de expandir.

## Regra de liberação

O primeiro carro só é liberado no sistema operacional quando: motorista escolhido e documentação conferida; contrato final assinado e acessível; caução efetivamente recebida; seguro adequado verificado; carro/vistoria/kit conferidos; cobrança semanal configurada; acesso individual do motorista testado; e caminho de suporte definido. Marcação fictícia da prévia não satisfaz nenhum desses itens.

Maringá/PR foi indicada como cidade do piloto; veículo, banco, Pix, assinatura, rastreador e hospedagem ainda não foram escolhidos. A [ficha de calibração](CALIBRACAO-MARINGA.md) distingue referências públicas de cotações pendentes. O desenvolvimento pode avançar na infraestrutura e nos cadastros sem inventar fornecedores ou condições comerciais. Deploy e promoção de produção exigem decisão específica do proprietário.
