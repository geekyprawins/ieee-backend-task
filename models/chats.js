const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
  username: String,  
  text : String,
})

const Chat = mongoose.model('Chat', chatSchema);
 module.exports = Chat;