import express from 'express';
import routes from './routes/index.js';


const app = express();
app.set('view engine', 'ejs');
routes(app);

export default app;