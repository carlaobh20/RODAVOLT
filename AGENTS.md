# Trabalho na RODAVOLT

- Esta é a nova plataforma: `https://github.com/carlaobh20/RODAVOLT.git`. Não confundir com `RodaVolt-System` nem editar a referência em Downloads.
- O usuário autorizou edição local, commits e sincronização ao GitHub. Trabalhar em `dev`, preservar mudanças existentes, conferir remoto e diff antes de push. Nunca usar force push ou reset destrutivo. Não inferir autorização para deploy ou promoção de produção.
- Entrega atual: planejamento e protótipo. Ler `README.md`, `docs/DECISOES.md` e o PRD antes de ampliar escopo. Distinguir requisitos confirmados de sugestões e dados demonstrativos.
- Node 22. Não há dependências nesta fase. `npm run check` antes de commit. Editar fontes; regenerar `index.html` e `prototype/preview.html` com `npm run build`.
- Fórmulas vivem em `src/simulator.js`; telas não duplicam o motor. Testar diferenças entre caixa, resultado e patrimônio.
- Dados do protótipo são fictícios. Não apresentar estoque, cobranças ou contratos como produção. Não guardar documentos pessoais em localStorage.
- A implementação operacional futura terá permissões no banco e separação por motorista. Não conectar ao banco antigo nem aplicar migrations remotas como parte do protótipo.
- Não versionar chaves, `.env`, documentos pessoais, dependências ou capturas temporárias de teste.
