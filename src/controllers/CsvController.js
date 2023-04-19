import fs from 'fs';


class CsvController {
    static createCSV(data, url, initialDate, finalDate) {
        // Gerando o nome do arquivo
        let fileName = '';
        let filePath = '';
        if (url.includes('cestaMensal')) {
            fileName = `${Date.now()}_${'RelatorioCestaMensal'}_${initialDate}_${finalDate}.csv`;
            filePath = 'extractions/CESTA_MENSAL';
        } else if (url.includes('cestaNatal')) {
            fileName = `${Date.now()}_${'RelatorioCestaNatal'}_${initialDate}_${finalDate}.csv`;
            filePath = 'extractions/CESTA_NATAL';
        }

        if (data[0]) {
            let columnNames = '';
            for (let elem of data[0]) {
                columnNames += elem.metadata.colName + ';';
            }
            columnNames += '\n';

            fs.appendFileSync(`./${filePath}/${fileName}`, columnNames, {encoding: 'latin1'}, (err) => {
                if (err) fileName = '';
            });
    
            let text = '';
            for (let row of data) {
                for (let i = 0; i < row.length; i++) {
                    text += row[i].value;
                    if (i === (row.length - 1)) {
                        text += '\n';
                    } else {
                        text += ';';
                    }
                }
            }
            fs.appendFileSync(`./${filePath}/${fileName}`, text, {encoding: 'latin1'}, (err) => {
                if (err) fileName = '';
            });
        } else {
            fileName = '';
        }
        return fileName;
    }
}

export default CsvController;