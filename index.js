const keyColumns = ['CODIGO PEDIDO', 'CODIGO PEDIDO INDUSTRIAL'];
const valueColumns = ['ETAPA', 'STATUS'];
const fs = require('fs');

const main = () => {
    const filename1 = process.argv[2];
    const filename2 = process.argv[3];
    const comparison = compareOrdersCsvs(filename1, filename2);
    fs.writeFileSync('output.json', comparison, 'utf8');
}

const compareOrdersCsvs = (filename1, filename2) => {
    const equalOrders = [];
    const differentOrders = {};
    const ordersNotIncluded = {};
    const ordersJson1 = getOrdersJsonFromCsvFile(filename1);
    const ordersJson2 = getOrdersJsonFromCsvFile(filename2);
    
    Object.keys(ordersJson2).forEach(orderId2 => {
        const orderJson1Value = ordersJson1[orderId2];
        const orderJson2Value = ordersJson2[orderId2];

        if (!ordersJson1[orderId2]) {
            ordersNotIncluded[orderId2] = ordersJson2[orderId2];
        } else if (JSON.stringify(orderJson1Value) !== JSON.stringify(orderJson2Value)) {
            differentOrders[orderId2] = {
                '1': orderJson1Value,
                '2': orderJson2Value
            }
        } else {
            equalOrders.push(orderId2);
        }
    });
    return JSON.stringify({
        'equalOrders': equalOrders,
        'differentOrders': differentOrders,
        'ordersNotIncluded': ordersNotIncluded
    });
};

const getOrdersJsonFromCsvFile = (filename) => {
    const csv = readFile(filename);
    let lines = csv.split('\n');
    const header = lines[0].split(',');
    lines.shift();
    const columnsIndexes = getColumnsIndexesToCompare(header);
    const ordersJson = getOrdersJson(lines, columnsIndexes);
    return ordersJson;
}

const readFile = (filename) => {
    return fs.readFileSync(filename, 'utf8');
};

const getColumnsIndexesToCompare = (header) => {
    const columns = {};
    const columnsToCompare = keyColumns.concat(valueColumns);

    header.forEach((columnName, index) => {
        if (columnsToCompare.includes(columnName)) {
            columns[columnName] = index;
        }
    });

    return columns;
};

const getOrdersJson = (linesCsv, columnsIndexes) => {
    const ordersJson = {};
    linesCsv.forEach(lineCsv => {
        const line = lineCsv.split(',');
        const key = `${line[columnsIndexes['CODIGO PEDIDO']]}_${line[columnsIndexes['CODIGO PEDIDO INDUSTRIAL']]}`;
        let value = '';
        
        valueColumns.forEach(columnName => {
            value += `${line[columnsIndexes[columnName]]}_`;
        });
        ordersJson[key] = value;
    });
    return ordersJson;
};

main();