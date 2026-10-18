# RODAVOLT

Plataforma para locação de veículos a motoristas de aplicativo, com financeiro por carro, contratos, manutenção, portal do motorista e lojinha no veículo.

Esta primeira entrega é **planejamento + protótipo navegável**. O simulador calcula cenários e salva premissas neste navegador/ambiente. Os demais módulos demonstram os fluxos com dados fictícios. Não há autenticação, banco, cobrança, assinatura ou emissão fiscal conectados.

## Abrir o desenho

Abra `index.html` no navegador ou, com Node 22:

```sh
npm run build
npm run dev
```

Acesse `http://127.0.0.1:4173`. Não é necessário instalar dependências. O protótipo possui gestão, simulador, ficha do carro, manutenção, motorista, contrato, financeiro, lojinha e prévia mobile. Na lojinha, registre uma venda no app e confira a mudança do estoque na gestão; os movimentos fictícios duram apenas a sessão aberta.

## Ler o plano

- [PRD: produto e critérios de aceite](docs/PRD.md)
- [Simulador e regras financeiras](docs/SIMULADOR.md)
- [O que aproveitar do sistema antigo](docs/AUDITORIA-LEGADO.md)
- [Plano de execução e lançamento](docs/PLANO-DE-EXECUCAO.md)
- [Arquitetura proposta](docs/ARQUITETURA.md)
- [Desenho de navegação e interface](docs/DESIGN.md)
- [Referências pesquisadas](docs/REFERENCIAS.md)
- [Decisões e perguntas em aberto](docs/DECISOES.md)

## Validar

```sh
npm run check
```

Testes determinísticos do motor cobrem calendário, dívida, caixa, depreciação, estoque econômico, tributos simplificados, equilíbrio e limites de entrada. O pipeline também verifica que os arquivos gerados estão atualizados. Os testes não certificam viabilidade de um investimento real.

## Fonte e sincronização

Edição local nesta pasta. Repositório: [carlaobh20/RODAVOLT](https://github.com/carlaobh20/RODAVOLT). Desenvolvimento em `dev`; referência inicial em `main`. Commit e push após validação fazem parte do fluxo autorizado. Publicação da aplicação será uma etapa posterior.

Fontes do protótipo em `prototype/shell.html`, `prototype/style.css`, `prototype/app.js` e `src/simulator.js`. `npm run build` gera `index.html` e `prototype/preview.html`; não editar os gerados à mão.

Referência legada fornecida: `Downloads/RodaVolt-System-main`. Inspeção de planejamento e amostras de código, sem migração de dados ou alterações no sistema antigo. Data do planejamento: **17/10/2026**, calendário do usuário.
