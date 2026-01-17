import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'

// Login/Register Utils
export function checkAuthInput(body, isRegister) {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let errors = []

    if (typeof body != 'object' || !body || typeof body.email != 'string' || typeof body.firstName != 'string' || typeof body.lastName != 'string' || typeof body.password != 'string' || typeof body.cpassword != 'string')
        return {valid: false, errors: ['Request is invalid, try again later']};

    const body_trim = {
        firstName: body.firstName.trim(),
        lastName: body.firstName.trim(),
        email: body.email.trim(),
    }


    if (body_trim.firstName.length > 64 || body_trim.firstName.length < 2) {
        errors.push('First name should have 2-64 characters')
    }
    if (body_trim.lastName.length > 64 || body_trim.lastName.length < 2) {
        errors.push('Last name should have 2-64 characters')
    }
    if (body_trim.email.length > 320 || !emailRegEx.test(body_trim.email))
        errors.push('Email is invalid');
    if (body.password.length > 72 || Buffer.byteLength(body.password, 'utf8') > 72)
        errors.push('Password is too big');
    if (body.password.length < 8) 
        errors.push('Password should have at least 8 characters')

    if (body.cpassword.length > 72 && isRegister)
        errors.push('Confirmation Password is too big');
    if (body.password != body.cpassword && isRegister)
        errors.push('Passwords are different')
    if (errors.length > 0) {
        return {valid: false, errors}
    }
    return {valid: true, body: body_trim}
}

export async function hashPassword(password) {
    try {
        return {status: true, hash: await bcrypt.hash(password, 12)};
    } catch (err) {
        return {status: false, error: err.message}
    }
}

export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export function generateRefreshToken() {
    return crypto.randomBytes(191).toString('base64url');
}

export function generateAccessToken(uid, email, exp) {
    try {
        const token = jwt.sign({email, exp}, env.PRIVATE_KEY, {algorithm: 'RS256', issuer: 'agenda-server', subject: uid});
        return {status: true, token}
    } catch (err) {
        return {status: false, error: err}
    }
}
export function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, env.PUBLIC_KEY, {algorithms: ['RS256'], issuer: 'agenda-server'})
        return {status: true, decoded}
    } catch (err) {
        return {status: false, error: err}
    }
}

export function encryptValue(value, aad) {
    try {
        const key_version = env.CRYPTO_VERSION
        const key = env[`CRYPTO_KEY_${key_version}`]
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv('aes-128-gcm', Buffer.from(key, 'hex'), iv)
        if (aad != undefined) {
            cipher.setAAD(aad)
        }
        let encryptedVal = cipher.update(value, 'utf8', 'hex')
        encryptedVal += cipher.final('hex')


        const tag = cipher.getAuthTag().toString('hex')

        return {status: true, encrypted: [key_version, iv.toString('hex'), tag, encryptedVal].join('.')}
    } catch (err) {
        return {status: false, error:`Failed to encrypt values EV-${err.message}`}
    }
}

export function decryptValue(encryptedValue, aad) {
    try {
        const parsed = encryptedValue.split('.')
        if (parsed.length != 4) {
            return {status: false, error:'Hash is invalid'}
        }
        const key = env[`CRYPTO_KEY_${parsed[0]}`]
        if (key == undefined) {
            return {status: false, error:'Key is invalid'}
        }

        const decipher = crypto.createDecipheriv('aes-128-gcm', Buffer.from(key, 'hex'), Buffer.from(parsed[1], 'hex'))
        decipher.setAuthTag(Buffer.from(parsed[2], 'hex'))
        if (aad != undefined) {
            decipher.setAAD(aad)
        }

        let value = decipher.update(parsed[3], 'hex', 'utf8')
        value += decipher.final('utf8')

        return {status: true, value}
    } catch (err) {
        return {status: false, error: `Failed to decrypt values DV-${err.message}`}
    }
}