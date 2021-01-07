const mongoose=require('mongoose');
const {validationResult} = require('express-validator');
const Group=require('../../models/groups')
const User=require('../../models/user')
const Gmassages=require("../../models/groupmessages")
const Response=require("../../helpers/general/Response")

var createGroup=async(req,res,next)=>{
    
    try{
      
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }

       await Group.create({
            name:req.body.name,
            icon:req.body.icon,
            admin:req.userId //takes user id
        }).save()

        Response.Created(res)


    
        }catch(err){
            console.debug(err)
                if(!err.statusCode){
                    err.statusCode = 500; 
                }
                return next(err);
        }
        

}

var addMember=async(req,res,next)=>{
    
    try{
      
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }
        const {roomId,memberId}=req.body;
      const room=  await Group.findById(roomId)
      const user =await User.findById(memberId)
      if(!(room||user)){
          Response.CustomResponse(res,422,"invalid room or user")
      }
      if(req.userId.toString()!=user.admin.toString()){
          Response.Unauthorized(res)
      }

      const index = room.members.indexOf(memberId);
      if(index===-1){
          Response.Forbidden(res)
      }


      room.members.push(memberId);
      
        Response.Ok(res)


    
        }catch(err){
            console.debug(err)
                if(!err.statusCode){
                    err.statusCode = 500; 
                }
                return next(err);
        }
        

}
 
var sendMessage=async(req,res,next)=>{
    
    try{
      
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }
        const {messaeObject}=req.body;
       await Gmassages.create({
            ...messaeObject
        }).save()
      
        Response.Ok(res)


    
        }catch(err){
            console.debug(err)
                if(!err.statusCode){
                    err.statusCode = 500; 
                }
                return next(err);
        }
        

}

var getGroupMessages=async(req,res,next)=>{
    // rememer to auth who makes can see those messages
    try{
      
        const page = req.query.page    || 1 ;
         const itemPerPage = 10 ;
        const {GID}=req.query;
       if(!GID){
           return Response.BadRequest(res)
       }
    const messageResult=  await Gmassages.find({gui:GID}).sort(dateTime)
       .skip((page - 1) * itemPerPage)
       .limit(itemPerPage);
       Response.Ok(res,"",messageResult)

    
        }catch(err){
            console.debug(err)
                if(!err.statusCode){
                    err.statusCode = 500; 
                }
                return next(err);
        }
        

}

module.exports={
    createGroup,
    addMember,
    sendMessage,
    getGroupMessages
    


}