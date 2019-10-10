const express= require('express');
const router = express.Router();
const multer = require('multer');

const usersController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');


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


router.get('/', checkAuth, usersController.get_all_user);

router.post('/signup', upload.single('avatar'), usersController.user_signup);

router.post('/login', usersController.login_user);

router.get('/:userId', checkAuth, usersController.get_id_user);

router.patch('/:userId', checkAuth, usersController.update_user);

router.delete('/:userId', checkAuth, usersController.delete_user);

module.exports = router;
