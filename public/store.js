var btn = document.getElementById('send');
var join = document.getElementById('join');

btn.addEventListener('click',(e)=>{

    var name = document.getElementById('login__username').value;
    var room_name = document.getElementById('room_name').value;
    console.log(name,room_name);
if(name.length == 0 || room_name.length == 0){

alert('Fields are empty');
    return;
}

e.preventDefault();

localStorage.setItem('name',name);
localStorage.setItem('rname',room_name);

window.open("http://localhost:3000/joinroom");

});

join.addEventListener('click',(e)=>{

e.preventDefault();

var name = document.getElementById('login__username').value;
    var room_name = document.getElementById('room_name').value;
    console.log(name,room_name);
if(name.length == 0 || room_name.length == 0){

alert('Fields are empty');
    return;
}

e.preventDefault();

localStorage.setItem('name',name);
localStorage.setItem('rname',room_name);

window.open("http://localhost:3000/joinroom");




})