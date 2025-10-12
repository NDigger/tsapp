const express = require('express');
const router = express.Router();
const { updateUserLocation, getUserLocation } = require('../models/location')

router.post('/', async (req, res) => {
    try {
        const location = await updateUserLocation(req);
        res.send(location);
    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

router.get('/', async (req, res) => {
    try {
        const location = await getUserLocation(req);
        res.send(location ?? {});
    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

module.exports = router