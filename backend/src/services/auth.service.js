import db from '../config/db.js'

export async function createClient() {
    try {
        return {status: true, client: await db.connect()}
    } catch (err) {
        return {status: false, error: err.code}
    }
    
}

export async function createUser(client, firstName, lastName, email, password) {
    try {
        const r = await client.query("INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [firstName, lastName, email, password]);
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
        const r = await client.query("INSERT INTO tokens (token, user_id, expire_at) VALUES ($1, $2, TO_TIMESTAMP($3)) RETURNING *", [token, uid, expire_at]);
        return {status: true, row: r.rows[0]}
    } catch (err) {
        if (err.code == "23505") {
            return {status: false, expected: true}
        }
        return {status: false, expected: false, error: `Unexpected error - DB-CRT-${err.code}`}
    }
}