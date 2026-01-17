import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import {dirname, join} from 'path'
import { readFileSync } from 'fs';

const path = join(dirname(dirname(dirname(fileURLToPath(import.meta.url)))), '.env');

function getEnv() {
    try {
        return dotenv.parse(readFileSync(path, 'utf-8'));
    } catch (err) {
        console.error('Failed to load env')
        return {}
    }
}

const env = getEnv();

function reloadEnv() {
    const newEnv = getEnv();
    if (Object.keys(newEnv).length != 0) {
        Object.assign(env, newEnv);
        return true;
    }
    return false;
}

const envProxy = new Proxy({}, {
    get(target, prop) {
        if (prop == 'reloadEnv') {
            return reloadEnv()
        }
        return env[prop]
    }
})

//TODO: Endpoint that updates .env with reloadEnv()

export default envProxy
