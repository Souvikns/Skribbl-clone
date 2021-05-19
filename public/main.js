var canvas = document.getElementById('canva');
var context = canvas.getContext('2d');
const form = document.getElementById('chat-form');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight/2;

var io = io.connect(window.location.host);
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