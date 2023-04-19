import express from 'express';
import cors from 'cors';

import mainRoutes from './mainRoutes.js';


const routes = (app) => {
    app.use(
        cors(),
        express.json(),
        mainRoutes,
    )
};

export default routes;