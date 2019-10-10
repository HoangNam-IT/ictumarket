const mongoose =  require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    productData: {type: Array, default: undefined},
    userId: mongoose.Types.ObjectId,
    username: {type: String, required: true},
    createDate: {type: Date, require: true},
    active: {type: Number, require:true}
});

module.exports = mongoose.model("Oder",orderSchema);