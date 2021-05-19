const express = require('express');
const app = express();
const path = require('path');
const httpserver = require('http').createServer(app);
const socket = require('socket.io')(httpserver,{

cors:{
    origin:"https://drawersoc.herokuapp.com/",
    method:["GET","POST"]
}

});
app.use(express.static(path.join(__dirname,'public')));

let connections = [];
socket.on('connect',(sockt)=>{
console.log('new user');
connections.push(sockt);

sockt.on('draw',(data)=>{

connections.forEach(user=>{


    if(user.id!==sockt.id){
        https://drawersoc.herokuapp.com/
        
user.emit('ondrawtoclient',{x:data.x,y:data.y});
    }



});

});

sockt.on('mssg',ms=>{

connections.forEach(um=>{


um.emit('message',ms);



});

})




})



app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname , './public','nikunj.html'));



})

const port  = process.env.PORT || 3000;

httpserver.listen(port , ()=>{

console.log('server started');

});
