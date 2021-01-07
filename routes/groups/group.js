const express=require('express');
const Router=express.Router();
const {body} =require('express-validator')  
const groupConttroller=require('../../controllers/groups/groups')
const verfytoken=require("../../helpers/Auth/tokenDecode")
Router.put('/createGroup',[
   
    body('name')
    .not()
    .isEmpty()

],verfytoken,groupConttroller.createGroup);

Router.put('/addMember',[
   
    body('memberId')
    .not()
    .isEmpty(),
    body('roomId')
    .not()
    .isEmpty(),
    

],verfytoken,groupConttroller.addMember);

Router.post('/sendMessage',[
   
    // body('memberId')
    // .not()
    // .isEmpty(),
    // body('roomId')
    // .not()
    // .isEmpty(),
    

],verfytoken,groupConttroller.sendMessage);

Router.get('/getGroupMessages',verfytoken,groupConttroller.getGroupMessages);

Router.get('/getGroupDetails',verfytoken,groupConttroller.getGroupDetails);


module.exports=Router

