const { query } = require('../dbmodel');
const crypto = require('crypto');

// Definition of user roles. 
UserRole = {
    PURCHASER: 0,
    SELLER: 1,
    MODERATOR: 2,
}

// Creates and returns a new user object
const createUser = async req => {
    const { firstName, lastName, email, password } = req.body;
    const res = await query(
      'INSERT INTO users(first_name, last_name, email, password) VALUES($1,$2,$3,$4) RETURNING *', 
      [firstName, lastName, email, password]
    );
    return res.rows[0];
}

// Returns user if token is valid
const getUserByToken = async token => {
    const result = await query(
        'SELECT * FROM sessions WHERE token=$1', [token]
    );
    if (!result.rows[0]) return undefined
    const user = await query(
        'SELECT * FROM users WHERE id=$1', [result.rows[0].user_id]
    );
    return user.rows[0];
}

const getUserById = async id => {
    const user = await query(
        'SELECT * FROM users WHERE id=$1', [id]
    );
    return user.rows[0];
}

const updateUser = async req => {
    await query('UPDATE users SET role=$1 WHERE id=$2', [req.body.role, req.params.id])
}

const deleteUserById = async userId => {
    await query('DELETE FROM sessions WHERE user_id=$1', [userId])
    await query('DELETE FROM users WHERE id=$1', [userId])
}

// Returns user if login has validated
const tryUserLogin = async req => {
    const { email, password } = req.query;
    const user = await query(
        'SELECT * FROM users WHERE email=$1 AND password=$2', [email, password]
    );
    return user.rows[0];
}

// Creates a session and returns session token.
const createSession = async userId => {
    const token = crypto.randomBytes(32).toString('hex');
    await query('INSERT INTO sessions(user_id, token) VALUES($1,$2)', [userId, token])
    return token;
}

const updateUserPassword = async (userId, newPassword) => {
    console.log(userId, newPassword)
    const user = await query('UPDATE users SET password=$1 WHERE id=$2 RETURNING *', [newPassword, userId])
    console.log(user.rows[0])
}

// Writes a token into a cookie.
// 60 days token storage
const cookieToken = (res, token) => {
    res.cookie("token", token, {
        // sameSite: "none",
        // secure: false,
        maxAge: 24*60*60*60*1000
    });
}

module.exports = { UserRole, updateUserPassword, deleteUserById, createUser, updateUser, getUserByToken, tryUserLogin, createSession, cookieToken, getUserById }