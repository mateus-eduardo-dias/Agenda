import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import {dirname, join} from 'path'

const path = join(dirname(dirname(dirname(fileURLToPath(import.meta.url)))), '.env');

dotenv.config({path});



export default {
    DB_CONNSTR: process.env.DB_CONNSTR,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
}