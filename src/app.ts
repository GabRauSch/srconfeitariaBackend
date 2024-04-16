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
import UsersModel from './models/Users';

if(process.env.ENV == 'HOMOLOG'){
    UsersModel.sync()
}

const app = express();

app.use(express.static(path.join(__dirname, '../public')))

app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet());
app.use(sessionConfig);

app.use(express.json())

app.use('/auth', Auth);

app.use((req: Request, res: Response)=>{
    res.status(404)
    return PatternResponses.error.notFound(res, 'route')
})

const errorHandler: ErrorRequestHandler = (err, req, res, next)=>{
    res.status(400);

    if(err instanceof MulterError){
        return res.json({error: err.code})
    }
    return res.json(err)
}
app.use(errorHandler)


export default app

