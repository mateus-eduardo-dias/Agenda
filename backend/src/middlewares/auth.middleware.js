import {createClient, findRefreshToken} from '../services/auth.service.js'

export async function verifyAuth(req, res, next) {
    const {refreshToken} = req.signedCookies;
    if (!refreshToken || refreshToken.length != 86) {
        res.status(401).end();
        return;
    }

    const client = await createClient();
    const request = await findRefreshToken(client);
}