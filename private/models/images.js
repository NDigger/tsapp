const path = require('path');
const fs = require('fs');

const getBase64Image = fileName => {
  try {
    const itemImagesPath = path.join(__dirname, '..', 'item-images');
    const buffer = fs.readFileSync(path.join(itemImagesPath, fileName));
    const base64 = buffer.toString("base64");
    return base64;
  } catch(e) {
    console.error(`File not found: ${fileName}`);
    return undefined;
  }
}

module.exports = { getBase64Image };