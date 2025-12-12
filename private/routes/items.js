const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Seller = require('../models/seller');
const Item = require('../models/item');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'item-images'));
  },
  filename: async function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.match(/\.([^.]+)$/)[0] ?? '';
    const fullFileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    req.body.fullFileName = fullFileName;
    cb(null, fullFileName);
  }
})
const uploadItemImage = multer({ storage })

router.post('/', uploadItemImage.single('image'), async (req, res) => {
  try {
    const seller = await Seller.fromToken(req.cookies.token);
    const {name, material, price, fullFileName} = req.body;
    await seller.postItem({
      name: name,
      material: material,
      price: price,
      fullFileName: fullFileName,
      sizes: JSON.stringify(req.body.sizes)
    });
    res.sendStatus(200);
  } catch(e) {
    console.error(e)
    res.sendStatus(500);
  }
})

router.get('/', async (req, res) => {
  try {
    const limit = 15;
    const {items, count} = await Item.getList(req, limit, parseInt(Number(req.query.page ?? 0) * limit));
    res.json({
      items: items,
      itemsCount: count,
    });
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
})

router.get('/:id', async (req, res) => {
    try {
      const item = await Item.getById(req.params.id);
      res.send(item);
    } catch(e) {
      console.error(e);
      res.sendStatus(500);
    }
})

// app.get('/data', (req, res) => {
//   const image = fs.readFileSync('image.png', { encoding: 'base64' });
//   res.json({
//     message: 'primer izobrazhenia',
//     image: `data:image/png;base64,${image}`
//   });
// });

module.exports = router