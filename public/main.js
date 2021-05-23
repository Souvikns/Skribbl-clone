var canvas = document.getElementById('canva');
var context = canvas.getContext('2d');
const form = document.getElementById('chat-form');
const ulist = document.getElementById('users');
const chatmessages = document.querySelector('.chat-messages');
const fetchword = document.getElementById('worrd');
const countdown = document.getElementById('timer');
const cancont = document.querySelector('.cancol');
var timer = 20;
var currentturn="";
var currentword="";

canvas.width = cancont.offsetWidth;
canvas.height = cancont.offsetHeight;


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
    displayusers();
    // allusers.forEach(e => {
    //     if (e.username === user_name) {
    //         userid = e.userid;
    //     }
    // })



});

io.on('remove', (id) => {

    allusers.filter((user, index) => {

        if (user.id === id) {
            allusers.splice(index, 1);
        }
        displayusers();
    });


});

// event for saving word

io.on('saveword', (crw) => {

    currentword = crw;

})

// function for timer
const time = () => {

    setInterval(() => {
        if (timer !== 0) {
            countdown.innerText = timer--;

        }


    }, 1000);

}


setInterval(() => {
    timer = 20;
   // context.clearRect(0,0,canvas.width,canvas.height);
   // context.beginPath();
    pointer++;
    currentturn = allusers[pointer%allusers.length].username;
    if (currentturn === user_name) {
        io.emit('generate', (val) => {

           // fetchword.innerText = val;

        });
        io.emit('currentw', currentword);
    //    time();

    }



}, 5000);



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
    chatmessages.scrollTop = chatmessages.scrollHeight;

});

io.on('mover', ({ x, y }) => {

        context.moveTo(x, y);

    
})

var x, y;
var lastx,lasty;
var mdown = false;
window.onmousedown = e => {

    if (currentturn === user_name) {

        
   //     context.beginPath();
        
        
         context.moveTo(x, y);
        // context.lineTo(x,y);
        // context.closePath();
        // context.stroke();
        io.emit('down', { x, y, room_name });
        mdown = true;

    }
}

window.onmouseup = e => {

    mdown = false;

}

canvas.addEventListener('touchmove', (e) => {

    mdown = true
    var touch = e.touches[0];

    x = touch.clientX;
    y = touch.clientY;
    if (mdown && currentturn === user_name) {


     //   context.beginPath();

        io.emit('draw', { x, y, room_name });
        //  context.moveTo(x, y);

        // x = e.clientX - canvas.offsetLeft;
        // y = e.clientY - canvas.offsetTop;

        context.lineTo(x, y)
        // context.lineTo(x,y);
        context.stroke();
    }

});


window.onmousemove = e => {

    x = e.clientX;
    y = e.clientY;
    // console.log(x,y);
    if (mdown && currentturn === user_name) {
        io.emit('draw', { x, y, room_name });
       
        context.lineTo(x,y);
      //  context.closePath();
        context.stroke();
console.log(x,y);
        
        // x = e.clientX - canvas.offsetLeft;
        // y = e.clientY - canvas.offsetTop;

        // context.lineTo(x,y);

    }



}

function displayusers() {
    ulist.innerHTML = '';
    allusers.forEach(user => {
        if (user.username === user_name) {
            userid = user.id;
        }
        const l = document.createElement('li');
        l.innerText = user.username;
        ulist.appendChild(l);
    })



}