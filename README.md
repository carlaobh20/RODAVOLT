# RODAVOLT · Sua operação em ordem

**Versão 3 · reconstrução de 18/10/2026.** Uma nova experiência para administrar locação semanal de carros no Brasil, organizar motoristas e simular o crescimento antes de investir.

O layout e o controlador anteriores foram substituídos. A versão 2 permanece no histórico Git. A matemática financeira validada foi preservada e ampliada com relatórios novos; não foi feita cópia da interface rejeitada.

## O que explorar

- **Visão do dia:** cobranças, caixa, fila de atenção, carro e próximos cuidados.
- **Motoristas:** kanban arrastável e lista, cadastro, busca, próxima ação, conferências de entrega e bloqueio de vínculo sobreposto.
- **Frota e cuidados:** aquisições demonstrativas, dívida por carro, manutenção, custo do serviço e vistorias.
- **Financeiro:** cobranças semanais, comprovantes em conferência, confirmação idempotente e livro por origem.
- **Loja no carro:** perfumes, carregadores veiculares e cabos; central/kit, venda, comissão, recebimento e acerto.
- **Simulador:** página contínua próxima ao sistema antigo, premissas com recálculo automático, linha Hoje, fluxo anual/mensal antes dos gráficos, juros/principal/extra, dinheiro do bolso, patrimônio, compra agora/3/6 meses e todos os meses da linha do tempo. Cenários e exportação CSV.
- **Planejado × realizado:** plano preservado, registros editáveis, origens e revisão pelo fechamento.
- **App do motorista:** análise “Vale a corrida?”, metas/custos, jornada, carteira, loja, manutenção, vistoria, documentos e suporte.

A análise de corrida calcula líquido por km e por hora usando oferta informada manualmente, trajeto até o passageiro, viagem, reposicionamento, espera, combustível, outros custos, pedágio não reembolsado e aluguel rateado. Compara com os mínimos pessoais e com a meta diária convertida por tempo e distância. Registrar aceitar/recusar só preserva a escolha do motorista; não executa ações em Uber/99.

## Abrir localmente

Node 22, sem instalação de dependências:

```sh
npm run check
npm run dev
```

Prévia: `http://127.0.0.1:4173/`. Os fontes geram `index.html` e `prototype/preview.html`. Não editar gerados manualmente.

A implementação é um **protótipo funcional local**, com pessoas, valores e registros fictícios. O exemplo financeiro usa nov/2026 a jan/2027. Não há banco remoto, login real, Pix, documentos privados, assinatura, telemetria ou leitura automática da tela de aplicativos. Não usar como sistema de produção nem inserir documentos pessoais. A chave de armazenamento `rodavolt-v3` inicia uma sessão nova, sem importar ou apagar os dados locais antigos. Há exportação JSON da sessão e CSV do simulador.

## Documentação atual

- [PRD e critérios de aceite](docs/PRD.md)
- [Desenho e navegação](docs/DESIGN.md)
- [Modelo e fluxo do simulador](docs/SIMULADOR.md)
- [Referência antiga e o que foi recuperado](docs/CENTRO-DE-ESTRATEGIA.md)
- [Pesquisa na internet e no GitHub](docs/REFERENCIAS.md)
- [Plano de implementação operacional](docs/PLANO-DE-EXECUCAO.md)
- [Arquitetura e limites](docs/ARQUITETURA.md)
- [Decisões](docs/DECISOES.md)
- [Validação](docs/VALIDACAO.md)

Edição direta nesta pasta, branch `dev`, commit/push após verificações. Repositório [carlaobh20/RODAVOLT](https://github.com/carlaobh20/RODAVOLT). Publicação e migração de banco não fazem parte desta reconstrução local.
