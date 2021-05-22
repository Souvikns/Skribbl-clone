/**
 * - array of rooms 
 * - room object 
 * - room object -users 
 */




class User {
    constructor(name){
        this.name = name;
        this.score = 0;
    }
};


class Room {
    constructor(name, users){
        this.name = name;
        this.users = users;
        this.TurnCount = 0;
        this.hasGameStarted = false;
        this.UserToDraw = users[0];
    }

    addUser(user){
        this.users.push(user);
    }
}


class Connection {
    constructor(){
        this.rooms = []
    }

    addUser(room_name, user_name){
        let foundRoom = this.rooms.filter(room.name === room_name);
        
        if(Array.isArray(foundRoom) && foundRoom.length === 0){
            this.rooms.push(new Room(room, [new User(user_name)]));
            return;
        }

        foundRoom[0].addUser(new User(user_name));
    }
}

let connections = new Connection();

module.exports  = {
    User,
    Room,
    connections
}