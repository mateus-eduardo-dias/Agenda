import db from '../config/db.js'

export async function createClient() {
    return await db.connect()
}

export async function findRefreshToken(client, token) {
    client.query('SELECT * FROM tokens WHERE token = $1', [token], (err, res) => {
        // TODO: Complete here
    });
}

export async function createUser(client, email, password) {
    try {
        const r = await client.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, password]);
        return {status: true, row: r.rows[0]}
    } catch (err) {
        if (err.code == "23505") {
            return {status: false, expected: true, error: 'Email already exists'}
        }
        return {status: false, expected: false, error: `Unexpected error - DB-C-${err.code}`}
    }
}

export async function storeRefreshToken(client, token, uid, expire_at) {
    try {
        const r = await client.query("INSERT INTO tokens (token, user_id, expire_at) VALUES ($1, $2, $3) RETURNING *", [token, uid, expire_at]);
        return {status: true, row: r.rows[0]}
    } catch (err) {
        if (err.code == "23505") {
            return {status: false, expected: true}
        }
        return {status: false, expected: false, error: `Unexpected error - DB-CRT-${err.code}`}
    }
}