const multer = require('multer');
const { join } = require('path');

const dest = join(__dirname, '../../public/uploads');

const storage = multer.diskStorage({
    destination: dest
})

const upload = multer({
    storage,
})

module.exports = upload