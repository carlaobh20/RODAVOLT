# RODAVOLT · Sua operação em ordem

**Versão 4 · ampliação operacional de 18/10/2026.** Uma nova experiência para administrar locação semanal de carros no Brasil, organizar motoristas e simular o crescimento antes de investir.

O layout e o controlador anteriores foram substituídos. A versão 2 permanece no histórico Git. A matemática financeira validada foi preservada e ampliada com relatórios novos; não foi feita cópia da interface rejeitada.

## O que explorar

- **Painel ativo:** mapa geográfico, veículo/motorista selecionado, telemetria e percurso fictícios, idade do dado, alertas e histórico; provedor ainda não conectado.
- **Agenda e compromissos:** semana/mês, responsável, lembretes locais e pendências derivadas de cobranças, contas, cadastro, contratos, serviços e vistorias.
- **Meu advogado:** cinco modelos versionados, minutas, revisão, fila e registro demonstrativo por signatário; documentos por perfil.
- **Visão do dia:** cobranças, caixa, fila de atenção, carro e próximos cuidados.
- **Motoristas:** kanban, seleção manual por critérios, caução, contrato/vistoria e veículo disponível; Piloto e benefícios concentra a entrada.
- **Frota e cuidados:** aquisições demonstrativas, dívida por carro, manutenção, custo do serviço e vistorias.
- **Financeiro:** contas a pagar/receber, vencimentos, baixas por conta e centro, livro de caixa e conciliação manual 1:1 com extrato fictício, sem duplicar dinheiro.
- **Loja no carro:** perfumes/carregadores/cabos com estoque financiado pela RODAVOLT e 100% da margem do piloto para o motorista; acerto, repasse ou crédito no aluguel, sem duplicar ganho.
- **Simulador:** página contínua próxima ao sistema antigo, premissas com recálculo automático, linha Hoje, fluxo anual/mensal antes dos gráficos, juros/principal/extra, dinheiro do bolso, patrimônio, compra agora/3/6 meses e todos os meses da linha do tempo. Cenários e exportação CSV.
- **Planejado × realizado:** plano preservado, registros editáveis, origens e revisão pelo fechamento.
- **App do motorista:** visual do Finanças Pessoais (branco/cinza/preto, cartões suaves, pílulas e tema claro/escuro), quatro abas — **Início, Aluguel, Lojinha e Mais** — com palavras simples, letras maiores e botões grandes. O início do motorista ativo oferece quatro ações: registrar venda, conferir corrida, fazer vistoria e pedir ajuda. Contratos, compromissos, manutenção, histórico, metas e registros do dia continuam disponíveis, sem um segundo menu.

A vistoria do motorista é guiada em quatro passos: painel do carro, itens, fotos e conferência antes de enviar. O aluguel mostra o saldo após os descontos; usar o lucro da lojinha pede confirmação com o valor antes, o desconto e quanto ainda falta pagar. As explicações do acerto e o histórico ficam acessíveis sem ocupar a tela inicial. Candidatos acompanham as etapas para receber o carro, enquanto motoristas ativos veem as tarefas da operação.

A análise de corrida calcula líquido por km e por hora usando oferta informada manualmente, trajeto até o passageiro, viagem, reposicionamento, espera, combustível, outros custos, pedágio não reembolsado e aluguel rateado. Compara com os mínimos pessoais e com a meta diária convertida por tempo e distância. Registrar aceitar/recusar só preserva a escolha do motorista; não executa ações em Uber/99.

O piloto começa com um carro e sem reinvestimento automático no rascunho; cenários anteriores e plano preservado continuam disponíveis. Caução é obrigação, separada de receita e lucro. App de finanças pessoais e novos apps são benefícios previstos, sem acesso ativado; parcerias ficam para depois.

## Abrir localmente

Node 22, sem instalação de dependências:

```sh
npm run check
npm run dev
```

Prévia: `http://127.0.0.1:4173/`. Os fontes geram `index.html` e `prototype/preview.html`. Não editar gerados manualmente.

A implementação é um **protótipo funcional local**, com pessoas, valores e registros fictícios. O exemplo financeiro usa nov/2026 a jan/2027. Não há banco remoto, login real, Pix, documentos privados, assinatura, telemetria real ou leitura automática da tela de aplicativos. Não usar como sistema de produção nem inserir documentos pessoais. A chave de armazenamento `rodavolt-v3` inicia uma sessão nova, sem importar ou apagar os dados locais antigos. Há exportação JSON da sessão e CSV do simulador.

## Documentação atual

- [Módulos da operação e fronteiras das integrações](docs/OPERACAO.md)
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
