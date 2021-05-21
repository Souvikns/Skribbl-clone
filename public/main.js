var canvas = document.getElementById('canva');
var context = canvas.getContext('2d');
const form = document.getElementById('chat-form');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight/2;

let user_name = localStorage.getItem('name');
let room_name = localStorage.getItem('rname');

var io = io.connect(window.location.host);



io.emit('create',room_name);

console.log(window.location.host);
form.addEventListener('submit',(e)=>{

e.preventDefault();
let msg = e.target.elements.msg.value;
e.target.elements.msg.value="";
io.emit('mssg',msg);


})


    


io.on('ondrawtoclient',({x,y})=>{

    context.lineTo(x,y);
    context.stroke();
    


});

io.on('message',(me)=>{

    //create div and append to dom

     const div = document.createElement('div');
     div.classList.add('message');
     div.innerHTML = `<p class="text">${me}</p>`

     document.querySelector('.chat-messages').appendChild(div);

});

let x,y;
var mdown = false;
window.onmousedown = e=>{

mdown = true;

}

window.onmouseup = e =>{

mdown = false;

}

canvas.addEventListener('touchmove',(e)=>{

    mdown =  true
    var touch = e.touches[0];

x = touch.clientX;
y = touch.clientY;
    if(mdown){
        io.emit('draw',{x,y});
    
        context.lineTo(x,y);
        context.stroke();
        
    }
    
});


window.onmousemove = e =>{

x = e.clientX;
y = e.clientY;
console.log(x,y);
if(mdown){
    io.emit('draw',{x,y});

    context.lineTo(x,y);
    context.stroke();
    
}



}