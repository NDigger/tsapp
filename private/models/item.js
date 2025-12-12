const { query } = require('../dbmodel');
const { getBase64Image } = require('../models/images');

class Item {
    static async addItem(req) {
        // req.body.fullFileName is added to req.body with multer middleware
        const { name, material, price } = req.body;
        const user = await User.getByToken(req.cookies.token);
        const item = await query(
            'INSERT INTO items(seller_id, name, image_path, material, price) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [user.id, name, req.body.fullFileName, material, price]
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