const express=require('express');
const Router=express.Router();
const {body} =require('express-validator')  
const groupConttroller=require('../../controllers/groups/groups')

Router.put('/createGroup',[
   
    body('name')
    .not()
    .isEmpty()

],groupConttroller.createGroup);



module.exports=Router

