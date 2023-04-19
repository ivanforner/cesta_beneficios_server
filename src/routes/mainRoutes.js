import express from 'express';

import UploadController from '../controllers/UploadController.js';
import AuthController from '../controllers/AuthController.js';
import BasketController from '../controllers/BasketController.js';
import ReportController from '../controllers/ReportController.js';
import CompanyNamesController from '../controllers/companyNameController.js';
import upload from '../config/multerConfig.js';
import verifyToken from '../middleware/verifyToken.js';


const mainRoutes = express.Router();

mainRoutes
.get('/', (req, res) => {res.render('index')})
.get('/modelo/beneficiariosCestaNatal', (req, res) => {
    res.download('./modelo/modelo_base_beneficiarios_cesta_natal.csv');
})

.post('/auth', AuthController.authenticate)

/* CESTA DE MENSAL */
.get('/cestaMensal/getReport/:fileName', ReportController.downloadReport)
.get('/cestaMensal/getCompanyNames', CompanyNamesController.getCompanyNames)
.post('/cestaMensal/getReport', ReportController.getReport)
.post('/cestaMensal/getQtd', BasketController.getAmountBaskets)
.post('/cestaMensal/removeQtd', BasketController.removeBaskets)

/* CESTA DE NATAL */
.get('/cestaNatal/getReport/:fileName', ReportController.downloadReport)
.get('/getCompanyNames', CompanyNamesController.getCompanyNames)
.post('/cestaNatal/getReport', ReportController.getReport)
.post('/cestaNatal/upload', upload, UploadController.saveCSVTable)
.post('/cestaNatal/getQtd', BasketController.getAmountBaskets)
.post('/cestaNatal/removeQtd', BasketController.removeBaskets)

export default mainRoutes;