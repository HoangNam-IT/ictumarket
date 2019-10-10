const User = require('../models/user');
const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');
const jwt =  require("jsonwebtoken");


exports.get_all_user = (req, res, next)=>{
    User.find()
    .select('username avatar email')
    .exec()
    .then(docs =>{
      console.log(docs);
      // if (docs.length >=0) {
      const response = {
        count: docs.length,
        data: docs.map(doc =>{
          return {
            username: doc.username,
            avatar: doc.avatar,
            email: doc.email,
            _id: doc._id,
            request:{
              type: "GET",
              url: 'https://api-market-demo.appspot.com/user/'+doc._id
            }
          }
        })
      }
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


  exports.user_signup = (req, res, next)=>{
    User.find({email: req.body.email})
      .exec()
      .then(user => {
        if(user.length >=1){
          return res.status(409).json({
            message: "Mail exists!",
          });
        }else{
          bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
              return res.status(500).json({
                error: err,
              });
            }else{
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username : req.body.username,
                email: req.body.email,
                password : hash,
                avatar: req.file.path,
                infor : req.body.infor
              });
              user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'user was created!',
                  userCreate: {
                    username: result.username,
                    password: result.password,
                    avatar: result.avatar,
                    email: result.email,
                    _id: result._id,
                    infor: result.infor,
                    request:{
                      type:"GET",
                      url: 'https://api-market-demo.appspot.com/user/'+result._id
                    }
                  }
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
            }
          });
        }
      })
      .catch();
    
  }

  exports.login_user = (req, res, next)=>{
    User.find({email: req.body.email})
      .exec()
      .then(user =>{
          if (user.length < 1) {
            return res.status(404).json({
              message: "Auth failed!"
            });
          }
          bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            if (err) {
              return res.status(404).json({
                message: "Auth failed!"
              });
            }
            if(result){
              const token =  jwt.sign({
                username: user[0].username,
                email: user[0].email,
                userId: user[0]._id
              }, "hoangnam97",
              {
                expiresIn: "1h"
              })
              return res.status(200).json({
                message: "Auth Successful",
                _id: user[0]._id,
                username: user[0].username,
                token: token
              });
            }
            res.status(401).json({
              message: "Auth failed!"
            });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  exports.get_id_user = (req, res, next)=>{
    const id = req.params.userId;
    User.findById(id)
      .select('username avatar infor email')
      .exec()
      .then(doc => {
        console.log("From database",doc);
        if (doc) {
          res.status(200).json({
            data: doc,
            request: {
              type:"GET",
              description: "get all user",
              url: "https://api-market-demo.appspot.com/user/"
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

  exports.update_user = (req, res, next)=>{
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id, email : req.userData.email},{$set:updateOps})
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

  exports.delete_user = (req, res, next)=>{
    const id = req.params.userId;
    User.remove({_id: id, email : req.userData.email})
    .exec()
    .then(result =>{
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error:err
      });
    });
  }