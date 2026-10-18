# Plano de execução · v5 local

18/10/2026. A autorização para implementar após a auditoria foi aplicada aos fluxos e à base de homologação local. Não há autorização implícita para publicar, promover produção ou usar o banco antigo.

## Implementado para validar nesta máquina

| Entrega | Conteúdo | Critério e limite |
|---|---|---|
| Rotina e planejamento | Gestão, kanban, app simples, simulador contínuo, plano × realizado | Mesmos motores financeiros; pessoas/valores/datas de exemplo |
| Cobrança contratual | Semana utilizada, regras explícitas, emissão por vínculo/versão, ajustes finais | Duas semanas/dois motoristas, reenvio sem duplicar; condições comerciais efetivas ainda a conferir |
| Devolução | Agenda, vistoria, carro/chaves, kit, demonstrativo e encerramento | Carro não é liberado por atalho; saldos não são compensados silenciosamente |
| Loja e exceções | Combo individual, divergência, reserva/expiração, entrega, tardio, devolução/reembolso e quarentena | Preserva produto/preço/custo/margem; fornecedor Pix ainda não homologado |
| Financeiro | Pagar/receber, baixa/conciliação, estorno, crédito/repasse, devoluções | Caixa, resultado e patrimônio separados; contabilidade/fiscal dependem de revisão |
| Multas/sinistros | Registro, prazo, manifestação, decisão humana e título vinculado | Proposta não é dívida; sem retenção automática de caução |
| Acesso e base local | Contas individuais, arquivos privados, gravação atômica, revisão, idempotência e backup | Serviço 4174 em loopback/HTTP; não é publicação ou banco remoto |
| Privacidade pessoal | Área financeira por conta do motorista | Fora da visão e do backup da gestão |

A manutenção por carro, km e data foi integrada, com agenda, prazo da oficina e conclusão vinculada à OS. O status final e os testes executados devem ser conferidos em [VALIDACAO.md](VALIDACAO.md), junto da evidência de interface. Não concluir uma área somente pela existência de um botão.

## Próximos passos para o primeiro carro

1. **Homologar a versão local.** Percorrer contratação, entrega, duas semanas, estoque/venda, exceção e devolução. Exercitar dois acessos, conflito de revisão, reenvio e restauração. Usar dados e arquivos de teste.
2. **Definir a operação efetiva.** Cidade/fuso, carro, financiamento, capital/reserva, seguro/franquia, caução, manutenção, dia de vencimento, parcialidades, atraso e encerramento. Conferir plano de manutenção aplicável ao veículo.
3. **Revisar contratos e registros.** Advogado revisa minutas, responsabilidades, privacidade e evidências; contabilidade confere reconhecimento, regime, notas/tributos e fechamentos. O sistema organiza o processo, sem substituir essas decisões.
4. **Preparar infraestrutura adequada.** Definir hospedagem, TLS, banco transacional, arquivos/retenção, monitoramento, recuperação externa, gestão de acessos e proteção do dispositivo. Não expor o serviço HTTP de homologação diretamente na rede.
5. **Escolher provedores e homologar um por vez.** Banco/Pix, assinatura, telemetria e notificações ainda estão em aberto. Testar confirmação autenticada, eventos fora de ordem, duplicados, falhas de rede, estorno/reembolso e conciliação.
6. **Executar piloto acompanhado.** Um carro/um motorista e kit pequeno. Conferir extrato, livro, inventário, obrigações e manutenção diariamente. Medir entendimento e tempo para conferir combo, vender, vistoriar, pagar e pedir ajuda.
7. **Crescer com evidência.** Bater plano com realizado e revisar expansão somente com caixa/reserva/resultado observados. Ganho da lojinha e benefícios não garantem permanência do motorista.

## Evoluções que continuam separadas

- Múltiplos lotes simultâneos por SKU, compras/entrada fiscal e regras comerciais efetivas de garantia, taxa, avaria e perdas.
- Provisionamento do benefício de Finanças Pessoais e novos apps; parcerias depois do piloto.
- Catálogo opcional por QR impresso; caminho principal continua venda assistida sem cadastro do passageiro.
- App nativo com leitura autorizada de oferta/overlay, se tecnicamente permitido, consentido e homologado por dispositivo. A análise web atual é manual e não aceita corridas em Uber/99.
- Notificações em segundo plano, recuperação fora desta máquina e rotina offline.

O detalhamento do fechamento da auditoria está em [AUDITORIA-DE-FLUXOS.md](AUDITORIA-DE-FLUXOS.md). As decisões confirmadas ficam em [DECISOES.md](DECISOES.md); condições de exemplo não se tornam fatos comerciais por estarem preenchidas na interface.
