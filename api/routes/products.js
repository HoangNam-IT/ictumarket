const express= require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productsController = require('../controllers/products');


const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null,true);
  }else{
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {fileSize: 1024 * 1024 *5},
  fileFilter: fileFilter

});


router.get('/',productsController.get_all_product);

router.post('/', checkAuth, upload.single('productImage'), productsController.product_create);

router.get('/:productId', checkAuth, productsController.get_id_product);
router.patch('/:productId', checkAuth, productsController.update_product);
router.delete('/:productId', checkAuth, productsController.delete_product);

module.exports = router;
