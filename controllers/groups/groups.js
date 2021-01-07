const mongoose=require('mongoose');
const {validationResult} = require('express-validator');
const Group=require('../../models/groups')
const User=require('../../models/user')

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
  

module.exports={
    createGroup,
    addMember
    


}