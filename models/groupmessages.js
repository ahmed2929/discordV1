const mongoose = require('mongoose');

const schema   = mongoose.Schema;

const groupMessagSchema = new schema({
   from:{
       type:mongoose.Types.ObjectId,
       ref:"User",
       required:true
   },
   to:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    required:true
},
gui:{
    type:mongoose.Types.ObjectId,
    ref:"Groups",
    required:true
},

dateTime:Date
   ,

   message:String


});

module.exports = mongoose.model('Gmessages',groupMessagSchema);