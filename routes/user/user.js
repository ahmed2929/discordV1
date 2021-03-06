const express=require('express');
const Router=express.Router();
const {body} =require('express-validator')  
const Conttroller=require('../../controllers/user/user')
const verfytoken=require("../../helpers/Auth/tokenDecode")

Router.post('/sendFriendRequest',[
   
    body('to')
    .not()
    .isEmpty(),
  
    

],verfytoken,Conttroller.sendFriendRequest);


Router.post('/acceptFriendRequest',[
   
    body('to')
    .not()
    .isEmpty(),
  
    

],verfytoken,Conttroller.acceptFriendRequest);



module.exports=Router

