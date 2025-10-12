const express = require('express');
const router = express.Router();

const { addCartItem, getCartItems, removeCartItem } = require('../models/cart');

router.post('/', async (req, res) => {
    try {
        await addCartItem(req);
        res.sendStatus(200);
    } catch(e) {
        res.sendStatus(500);
        console.error(e);
    }
})

router.get('/', async (req, res) => {
    try {
        const items = await getCartItems(req);
        res.json(items);
    } catch(e) {
        res.sendStatus(500);
        console.error(e);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await removeCartItem(req);
        const items = await getCartItems(req);
        res.json(items);
    } catch(e) {
        res.sendStatus(500);
        console.error(e);
    }
})

module.exports = router;