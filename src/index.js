const express = require('express');
const morgan = require('morgan');
const path = require('path');
const _ = require('lodash');
const { clearInterval } = require('timers');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config();

const { mongoose } = require('./database');

const { getUser, getRoom, createRoom, joinRoom, shuffle, roomStatus } = require('./functions');
const { base } = require('./models/card');

// Settings
app.set('port', process.env.PORT || 3000);
const baseURL = process.env.API_URL || ("http://localhost:" + app.get('port'));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    req.rooms = rooms;
    req.users = users;
    req.baseURL = baseURL;
    next();
});

// Routes
app.use('/api/cards', require('./routes/card.routes'));
app.use('/room', require('./routes/rooms.routes'));

// Static files
app.use(express.static(path.join(__dirname, 'public/')));

// Rooms and Users
var users = [];
var rooms = [];

// Socket connection
io.set('origins', '*:*');
io.on('connection', (socket) =>{
    let newUser = {
        id: socket.id,
        name: socket.id.toString(),
        deck: []
    };
    users.push(newUser);

    socket.on('change username', (data) => {
        getUser(socket, users).name = data.name;
        io.to(socket.id).emit('user', getUser(socket, users));
    });
    
    socket.on('card played', (data) => {
        var cardsPlayed = data.map(dataCard => {
            var cardInfo = {
                card: dataCard.card,
                user: {
                    id: dataCard.user,
                    name: getUser(socket, users).name
                }
            };
            if (!dataCard.newCard) {
                _.remove(getRoom(socket, rooms).cards.white.deck, item => item._id == dataCard.card._id);
                _.remove(getUser(socket, users).deck, card => card._id == dataCard.card._id);
            }
            return cardInfo;
        });
        getRoom(socket, rooms).cards.white.played.push(cardsPlayed);
        
        if (getRoom(socket, rooms).cards.white.played.length == getRoom(socket, rooms).users.length-1) {
            roomStatus(getRoom(socket, rooms), "judge choosing a card", io);
            io.to("room-"+getRoom(socket, rooms).id).emit('room cards played', {tableCards: shuffle(getRoom(socket, rooms).cards.white.played)});
        } else
            io.to("room-"+getRoom(socket, rooms).id).emit('room cards played', {tableCards: getRoom(socket, rooms).cards.white.played});
        io.to("room-"+getRoom(socket, rooms).id).emit('room white cards', {deck: getRoom(socket, rooms).cards.white.deck});        
    });

    socket.on('judge choice', (data) => {
        roomStatus(getRoom(socket, rooms), "card chosen", io);
        var userSelected = getRoom(socket, rooms).users[_.findIndex(getRoom(socket, rooms).users, user => user.id == data.user.id)];
        userSelected.score += 1;
        if (userSelected.score >= 5) {
            roomStatus(getRoom(socket, rooms), 'game finished', io);
            getRoom(socket, rooms).winner = userSelected;
            io.to("room-"+getRoom(socket, rooms).id).emit('game finished', getRoom(socket, rooms).winner)
        }
        getRoom(socket, rooms).cards.white.roundWinner = data;
        io.to("room-"+getRoom(socket, rooms).id).emit('users', getRoom(socket, rooms).users);
        io.to("room-"+getRoom(socket, rooms).id).emit('room card chosen', {card: data});
    });

    socket.on('user deck', (data) => {
        getUser(socket, users).deck = data;
        data.map(card => {
            if (getRoom(socket, rooms).cards.white.deck.filter(item => item._id == card._id).length == 0)
                getRoom(socket, rooms).cards.white.deck = [...getRoom(socket, rooms).cards.white.deck, card];
        })
        io.to("room-"+getRoom(socket, rooms).id).emit('room white cards', {deck: getRoom(socket, rooms).cards.white.deck});
    });

    socket.on('user deck delete', (data) => {
        data.map(deletedCard => {
            if (!deletedCard.newCard) {
                _.remove(getUser(socket, users).deck, card => card._id == deletedCard.card._id);
                _.remove(getRoom(socket, rooms).cards.white.deck, card => card._id == deletedCard.card._id);
            }
        });

        io.to(socket.id).emit('user deck', getUser(socket, users).deck);
        io.to("room-"+getRoom(socket, rooms).id).emit('room white cards', {deck: getRoom(socket, rooms).cards.white.deck});
    });

    socket.on('user deck add', (data) => {
        getUser(socket, users).deck = [...getUser(socket, users).deck, data];
        getRoom(socket, rooms).cards.white.deck = [...getRoom(socket, rooms).cards.white.deck, data];

        io.to("room-"+getRoom(socket, rooms).id).emit('room white cards', {deck: getRoom(socket, rooms).cards.white.deck});
    });

    socket.on('disconnect', () => {
        let userDisconnected = getUser(socket, users);
        let userDisconnectedRoom = getRoom(userDisconnected, rooms);

        if (userDisconnected != undefined && userDisconnectedRoom != undefined) {
            console.log(`a user (${userDisconnected.id}) disconnected from "${userDisconnectedRoom.id}"`);
        
            _.map(userDisconnected.deck, card => _.remove(userDisconnectedRoom.cards.white.deck, item => item._id === card._id)) // Remove cards from room deck
            io.to("room-"+userDisconnectedRoom.id).emit('room white cards', {deck: userDisconnectedRoom.cards.white.deck})

            _.remove(userDisconnectedRoom.cards.white.played, deck => deck[0].user.id == socket.id) // Remove cards played by the disconnected user
            io.to("room-"+userDisconnectedRoom.id).emit('room cards played', {tableCards: userDisconnectedRoom.cards.white.played});

            _.remove(users, item => item.id == userDisconnected.id); // Remove from users
            _.remove(userDisconnectedRoom.users, user => user.id == userDisconnected.id); // Remove user from room
            io.to("room-"+userDisconnectedRoom.id).emit('users', userDisconnectedRoom.users);
            
            if (userDisconnectedRoom.users.length <= 0)
                _.remove(rooms, item => item.users.length <= 0); // Remove room when empty
            else {
                if (userDisconnectedRoom.users.length < 3) {
                    roomStatus(userDisconnectedRoom, "waiting for players", io);
                    if (userDisconnectedRoom.interval != null)
                        clearInterval(userDisconnectedRoom.interval);
                }

                if (userDisconnectedRoom.judge != null) {
                    if (userDisconnectedRoom.judge.id == userDisconnected.id) {
                        while (userDisconnectedRoom.judge.index >= userDisconnectedRoom.users.length) userDisconnectedRoom.judge.index--;
                        userDisconnectedRoom.judge =  {
                            ...userDisconnectedRoom.judge,
                            id: userDisconnectedRoom.users[userDisconnectedRoom.judge.index].id
                        };
                        _.remove(userDisconnectedRoom.cards.white.played, deck => deck[0].user.id ==  userDisconnectedRoom.judge.id) // Remove cards played by the new judge
                        io.to("room-"+userDisconnectedRoom.id).emit('room cards played', {tableCards: userDisconnectedRoom.cards.white.played});

                        io.to("room-" + userDisconnectedRoom.id).emit('room judge', {judge: userDisconnectedRoom.judge});
                    }
                }
                
                if (userDisconnectedRoom.host == userDisconnected.id) {
                    userDisconnectedRoom.host = userDisconnectedRoom.users[0].id;
                    io.to("room-"+userDisconnectedRoom.id).emit("room host", {host: userDisconnectedRoom.host});
                }
            }
        }
    });

    socket.on('message', (data) => {
        io.to("room-"+getRoom(socket, rooms).id).emit('chat message', data);
    });
});

// Starting the server
http.listen(app.get('port'), () => {
    console.log(`server is on port ${app.get('port')}`);
});

// Redirect to root ('/') when error 404
app.use((req, res, next) => {
    if (res.status(404)) {
        res.redirect(baseURL);
    }
});