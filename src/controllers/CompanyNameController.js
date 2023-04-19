import DatabaseController from "./DatabaseController.js";


class CompanyNamesController {
    static getCompanyNames = async function (req, res) {
        let query = '';
        if (req.url.includes('cestaMensal')) {
            query = 'exec senior.usp_sdr_lista_empresas_benef_mensal_tst';
        } else {
            query = 'Exec senior.usp_sdr_lista_empresas_benef_natal_tst';
        };

        const result = await DatabaseController.getData(query);

        const response = [];
        result.map(function (company) {
            const tempObj = {};
            tempObj[company[0].metadata.colName] = company[0].value;
            response.push(tempObj);
        })
        res.status(200).json(response);
    };
};

export default CompanyNamesController;