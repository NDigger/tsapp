const { getUserByToken } = require('./user');
const { query } = require('../dbmodel');

const { getBase64Image } = require('../models/images');

const getSellerItems = async req => {
    const user = await getUserByToken(req.cookies.token);
    let items = await query('SELECT * FROM items WHERE user_id=$1', [user.id]);
    items = items.rows;
    for (let item of items) {
        const itemSizes = await getSellerSizedItems(item.id);
        item.sizes = itemSizes;
        const imageBase64 = getBase64Image(item.image_path);
        if (imageBase64) item.imageBase64 = imageBase64;
    }
    return items;
}

const getSellerSizedItems = async itemId => {
    const items = await query('SELECT * FROM item_sizes WHERE item_id=$1', [itemId]);
    return items.rows;
}

const getSellerItem = async itemId => {
    let item = await query('SELECT * FROM items WHERE id=$1', [itemId]);
    item = item.rows[0];
    const itemSizes = await getSellerSizedItems(itemId);
    item.sizes = itemSizes;
    item.imageBase64 = getBase64Image(item.image_path);
    return item;
}

module.exports = { getSellerItems, getSellerItem };