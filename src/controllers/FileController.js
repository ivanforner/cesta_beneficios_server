import fs from 'fs';
import path from 'path';
import { parse } from 'csv';
import languageEncoding from "detect-file-encoding-and-language";
import getColumns from '../config/fileColumnsConfig.js'


class FileController {
    static async getData(file) {

        // Identificando o Encoding do arquivo
        const fileInfo = await languageEncoding(file.path);
        const encoding = fileInfo.encoding === 'UTF-8' ? 'utf8' : 'latin1';
        //console.log(`\nLendo o arquivo [${file.filename}], encoding [${encoding}]`);

        // Lendo o arquivo
        const csvFile = await getCSV(file.path, encoding);

        //Valida o nome das colunas
        const columns = validateColumnNames(csvFile[0], file.destination);

        let dataInfo = {
            data: [],
            correctColumnNames: columns.columnNames,
            invalidColumnNames: columns.invalidColumnNames
        };

        if (dataInfo.invalidColumnNames.length === 0) {
            // Valida se todos os valores de uma linha estão vazios
            for (let i = 0; i < csvFile.length; i++) {
                let empty = Object.values(csvFile[i]).every(elem => elem === '');
                if (!empty) {
                    dataInfo.data.push(csvFile[i]);
                }
            }

            dataInfo.data = changeColumnNames(dataInfo.data, file.destination);
        }
        return dataInfo;
    }
}

function getCSV(filePath, encoding) {

    const options = {
        delimiter: ';',
        relax_quotes: true,

        columns: (headers) => {
            let columns = headers.filter( header => header.length > 0);
            columns = columns.map(name => String(name).toLowerCase().trim());
            return columns;
        },

        relax_column_count: true,
        encoding: encoding,
    }
    
    const data = new Promise((resolve, reject) => {
        let dataArray = [];
        fs
        .createReadStream(`${path.resolve('./')}\\${filePath}`)
        .pipe(parse(options))
        .on('data', (row) => {
            dataArray.push(row);
        })
        .on('end', () => {
            resolve(dataArray);
        })
        .on('error', (err) => {
            console.log(err);
            //reject(err);
        })
    })
    return data;
}

function validateColumnNames(row, fileStorage) {
    // Inicializando as variáveis de resposta
    let invalidColumnNames = [];
    
    // Obtendo as colunas corretas
    const columns = getColumns();
    const columnNames = columns.map(elem => elem.columnName);

    // Obtendo as colunas do arquivo de upload
    const fileColumns = Object.keys(row);
    
    if (columnNames.length === fileColumns.length) {
        for (let fileColumnName of fileColumns) {
            let isValid = false;
            for (let columnName of columnNames) {
                if (fileColumnName === columnName) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) invalidColumnNames.push(fileColumnName);
        }
    } else {
        let largerList =  [];
        let smallerList = [];

        if (columnNames.length > fileColumns.length) {
            largerList = columnNames;
            smallerList = fileColumns;
        } else {
            largerList = fileColumns;
            smallerList = columnNames;
        }

        for (let name of largerList) {
            if (!smallerList.includes(name)) invalidColumnNames.push(name);
        }
    }
    
    return {
        columnNames: columnNames,
        invalidColumnNames: invalidColumnNames
    }
}

function changeColumnNames(data, fileStorage) {
    const columns = getColumns();
    let newData = [];
    for (let row of data) {
        let newRow = {};
        for (let column of columns) {
            let elem = row[column.columnName];
            
            // Se o elemento não é nulo...
            if (elem) {
                
                // Removendo os espaços desnecessários
                elem = elem.trim();

                // Verifica se o elemento tem formatação especial do excel
                const regex = /="(.*)"/g;
                if (elem.match(regex)) {
                    elem = elem.replaceAll('"', '');
                    elem = elem.replace('=', '');
                }

                // Verifica se o elemento tem aspas simples
                if (elem.includes("'")) {
                    elem = elem.replaceAll("'", '');
                }
            }
            
            newRow[column.dbColumnName] = elem;
        }
        newData.push(newRow);
    }
    return newData;
}

export default FileController;