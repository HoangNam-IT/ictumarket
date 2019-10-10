const Product = require('../models/product');
const mongoose =  require('mongoose');


exports.get_all_product = (req, res, next)=>{
    Product.find()
    .select('productname price _id category image username userId')
    .exec()
    .then(docs =>{
      console.log(docs);
      const response = {
        count: docs.length,
        products: docs.map(doc =>{
          return {
            userId: doc.userId,
            username: doc.username,
            productname: doc.productname,
            price: doc.price,
            category: doc.category,
            image: doc.image,
            _id: doc._id,
            request:{
              type: "GET",
              url: 'https://api-market-demo.appspot.com/products/'+doc._id
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

  exports.get_id_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
      .select('productname price category image _id details comments username userId')
      .exec()
      .then(doc => {
        // console.log("From database",doc);
        if (doc) {
          res.status(200).json({
            product:doc,
            request:{
              type: "GET",
              description:"get all products",
              url:"https://api-market-demo.appspot.com/products"
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

  exports.product_create = (req, res, next)=>{
    console.log(req.body);
    
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      userId: req.userData.userId,
      username: req.userData.username,
      productname : req.body.productname,
      price : req.body.price,
      category: req.body.category,
      image: req.file.path,
      details: req.body.details,
      comments: req.body.comments
    });
    product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'product was created!',
        productCreate: {
          productname: result.productname,
          price: result.price,
          category: result.category,
          image: result.image,
          _id: result._id,
          details: result.details,
          request:{
            type: "GET",
            url: 'https://api-market-demo.appspot.com/products/'+result._id
          }
        }
      });
    })
    .catch(err => console.log(err));
  }

  exports.update_product = (req, res, next)=>{   
    const id = req.params.productId;
    const updateOps = {};
    console.log(req.body[0].propName);
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    if(req.body[0].propName==="comments"){
      for (const ops of req.body) {
        updateOps[ops.propName] = {
          _id: new mongoose.Types.ObjectId(),
          userId: req.userData.userId,
          username: req.userData.username,
          createDate: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
          message: ops.value
        }
    }
    Product.update({_id : id},{$push:updateOps})
    .exec()
    .then(result =>{
      res.status(200).json({
        message:"product apdated comments",
        request:{
          type: "GET",
          url:"https://api-market-demo.appspot.com/products/"+id
        }
      });
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    }else{
      for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
      }
      Product.update({_id : id, userId : req.userData.userId},{$set:updateOps})
    .exec()
    .then(result =>{
      res.status(200).json({
        message:"product apdated",
        request:{
          type: "GET",
          url:"https://api-market-demo.appspot.com/products/"+id
        }
      });
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    }
  }
  
  exports.delete_product = (req, res, next)=>{
    const id = req.params.productId;
    console.log(req.userData.userId);
    
    Product.remove({ _id : id, userId : req.userData.userId })
    .exec()
    .then(result =>{
      res.status(200).json({
        message: "product deleted!",
        request:{
          type:"GET",
          description:"GET all products",
          url:"https://api-market-demo.appspot.com/products"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
  
  }