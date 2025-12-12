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
    async postItem(req) {
        // req.body.fullFileName is added to req.body with multer middleware
        const { name, material, price } = req.body;
        const item = await query(
            'INSERT INTO items(seller_id, name, image_path, material, price) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [this.id, name, req.body.fullFileName, material, price]
        );
        const itemId = item.rows[0].id;

        const sizedItems = [];

        const setSizedItem = async(itemId, size) => {
            const item = await query(
                'INSERT INTO item_sizes(item_id, name, quantity) VALUES($1, $2, $3) ON CONFLICT (item_id, name) DO UPDATE SET quantity=EXCLUDED.quantity RETURNING *',
                [itemId, size.name, size.quantity]
            );
            return item.rows[0];
        }

        const setSizedItemIfHasCount = async (sizeCounterStr, sizeName) => {
            const sizeCount = parseInt(sizeCounterStr);
            if (sizeCount > 0) {
                const sizedItem = await setSizedItem(itemId, { quantity: sizeCount, name: sizeName});
                sizedItems.push(sizedItem);
            }
        };
        await setSizedItemIfHasCount(req.body.sizeCountXS, 'XS');
        await setSizedItemIfHasCount(req.body.sizeCountS, 'S');
        await setSizedItemIfHasCount(req.body.sizeCountL, 'L');
        await setSizedItemIfHasCount(req.body.sizeCountXL, 'XL');
        await setSizedItemIfHasCount(req.body.sizeCountXXL, 'XXL');
        await setSizedItemIfHasCount(req.body.sizeCountXXXL, 'XXXL');
        return {item: item.rows[0], sizedItems: sizedItems};
    }

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