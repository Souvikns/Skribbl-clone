var canvas = document.getElementById('canva');
var context = canvas.getContext('2d');
const form = document.getElementById('chat-form');
const val = document.getElementById('nameword');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.strokeStyle = 'white';

var pointer = -1;
var allusers = [];
var userid;
let user_name = localStorage.getItem('name');
let room_name = localStorage.getItem('rname');

var io = io.connect(window.location.host);

// for joining user

io.emit('create', { user_name, room_name });

console.log(window.location.host);
form.addEventListener('submit', (e) => {

    e.preventDefault();
    let msg = e.target.elements.msg.value;
    e.target.elements.msg.value = "";
    io.emit('mssg', { msg, user_name, room_name });


});

io.on('sendall', (users) => {
    // users.forEach(e=>{
    //     console.log(e.username);

    // })
    allusers.splice(0, users.length, ...users);

    allusers.forEach(e => {
        if (e.username === user_name) {
            userid = e.userid;
        }
        console.log(e.username);
    })
    console.log(allusers);

});



setInterval(() => {
    pointer++;

    io.emit('generate', (val)=>{

val.innerText = val;

    });


}, 10000);



io.on('tellturn', (name) => {

    /* display name in ui */

});


/* Draw logic   */

io.on('ondrawtoclient', ({ x, y }) => {

    // context.lineTo(x,y);
    // context.stroke();
    console.log(x, y);
    // context.moveTo(x,y);

    // x = e.clientX - canvas.offsetLeft;
    // y = e.clientY - canvas.offsetTop;

    context.lineTo(x, y)
    // context.lineTo(x,y);
    context.stroke();

});

io.on('message', (me) => {

    //create div and append to dom

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${me.name}</p><p class="text">${me.message}</p>`

    document.querySelector('.chat-messages').appendChild(div);

});

let x, y;
var mdown = false;
window.onmousedown = e => {

    mdown = true;
    x = e.clientX - canvas.offsetLeft;
    y = e.clientY - canvas.offsetTop;

}

window.onmouseup = e => {

    mdown = false;

}

canvas.addEventListener('touchmove', (e) => {

    mdown = true
    var touch = e.touches[0];

    x = touch.clientX;
    y = touch.clientY;
    if (mdown) {


        context.beginPath();

        io.emit('draw', { x, y, room_name });
        context.moveTo(x, y);

        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;

        context.lineTo(x, y)
        // context.lineTo(x,y);
        context.stroke();
    }

});


window.onmousemove = e => {

    // x = e.clientX;
    // y = e.clientY;
    // console.log(x,y);
    if (mdown) {

        // context.beginPath();

        io.emit('draw', { x, y, room_name });
        // context.moveTo(x, y);

        // x = e.clientX - canvas.offsetLeft;
        // y = e.clientY - canvas.offsetTop;

        // context.lineTo(x, y)
        // // context.lineTo(x,y);
        // context.stroke();

    }



}