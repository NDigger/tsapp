const { query } = require('../dbmodel');
const { getBase64Image } = require('../models/images');

const Sort = {
    NONE: '',
    HIGHEST_PRICE: 'highest-price',
    LOWEST_PRICE: 'lowest-price',
    NAME: 'name',
    NAME_REVERSE: 'name-reverse'
}

const SortQueries = {
    [Sort.NONE]: '',
    [Sort.LOWEST_PRICE]: 'ORDER BY sub.price ASC',
    [Sort.HIGHEST_PRICE]: 'ORDER BY sub.price DESC',
    [Sort.NAME]: 'ORDER BY sub.name ASC',
    [Sort.NAME_REVERSE]: 'ORDER BY sub.name DESC',
}

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

    static async removeById(itemId) {
        await query('DELETE FROM items WHERE id=$1', [itemId]);
        await query('DELETE FROM item_sizes WHERE item_id=$1', [itemId]);
    }

}

module.exports = Item;