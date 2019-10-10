const Order = require('../models/order');
const mongoose =  require('mongoose');


exports.get_order_id = (req, res, next)=>{
    const id = req.params.orderId;
    Order.findById(id)
      .select('_id productData createDate active  username userId')
      .exec()
      .then(doc => {
        // console.log("From database",doc);
        if (doc) {
          res.status(200).json({
            order:doc,
            request:{
              type: "GET",
              description:"get all order",
              url:"https://api-market-demo.appspot.com/order"
            }
          });
        }else{
          res.status(404).json({message: "Not Found!"});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
      });
}

exports.get_order = (req, res, next) =>{
    const id = req.userData.userId;
    Order.find({userId:id})
    .select('_id productData createDate active  username userId')
    .exec()
    .then(docs =>{
      console.log(docs);
      const response = {
        count: docs.length,
        orders: docs.map(doc =>{
          return {
            userId: doc.userId,
            username: doc.username,
            productData: doc.productData,
            active: doc.active,
            createDate: doc.createDate,
            _id: doc._id,
            request:{
              type: "GET",
              url: 'https://api-market-demo.appspot.com/orders/'+doc._id
            }
          }
        })
      };
      // if (doc.length >=0) {
          res.status(200).json(response);
      // }else{
      //     res.status(404).json({message: "Not Found!"});
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
}
exports.create_order = (req, res, next)=>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        username: req.userData.username,
        productData: req.body.productData,
        createDate: new Date(),
        active: 0,
    });

    order
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'order was created!',
          orderCreate: {
            _id: result._id,
            userId: result.userId,
            username: result.username,
            productData: result.productData,
            createDate: result.createDate,
            active: result.active,
            request:{
              type: "GET",
              url: 'https://api-market-demo.appspot.com/orders/'+result._id
            }
          }
        });
      })
    .catch(err => console.log(err));

}
exports.update_order = (req, res, next)=>{
    const id = req.params.orderId;
    console.log(req.userData.userId);
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Order.update({_id: id, userId: req.userData.userId},{$set:updateOps})
    .exec()
    .then(result =>{
      res.status(200).json(result);
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}