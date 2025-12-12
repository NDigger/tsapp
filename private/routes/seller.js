const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Seller = require('../models/seller');
const Item = require('../models/item');

const { removeItem } = require('../models/items')

router.get('/items', async (req, res) => {
    try {
        const seller = await Seller.fromToken(req.cookies.token);
        const items = await seller.getItems();
        res.send(items);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.get('/item/:itemId', async (req, res) => {
    try {
        const seller = await User.getByToken(req.cookies.token);
        const item = await Item.getById(req.params.itemId);
        if (item.seller_id === seller.id) res.json(item);
        else res.sendStatus(401);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.delete('/item/:itemId', async (req, res) => {
    try {
        const user = await User.getByToken(req.cookies.token);
        const item = await Item.getById(req.params.itemId);
        if (item.seller_id === user.id) {
            await Item.removeById(item.id);
            res.sendStatus(200);
        } 
        else res.sendStatus(401);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

module.exports = router