import DatabaseController from "./DatabaseController.js";
import  jwt  from "jsonwebtoken";
import {} from 'dotenv/config'

class AuthController {

    static authenticate = async (req, res) => {

        const login = req.body.login;
        const password = req.body.password;
        const query = `exec dbo.usp_ex_sdr_autenticacao_cesta_geral_tst @usuario = '${login}', @senha = '${password}'`;
        const result = await DatabaseController.getResult(query);
        const token = jwt.sign({ login }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION })

        console.log(result)
        let statusCode = 200
        if (Number(result[0].retorno_autenticacao) !== 1) {
            statusCode = 400;
            return res.status(statusCode).json({
                ...result[0]
            });
        }
        res.status(statusCode).json({
            ...result[0],
            token
        });
    }

}
export default AuthController;