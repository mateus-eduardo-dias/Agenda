import express from 'express'
import router from './routes/index.js'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express();
app.use(cors({origin: true}));
app.use(cookieParser('Agenda'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

app.use('/api/v1', router);

const dist = join(dirname(dirname(dirname(fileURLToPath(import.meta.url)))), 'frontend', 'dist');

app.use(express.static(dist));
app.get('*reactRoute', (req,res) => res.sendFile(join(dist, 'index.html')));

export default app;