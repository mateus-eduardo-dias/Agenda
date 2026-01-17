import { checkAuthInput, generateRefreshToken, generateAccessToken, encryptValue, hashPassword } from '../utils/auth.util.js'
import { createClient, createUser, storeRefreshToken } from '../services/auth.service.js';

export async function register(req, res) {
    // Validação de input
    const inputValidation = checkAuthInput(req.body, true);
    if (!inputValidation.valid) {
        res.status(400).send({errors: inputValidation.errors});
        return;
    }

    const body_trim = inputValidation.body

    // Verificar existência do usuário

    const con = await createClient();
    if (!con.status) {
        res.status(500).send({errors:[`Failed to connect with the database - CON-${con.error}`]})
        return;
    }
    const client = con.client;

    const email_enc = encryptValue(body_trim.email);
    if (!email_enc.status) {
        client.release()
        res.status(500).send({errors:[email_enc.error]})
        return;
    }
    const fname_enc = encryptValue(body_trim.firstName);
    if (!fname_enc.status) {
        client.release()
        res.status(500).send({errors:[fname_enc.error]})
        return;
    }
    const lname_enc = encryptValue(body_trim.lastName);
    if (!lname_enc.status) {
        client.release()
        res.status(500).send({errors:[lname_enc.error]})
        return;
    }

    const pass_enc = await hashPassword(req.body.password)
    if (!pass_enc.status) {
        client.release()
        res.status(500).send({errors:[`Failed to authenticate - HP-${pass_enc.error}`]})
        return;
    }
    
    const user = await createUser(client, fname_enc.encrypted, lname_enc.encrypted, email_enc.encrypted, pass_enc.hash)
    if (!user.status) {
        const scode = user.expected ? 409 : 500;
        client.release()
        res.status(scode).send({errors: [user.error]});
        return;
    }

    // Gerar tokens e resposta

    const now_seconds = Date.now() / 1000
    const refTknExp = now_seconds + 2592000
    const accTknExp = now_seconds + 600

    console.log(user.row.id)
    console.log(body_trim.email)
    const accessToken = generateAccessToken(user.row.id, body_trim.email, accTknExp);
    if (!accessToken.status) {
        console.log(accessToken.error)
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
    date.setTime(refTknExp * 1000)
    res.cookie('refreshToken', refreshToken, {signed: true, sameSite:'strict', httpOnly:true, expires: date, secure: process.env.NODE_ENV == 'production' ? true : false});
    res.cookie('uid', user.row.id, {sameSite:'strict', expires: date})
    res.cookie('fname', body_trim.firstName, {sameSite:'strict', expires: date})
    res.cookie('lname', body_trim.lastName, {sameSite:'strict', expires: date})
    res.cookie('email', body_trim.email, {sameSite:'strict', expires: date})
    date.setTime(accTknExp * 1000)
    res.cookie('accessToken', accessToken.token, {signed: true, sameSite:'strict', httpOnly:true, expires: date, secure: process.env.NODE_ENV == 'production' ? true : false});
    res.status(201).end()
}