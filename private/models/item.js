const { query } = require('../dbmodel');
const { getBase64Image } = require('../models/images');

class Item {
    static async #getSizesById(itemId) {
        const items = await query('SELECT * FROM item_sizes WHERE item_id=$1', [itemId]);
        return items.rows;
    }

    static async getById(itemId) {
        let item = await query('SELECT * FROM items WHERE id=$1', [itemId]);
        item = item.rows[0];
        const itemSizes = await Item.#getSizesById(itemId);
        item.sizes = itemSizes;
        item.imageBase64 = getBase64Image(item.image_path);
        delete item.image_path;
        return item;
    }
}

module.exports = Item;