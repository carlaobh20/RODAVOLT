# Caminho para uma operação real

18/10/2026. A interface anterior foi substituída. Esta versão serve para validar tarefas concretas com o proprietário, preservando a matemática auditada.

| Etapa | Entrega | Critério para avançar |
|---|---|---|
| 1 · Experiência local | Rotina, kanban, simulador contínuo, loja correta e app com análise de corrida | Percorrer os cenários da validação e aprovar estrutura e nomenclatura |
| 2 · Primeiro carro | Modelo efetivo, condições comerciais, financiamento, contrato/termo do kit e responsabilidades | Premissas conferidas, reserva suportada e contrato revisado |
| 3 · Base operacional | Banco, identidades individuais, permissões, arquivos privados, transações e backups | Motorista não acessa outro vínculo; operações concorrentes não duplicam dinheiro/estoque |
| 4 · Homologação de uma semana | Um carro/um motorista com cobranças, vistoria, manutenção, kit e repasse | Conferir livro e extrato, contagem física, parcelas, comissão e um fechamento completo |
| 5 · Integrações | Cobrança/Pix, assinatura, notificações e importações, cada uma homologada | Idempotência e reconciliação em cenários de erro/reenvio |
| 6 · App nativo/assistente de corrida | Captura autorizada de oferta/overlay quando tecnicamente permitido, consentimento e testes por dispositivo | Valores lidos conferem com a oferta; motorista controla o recurso e a decisão; não prometer automação que o protótipo web não possui |
| 7 · Crescer com evidência | Comparar plano com fechamentos e revisar expansão | Compra adicional sustentada por caixa, reserva e resultado observados |

Não realizar deploy, migração do banco antigo ou contratação de serviços por consequência implícita desta reconstrução. Continuar edição local e sincronização da branch dev após validação.

## Ampliação v4 já disponível para avaliação local

Financeiro com pagar/receber e conciliação, agenda derivada da operação, Meu advogado, contratação por perfil, vistoria revisável e painel geográfico demonstrativo. Isso amplia a etapa 1; não antecipa banco, autenticação, assinatura nem GPS reais das etapas seguintes. O proprietário decidiu escolher fornecedores somente depois de validar o sistema.

## Ordem revista após auditoria de fluxos

A [auditoria de 18/10](AUDITORIA-DE-FLUXOS.md) é a referência de pendências e evidências desta etapa. Não considerar a operação completa apenas pela quantidade de telas.

1. Aprovar a rotina simples do motorista e o combo com estoque individual, já demonstráveis.
2. Definir e implementar a geração de aluguel semanal por contrato, incluindo primeira/última semana e reenvio idempotente.
3. Conduzir devolução física do carro/kit e acerto final, separando disponibilidade de dívida e caução.
4. Construir base persistente com acessos individuais, transações, arquivos e recuperação. Não reutilizar o banco antigo por inferência.
5. Selecionar banco/Pix, assinatura e rastreador; homologar recebimento, conciliação, reembolso, rede indisponível e eventos repetidos.
6. Validar uma semana com o primeiro carro e motorista; medir entendimento e tempo de cada tarefa antes de automatizar crescimento ou ampliar a frota.

O fluxo principal de venda usa seleção no app do motorista e Pix por pedido na conta da RODAVOLT. Catálogo por QR impresso é uma evolução opcional. O pagamento demonstrativo atual não está conectado a um banco.
