# Verificação da entrega inicial

Data: 17/10/2026, calendário do proprietário. Escopo: planejamento e protótipo, sem backend.

## Automatizado

`npm run check`: 20 testes do motor aprovados, geração do protótipo e verificação de sintaxe JavaScript. Casos cobrem calendário, financiamento, caixa versus resultado, tributos/margem simplificados, equilíbrio, revenda, reserva, desconto e validação de entradas. `git diff --check` sem erro.

## Navegador

Conferidos no navegador integrado, em largura de desktop e apresentação estreita de 320px:

- Renderização de tema escuro no desktop e claro na moldura de 320px, sem cortes visíveis na navegação e campos inspecionados.
- Alterar aluguel de R$ 750 para R$ 900 atualiza o caixa médio de aproximadamente R$ 916 para R$ 1.426 e muda resultado, gráfico e VPL.
- Mudar compra à vista para financiada mostra entrada, juros, prazo e tarifas e recalcula capital e parcelas; reabrir cenário restaura as premissas.
- Comparação de cenários e salvamento/restauração disponíveis na tela.
- Ficha do carro abre sua área de manutenção com serviço e ocorrência contextualizados.
- Transferir seis águas muda central de 48 para 42 e kit de 12 para 18; uma venda reduz o kit para 17, registra R$ 4 de venda e R$ 0,80 de comissão na gestão.
- Comprovante simulado no app muda a cobrança para “em conferência” também no financeiro; não confirma pagamento.
- App do motorista mostra início, carro, pagamento, loja e documentos; captura visual de demonstração produzida.

Não foram homologados: ambiente de produção, acessos reais, banco/arquivos, segurança operacional, integrações, emissão fiscal, performance sob carga, offline ou acessibilidade integral. O teste visual de 320px cobre a composição inspecionada; não substitui uma suíte de dispositivos na fase operacional.
