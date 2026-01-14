import authServices from '../services/auth.services.js'

export async function verifyAuth(req, res, next) {
    const {refreshToken} = req.signedCookies;
    if (!refreshToken || refreshToken.length != 86) {
        res.status(401).end();
        return;
    }

    const client = await authServices.createClient();
    const request = await authServices.findRefreshToken(client);
}