const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    try {
        const user = await User.fromToken(req.cookies.token);
        const order = await user.pushOrder();
        res.json(order);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const user = await User.fromToken(req.cookies.token);
        const orders = await user.getOrders(req);
        res.send(orders);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

module.exports = router;