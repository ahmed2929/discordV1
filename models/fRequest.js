const mongoose = require('mongoose');

const schema   = mongoose.Schema;

const userSchema = new schema({
    status:{
        type:Number,
        default:0
    },
    from:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    to:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    GI:{
        type:mongoose.Types.ObjectId,
        ref:"Groups"
    },
    canChat:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('FRequest',userSchema);