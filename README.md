# RODAVOLT · Sua operação em ordem

**Versão 5 · fluxos completos e homologação local de 18/10/2026.** Uma nova experiência para administrar locação semanal de carros no Brasil, organizar motoristas e simular o crescimento antes de investir.

O layout e o controlador anteriores foram substituídos. A versão 2 permanece no histórico Git. A matemática financeira validada foi preservada e ampliada com relatórios novos; não foi feita cópia da interface rejeitada.

## O que explorar

- **Painel ativo:** mapa geográfico, veículo/motorista selecionado, telemetria e percurso fictícios, idade do dado, alertas e histórico; provedor ainda não conectado.
- **Agenda e compromissos:** semana/mês, responsável, lembretes locais e pendências derivadas de cobranças, contas, cadastro, contratos, serviços e vistorias.
- **Meu advogado:** cinco minutas completas para conferência profissional, modelos versionados, download em texto, revisão, fila e registro demonstrativo por signatário; documentos por perfil.
- **Visão do dia:** cobranças, caixa, fila de atenção, carro e próximos cuidados.
- **Motoristas:** kanban com colunas criáveis, renomeáveis, reordenáveis e removíveis (cartões realocados antes da exclusão), seleção manual por critérios, caução, contrato/vistoria e veículo disponível; Piloto e benefícios concentra a entrada.
- **Frota e cuidados:** aquisições demonstrativas, dívida por carro, manutenção, vistorias, multas/sinistros/avarias e devolução guiada de carro, chaves e kit.
- **Financeiro:** agenda semanal por contrato, contas a pagar/receber, baixas por conta e centro, estorno com origem, crédito/repasse da lojinha, devolução de aluguel e conciliação manual 1:1, sem duplicar dinheiro.
- **Loja no carro:** combo com vários produtos por motorista, envio/conferência/divergência, estoque disponível e reservado, pedido/Pix demonstrativo/entrega, expiração, reembolso e quarentena; 100% da margem do piloto para o motorista, sem duplicar crédito ou recebimento.
- **Simulador:** página contínua próxima ao sistema antigo, premissas com recálculo automático, linha Hoje, fluxo anual/mensal antes dos gráficos, juros/principal/extra, dinheiro do bolso, patrimônio, compra agora/3/6 meses e todos os meses da linha do tempo. Cenários e exportação CSV.
- **Planejado × realizado:** plano preservado, registros editáveis, origens e revisão pelo fechamento.
- **App do motorista:** visual do Finanças Pessoais (branco/cinza/preto, cartões suaves, pílulas e tema claro/escuro), quatro abas — **Início, Aluguel, Lojinha e Mais** — com palavras simples, letras maiores e botões grandes. O início do motorista ativo oferece quatro ações: registrar venda, conferir corrida, fazer vistoria e pedir ajuda. Contratos, compromissos, manutenção, histórico, metas e registros do dia continuam disponíveis, sem um segundo menu.

Na prévia de design, a vistoria do motorista é guiada em quatro passos: painel do carro, itens, fotos e conferência antes de enviar. O aluguel mostra o saldo após os descontos; usar o lucro da lojinha pede confirmação com o valor antes, o desconto e quanto ainda falta pagar. As explicações do acerto e o histórico ficam acessíveis sem ocupar a tela inicial. Candidatos acompanham as etapas para receber o carro, enquanto motoristas ativos veem as tarefas da operação.

A análise de corrida calcula líquido por km e por hora usando oferta informada manualmente, trajeto até o passageiro, viagem, reposicionamento, espera, recarga elétrica (kWh e R$/kWh), outros custos, pedágio não reembolsado e aluguel rateado. Compara com os mínimos pessoais e com a meta diária convertida por tempo e distância. Registrar aceitar/recusar só preserva a escolha do motorista; não executa ações em Uber/99.

O piloto começa com um carro e sem reinvestimento automático no rascunho; cenários anteriores e plano preservado continuam disponíveis. Caução é obrigação, separada de receita e lucro. App de finanças pessoais e novos apps são benefícios previstos, sem acesso ativado; parcerias ficam para depois.

## Abrir localmente

Node 22, sem instalação de dependências:

```sh
npm run check
npm run build
npm run operate
```

Acesso individual para homologação: `http://127.0.0.1:4174/operacao`. Na primeira abertura, o proprietário cria seu próprio acesso e senha. Depois cadastra e vincula os acessos dos motoristas. A gestão abre o painel completo com gravação no serviço local; cada motorista recebe somente sua visão e as ações permitidas pelo servidor.

Os registros ficam em `.local/rodavolt/`, ignorada pelo Git. Senhas usam scrypt; a sessão usa cookie HttpOnly e proteção CSRF. Revisão e idempotência protegem a gravação contra reenvio e atualizações concorrentes. O serviço escuta somente em `127.0.0.1`, por HTTP, para homologação nesta máquina. Não é uma publicação para a internet.

Para explorar o desenho sem login nem gravação no serviço:

```sh
npm run dev
```

Prévia demonstrativa separada: `http://127.0.0.1:4173/`. Os fontes geram `index.html` e `prototype/preview.html`; não editar esses arquivos diretamente. O seletor Gestão/Motorista da prévia serve para testar a interface e não é controle de acesso.

A implementação é uma **plataforma local para homologação**, com pessoas, valores e registros fictícios. A abertura financeira usa nov/2026 a jan/2027; a data operacional de exemplo é 25/01/2027. Login individual, persistência e arquivos privados funcionam no serviço local. Pix, banco, assinatura eletrônica, telemetria e notificações externas continuam sem fornecedor escolhido e sem integração homologada. A análise de corrida permanece manual.

A prévia 4173 preserva a chave `rodavolt-v3`, sem importar ou apagar sessões antigas. O serviço 4174 mantém outra base: não importa o localStorage silenciosamente. Jornadas, metas e decisões pessoais no serviço ficam por conta do motorista e não compõem a visão nem o backup da gestão. O backup operacional inclui a operação e os arquivos; exclui senhas e finanças pessoais. Restaurar exige entrar novamente e recriar os vínculos de acesso dos motoristas. Consulte as condições em [Operação](docs/OPERACAO.md).

Cobrança vencida — pagamento da semana já utilizada — foi confirmada pelo proprietário. O dia de vencimento e as regras de primeira/última semana são configurados e conferidos por contrato. O histórico de abertura permanece preservado. Ainda é necessário validar condições do primeiro carro, minutas com profissional e facilidade de uso com o motorista real antes da operação.

## Documentação atual

- [Auditoria de todos os fluxos e situação de fechamento](docs/AUDITORIA-DE-FLUXOS.md)
- [Cobranças semanais por contrato](docs/COBRANCAS.md)
- [Devolução e encerramento](docs/DEVOLUCAO.md)
- [Multas, sinistros e avarias](docs/OCORRENCIAS.md)
- [Módulos da operação e fronteiras das integrações](docs/OPERACAO.md)
- [Pacote contratual e checklist do advogado](docs/PACOTE-CONTRATUAL.md)
- [PRD e critérios de aceite](docs/PRD.md)
- [Desenho e navegação](docs/DESIGN.md)
- [Modelo e fluxo do simulador](docs/SIMULADOR.md)
- [Calibração do primeiro carro em Maringá/PR e teste de ponta a ponta](docs/CALIBRACAO-MARINGA.md)
- [Referência antiga e o que foi recuperado](docs/CENTRO-DE-ESTRATEGIA.md)
- [Pesquisa na internet e no GitHub](docs/REFERENCIAS.md)
- [Plano de implementação operacional](docs/PLANO-DE-EXECUCAO.md)
- [Prontidão para iniciar com o primeiro carro](docs/PRONTIDAO-OPERACIONAL.md)
- [Arquitetura e limites](docs/ARQUITETURA.md)
- [Decisões](docs/DECISOES.md)
- [Validação](docs/VALIDACAO.md)

Edição direta nesta pasta, branch `dev`, commit/push após verificações. Repositório [carlaobh20/RODAVOLT](https://github.com/carlaobh20/RODAVOLT). Publicação e migração de banco não fazem parte desta reconstrução local.
