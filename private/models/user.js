const { query } = require('../dbmodel');
const crypto = require('crypto');

// Definition of user roles. 
// UserRole = {
//     PURCHASER: 0,
//     SELLER: 1,
//     MODERATOR: 2,
// }

class User {
    // Creates and returns a new user object
    static async create({ firstName, lastName, email, password }) {
        const res = await query(
        'INSERT INTO users(first_name, last_name, email, password) VALUES($1,$2,$3,$4) RETURNING *', 
            [firstName, lastName, email, password]
        );
        return new User(User.dbToJsObj(res.rows[0]));
    }

    static async getById(id) {
        const user = await query(
            'SELECT * FROM users WHERE id=$1', [id]
        );
        return user.rows[0];
    }

    // Returns user if token is valid
    static async getByToken(token) {
        const result = await query(
            'SELECT * FROM sessions WHERE token=$1', [token]
        );
        if (!result.rows[0]) return undefined
        const user = await query(
            'SELECT * FROM users WHERE id=$1', [result.rows[0].user_id]
        );
        return user.rows[0];
    }

    constructor(obj) {
        for (const [key, value] of Object.entries(obj)) this[key] = value;
    }

    static dbToJsObj(userData) {
        return {
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: userData.role,

            email: userData.email,
            password: userData.password,
        }
    }

    static async fromToken(token) {
        const userData = await User.getByToken(token);
        if (userData === undefined) return undefined;
        return new User(User.dbToJsObj(userData));
    }

    static async fromId(userId) {
        const userData = await User.getById(userId);
        if (userData === undefined) return undefined;
        return new User(User.dbToJsObj(userData));
    }

    // Returns user if login has validated
    static async fromLogin({email, password}) {
        const dbRes = await query(
            'SELECT * FROM users WHERE email=$1 AND password=$2', [email, password]
        );
        if (dbRes.rows.length === 0) return undefined
        const userData = dbRes.rows[0]
        return new User(User.dbToJsObj(userData));
    }

    async setLocation({street, place, psc}) {
        const location = await query(
            'INSERT INTO locations(user_id, street, place, psc) VALUES($1, $2, $3, $4) ON CONFLICT(user_id) DO UPDATE SET street=EXCLUDED.street, place=EXCLUDED.place, psc=EXCLUDED.psc RETURNING street, place, psc',
            [this.id, street, place, psc]
        );
        return location.rows[0];
    }

    async getLocation() {
        const location = await query('SELECT street, place, psc FROM locations WHERE user_id=$1', [this.id]);
        return location.rows[0];
    }

    static async update(req) {
        await query('UPDATE users SET role=$1 WHERE id=$2', [req.body.role, req.params.id])
    }

    async delete() {
        await query('DELETE FROM sessions WHERE user_id=$1', [this.id])
        await query('DELETE FROM users WHERE id=$1', [this.id])
    }

    static #writeToken(res, token) {
        res.cookie("token", token, {
            // sameSite: "none",
            // secure: false,
            maxAge: 24*60*60*60*1000
        });
    }

    async createSession(res) {
        const token = crypto.randomBytes(32).toString('hex');
        await query('INSERT INTO sessions(user_id, token) VALUES($1,$2)', [this.id, token])
        User.#writeToken(res, token);
    }

    async updatePassword(newPassword) {
        await query('UPDATE users SET password=$1 WHERE id=$2 RETURNING *', [newPassword, this.id])
    }
}

module.exports = User