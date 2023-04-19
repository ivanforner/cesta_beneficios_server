import { Connection, Request, TYPES } from "tedious";

import dbConfig from "../config/dbConfig.js";
import getColumns from '../config/fileColumnsConfig.js'


class DatabaseController {
    static async getResult(query) {
        const connection = await this.getConnection()
        .catch(function (err) {
            return err;
        });

        const result = await this.execReq(connection, query)
        .catch((err) => {
            return err;
        });
        return result;
    }

    static async getData(query) {
        const connection = await this.getConnection()
        .catch(function (err) {
            return err;
        });

        const data = await this.execReportReq(connection, query)
        .catch((err) => {
            return err;
        });

        return data;
    }

    // Função que estabelece a conexão com o banco
    static getConnection() {
        return new Promise((resolve, reject) => {
            const connection = new Connection(dbConfig);
            connection.connect((err) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    console.log('\nConexão com o banco de dados estabelecida');
                    resolve(connection);
                }
            })
        })
    }

    // Função que realiza a request no banco de dados
    static execReq(connection, query) {
        return new Promise((resolve, reject) => {
            const request = new Request(query, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`Request concluído, os dados foram obtidos`);
                    connection.close();
                    resolve(resultList);
                }
            })

            const minutes = 90;
            request.setTimeout(minutes*60000);

            connection.execSql(request);

            let resultList = []
            request.on('row', function (columns) {
                let result = {};
                columns.map((column) => {
                    result[column.metadata.colName] = String(column.value).trimEnd();
                });
                resultList.push(result);
            });
        })
    }

    // Função que realiza a request no banco de dados e traz os dados do relatório
    static execReportReq(connection, query) {
        return new Promise((resolve, reject) => {
            const request = new Request(query, (err, rowCount, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`Request concluído, as ${rowCount} linhas foram obtidos`);
                    connection.close();
                    resolve(rows);
                }
            })

            const minutes = 90;
            request.setTimeout(minutes*60000);

            connection.execSql(request);
        })
    }

    static async saveTable(table, values, file) {
        const connection = await this.getConnection()
        .catch(function (err) {
            return err;
        });

        // Se Connection tiver erro, retorna essa conexão com o erro
        if (connection.code === 'ESOCKET') return connection.code;

        const reqInfo = await this.execUpReq(connection, table, values, file)
        .catch(function (err) {
            return err;
        });

        return reqInfo;
    }

    static execUpReq(connection, table, values, file) {
        return new Promise((resolve, reject) => {
            const request = new Request(table.createTableQuery, (err) => {
                if (err) {
                    console.log(err)
                    reject(err.code);
                } else {
                    console.log(`Criando a tabela temporária [${table.name}]`);
                    const options = { keepNulls: true };
                    const bulkLoad = connection.newBulkLoad(table.name, options, (err, rowCount) => {
                        if (err) {
                            console.log(err)
                            reject('EBLOAD');
                        } else {
                            console.log(`Linhas inseridas na tabela temporária: ${rowCount}`);
                            let responseObject = {};
                            const procRequest = new Request(table.proc, (err) => {
                                if (err) {
                                    console.log(err)
                                    reject(err.code);
                                } else {
                                    console.log('A procedure foi executada com sucesso');
                                    const successInfo = {
                                        fileName: file.filename,
                                        message: 'PROCESSO FINALIZADO COM SUCESSO',
                                        status: 200,
                                    }
                                    connection.close();
                                    responseObject = {...successInfo, ...responseObject};
                                    resolve(responseObject);
                                }
                            })

                            procRequest.on('row', function (columns) {
                                columns.map(elem => {
                                    responseObject[elem.metadata.colName] = elem.value;
                                })
                            });

                            connection.execSql(procRequest);
                        }                
                    })
                    
                    bulkLoad.setTimeout(100000);

                    const columns = getColumns();
                    for (let column of columns) {
                        bulkLoad.addColumn(column.dbColumnName, TYPES.VarChar, { length: column.dbSize });
                    }
                
                    const rows = values;
                    connection.execBulkLoad(bulkLoad, rows);
                }
            })
            connection.execSql(request);
        })         
    }
}

export default DatabaseController;