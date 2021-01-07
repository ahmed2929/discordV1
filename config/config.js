const bodyParser=require('body-parser');
var cors = require('cors')
const socketR=require('../events/eventResciver')
const socketS=require('../events/eventSender')


const addMiddlware=(app)=>{
   app.use(cors())
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({extended:true}));
   app.use(socketR);
   app.use(socketS);

   return app
}

const addAPIS=(app)=>{

   app.get('/',(req,res)=>{
      res.send('welcome to discord api v1  please read the docs')
   })

//
   return app
}

const addErorrHandler=(app)=>{

   app.use((error,req,res,next)=>{
      console.debug('general error runs')
      const status    = error.statusCode || 500 ;
      const message   = error.message           ;
      const data      = error.data              ;
      
      res.status(status).json({state:0,message:message,data:data});
   });
      


   return app
}




module.exports=(app)=>{ 
   
app=addMiddlware(app);
app=addAPIS(app);
app=addErorrHandler(app);
   

return app;
}
