const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
    try {
        const location = await User.setLocation(req, req.body);
        res.send(location);
    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await User.fromToken(req.cookies.token);
        const location = await user.getLocation();
        res.send(location ?? {});
    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

module.exports = router