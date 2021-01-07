const socketR=require('./events/eventResciver')
const socketS=require('./events/eventSender')
let io;

module.exports={
    init:(server)=>{
       
        io=require('socket.io')(server);
        io.on('connection', socket => {
        
            console.log('Client connected');
            handleEvent(socketR);
            handleEvent(socketS);

        return server;
        })
    },
    getIo:()=>{
        if(!io){
            throw new Error('socket is not difined')
        }
        return io;
    }
}