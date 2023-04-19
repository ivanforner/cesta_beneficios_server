import CsvController from "./CsvController.js";
import DatabaseController from "./DatabaseController.js";


class ReportController {
    static getReport = async (req, res) => {
        const initialDate = req.body.initialDate;
        const finalDate = req.body.finalDate;

        let query = '';

        if (req.url.includes('cestaMensal')) {
            query = `
                Exec senior.usp_ex_sdr_relatorio_cesta_mensal_tst   @dt_ini = '${initialDate}'
                ,   @dt_fim = '${finalDate}'
            `;  
        } else if (req.url.includes('cestaNatal')) {
            query = `
                Exec senior.usp_ex_sdr_relatorio_cesta_natal_tst    @dt_ini = '${initialDate}'
                ,   @dt_fim = '${finalDate}'
            `;
        }

        const data = await DatabaseController.getData(query);
        
        const fileName = CsvController.createCSV(data, req.url, initialDate, finalDate);

        let statusCode = 200;
        if (fileName === '') {
            statusCode = 400;
        }

        res.status(statusCode).json({
            fileName : fileName
        })
    }

    static downloadReport = async (req, res) => {
        const fileName = req.params.fileName;

        let filePath = '';
        if (req.url.includes('cestaMensal')) {
            filePath = './extractions/CESTA_MENSAL';
        } else if (req.url.includes('cestaNatal')) {
            filePath = './extractions/CESTA_NATAL';
        } else {
            filePath = '';
        }

        res.download(`${filePath}/${fileName}`, (err) => {
            if (err) {
                console.log(err.message);
                res.status(err.statusCode).send({message:'Arquivo não encontrado'})
            }
        });
    }
}

export default ReportController;