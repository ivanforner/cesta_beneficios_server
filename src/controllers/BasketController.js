import DatabaseController from "./DatabaseController.js";


class BasketController {
    static getAmountBaskets = async (req, res) => {

        const id = req.body.id ? req.body.id : '';
        const barCode = req.body.barCode ? req.body.barCode : '';
        const companyName = req.body.companyName;
        
        let query = '';
        if (req.url.endsWith('/cestaMensal/getQtd')) {
            query = `
                exec senior.usp_ex_sdr_quant_disponivel_cesta_mensal_tst
                    @pvar_matricula = '${id}'
                ,   @pvar_cod_barras = '${barCode}'
                ,   @pvar_empresa = '${companyName}'
            `;
        } else if (req.url.endsWith('/cestaNatal/getQtd')) {
            query = `
                exec senior.usp_ex_sdr_quant_disponivel_cesta_natal_tst 
                    @pvar_matricula = '${id}'
                ,   @pvar_cod_barras = '${barCode}'
                ,   @pvar_empresa = '${companyName}'
            `;
        }

        console.log(query)
        let result = await DatabaseController.getResult(query);
        const statusCode = this.getStatusCode(result)

        if (statusCode === 400) {
            result.qtd_disponivel = "0";
        } else if (statusCode === 500 || result.length === 0) {
            result = {
                nome_funcionario: "Não Localizado",
                qtd_kit_panetone: "0",
                qtd_kit_crianca: "0",
                qtd_kit_congelado: "0",
                qtd_disponivel: "0"
            }
        }
        res.status(statusCode).json(result);
    }

    static removeBaskets = async (req, res) => {

        const id = req.body.id ? req.body.id : '';
        const barCode = req.body.barCode ? req.body.barCode : '';
        const userType = req.body.user;
        const companyName = req.body.companyName;
        const employeeName = req.body.name1 ? req.body.name1 : req.body.name2;
        const qtd = this.basketValidate(req.body.qtd1 ? req.body.qtd1 : req.body.qtd2);
        const kitPanetoneQtd = this.basketValidate(req.body.kitPanetoneQtd);
        const kitCriancaQtd = req.body.kitCriancaQtd;
        const kitCongeladoQtd = this.basketValidate(req.body.kitCongeladoQtd);
        
        let query = ``;
        if (req.url.endsWith('/cestaMensal/removeQtd')) {
            query = `
                exec senior.usp_ex_sdr_retirar_cesta_mensal_tst
                    @pvar_matricula = '${id}'
                ,   @pvar_cod_barras = '${barCode}'
                ,   @pvar_usuario = '${userType}'
                ,   @pvar_empresa = '${companyName}'
                ,   @pvar_funcionario = '${employeeName}'
                ,   @pvar_quantidade_cesta = ${qtd}
            `;
        } else if (req.url.endsWith('/cestaNatal/removeQtd')) {
            query = `
                exec senior.usp_ex_sdr_retirar_cesta_natal_tst  
                    @pvar_matricula = '${id}'
                ,   @pvar_cod_barras = '${barCode}'
                ,   @pvar_usuario = '${userType}'
                ,   @pvar_empresa = '${companyName}'
                ,   @pvar_qtd_kit_panetone = ${kitPanetoneQtd}
                ,   @pvar_qtd_kit_crianca = ${kitCriancaQtd}
                ,   @pvar_qtd_kit_congelado = ${kitCongeladoQtd}
            `;
        }
        console.log(query)
        let result = await DatabaseController.getResult(query);
        // A resposta sempre vem em formato de lista
        if(result.code) {
            res.status(500).json({
                error:result.code
            });
        } else {
            result = result[0];
            res.status(200).json({
                ...result
            });
        }
    }

    static basketValidate(amountBaskets) {
        let value = Number(amountBaskets);

        if (value && typeof(value) == 'number') {
            if (value > 3 || value < 0) {
                value = 0;
            }
        } else {
            value = 0;
        }
        return value;
    }

    static getStatusCode(result) {
        let statusCode = 200;
        if (result.code === 'EREQUEST') statusCode = 500;
        if (result.length === 0) statusCode = 500;
        if (result.nome_funcionario === 'Não Localizado') statusCode = 400;
        return statusCode;
    }
}

export default BasketController;