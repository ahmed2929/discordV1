const mongoose = require('mongoose');

const schema   = mongoose.Schema;

const groupSchema = new schema({
   name:{
       type:String,
       required:true
   },
   icon:{
       type:String,
       default:"https://www.flaticon.com/svg/static/icons/svg/3969/3969727.svg"
   },
   admin:{
       type:mongoose.Types.ObjectId,
       ref:"User",
       required:true
   },
   members:[{
       type:mongoose.Types.ObjectId,
       ref:"User"
   }]


});

module.exports = mongoose.model('Groups',groupSchema);