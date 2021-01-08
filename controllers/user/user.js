const mongoose=require('mongoose');
const {validationResult} = require('express-validator');
const Group=require('../../models/groups')
const User=require('../../models/user')
const Gmassages=require("../../models/groupmessages")
const Response=require("../../helpers/general/Response");
const fRequest = require('../../models/fRequest');



var sendFriendRequest=async(req,res,next)=>{
    
    try{
      
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }
        const {to}=req.body;
        
        if(req.user.friends.indexOf(to)>-1){
            Response.BadRequest(res,"user already frind")
        }
    await fRequest.create({
           from:req.userId,
           to,
           
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


var acceptFriendRequest=async(req,res,next)=>{
    
    try{
      
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }
        const {requestId}=req.body;
     
   const frequest = await fRequest.find({_id:requestId,to:req.userId})
 const pg= await  Group.create({
       name:`chat with ${frequest.from} and ${frequest.to}`,
       admin:frequest.from,
       members:[frequest.from,frequest.to],
       PriviteGroup:true
   })

  await pg.save()

   frequest.status=1;
   frequest.canChat=true,
   frequest.GI=pg._id
 await  frequest.save()

 const from=     await fRequest.findById(frequest.from)
 const to=     await fRequest.findById(frequest.to)


 from.friends.push(frequest.to._id)
 to.friends.push(frequest.from._id)
        Response.Ok(res)
await from.save()
await to.save()

    
        }catch(err){
            console.debug(err)
                if(!err.statusCode){
                    err.statusCode = 500; 
                }
                return next(err);
        }
        

}







module.exports={
    sendFriendRequest,
    acceptFriendRequest
    
}