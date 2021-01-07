 const mongoose=require('mongoose');
var bycript = require('bcryptjs');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const User = require('../../models/user');
const sendEmail=require('../../helpers/general/sendEmail').sendEmail
const messages=require("../../helpers/general/emailMessages")
var register=async (req,res,next)=>{

    const errors = validationResult(req);
   // console.debug(errors)
    if(!errors.isEmpty()){
        const error = new Error('validation faild');
        error.statusCode = 422 ;
        error.data = errors.array();
        return next(error) ; 
    }
    var EMAIL=req.body.email.trim().toLowerCase()
    const email     = EMAIL;
    const password  = req.body.password;
    const name      = req.body.name;

    const findEmailLocal=await User.findOne({"local.email":email})
    const findEmailgoogle=await User.findOne({"google.email":email})
    const findEmailfacebook=await User.findOne({"facebook.email":email})

    if(findEmailLocal||findEmailfacebook||findEmailgoogle){
        const error = new Error('email alreay exist please try to login with  ');
        error.statusCode = 422;
       return next(error) ;
    }

    bycript.hash(password,12).then(hashedPass=>{
        const newUser = new User({
            methods:'local',
            local:{
                email:email,
                password:hashedPass,
               
            },
           email:email,
           name:name,
        });
        return newUser.save();
    })   
    .then(user=>{
        const token  = jwt.sign(
            {
                userId:user._id.toString()
            },
            process.env.JWT_PRIVATE_KEY
        );

       return res.status(201).json({state:1,message:'user created',userId:user._id});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        return next(err);
    });



    }

var login=async(req,res,next)=>{

    try{
       
        const errors = validationResult(req);
        console.debug(errors)
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }
        var {email,password,FCM}=req.body
        var EMAIL=req.body.email.trim().toLowerCase()
            email = EMAIL;
        const usergoogle = await User.findOne({'google.email':email}) 
        if(usergoogle){
            var message='please try to login with your google acount'
            const error = new Error(message);
            error.statusCode = 401 ;
            return next(error) ;
        }
        const userfacebook = await User.findOne({'facebook.email':email}) 

        if(userfacebook){
            var message='please try to login with your facebook acount'
           
            const error = new Error(message);
            error.statusCode = 401 ;
            return next(error) ;
        }


             const user = await User.findOne({'local.email':email}) 
            
                if(!user){
                    const error = new Error('user not found');
                    error.statusCode = 404 ;
                    return next(error) ;
                }    
                const isEqual = await bycript.compare(password,user.local.password);
                if(!isEqual){
                    var message='incorrect password'
              

                    const error = new Error(message);
                    error.statusCode = 401 ;
                    return next(error) ;
                }
                if(user.blocked==true){
                    var message='you are blocked from using the app'
                   


                    const error = new Error(message);
                    error.statusCode = 403 ;
                    return next(error) ;
                }
                const index =  user.FCMJwt.indexOf(FCM);
                if(index==-1){
                    user.FCMJwt.push(FCM);
                    await user.save();
                }
                
                
                const token  = jwt.sign(
                    {
                        userId:user._id.toString()
                    },
                    process.env.JWT_PRIVATE_KEY
                );
    
               
    
                res.status(200).json({
                    state:1,
                    token:token,
                    name:user.name,
                    email:user.email,
                    emailVerfied:user.emailVerfied,
                    userId:user._id,
                   // notfications:user.notfications,
                  //  pendingRequestTo:user.pendingRequestTo,
                   // RecivedRequest:user.RecivedRequest,
                    

                });
        }catch(err){
            if(!err.statusCode){
                err.statusCode = 500;
            }
            return next(err);
        }
        


}

const Logout = async (req,res,next)=>{
    //console.debug('logut run')
    const FCM = req.body.FCM ;
    try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){

        var message='validation faild'
       

        const error = new Error(message);
        error.statusCode = 422 ;
        error.data = errors.array();
        return next(error) ; 
    }
    const user = await User.findById(req.userId);
    console.debug(req.token)
    const index = user.FCMJwt.indexOf(FCM);
    if(index>-1){
        user.FCMJwt.splice(index, 1);
    }
    await user.save();

    var message='logedOut successfuly '
      

    res.status(201).json({state:1,message:message});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        return next(err);
    }
    
    
};

const ForgetPassword=async (req,res,next)=>{
    var EMAIL=req.body.email.trim().toLowerCase()
    const email     = EMAIL;
    
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            var message='validation faild'
         

            const error = new Error(message);
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error); 
        }
        const user = await User.findOne({email:email});
        const buf = crypto.randomBytes(2).toString('hex');
        const hashedCode = await bycript.hash(buf,12)
        user.forgetPasswordCode = hashedCode;
       // user.codeExpireDate =  Date.now()  + 3600000 ;
        await user.save();
        // await nodemailerMailgun.sendMail({
        //     to:email,
        //     from:'support test',
        //     subject:'Reset password',
        //     html:`
        //     <h1>Reset password</h1>
        //     <br><h4>that's your code to reset your password</h4>
        //     <br><h3>${buf}</h3>
        //     `
        //   });
        var Emessage=messages.ResetPasswordMessage(buf)
       

        const Emailresult=await sendEmail(email,'ResetPassword',Emessage)

          console.debug('Emailresult',Emailresult)
          
          res.status(200).json({state:1,message:'the code has been sent succefuly',email});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        return next(err);
    }
    


}

const VerfyCode = async (req,res,next)=>{
    const code  = req.body.code;
    var EMAIL=req.body.email.trim().toLowerCase()
    const email     = EMAIL;
    
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var message='validation faild'
        const error = new Error(message);
        error.statusCode = 422 ;
        error.data = errors.array();
        return next(error) ; 
    }
    const user = await User.findOne({email:email});
    if(!user){
        const error = new Error('User not Found');
        error.statusCode = 404 ;
        return next(error) ;
    }  
    const match = await bycript.compare(code,user.forgetPasswordCode)
    if(!match){

        var message='wrong code'
       


        const error = new Error(message);
        error.statusCode = 401 ;
        return next(error) ;
    }
    // if(user.codeExpireDate<=Date.now()){

    //     var message='your code is expired'
       
    //     const error = new Error(message);
    //     error.statusCode = 401 ;
    //     return next(error) ;
    // }

    const token  = jwt.sign(
        {
            userId:user._id.toString()
        },
        process.env.JWT_PRIVATE_KEY,
        {expiresIn:'1h'}
     );
     var message='correct code'
 
    res.status(200).json({state:1,message:message,token})
    
}catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    return next(err);
}

};    

const PasswordRest = (req,res,next)=>{ //put
    const password  = req.body.password;
    const oldpassword =req.body.oldpassword

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var message='validation faild'
       
        const error = new Error(message);
        error.statusCode = 422 ;
        error.data = errors.array();
        return next(error) ; 
    }


    User.findById(req.userId).then(async user=>{
        if(!user){
            const error = new Error('User not Found');
            error.statusCode = 404 ;
            return next(error) ;
        }
    
        const isEqual = await bycript.compare(password,user.local.password);
        if(!isEqual){
            var message='incorrect old password'
      

            const error = new Error(message);
            error.statusCode = 401 ;
            return next(error) ;
        }

        bycript.hash(password,12).then(hashed=>{
           // console.log(hashed);
            
            user.password = hashed ;
            return user.save();
        });
        
        
    }).then(u=>{
        
        var message='password updated'
     
    
        res.status(201).json({state:1,message:message});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        return next(err);
    });
};

const SendactivateEmail=async (req,res,next)=>{
    try{
    const user = await User.findById(req.userId);
    const buf = crypto.randomBytes(2).toString('hex');
    const hashedCode = await bycript.hash(buf,12)
    user.EmailActiveCode = hashedCode;
    //user.codeExpireDate =  Date.now()  + 3600000 ;
    await user.save();
    var Emessage=messages.ActivateEmailMessage(buf)
  
    const Emailresult=await sendEmail(user.local.email,'ActivateEmail',Emessage)

    var message='the code has been sent succefuly '
   

        res.status(200).json({state:1,message:message});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        return next(err);
    }
    
    }

const VerfyActiveEmailCode=async (req,res,next)=>{
    const code  = req.body.code.trim();
try{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){

        var message='validation faild'
      

        const error = new Error(message);
        error.statusCode = 422 ;
        error.data = errors.array();
        return next(error) ; 
    }
    const user = await User.findById(req.userId);
    if(!user){
        const error = new Error('User not Found');
        error.statusCode = 404 ;
        return next(error) ;
    }  
    const match = await bycript.compare(code,user.EmailActiveCode)
    if(!match){

        
        var message='incorrect code'
     
        const error = new Error(message);
        error.statusCode = 401 ;
        return next(error) ;
    }
    // if(user.codeExpireDate<=Date.now()){

    //     var message='your code is expired'
       

    //     const error = new Error(message);
    //     error.statusCode = 401 ;
    //     return next(error) ;
    // }

    user.emailVerfied=true;
    await user.save()
   // console.debug(user.emailVerfied)
    
   var message='your email is verfied'
 

    res.status(200).json({state:1,message:message})
    
}catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    return next(err);
}
}

const googleWithOuthData=async (req,res,next)=>{
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation faild');
        error.statusCode = 422 ;
        error.data = errors.array();
        return next(error) ; 
    }
        var {id,email,fullName,photo,FCM}=req.body

        if(!FCM){
            const error = new Error('FCM is required');
            error.statusCode = 422;
           return next(error) ;
        }

        console.debug('req body ',req.body)
        var EMAIL=req.body.email.trim().toLowerCase()
             email     = EMAIL;
       // We're in the account creation process
       let existingUser = await User.findOne({ "google.id":id });
       if (existingUser) {
           console.debug("user found in google")
        existingUser.FCMJwt.push(FCM)
         console.debug('user aready exist')
         const token  = jwt.sign(
            {
                userId:existingUser._id.toString()
            },
            process.env.JWT_PRIVATE_KEY
        );



        return res.status(200).json({
            state:1,
            token,
            userId:existingUser._id,
            state:1,
            name:existingUser.name,
            email:existingUser.email,
            emailVerfied:existingUser.emailVerfied,
            
            
        
        
        })


        }
 
        // Check if we have someone with the same email
        let existingUserLocal = await User.findOne({ "local.email":email })
        if (existingUserLocal) {
            console.debug("user found in local")
          // We want to merge google's data with local auth
          existingUserLocal.FCMJwt.push(FCM)
          existingUserLocal.emailVerfied=true
          await existingUserLocal.save()
          const token  = jwt.sign(
            {
                userId:existingUserLocal._id.toString()
            },
            process.env.JWT_PRIVATE_KEY
        );



        return res.status(200).json({
            state:1,
                token,
                userId:existingUserLocal._id,
                state:1,
                name:existingUserLocal.name,
                email:existingUserLocal.email,
                emailVerfied:existingUserLocal.emailVerfied,
                
        })


        }
 
        let existingUserfacebook = await User.findOne({ "facebook.email": email })
        if (existingUserfacebook) {
            console.debug("user found in facebook")

                // const error = new Error('you already singed up with facebook acount with the same email try to login with it');
                // error.statusCode = 403 ;
                // return next(error) ;
                existingUserfacebook.FCMJwt.push(FCM)
                const token  = jwt.sign(
                    {
                        userId:existingUserfacebook._id.toString()
                    },
                    process.env.JWT_PRIVATE_KEY
                );
        
        
        
                return res.status(200).json({
                    
                    token,
                    userId:existingUserfacebook._id,
                    state:1,
                    name:existingUserfacebook.name,
                    email:existingUserfacebook.email,
                    emailVerfied:existingUserfacebook.emailVerfied,
                    
                })
        
          
        }
 
        const newUser = new User({
            methods: 'google',
            google: {
              id,
              email    
            },
            email,
              name:fullName,
               photo,
            emailVerfied:true,
    
          });
          newUser.FCMJwt.push(FCM)

          await newUser.save();
        
     const token  = jwt.sign(
            {
                userId:newUser._id.toString()
            },
            process.env.JWT_PRIVATE_KEY
        );

        console.debug("new google user is created")


        return res.status(200).json({
            state:1,
                token,
                userId:newUser._id,
                state:1,
                name:newUser.name,
                email:newUser.email,
                emailVerfied:newUser.emailVerfied,
        })


   
    
}catch(err){
    if(!err.statusCode){
        err.statusCode = 500;
    }
    return next(err);
}
}
      
const facebookWithOuthData=async (req,res,next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error('validation faild');
            error.statusCode = 422 ;
            error.data = errors.array();
            return next(error) ; 
        }
            var {id,email,fullName,photo,FCM}=req.body
            if(!FCM){
                const error = new Error('FCM is required');
                error.statusCode = 422;
               return next(error) ;
            }
            var EMAIL=req.body.email.trim().toLowerCase()
             email     = EMAIL;
           // We're in the account creation process
           let existingUser = await User.findOne({ "facebook.id":id });
           if (existingUser) {
               console.debug('user found in facebook')
             existingUser.FCMJwt.push(FCM)
             console.debug('user aready exist')
             const token  = jwt.sign(
                {
                    userId:existingUser._id.toString()
                },
                process.env.JWT_PRIVATE_KEY
            );
    
    
    
            return res.status(200).json({
                token,
                userId:existingUser._id,
                state:1,
                name:existingUser.name,
                email:existingUser.email,
                emailVerfied:existingUser.emailVerfied,
            })
    
    
            }
     
            // Check if we have someone with the same email
            let existingUserLocal = await User.findOne({ "local.email":email })
            if (existingUserLocal) {
                console.debug('user found in local')

              // We want to merge google's data with local auth
              existingUserLocal.FCMJwt.push(FCM)
              existingUserLocal.emailVerfied=true
              await existingUserLocal.save()
              const token  = jwt.sign(
                {
                    userId:existingUserLocal._id.toString()
                },
                process.env.JWT_PRIVATE_KEY
            );
    
    
    
            return res.status(200).json({
                token,
                userId:existingUserLocal._id,
                state:1,
                name:existingUserLocal.name,
                email:existingUserLocal.email,
                emailVerfied:existingUserLocal.emailVerfied,
            })
    
    
            }
     
            let existingUserfacebook = await User.findOne({ "google.email": email })
            if (existingUserfacebook) {
                console.debug('user found in google')

                    // const error = new Error('you already singed up with facebook acount with the same email try to login with it');
                    // error.statusCode = 403 ;
                    // return next(error) ;
                    existingUserfacebook.FCMJwt.push(FCM)
                    const token  = jwt.sign(
                        {
                            userId:existingUserfacebook._id.toString()
                        },
                        process.env.JWT_PRIVATE_KEY
                    );
            
            
            
                    return res.status(200).json({
                        
                        token,
                            userId:existingUserfacebook._id,
                            state:1,
                            name:existingUserfacebook.name,
                            email:existingUserfacebook.email,
                            emailVerfied:existingUserfacebook.emailVerfied,
                    })
            
              
            }
     
            const newUser = new User({
                methods: 'facebook',
                facebook: {
                  id,
                  email,
                  
                },
                 email,
                 name:fullName,
                  photo
       
              });
              newUser.emailVerfied=true,
              await newUser.save();
              newUser.FCMJwt.push(FCM)

    
              await newUser.save();
            
         const token  = jwt.sign(
                {
                    userId:newUser._id.toString()
                },
                process.env.JWT_PRIVATE_KEY
            );
    
            console.debug('new user created facebook')

    
            return res.status(200).json({
                state:1,
                token,
                userId:newUser._id,
                state:1,
                name:newUser.name,
                email:newUser.email,
                emailVerfied:newUser.emailVerfied,
              
            })
    
    
       
        
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        return next(err);
    }
    }

module.exports={

register,
login,
PasswordRest,
VerfyCode,
ForgetPassword,
Logout,
SendactivateEmail,
VerfyActiveEmailCode,
googleWithOuthData,
facebookWithOuthData


}
