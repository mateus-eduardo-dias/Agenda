import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../config/env.js'

// Login/Register Utils
export function checkAuthInput(body, isRegister) {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let errors = []
    if (typeof body != 'object' || !body)
        return {valid: false, errors: ['Request is invalid, try again later']};
    if (typeof body.email != 'string' || body.email.length > 320 || !emailRegEx.test(body.email))
        errors.push('Email is invalid');
    if (typeof body.password != 'string' || body.password.length > 72 || Buffer.byteLength(body.password, 'utf8') > 72)
        errors.push('Password is too big (more than 72 bytes)');
    if (body.password.length < 8) 
        errors.push('Password should have at least 8 characters')

    if ((typeof body.cpassword != 'string' || body.cpassword.length > 72) && isRegister)
        errors.push('Confirmation Password is too big (more than 72 bytes)');
    if ((body.password != body.cpassword) && isRegister)
        errors.push('Passwords are different')
    if (errors.length > 0) {
        return {valid: false, errors}
    }
    return {valid: true}
}

export async function hashPassword(password) {
    try {
        return {status: true, hash: await bcrypt.hash(password, 13)};
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