const express= require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const checkAuth = require('../middleware/check-auth');


router.get("/:orderId",checkAuth, ordersController.get_order_id);
router.get("/",checkAuth, ordersController.get_order);
router.post("/",checkAuth, ordersController.create_order);
router.patch("/:orderId", checkAuth, ordersController.update_order);


module.exports = router;