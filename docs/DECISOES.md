# Decisões de produto · v2

## Confirmado

Brasil/BRL, locação semanal para motorista de aplicativo, edição local na pasta RODAVOLT, GitHub `carlaobh20/RODAVOLT`, gestão completa, loja no carro, app do motorista, simulação antes da compra e intenção de aquisição em novembro de 2026.

Na revisão de 17/10/2026, o proprietário pediu reconstrução integral: mais controle e transparência, app mais completo, recuperação do fluxo de crescimento/projeções do simulador antigo e comparação entre planejado e realizado conforme a operação for registrada. A simplificação em sete áreas e o adiamento do crescimento da v1 foram superados por essa direção.

## Decisões de desenho desta versão

- Três camadas: plano versionado, livro de registros e revisão prospectiva; nenhuma sobrescreve a outra.
- Controle por origem, período, natureza e estado, com composição clicável.
- Crescimento por veículo e dívida, reserva fixa/por carro, aportes, retiradas e prioridade de capital.
- Visão mensal e anual; novas aquisições operam no mês seguinte.
- Aplicativo com Início, Jornada, Carteira, Loja e Mais; carro, manutenção, vistoria, documentos e suporte aprofundados.
- Jornada pessoal não é faturamento da locadora nem dado administrativo por padrão.
- Ações da loja distinguem recebimento pelo motorista e pela empresa, comissão e repasse.
- Versão antiga preservada pelo histórico Git; código, interface e documentação correntes reconstruídos.

## Hipóteses comerciais a confirmar

Consignação versus venda do kit; comissão e sua base; produtos/preços; responsáveis por seguro/revisão/pneus/combustível; política de atraso, caução, franquia e km; cidade/estado; capital, reserva e financiamento; modelo/ano do carro; regime da empresa e minuta jurídica.

Padrões do simulador são ilustrativos. O kit demonstrativo usa 20% de comissão e dados fictícios; não é condição comercial aprovada. A janela nov/2026–jan/2027 é um exemplo prospectivo, não registros reais.

## Infraestrutura

A aplicação operacional proposta continua React/TypeScript e banco relacional com autorização e arquivos privados. O protótipo atual é estático e não fornece autenticação real. Desenvolvimento em `dev`, commit e push após verificações autorizados. Publicação e integrações operacionais são etapas posteriores.

## Integração do Centro de Estratégia

O proprietário confirmou operação somente no Brasil. O cartão “Minha operação / Brasil” foi removido; país e BRL são fixos, sem seleção de operação. A integração das cinco áreas e das análises de expansão/renovação está detalhada em [CENTRO-DE-ESTRATEGIA.md](CENTRO-DE-ESTRATEGIA.md), incluindo correções matemáticas e limites de origem dos dados.
