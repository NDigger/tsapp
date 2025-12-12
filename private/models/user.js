const { query } = require('../dbmodel');
const crypto = require('crypto');

const { getBase64Image } = require('../models/images');

class User {
    // Creates and returns a new user object
    static async create({ firstName, lastName, email, password }) {
        const res = await query(
        'INSERT INTO users(first_name, last_name, email, password) VALUES($1,$2,$3,$4) RETURNING *', 
            [firstName, lastName, email, password]
        );
        return new this(User.#dbToJsObj(res.rows[0]));
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

    static #dbToJsObj(userData) {
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
        return new this(User.#dbToJsObj(userData));
    }

    static async fromId(userId) {
        const userData = await User.getById(userId);
        if (userData === undefined) return undefined;
        return new this(User.#dbToJsObj(userData));
    }

    // Returns user if login has validated
    static async fromLogin({email, password}) {
        const dbRes = await query(
            'SELECT * FROM users WHERE email=$1 AND password=$2', [email, password]
        );
        if (dbRes.rows.length === 0) return undefined
        const userData = dbRes.rows[0]
        return new this(User.#dbToJsObj(userData));
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

    async setRole(role) {
        await query('UPDATE users SET role=$1 WHERE id=$2', [role, this.id])
    }

    async delete() {
        await query('DELETE FROM sessions WHERE user_id=$1', [this.id])
        await query('DELETE FROM users WHERE id=$1', [this.id])
    }

    static #writeToken(res, token) {
        res.cookie("token", token, {
            sameSite: "lax",
            secure: true,
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

    // Cart methods
    async addCartItem(sizedItemId, quantity) {
        const cartItem = await query(
            'INSERT INTO cart(user_id, item_id, item_quantity) VALUES($1, $2, $3) ON CONFLICT(user_id, item_id) DO UPDATE SET item_quantity=EXCLUDED.item_quantity RETURNING *',
            [this.id, sizedItemId, quantity]
        );
        return cartItem;
    }

    async getCartItems() {
        let cartItems = await query(
            'SELECT cart.*, items.*, item_sizes.*, items.id AS item_id, items.user_id AS seller_id, items.name AS item_name, item_sizes.id AS sized_item_id, item_sizes.name AS item_size, cart.user_id AS user_id FROM cart LEFT JOIN item_sizes ON item_sizes.id=cart.item_id LEFT JOIN items ON items.id=item_sizes.item_id WHERE cart.user_id=$1',
            [this.id]
        )
        cartItems = cartItems.rows;
        for (let item of cartItems) {
            item.imageBase64 = getBase64Image(item.image_path);
        }
        return cartItems
    }

    async removeCartItem(sizedItemId) {
        await query(
            'DELETE FROM cart WHERE user_id=$1 AND item_id=$2', 
            [this.id, sizedItemId]
        );  
    }
}

module.exports = User