const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
  username: String,  
  text : String,
})

module.exports = mongoose.model('Chat', chatSchema);