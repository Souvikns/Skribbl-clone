const express = require('express');
const app = express();
const path = require('path');
const User = require('./utils/User');

const httpserver = require('http').createServer(app);
const socket = require('socket.io')(httpserver,{


cors:{
    origin:"https://drawersoc.herokuapp.com/",
    method:["GET","POST"]
}

});

app.use(express.static(path.join(__dirname,'public')));

let connections = [];

// socket connection function
socket.on('connect',(sockt)=>{
console.log('new socket craeted',sockt.id);



sockt.on('create',(user_data)=>{

const {user_name , room_name} = user_data; 

const newuser = new User(user_name , room_name , sockt.id);
console.log(newuser.username);
    connections.push(newuser);

sockt.join(room_name);
console.log('you joined',room_name,user_name);
console.log(connections);
var allusers = connections.filter(user => user.room_name === room_name);
console.log(allusers);
socket.sockets.in(room_name).emit('sendall',allusers);
 //sockt.emit('sendall',allusers);


});

sockt.on('draw',(data)=>{

socket.sockets.in(data.room_name).emit('ondrawtoclient',{x:data.x,y:data.y});

// connections.forEach(user=>{


// //     if(user.id!==sockt.id){
        
// // user.emit('ondrawtoclient',{x:data.x,y:data.y});
// //     }



// });

});

sockt.on('mssg',ms=>{

connections.forEach(um=>{


um.emit('message',ms);



});

})




})


// landing route

app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname , './public','enter.html'));



});

app.get('/joinroom',(req,res)=>{


    res.sendFile(path.join(__dirname , './public','nikunj.html'));


});


const port  = process.env.PORT || 3000;

httpserver.listen(port , ()=>{

console.log('server started');

});
