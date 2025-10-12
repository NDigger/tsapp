const { getUserByToken } = require('./user');
const { query } = require('../dbmodel');

// Creates user location and returns it
const createUserLocation = async userId => {
    const location = await query('INSERT INTO locations(user_id) VALUES($1) RETURNING *',
        [userId]
    );
    return location.rows[0];
}

// Updates existing user location and return it
const updateUserLocation = async req => {
    const { street, place, psc } = req.body;
    const user = await getUserByToken(req.cookies.token);
    const location = await query('UPDATE locations SET street=$2, place=$3, psc=$4 WHERE user_id=$1 RETURNING *',
        [user.id, street, place, psc]
    );
    return location.rows[0];
}

const getUserLocation = async req => {
    const user = await getUserByToken(req.cookies.token);
    const location = await query('SELECT * FROM locations WHERE user_id=$1', [user.id]);
    return location.rows[0];
}

module.exports = { createUserLocation, updateUserLocation, getUserLocation };