const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products');
const usersRoutes = require('./api/routes/users');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://hoangnam:hoangnam97@market-z5ym7.gcp.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use('/uploads',express.static('uploads'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Resquested-With, Context-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header('Access=Control-Allow-Methods', 'PUT, POST, GET PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});



app.use('/products', productsRoutes);
app.use('/user', usersRoutes);
app.use('/orders', ordersRoutes);

app.use(function (req, res, next){
  const error = new Error('Not Fonud!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next)=>{
  res.status(error.status||500);
  res.json({
    error:{
      message: error.message
    }
  })
});

module.exports = app;
