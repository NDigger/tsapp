const User = require('./user');
const { query } = require('../dbmodel');

const { getBase64Image } = require('../models/images');

// Cart contains ONLY sized items from item_sizes table.

// module.exports = { addCartItem, getCartItems, removeCartItem };