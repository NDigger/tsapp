const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/', async (req, res) => {
    try {
        const user = await User.fromToken(req.cookies.token);
        await user.addCartItem(req.body.sizedItem.id, req.body.quantity);
        res.sendStatus(200);
    } catch(e) {
        res.sendStatus(500);
        console.error(e);
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await User.fromToken(req.cookies.token);
        const items = await user.getCartItems();
        res.json(items);
    } catch(e) {
        res.sendStatus(500);
        console.error(e);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = User.fromToken(req.cookies.token);
        const sizedItemId = req.params.id;
        await user.removeCartItem(sizedItemId);
        const items = await user.getCartItems();
        res.json(items);
    } catch(e) {
        res.sendStatus(500);
        console.error(e);
    }
})

module.exports = router;