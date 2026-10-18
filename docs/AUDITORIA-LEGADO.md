# Auditoria do legado para v3

O simulador original foi relido em 18/10/2026. O problema principal era de experiência: as versões novas escondiam os fluxos em várias abas, enquanto o antigo apresentava premissas e toda a análise numa página longa.

A reconstrução recupera essa sequência, a manutenção mensal simples, as dez métricas executivas, a recuperação econômica, a posição Hoje, as colunas de juros/principal/extra/IR e a tabela antes dos gráficos. Veja CENTRO-DE-ESTRATEGIA.md para o mapa de paridade.

Não foram replicados erros antigos de mês zero operacional, lucro após principal da parcela, venda abaixo da dívida com piso artificial ou recuperação econômica apresentada como dinheiro sacado. Código de referência foi apenas lido. Dados, credenciais e infraestrutura não foram importados.

A v2 rejeitada permanece no histórico Git; seu controlador e estilo não são a experiência corrente. Os módulos matemáticos testados foram reaproveitados para evitar regressão nas identidades de caixa e patrimônio.
