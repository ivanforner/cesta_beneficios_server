import FileController from './FileController.js';
import { getUploadQuery } from '../config/uploadQueryConfig.js';
import DatabaseController from './DatabaseController.js';


class UploadController {
    static saveCSVTable = async (req, res) => {

        if (req.file) {

            // Obtém o CSV
            const dataInfo = await FileController.getData(req.file);

            // Se não tiver colunas inválidas...
            if (dataInfo.invalidColumnNames.length === 0) {
                // Obtém a as informações da tabela
                const table = getUploadQuery();

                // Salva as informações no banco
                const saveTableInfo = await DataBaseController.saveTable(table, dataInfo.data, req.file);
                
                // Envia a resposta para o Front-end
                if (saveTableInfo === 'ESOCKET') {
                    res
                    .status(500)
                    .send({
                        message: 'Verifique se está conectado à VPN',
                        error: 'ERRO: NÃO FOI POSSÍVEL ESTABELECER A CONEXÃO COM O BANCO DE DADOS',
                        status: 500,
                    }); 
                } else if (saveTableInfo === 'EBLOAD') {
                    res
                    .status(500)
                    .send({
                        message: 'Erro na inserção dos dados',
                        error: 'ERRO: NÃO FOI POSSÍVEL INSERIR OS DADOS',
                        status: 500,
                    }); 
                } else if (saveTableInfo === 'EREQUEST') {
                    res
                    .status(500)
                    .send({
                        message: 'Erro de execução da procedure',
                        error: 'ERRO: NÃO FOI POSSÍVEL EXECUTAR A PROCEDURE',
                        status: 500,
                    }); 
                } else if (saveTableInfo.status === 200) {
                    res
                    .status(200)
                    .send({
                        fileName: saveTableInfo.fileName,
                        message: saveTableInfo.message,
                        error: null,
                        status: saveTableInfo.status,
                    });
                }
            } else {
                res.status(400).send({
                    message: 'Verifique os nomes das colunas',
                    error: 'ERRO: EXISTEM COLUNAS INVÁLIDAS NO ARQUIVO',
                    correctColumns: dataInfo.correctColumnNames,
                    invalidColumns: dataInfo.invalidColumnNames,
                    status:400
                });
            }
        } else {
            res.status(400).send(
                {
                    message: "Verifique a extensão do arquivo",
                    error: "ERRO: NÃO FOI POSSÍVEL PROCESSAR O ARQUIVO",
                    status: 400
                }
            );
        }           
    }
}

export default UploadController;