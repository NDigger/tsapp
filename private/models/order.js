const User = require('./user');
const { query } = require('../dbmodel');
const { getBase64Image } = require('./images');

const createOrder = async req => {
    const user = await User.getByToken(req.cookies.token);
    let order = await query(
        'INSERT INTO orders(user_id) VALUES($1) RETURNING *',
        [user.id]
    );
    const { items } = req.body;
    let orderItems = [];
    for (const item of items) {
        const addedItem = await query(
            'INSERT INTO order_items(order_id, item_id, quantity, seller_id) VALUES($1, $2, $3, $4) RETURNING *',
            [order.rows[0].id, item.sized_item_id, item.quantity, item.seller_id]
        )
        orderItems.push(addedItem.rows[0]);
        const sizedItemInfo = await query(
            'SELECT * FROM item_sizes WHERE id=$1',
            [item.sized_item_id]
        )
        const sizedItemQuantity = sizedItemInfo.rows[0].quantity;
        const sizedItemId = sizedItemInfo.rows[0].id;
        const newSizedItemQuantity = sizedItemQuantity - item.quantity;
        await query(
            'UPDATE item_sizes SET quantity=$1 WHERE id=$2',
            [newSizedItemQuantity, sizedItemId]
        )
    };
    await query('DELETE FROM cart WHERE user_id=$1', [user.id]);

    order = order.rows[0];
    order.items = orderItems;
    return order;
}

const getUserOrders = async req => {
    const user = await User.getByToken(req.cookies.token);
    let orders = await query(
        'SELECT * FROM orders WHERE user_id=$1',
        [user.id]
    );
    orders = orders.rows;
    for (let order of orders) {
        const orderItems = await query(
            'SELECT * FROM order_items WHERE order_id=$1',
            [order.id]
        );
        order.items = orderItems.rows;
        for (let orderItem of order.items) {
            const sizedItemData = await query(
                'SELECT * FROM item_sizes WHERE id=$1',
                [orderItem.item_id]
            );
            orderItem.sizedItemData = sizedItemData.rows[0];
            let itemData = await query(
                'SELECT * FROM items WHERE id=$1',
                [sizedItemData.rows[0].item_id]
            );
            itemData = itemData.rows[0];
            itemData.imageBase64 = getBase64Image(itemData.image_path);
            orderItem.itemData = itemData;
        }
    }
    return orders;
}

module.exports = { getUserOrders, createOrder };