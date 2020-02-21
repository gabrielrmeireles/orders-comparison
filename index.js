const keyColumns = ['CODIGO PEDIDO', 'CODIGO PEDIDO INDUSTRIAL'];
const valueColumns = ['ETAPA', 'STATUS'];
const fs = require('fs');

const main = () => {
    const filename1 = process.argv[2];
    const filename2 = process.argv[3];
    const jsonOutput = compareOrdersCsvs(filename1, filename2);
    writeOutputsToCsv(jsonOutput);
}

const compareOrdersCsvs = (filename1, filename2) => {
    return getJsonOutput(filename1, filename2);
};

const writeOutputsToCsv = (jsonOutput) => {
    const { equalOrdersList, differentOrdersJson, ordersNotIncludedJson } = jsonOutput;
    writeEqualOrdersListToCsv(equalOrdersList);
    writeDifferentOrdersToCsv(differentOrdersJson);
    writeOrdesNotIncludedToCsv(ordersNotIncludedJson);
    writeResumeToCsv(equalOrdersList, differentOrdersJson, ordersNotIncludedJson);
};

const writeEqualOrdersListToCsv = (equalOrdersList) => {
    let csv = 'Pedido,Pedido Industrial\n';
    equalOrdersList.forEach(order => {
        csv += order + '\n';
    });
    fs.writeFileSync('output/equalOrders.csv', csv, 'utf8');
};

const writeDifferentOrdersToCsv = (differentOrdersJson) => {
    let csv = 'Pedido,Pedido Industrial,Etapa em 1,Status em 1,Etapa em 2,Status em 2\n';
    Object.keys(differentOrdersJson).forEach(order => {
        let line = `${order},${differentOrdersJson[order]}`;
        line = line.slice(0, -1);
        csv += line + '\n';

    });
    fs.writeFileSync('output/differentOrders.csv', csv, 'utf8');
};

const writeOrdesNotIncludedToCsv = (ordersNotIncludedJson) => {
    let csv = 'Pedido,Pedido Industrial,Etapa,Status\n';
    Object.keys(ordersNotIncludedJson).forEach(order => {
        let line = `${order},${ordersNotIncludedJson[order]}`
        line = line.slice(0, -1);
        csv += line + '\n';
    });
    fs.writeFileSync('output/ordersNotIncluded.csv', csv, 'utf8');
};

const writeResumeToCsv = (equalOrdersList, differentOrdersJson, ordersNotIncludedJson) => {
    const totalEqual = equalOrdersList.length;
    const totalDifferent = Object.keys(differentOrdersJson).length;
    const totalNotIncluded = Object.keys(ordersNotIncludedJson).length;
    const total = totalEqual + totalDifferent + totalNotIncluded;
    const percentEqual = totalEqual / total;
    const percentDifferent = totalDifferent / total;
    const percentNotIncluded = totalNotIncluded / total;
    const percentWrong = percentDifferent + percentNotIncluded;
    const csv = `total em 1,${total}\n% iguais,${percentEqual}\n% diferentes,${percentDifferent}\n% estao em 1 e nao estao em 2,${percentNotIncluded}\n% total errados,${percentWrong}`;
    fs.writeFileSync('output/resume.csv', csv, 'utf8');
};

const getJsonOutput = (filename1, filename2) => {
    const equalOrdersList = [];
    const differentOrdersJson = {};
    const ordersNotIncludedJson = {};
    const ordersJson1 = getOrdersJsonFromCsvFile(filename1);
    const ordersJson2 = getOrdersJsonFromCsvFile(filename2);
    
    Object.keys(ordersJson1).forEach(orderId1 => {
        const orderJson1Value = ordersJson1[orderId1];
        const orderJson2Value = ordersJson2[orderId1];

        if (!orderJson2Value) {
            ordersNotIncludedJson[orderId1] = orderJson1Value;
        } else if (JSON.stringify(orderJson1Value) !== JSON.stringify(orderJson2Value)) {
            differentOrdersJson[orderId1] = `${orderJson1Value}${orderJson2Value}`;
        } else {
            equalOrdersList.push(orderId1);
        }
    });
    return { equalOrdersList, differentOrdersJson, ordersNotIncludedJson};
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
        const key = `${line[columnsIndexes['CODIGO PEDIDO']]},${line[columnsIndexes['CODIGO PEDIDO INDUSTRIAL']]}`;
        let value = '';
        
        valueColumns.forEach(columnName => {
            value += `${line[columnsIndexes[columnName]]},`;
        });
        ordersJson[key] = value;
    });
    return ordersJson;
};

main();