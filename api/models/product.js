const mongoose =  require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  username: {type: String, required: true},
  productname: {type: String, required: true},
  price: {type: Number, required: true},
  category: {type: String, required: true},
  image: {type: String, required: true},
  comments: {type: Array, default: undefined},
  details: {type: Array, default: undefined}
});

module.exports = mongoose.model('Product', productSchema);
