import express, { ErrorRequestHandler, Request, Response } from 'express';
import { limiter } from './config/Limiter' 
import cors from 'cors';
import helmet from 'helmet';
import { sessionConfig } from './config/Session';
import Auth from './routes/Auth'
import { Model } from 'sequelize';
import path from 'path'
import { corsOptions } from './config/cors';
import { MulterError } from 'multer';
import PatternResponses from './utils/PatternResponses';
import { syncDatabases } from './config/sync';
import Clients from './routes/Clients'
import { errorHandler } from './config/ErrorHandler';
import Configs  from './routes/Configs';
import OrderItems from './routes/OrderItems';
import  OrderPayments from './routes/OrderPayments';
import  Orders from './routes/Orders';
import  PlanPayments from './routes/PlanPayments';
import  Plans from './routes/Plans';
import  Products from './routes/Products';
import Users from './routes/Users';

if(process.env.ENV == 'HOMOLOG'){
    syncDatabases()
}

const app = express();

app.use(express.static(path.join(__dirname, '../public')))

app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(sessionConfig);

app.use(express.json())

app.use('/auth', Auth);
app.use('/clients', Clients);
app.use('/configs', Configs)
app.use('/orderItems', OrderItems)
app.use('/orderPayments', OrderPayments)
app.use('/orders', Orders)
app.use('/planPayments', PlanPayments)
app.use('/plans', Plans)
app.use('/products', Products)
app.use('/users', Users)


app.use((req: Request, res: Response)=>{
    res.status(404)
    return PatternResponses.createError('notFound')
})

app.use(errorHandler)

export default app
