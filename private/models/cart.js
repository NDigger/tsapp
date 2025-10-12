const { getUserByToken } = require('./user');
const { query } = require('../dbmodel');

const { getBase64Image } = require('../models/images');

// Cart contains ONLY sized items from item_sizes table.

const addCartItem = async req => {
    const user = await getUserByToken(req.cookies.token);
    const cartItem = await query(
        'INSERT INTO cart(user_id, item_id, item_quantity) VALUES($1, $2, $3) ON CONFLICT(user_id, item_id) DO UPDATE SET item_quantity=EXCLUDED.item_quantity RETURNING *',
        [user.id, req.body.sizedItem.id, req.body.quantity]
    );
    return cartItem;
}

const getCartItems = async req => {
    const user = await getUserByToken(req.cookies.token);
    let cartItems = await query(
        'SELECT cart.*, items.*, item_sizes.*, items.id AS item_id, items.user_id AS seller_id, items.name AS item_name, item_sizes.id AS sized_item_id, item_sizes.name AS item_size, cart.user_id AS user_id FROM cart LEFT JOIN item_sizes ON item_sizes.id=cart.item_id LEFT JOIN items ON items.id=item_sizes.item_id WHERE cart.user_id=$1',
        [user.id]
    )
    cartItems = cartItems.rows;
    for (item of cartItems) {
        item.imageBase64 = getBase64Image(item.image_path);
    }
    return cartItems
}

const removeCartItem = async req => {
    const user = await getUserByToken(req.cookies.token);
    console.log(user.id, req.params.id)
    await query(
        'DELETE FROM cart WHERE user_id=$1 AND item_id=$2', 
        [user.id, req.params.id]
    );  
}

module.exports = { addCartItem, getCartItems, removeCartItem };