/**
 * - array of rooms
 * - room object
 * - room object -users
 */
const User = require("./utils/User");

class Room {
  constructor(name) {
    this.name = name;
    this.users = [];
    this.TurnCount = 0;
    this.hasGameStarted = false;
    this.currentword = "null";
    this.UserToDraw = 0;
  }

  addUser(user) {
    this.users.push(user);
  }

  getusers() {
    return this.users;
  }
}

class Connection {
  constructor() {
    this.rooms = new Map();
  }

  addmembertoroom(roomname, username, id) {
    this.rooms.get(roomname).addUser(new User(username, roomname, id));
  }

  addnewroom(roomname, username, id) {
    if (this.rooms.has(roomname)) {
      this.addmembertoroom(roomname, username, id);
    } else {
      this.rooms.set(roomname, new Room(roomname));
      this.addmembertoroom(roomname, username, id);
    }
  }
}

module.exports = {
  Room,
  Connection,
};
