const mongoose = require('mongoose');

const schema   = mongoose.Schema;

const userSchema = new schema({
    methods: {
        type: String,
        required: true,
        default:"local"
      },
      local: {
        email: {
          type: String,
          lowercase: true
        },
        password: {
          type: String
        },
     
        
      },
      google: {
        id: {
          type: String
        },
        email: {
          type: String,
          lowercase: true
        },
      },
      facebook: {
        id: {
          type: String
        },
        email: {
          type: String,
          lowercase: true
        }
    },
    name:{
        type:String,
        
    },
    photo:{
      type:String,
      default:'https://img.icons8.com/bubbles/50/000000/user-male.png'
    },
    
    emailVerfied:{
        type:Boolean,
        default:false
    },
    blocked:{
        type:Boolean,
        default:false
    }
    ,
    FCMJwt:[{
        type:String
    }],
    notfications:[
      {
        type:schema.Types.ObjectId,
        ref:'notification' 
      }
    ],
    EmailActiveCode:{
      type:String,
      expires: 3600*60
    },
    forgetPasswordCode:{
      type:String,
      expires: 3600*60
    },
    groups:[{
      type:mongoose.Types.ObjectId,
      ref:"Groups"
    }],
    friends:[{
      type:mongoose.Types.ObjectId,
      ref:"User"
    }],

});

module.exports = mongoose.model('User',userSchema);