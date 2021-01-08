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
    }
});

module.exports = mongoose.model('FRequest',userSchema);