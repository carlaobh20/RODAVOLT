# Pacote contratual RODAVOLT · versão para conferência do advogado

Atualizado em 04/11/2026. A biblioteca atual fica em **Meu advogado → Preparar um documento** e contém **22 modelos e formulários preenchíveis**, cobrindo os 16 tipos da operação. O texto integral e os campos vivem em `src/legal-documents.js`; os arquivos são exportados para [contratos/preenchiveis](contratos/preenchiveis/README.md).

**Situação:** textos redigidos, campos e geração local disponíveis, sujeitos a revisão jurídica/comercial. Preenchimento completo não é aprovação jurídica nem assinatura. Seguro e financiamento têm formulários preparatórios: apólice e contrato de crédito precisam ser obtidos dos fornecedores. A constituição da empresa e as condições reais ainda precisam ser definidas.

## Como preparar e reutilizar

1. Abra um modelo ou **Pacote de entrada · 8 modelos** (locação, cuidados do elétrico, caução, vistoria, privacidade, uso do app, kit e inventário).
2. Preencha empresa, carro, regras, privacidade e loja. **Salvar base reutilizável** baixa um JSON privado desses grupos. Ele exclui motorista, ocorrência, outra parte e assinatura.
3. Em cada novo vínculo, use **Trocar motorista / novo caso**. A base fica; identidade, datas, referência e fatos anteriores são retirados. Preencha os dados individuais e condições específicas.
4. **Conferir e gerar prévia** mostra os campos ausentes. TXT permite edição; HTML independente permite **Imprimir → Salvar como PDF**. Rascunho incompleto mantém os marcadores visíveis.
5. Revise texto, valores, fatos, anexos e condições com advogado/contador. Recibos dependem de recebimentos efetivos; acordos e ocorrências dependem do caso. A revisão profissional não é substituída por contagem de campos.
6. Após obter a via final, assine por meio adequado, guarde o original e confira autoria/integridade. O PDF pode retornar pelo acesso individual do motorista. Correlacione contrato, versão e anexos; exportar a minuta não registra assinatura ou libera carro.

O preparador usa **somente memória da aba**: não grava dados de qualificação em localStorage, widgetState, backup operacional, financeiro ou serviço. Atualizar/fechar a página perde o preenchimento. Arquivos baixados podem conter dados privados; sua guarda é uma ação explícita do usuário. A base importada valida tipo/versão/campos e não pode carregar identidade de motorista. Nenhum arquivo vai automaticamente ao GOV.BR, ITI ou terceiros.

**Exceção exclusiva para ensaio fictício na prévia:** depois de preencher os oito modelos de entrada, **Vincular exemplo à operação** permite guardá-los em uma nova versão da minuta de locação. Exige motorista identificado como TESTE, carro com placa TESTE-, correspondência de identificação/datas/valores e confirmação de que não há dados pessoais reais. A cópia passa a integrar o estado local e seu backup, aparecendo como oito documentos no app do perfil correspondente. Revisão e assinaturas continuam simuladas e separadas da caução, vistoria e entrega. Editar as condições retira o pacote da versão atual, preservando a anterior no histórico. O vínculo não está disponível no serviço autenticado; não usar esse mecanismo para contratos reais.

## Biblioteca atual

| Tipo | Textos preenchíveis |
|---|---|
| 1 | Locação semanal de veículo elétrico e quadro comercial |
| 2 | Anexo de uso, recarga e manutenção |
| 3 | Caução/recibo de recebimento; prestação de contas/restituição |
| 4 | Vistoria, entrega e devolução |
| 5 | Privacidade e escolha específica de localização |
| 6 | Termos do aplicativo e benefícios |
| 7 | Custódia e venda assistida; recibo de combo/inventário |
| 8 | Acerto da loja e autorização específica de crédito |
| 9 | Condições de compra, entrega, trocas e garantia |
| 10 | Solicitação de seguro para o uso real (não emite apólice) |
| 11 | Compra e venda do elétrico; conferência de financiamento (não emite crédito) |
| 12 | Fornecimento de produtos; serviços; anexo de tratamento de dados |
| 13 | Aditivo e substituição do veículo |
| 14 | Notificação de trânsito; registro/apuração de sinistro, avaria ou perda |
| 15 | Acordo de pagamento de saldo apurado |
| 16 | Distrato, devolução e acerto final |

O roteiro numerado continua em [MAPA-DOCUMENTOS-JURIDICOS.md](MAPA-DOCUMENTOS-JURIDICOS.md). `npm run contracts:export` gera cada minuta, TXT e HTML do pacote completo, índice e roteiro a partir das fontes. Não editar arquivos gerados.

## Preservação do fluxo e do histórico

Os cinco modelos anteriores em `src/legal-pack.js` e suas versões em `src/coordination.js` continuam vinculados aos documentos demonstrativos já existentes. Estão recolhidos no **acervo dos modelos usados nos vínculos de exemplo**, abaixo do controle operacional. A biblioteca preenchível é um preparador de arquivos separado: não substitui textos já assinados, não instala dados privados no estado e não modifica gates, caução, cobrança ou assinatura. É necessário conferir a coerência entre a versão final do arquivo e os registros do vínculo. Nenhuma nova assinatura, fornecedor, banco ou publicação foi integrada por esta entrega.

Antes dos instrumentos da operação, definir quem contrata, constituição/registro, CNPJ, poderes, atividades, tributação, emissão fiscal e exigências locais com advogado e contador. O nome comercial e o site não comprovam formalização.

## Pontos de revisão que não podem ficar implícitos

1. A [Súmula 492 do STF](https://portal.stf.jus.br/jurisprudencia/sumariosumulas.asp?base=30&sumula=2628) trata de responsabilidade da locadora por dano do locatário a terceiros. Uma cláusula interna não elimina a pretensão do terceiro. Conferir seguro para locação e aplicativo, coberturas, franquias, exclusões e limites. A [Susep informa a vigência da Lei 15.040/2024](https://www.gov.br/susep/pt-br/central-de-conteudos/noticias/2025/dezembro/lei-do-contrato-de-seguro-entra-em-vigor-trazendo-mais-clareza-e-seguranca-juridica-ao-mercado), desde 11/12/2025.
2. Custódia com intermediação e contrato estimatório não são rótulos intercambiáveis. Validar a natureza da lojinha e a alocação de riscos, especialmente o art. 535 do [Código Civil](https://www2.camara.leg.br/legin/fed/lei/2002/lei-10406-10-janeiro-2002-432893-normaatualizada-pl.html), antes de chamar o modelo de consignação definitiva.
3. Na loja, definir quem vende, emite a nota, atende e reembolsa. As condições devem respeitar o [CDC](https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html) e, quando aplicável, as regras de comércio eletrônico; não criar exclusão genérica de trocas/garantias/arrependimento.
4. Privacidade exige base legal adequada por finalidade. Permissão de localização no navegador não é autorização genérica para tratar todos os dados. A relação comercial e os controles do app também precisam de análise trabalhista coerente com os fatos, não apenas uma declaração de autonomia.
5. Para PDF assinado externamente, guardar o arquivo original, verificar partes/versão e conferir autoria/integridade pelo [VALIDAR/ITI](https://validar.iti.gov.br/). A verificação técnica não aprova conteúdo jurídico nem poderes de representação. O aplicativo não envia o documento ao ITI automaticamente.

## Dados e decisões a preencher antes da assinatura

1. **Locadora:** razão social, CNPJ, endereço, representante e poderes; definir se a contratação será por empresa ou pessoa física. O nome comercial RODAVOLT não substitui qualificação jurídica.
2. **Motorista:** nome civil, CPF, endereço, contato, CNH/categoria/validade e requisitos legais e da plataforma. Capturar em sistema privado com finalidade, acesso e retenção definidos.
3. **Carro:** placa, RENAVAM, chassi, ano/modelo, proprietário, acessórios, documentação, condições de uso e local de retirada/devolução.
4. **Preço e calendário:** valor semanal real, dia de corte/vencimento, cobrança vencida, primeiro/último período parcial, feriado, prazo de cobrança e meios de pagamento. O protótipo não fixa multa, juros ou reajuste.
5. **Caução:** valor, recibo, guarda, hipóteses fundamentadas de uso, prazo e forma de restituição, contestação e prestação de contas. Não é receita e não é compensada automaticamente.
6. **Risco e operação:** apólice, cobertura para transporte por aplicativo, exclusões, franquia, assistência, sinistro, matriz de manutenção, recarga paga pelo motorista no piloto, pneus, km excedente, condutor adicional, área de circulação, prazo de aviso e encerramento.
7. **Loja:** tabela de SKU, lote/validade, quantidades, preço/custo, taxas/tributos, emissor da nota, canal de pagamento, repasse e reembolso. A regra confirmada é 100% da margem comercial conferida para o motorista; custo do estoque volta à locadora. A incidência fiscal ainda exige contador.
8. **Rastreador e dados:** fornecedor, base legal apropriada, finalidades, acesso, retenção, direitos e aviso específico. Evitar rastrear a pessoa fora do carro. Não há rastreador contratado. O serviço local permite localização do navegador por escolha do motorista, com app aberto; isso não equivale a telemetria contínua do veículo.
9. **Assinatura:** escolher plataforma, grau de identificação, trilha de auditoria, integridade da versão e entrega de cópia a ambas as partes. Os estados contratuais iniciais são demonstrativos. O serviço local recebe o PDF assinado externamente para conferência humana, sem integrar a assinatura GOV.BR nem validar automaticamente o arquivo.

## Roteiro objetivo para o advogado

Conferir natureza da locação e regras locais da atividade; redação clara e equilíbrio das obrigações; aplicabilidade das normas de consumo; matriz de responsabilidade por multas, franquia, dano e desgaste; cobrança e restituição da caução; seguro efetivo; força e limites das provas de vistoria/telemetria; prazo e forma de rescisão; proteção de dados e assinatura eletrônica. Ajustar as minutas para a pessoa jurídica, a cidade/UF, o carro, apólice e fornecedor de assinatura efetivos. Revisar especialmente toda cláusula que possa limitar direitos do motorista. Não existe contrato “blindado” contra qualquer litígio: a proteção depende também de prática consistente, comunicação e provas.

## Fontes oficiais consultadas

- [Código Civil, locação de coisas e deveres das partes](https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm).
- [Código de Defesa do Consumidor, cláusulas abusivas e contratos de adesão](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm).
- [Código de Trânsito Brasileiro, identificação do condutor e autuações](https://planalto.gov.br/ccivil_03/leis/l9503compilado.htm).
- [Lei Geral de Proteção de Dados](https://planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm) e [orientação da ANPD sobre interesse legítimo](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_hipoteses_legais_tratamento_de_dados_pessoais_legitimo_interesse).
- [MP 2.200-2/2001, autoria e integridade de documentos eletrônicos](https://planalto.gov.br/ccivil_03/mpv/antigas_2001/2200-2.htm) e [Lei 14.063/2020, tipos de assinatura eletrônica](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/lei/l14063.htm).

As fontes orientam a revisão; este pacote não afirma enquadramento jurídico definitivo nem substitui parecer profissional.
