const path=require('path');
const multer=require('multer')


 var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+path.join('..','..','images'))
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+'-'+file.originalname)
    }
  })

  const fileFilter = (req,file,cb)=>{
    if(file.mimetype==='image/png'||
    file.mimetype==='image/jpg'   ||
    file.mimetype==='image/jpeg'  ){
        console.debug('it image')

        cb(null,true);
    }else {
        console.debug('else run')
      cb(new Error('In correct type'));
    }
  }
   
 module.exports= multer({ storage: storage,fileFilter:fileFilter })