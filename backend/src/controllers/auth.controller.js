import { checkAuthInput, generateRefreshToken, generateAccessToken, hashPassword } from '../utils/auth.util.js'
import { createClient, createUser, storeRefreshToken } from '../services/auth.service.js';

export default async function register(req, res) {
    // Validação de input
    const inputValidation = checkAuthInput(req.body);
    if (!inputValidation.valid) {
        res.status(400).send({errors: inputValidation.errors});
        return;
    }

    // Verificar existência do usuário
    let client;
    try {
        client = await createClient();
    } catch (err) {
        res.status(500).send({errors:[`Failed to connect with the database - CON-${err.code}`]})
        return;
    }

    const hashPassword = await hashPassword(req.body.password)
    if (!hashPassword.status) {
        res.status(500).send({errors:[`Failed to authenticate - HP-${hashPassword.error}`]})
        return;
    }
    
    const user = await createUser(client, req.body.email, hashPassword.hash)
    if (!user.status) {
        const scode = user.expected ? 409 : 500;
        res.status(scode).send({errors: [user.error]});
        return;
    }

    // Gerar tokens e resposta

    const now = Date.now()
    const refTknExp = now + 2592000
    const accTknExp = now + 600

    const accessToken = generateAccessToken(user.row.id, user.row.email, accTknExp);
    if (!accessToken.status) {
        res.status(500).send({errors: ['Account created but not authenticated, log in to access your account']})
        return;
    }

    let storeToken;
    let refreshToken;
    do {
        refreshToken = generateRefreshToken();
        storeToken = await storeRefreshToken(client, refreshToken, user.row.id, refTknExp);
        if (!storeToken.status && !storeToken.expected) {
            res.status(500).send({errors: [storeToken.error]})
            return;
        }
    } while (!storeToken.status && storeToken.expected);

    const date = new Date()
    date.setTime(refTknExp)
    res.cookie('refreshToken', refreshToken, {signed: true, sameSite:'strict', httpOnly:true, expires: date.toUTCString()});
    date.setTime(accTknExp)
    res.cookie('accessToken', accessToken.token, {signed: true, sameSite:'strict', httpOnly:true, expires: date.toUTCString()});
    res.cookie('uid', user.row.id, {signed: true, sameSite:'strict', httpOnly:true, expires: date.toUTCString()})
    res.status(201).end()
}