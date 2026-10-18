# RODAVOLT · Gestão & Crescimento

Plataforma de locação semanal a motoristas de aplicativo com operação, financeiro rastreável, plano de crescimento, comparação projetado × realizado e app completo do motorista.

## Esta versão

**v2 · planejamento e protótipo reconstruídos.** O simulador recupera os conceitos de crescimento do sistema anterior: capital, aquisições por veículo, reinvestimento, reserva, aportes, amortização, caixa, dívida e patrimônio. Acrescenta versões preservadas do plano, livro demonstrativo, desvios com origens e revisão a partir de fechamento observado.

O app do motorista possui Início, Jornada, Carteira, Loja e Mais, com carro, manutenção, checklist de vistoria, documentos e suporte. Vendas, reposição, comprovante, atendimento e acerto percorrem os respectivos fluxos da gestão.

Há apenas **dados fictícios**. A janela nov/2026–jan/2027 é ilustrativa e prospectiva, não uma operação existente. Não há autenticação, banco, Pix, assinatura, documentos/fotos reais nem integração com Uber/99. Persistência local de demonstração não é segurança operacional.

## Abrir e verificar

Node 22, sem dependências a instalar:

```sh
npm run check
npm run dev
```

Abra `http://127.0.0.1:4173` ou o arquivo `index.html`. As verificações cobrem crescimento, caixa, patrimônio, dívida, reserva, revisão, plano preservado, lançamentos e estoque. A interface é conferida no navegador integrado. O servidor também oferece molduras locais de QA em `/_responsive/320`, `/390`, `/736` e `/1024`.

## Explorar os fluxos

1. Na visão executiva, abrir a origem do caixa ou do patrimônio.
2. No plano, ver crescimento e fluxo anual; editar premissas e recalcular o rascunho; preservar outra versão.
3. Incluir uma despesa no financeiro e comparar; registrar uma aquisição de exemplo na frota; gerar revisão a partir do fechamento.
4. No app, registrar jornada pessoal, venda e comprovante; abrir solicitação/vistoria/suporte.
5. Na gestão, conferir recebimento, entregar reposição e fechar acerto da loja; verificar as mudanças e os eventos.

## Documentação

- [PRD v2](docs/PRD.md)
- [Modelo do simulador, crescimento e revisão](docs/SIMULADOR.md)
- [Mapeamento do legado](docs/AUDITORIA-LEGADO.md)
- [Plano de execução](docs/PLANO-DE-EXECUCAO.md)
- [Arquitetura proposta](docs/ARQUITETURA.md)
- [Desenho e navegação](docs/DESIGN.md)
- [Decisões e hipóteses](docs/DECISOES.md)
- [Validação](docs/VALIDACAO.md)
- [Referências externas pesquisadas](docs/REFERENCIAS.md)

Fontes: `src/growth.js`, `src/control.js`, `prototype/shell.html`, `prototype/style.css`, `prototype/app.js`. `npm run build` gera `index.html` e `prototype/preview.html`. Não editar gerados manualmente. A v1 está preservada no histórico Git; não é a proposta corrente.

Repositório [carlaobh20/RODAVOLT](https://github.com/carlaobh20/RODAVOLT). Edição local e desenvolvimento em `dev`; sincronização após validação. Deploy operacional e infraestrutura são etapas posteriores. Planejamento datado de **17/10/2026**.
