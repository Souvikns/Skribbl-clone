const express = require('express');
const app = express();
const path = require('path');
const httpserver = require('http').createServer(app);
const socket = require('socket.io')(httpserver);

let connections = [];
socket.on('connect',(sockt)=>{
console.log('new user');
connections.push(sockt);

sockt.on('draw',(data)=>{

connections.forEach(user=>{


    if(user.id!==sockt.id){

        
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


app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname , './public','nikunj.html'));



})

const port  = process.env.port || 3000;

httpserver.listen(port , ()=>{

console.log('server started');

});
