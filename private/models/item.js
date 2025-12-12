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

    static async getList(req, limit, offset) {
        const filters = {
            sizes: {
                XS: req.query.sizesXS === 'true',
                S: req.query.sizesS === 'true',
                L: req.query.sizesL === 'true',
                XL: req.query.sizesXL === 'true',
                XXL: req.query.sizesXXL === 'true',
                XXXL: req.query.sizesXXXL === 'true',
            },
            price: {
                min: Number(req.query.priceMin),
                max: Number(req.query.priceMax) || 999999999,
            }
        }
        const querySort = SortQueries[req.query.sort]

        const sizeQueryFilters = Object.values(filters.sizes).filter(value => value === true)
        .map(([key]) => `s.name='${key}'`)
        const filtersQuery = 
        `AND price>=${filters.price.min} AND price<=${filters.price.max} ${sizeQueryFilters.length !== 0 ? `AND (${sizeQueryFilters.join(' OR ')})` : ''}`

        let items = await query(
            `
            SELECT *
            FROM (
                SELECT DISTINCT ON(i.id) i.id, i.name, i.image_path, i.material, i.price, i.seller_id FROM items AS i 
                LEFT JOIN item_sizes AS s ON s.item_id=i.id
                WHERE s.quantity > 0 ${filtersQuery} 
                LIMIT $1 OFFSET $2
            ) AS sub ${querySort}
            `, 
            [limit, offset]
        );
        const itemsCount = await query(`
            SELECT DISTINCT ON(i.id) i.id FROM items AS i 
            LEFT JOIN item_sizes AS s ON s.item_id=i.id 
            ${filtersQuery} 
            `)
        items = items.rows;
        for (const item of items) {
            const sizedItems = await Item.#getSizesById(item.id);
            item.sizes = sizedItems;
            item.imageBase64 = getBase64Image(item.image_path);
        }
        return {items: items, count: itemsCount.rowCount};
    }

}

module.exports = Item;