# orders-comparison

Instruções para executar:
`
node index.js <pedido_csv_1> <pedido_csv_2>
`

Ao executar vai gerar 4 csvs na pasta output:
* equalOrders.csv possui os pedidos iguais;
* differentOrders.csv possui os pedidos diferentes;
* ordersNotIncluded.csv possui os pedidos que estão em 1 e não estão em 2;
* resume.csv possui um resumo com o percentual de pedidos certos e errados.

Sugiro utilizar uma ferramenta local para executar o script.
Ex.: https://github.com/WelliSolutions/HugeJsonViewer
