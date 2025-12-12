const express = require('express');
const router = express.Router();

const { getBase64Image } = require('../models/images');
const { getSellerItems, getSellerItem } = require('../models/seller');
const User = require('../models/user');
const { removeItem } = require('../models/items')

router.get('/items', async (req, res) => {
    try {
        let items = await getSellerItems(req);
        res.send(items);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.get('/item/:itemId', async (req, res) => {
    try {
        const user = await User.getByToken(req.cookies.token);
        let item = await getSellerItem(req.params.itemId);
        if (item.user_id === user.id) res.json(item);
        else res.sendStatus(401);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.delete('/item/:itemId', async (req, res) => {
    try {
        const user = await User.getByToken(req.cookies.token);
        let item = await getSellerItem(req.params.itemId);
        if (item.user_id === user.id) {
            await removeItem(item.id);
            res.sendStatus(200);
        } 
        else res.sendStatus(401);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

module.exports = router