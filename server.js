const express = require('express');
const app = express();
const path = require('path');
const User = require('./utils/User');
const mongoose = require('mongoose');
const randval = require('./words');
const { Room, Connection } = require('./data');




const httpserver = require('http').createServer(app);
const socket = require('socket.io')(httpserver, {


    cors: {
        origin: "https://drawersoc.herokuapp.com/",
        method: ["GET", "POST"]
    }

});

app.use(express.static(path.join(__dirname, 'public')));

let Allcon = new Connection();

// socket connection function
socket.on('connect', (sockt) => {
    console.log('new socket craeted', sockt.id);



    sockt.on('create', (user_data) => {

        const { user_name, room_name } = user_data;
        sockt.room_name = room_name;
        sockt.user_name = user_name;
        // create a new room default 1 user will be there 
        // connections.addUser(room_name, user_name);

        //    const newuser = new User(user_name, room_name, sockt.id);
        // console.log(newuser.username);
        // connections.push(newuser);

        Allcon.addnewroom(room_name, user_name, sockt.id);
        sockt.join(room_name);
        console.log('you joined', room_name, user_name);
        console.log(Allcon);
        var allusers = Allcon.rooms.get(room_name).getusers();
        console.log(allusers);
        socket.sockets.in(room_name).emit('sendall', allusers);
        //sockt.emit('sendall',allusers);


    });

    /* event for starting thw game */
    sockt.on('startgame', val => {

        socket.in(sockt.room_name).emit('ready', Allcon.rooms.get(sockt.room_name).TurnCount);
        //   sockt.to(sockt.room_name).emit('ready', Allcon.rooms.get(sockt.room_name).TurnCount);

    })


    sockt.on('generate', fu => {

        const gen = randval();
        Allcon.rooms.get(sockt.room_name).currentword = gen;
        fu(gen);

    });

    // event for time
    sockt.on('time', (timer) => {

        sockt.to(sockt.room_name).emit('telltime', timer);

    });

    // event for inc pointer for a room

    sockt.on('ipoint', (p) => {

        Allcon.rooms.get(sockt.room_name).TurnCount =
            (Allcon.rooms.get(sockt.room_name).TurnCount + 1) % Allcon.rooms.get(sockt.room_name).users.length;
        sockt.emit('updatecount',Allcon.rooms.get(sockt.room_name).TurnCount);
    })

    sockt.on('draw', (data) => {


        sockt.to(data.room_name).emit('ondrawtoclient', { x: data.x, y: data.y });

        // if (sockt.id === data.user_id) {

        // }

        // connections.forEach(user=>{


        // //     if(user.id!==sockt.id){

        // // user.emit('ondrawtoclient',{x:data.x,y:data.y});
        // //     }



        // });

    });

    sockt.on('turn', (user) => {

        socket.sockets.in(user.room_name).emit('tellturn', user.username);

    });

    sockt.on('down', (data) => {

        sockt.to(data.room_name).emit('mover', { x: data.x, y: data.y });

    });

    sockt.on('currentw', (crrw) => {

        sockt.to(sockt.room_name).emit('saveword', crrw);

    })




    sockt.on('mssg', (info) => {

if(info.msg === Allcon.rooms.get(sockt.room_name).currentword){

    socket.sockets.in(info.room_name)
    .emit('message', { name: info.user_name, message: 'Guessed correctly'});

    return;
}
        socket.sockets.in(info.room_name)
            .emit('message', { name: info.user_name, message: info.msg });

    })


    sockt.on('disconnect', (reason) => {

        Allcon.rooms.get(sockt.room_name).users.forEach((u,index)=>{

if(index === Allcon.rooms.get(sockt.room_name).TurnCount){

    Allcon.rooms.get(sockt.room_name).TurnCount = 0;
console.log('dis' ,  Allcon.rooms.get(sockt.room_name).TurnCount);
}
if(u.id === sockt.id){
    Allcon.rooms.get(sockt.room_name).users.splice(index,1);
}

        });

        socket.sockets.in(sockt.room_name).emit('remove', sockt.id);

    });

})


// landing route

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, './public', 'enter.html'));



});

app.get('/joinroom', (req, res) => {


    res.sendFile(path.join(__dirname, './public', 'nikunj.html'));


});


const port = process.env.PORT || 3000;

httpserver.listen(port, () => {

    console.log('server started');

});
