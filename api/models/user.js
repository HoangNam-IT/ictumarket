const mongoose =  require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  username: {type: String, required: true},
  email: {
    type: String, 
    required: true, 
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {type: String, required: true},
  avatar: {type: String, required: true},
  infor: {type: Object, required: true}
});

module.exports = mongoose.model('Users', userSchema);
