const express = require('express');
const router = express.Router();

const { getUserOrders, createOrder } = require('../models/order');

router.post('/', async (req, res) => {
    try {
        const order = await createOrder(req);
        res.json(order);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await getUserOrders(req);
        res.send(orders);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

module.exports = router;