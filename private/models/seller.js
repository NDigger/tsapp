const User = require('./user');
const { query } = require('../dbmodel');

const { getBase64Image } = require('../models/images');

const prepareItem = (item, itemSizes) => {
    item.sizes = []
    const imageBase64 = getBase64Image(item.image_path);
    if (imageBase64) item.imageBase64 = imageBase64;
    delete item.image_path;

    itemSizes.forEach(isz => {
        item.sizes.push({
            name: isz.name, 
            quantity: isz.quantity
        })
    })

    return item;
}

class Seller extends User {
    async getItems() {
        let items = await query('SELECT * FROM items WHERE seller_id=$1', [this.id]);
        items = items.rows;
        let itemsSizes = await query('SELECT isz.name, isz.item_id, isz.quantity FROM items AS i LEFT JOIN item_sizes AS isz ON i.id=isz.item_id WHERE seller_id=$1', [this.id]);
        itemsSizes = itemsSizes.rows;

        items = items.map(item => prepareItem(item, itemsSizes.filter(isz => isz.item_id === item.id)));
        return items;
    }
}

module.exports = Seller;