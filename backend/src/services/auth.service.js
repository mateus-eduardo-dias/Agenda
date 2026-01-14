import db from '../config/db.js'

export async function createClient() {
    return await db.connect()
}

export async function findRefreshToken(client, token) {
    return await client.query('SELECT * FROM tokens WHERE token = $1', [token]);
}