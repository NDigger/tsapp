const User = require('./user');
const { query } = require('../dbmodel');

const { getBase64Image } = require ('../models/images');

const getSizedItems = async itemId => {
    const items = await query('SELECT * FROM item_sizes WHERE item_id=$1', [itemId]);
    return items.rows;
}

const getItem = async id => {
    let item = await query('SELECT * FROM items WHERE id=$1', [id]);
    item = item.rows[0];
    const itemSizes = await getSizedItems(item.id);
    item.sizes = itemSizes;
    item.imageBase64 = getBase64Image(item.image_path);
    return item;
}

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

const getItems = async (req, limit, offset) => {
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

    const sizeQueryFilters = Object.entries(filters.sizes)
    .filter(([key, value]) => value === true)
    .map(([key]) => `s.name='${key}'`)
    const filtersQuery = 
    `AND price>=${filters.price.min} AND price<=${filters.price.max} ${sizeQueryFilters.length !== 0 ? `AND (${sizeQueryFilters.join(' OR ')})` : ''}`

    let items = await query(
        `
        SELECT *
        FROM (
            SELECT DISTINCT ON(i.id) i.id, i.name, i.image_path, i.material, i.price, i.user_id FROM items AS i 
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
        const sizedItems = await getSizedItems(item.id);
        item.sizes = sizedItems;
        item.imageBase64 = getBase64Image(item.image_path);
    }
    // const areFiltersActive = [
    //     Object.values(filters.sizes).some(v => v === true),
    //     Object.values(filters.price).some(v => v !== 0),
    // ].every(v => v === false);
    // if (areFiltersActive) return items
    // const sizesAllowed = [];
    // Object.entries(filters.sizes).map(([key, value]) => {
    //     if (value) sizesAllowed.push(key)
    // })
    // const filteredItems = items.filter(item => {
    //     const itemSizes = item.sizes.map(size => size.name);
    //     console.log(item.price, filters.price.min, filters.price.max)
    //     return (
    //         sizesAllowed.every(v => itemSizes.includes(v))
    //         && item.price <= (filters.price.max || Infinity)
    //         && item.price >= filters.price.min
    //     );
    // });
    return {items: items, count: itemsCount.rowCount};
}

module.exports = { getItems, getItem };