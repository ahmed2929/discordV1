const mongoose=require('mongoose');
const {validationResult} = require('express-validator');
const Group=require('../../models/groups')
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
            admin:123 //takes user id
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


  

module.exports={
    createGroup
    


}