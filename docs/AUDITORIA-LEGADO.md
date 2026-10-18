# O que aproveitar do RodaVolt-System

**Data:** 17/10/2026. Referência indicada pelo usuário: `Downloads/RodaVolt-System-main/`. Escopo: leitura de README, mapa de navegação/rotas, estrutura de funcionalidades e amostras de código da lojinha e simulador. Também foi encontrada a cópia local `Documents/ChatGPT/RODAVOLT - SYSTEM`. Não foi executada uma auditoria completa de segurança, testes ou banco; estados de produção descritos nos documentos antigos não foram confirmados.

## Diagnóstico

O legado tem uma estrutura de domínio útil: carro, motorista, contrato, pagamentos, manutenção, vistoria, documentos e estoque. O menu analisado em `src/app/layout/AppLayout.tsx` contém **17 destinos principais**, incluindo Operações, Ações Operacionais, Jurídico, Atendimento, três itens de loja, quatro de financeiro, Estratégia e Dashboard.

Para uma operação inicial de um carro, essa distribuição aumenta o trabalho de entender onde agir. A proposta mantém a rastreabilidade e reúne as tarefas em **sete áreas**. Isso é uma decisão de desenho para o novo produto, não a constatação de que os fluxos antigos não funcionam.

## Reaproveitamento por capacidade

| Origem observada | Nova decisão | Motivo e condição |
|---|---|---|
| `features/frota/` · ficha do ativo | Manter conceito e revisar campos | Compra, km, documentos e custos são o centro da operação |
| `features/motoristas/` · cadastro e CRM | Cadastro + funil simples | Histórico útil; CRM elaborado só quando houver volume |
| `features/contracts/` | Manter domínio, simplificar interface | Contrato comercial e documento devem ser partes do mesmo registro |
| `features/contracts/juridico/` | Integrar versões e assinatura ao contrato | Sala jurídica, políticas e pacote de advogado separados ficam para demanda real |
| `features/financeiro/` | Reunir em área financeira | Contas, pagamentos, bancos e centros de custo não precisam ser quatro destinos principais |
| Vistorias no portal do motorista | Manter evidência e checklist | Entrega/devolução, fotos e km têm efeito contratual concreto |
| `features/operacoes/` e command center | Uma fila de pendências | Evitar mais de um lugar para acompanhar a mesma ocorrência |
| `features/atendimento/` | Suporte vinculado ao carro/cobrança | Contexto reduz preenchimento e liga ocorrência a custo |
| `features/motorista-app/` | Reaproveitar jornada e permissões conceituais | Consulta do próprio contrato, carro, cobrança e documentos faz sentido |
| `features/lojinha/` | Manter produto e movimentos; ampliar modelo | Kit em custódia, localização, venda a passageiro e acerto precisam de desenho próprio |
| `features/estrategia/intelligence/simulacaoEmpresarial.ts` | Preservar ideias, validar fórmulas separadamente | Compra, dívida, caixa e depreciação são úteis; crescimento automático sai do primeiro lançamento |
| Tags, favoritos, comentários e timelines genéricas | Histórico essencial por registro | Evitar infraestrutura transversal sem caso de uso no primeiro carro |
| Pontuações/inteligências de motorista e ativo | Adiar | Mostrar fatos e valores, sem classificar pessoas por score opaco |
| Plataformas AI/Agent/Data/Smart Fleet | Adiar | Exigem dados e operação que ainda serão construídos |
| Expansão e renovação automática da frota | Adiar | Decisão sobre o primeiro ativo vem antes de otimizar expansão |
| Mapas/demanda/telemetria | Adiar até fonte e hardware definidos | Não inferir integração com Uber/99 nem GPS contínuo pelo navegador |

## Diferença decisiva na lojinha

As amostras `features/motorista-app/pages/LojinhaPage.tsx` e `features/lojinha/api/lojinhaAdmin.ts` mostram catálogo, carrinho, pedidos do motorista e estados até entrega. O estoque observado já segue a boa ideia de **saldo por soma de movimentações**, em vez de edição direta do saldo do produto.

As amostras não demonstram, por si só, todo o controle da venda ao passageiro, estoque em cada carro, comissão e repasse. Portanto, não basta renomear a loja existente. É necessário modelar as duas transações: entrega da mercadoria ao motorista e venda ao passageiro. A primeira transfere custódia; a segunda reconhece venda e custo e pode criar valor a repassar.

O modelo de consignação é uma proposta. Se o usuário preferir vender o kit ao motorista no atacado, o reconhecimento financeiro e a responsabilidade pelo estoque mudam. Escolher a regra antes de migrar produtos/pedidos.

## Cuidados com o simulador antigo

A amostra de `simulacaoEmpresarial.ts` considera aquisição, juros da dívida, amortização, caixa, custos administrativos e crescimento. Seus comentários e nomes refletem sucessivas definições de “lucro” e “fluxo”. Isso justifica validar os conceitos com casos pequenos e independentes; não constitui prova de defeito matemático específico.

No novo motor, a separação é explícita: parcela completa sai do caixa; só juros afetam resultado; principal reduz dívida; depreciação afeta resultado e valor do ativo, não o caixa mensal; caução não vira receita. A versão inicial não compra novos carros automaticamente.

## Estratégia de reutilização

1. Preservar o legado como referência; não copiar o banco, chaves ou estado operacional.
2. Antes de portar cada função, listar regra útil e critério de aceite do novo PRD.
3. Reaproveitar função pura, validação ou componente somente depois de revisar suas dependências e testar comportamento relevante.
4. Revalidar permissões e políticas em banco novo; não confiar em comentários ou em telas que escondem ações.
5. Só migrar dados reais com inventário de tabelas, fonte autorizada, mapeamento, ensaio e conferência de saldos e arquivos.

O protótipo atual é novo e independente. Nenhum módulo do legado foi anunciado como migrado ou validado para produção.
