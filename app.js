const express=require('express');
const mongoose=require('mongoose');
const configMiddleware=require('./config/config');
require('dotenv').config();
var app=express();
mongoose.connect(process.env.DB,{ useNewUrlParser: true,useUnifiedTopology: true },()=>{

    console.log('db connected');
    const server=app.listen(process.env.PORT||7878);
    require('./socket.io.settings').init(server)
   })

app=configMiddleware(app);







