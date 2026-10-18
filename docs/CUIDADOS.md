# Cuidados recorrentes e prazos da oficina

O módulo `src/maintenance.js` organiza planos explícitos por carro. Não cria periodicidade padrão nem transforma estimativa em gasto. `prototype/maintenance.js` oferece os controles na gestão e uma projeção simples para o motorista; `tests/maintenance.test.mjs` verifica as regras.

## Configurar o plano

Informe o serviço, intervalo em km, intervalo em dias ou ambos, data e km do último cuidado, antecedência do aviso em km e origem das condições. O custo estimado é opcional. Os valores são escolhidos pela gestão conforme o veículo e a orientação profissional, sem inventar indicação mecânica. Havendo dois critérios, o que chegar primeiro demanda atenção. Vários planos podem coexistir no mesmo carro; óleo, pneus e outros cuidados mantêm seus próprios intervalos.

A próxima data usa dias corridos desde o último cuidado confirmado. O próximo km usa o hodômetro daquele cuidado. Um prazo vencido ou km atingido permanece pendente até existir serviço concluído. Um aviso de proximidade por km aparece como planejamento, sem prometer que o carro alcançará a quilometragem numa data determinada.

Ao configurar planos, a referência fictícia antiga de próximo km cede lugar ao menor km dos planos ativos. Um plano somente por data não recebe intervalo em km por inferência. Pausar não conclui serviço; retomar preserva as condições escolhidas. Mudanças ficam versionadas. Uma ordem aberta precisa ser concluída antes de alterar ou pausar seu plano, para preservar a regra vinculada.

## Abrir e concluir a ordem

Abra a manutenção com veículo, serviço, prazo e combinado da oficina. O carro fica indisponível, mas não há despesa até confirmar o custo efetivo. Uma ordem pode ser vinculada a um plano recorrente ou ser um serviço avulso. O prazo aparece na agenda; concluir um lembrete não baixa custo ou atualiza intervalo.

Na conclusão, registre data efetiva, km e custo. O motor valida a data, o hodômetro e a versão vinculada antes do lançamento financeiro. O custo é registrado uma vez; `recordCompleted` apenas guarda histórico e atualiza o próximo cuidado do plano vinculado. Serviço avulso não reinicia todos os cuidados do carro. Repetir uma conclusão não duplica custo, histórico ou avanço dos intervalos.

O motorista vê somente os próximos cuidados de seu carro ativo, datas, km e sinal de atenção. Não recebe o custo estimado ou o parecer interno da gestão. As informações continuam demonstrativas até a homologação operacional; nenhum fornecedor de oficina é acionado pelo protótipo.
