const _ = require('lodash');
const fetch = require('node-fetch');
const { setInterval, clearInterval } = require('timers');

const fetchBlackCard = (room, baseURL, io) => {
    fetch(new URL('/api/cards/black', baseURL))
        .then(res => res.json())
        .then(data => {
            room.cards.black = data;
            io.to("room-"+room.id).emit('room black card', {black: room.cards.black})
        })
        .catch(err => console.log(err));
}

const getRoom = (socket, rooms) => {
    return rooms[_.findIndex(rooms, room => _.filter(room.users, user => user.id == socket.id).length != 0)];
}

const getUser = (socket, users) => {
    return users[_.findIndex(users, user => user.id == socket.id)];
}

const getSocket = (id, io) => {
    return io.sockets.connected[_.find(Object.keys(io.sockets.connected), key => key == id)];
}

const joinRoom = (socket, room, newUser, io, baseURL) => {
    room.users.push({
        id: newUser.id,
        name: newUser.name,
        score: 0
    });
    if (room.users.length >= 3 && (room.status != "players selecting cards" || room.status != "judge choosing a card")) {
        roomStatus(room, "players selecting cards", io);

        room.interval = setInterval(() => {
            if (room.status == "game finished") {
                clearInterval(room.interval);
                io.to("room-" + room.id).emit('room timer', {timer: room.timer});
            } else {
                room.timer--;
                io.to("room-" + room.id).emit('room timer', {timer: room.timer});
                if (room.timer == 0) {
                    if (room.status != "judge choosing a card" && room.status != "card chosen")
                        roomStatus(room, "judge choosing a card", io);
                    else if (room.status == "card chosen") {
                        fetchBlackCard(room, baseURL, io);
                        roomStatus(room, "players selecting cards", io);
                        let judgeIndex = (room.judge.index+1 < room.users.length) ? (room.judge.index+1) : 0;
                        room.judge = {
                            id: room.users[judgeIndex].id,
                            index: judgeIndex
                        };
                        io.to("room-" + room.id).emit('room judge', {judge: room.judge});
                    }
                }
            }
        }, 1000);
    }

    socket.join("room-" + room.id);
    io.to(socket.id).emit('room connection', _.omit(room, ['users', 'interval']));
}

const createRoom = (socket, rooms, newUser, io, baseURL) => {
    let newRoomId = Math.random().toString(36).slice(2, 7);
    
    let newRoom = {
        id: newRoomId,
        name : newUser.name + "'s room",
        host: newUser.id,
        status: "waiting for players",
        judge: {
            id: newUser.id,
            index: 0
        },
        winner: null,
        timer: null,
        users: [{
            id: newUser.id,
            name: newUser.name,
            score: 0
        }],
        cards: {
            white: {
                roundWinner: null,
                played: [],
                deck: []
            },
            black: null
        },
        interval: null
    };
    rooms.push(newRoom);

    socket.join("room-" + newRoomId);
    io.to(socket.id).emit('room connection', _.omit(newRoom, ['users', 'interval']));

    fetchBlackCard(getRoom(socket, rooms), baseURL, io);
}

const roomStatus = (room, status, io) => {
    if (status == "players selecting cards") {
        room.timer = 120;
        startOver(room, io);
    }
    if (status == "judge choosing a card")
        room.timer = 60;
    if (status == "card chosen")
        room.timer = 10;
    if (status == "waiting for players") {
        startOver(room, io);
    }
    if (status == "game finished")
        room.timer = null;
    room.status = status;
    io.to("room-" + room.id).emit('room status', {status: room.status});
}

const startOver = (room, io) => {
    room.cards.white.played = [];
    io.to("room-"+room.id).emit('room cards played', {tableCards: room.cards.white.played})
    room.cards.white.roundWinner = null;
    io.to("room-"+room.id).emit('room card chosen', {card: room.cards.white.roundWinner});
}

const shuffle = (array) => {
    let shuffledArray = array;
    for(let i = array.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return shuffledArray;
}

module.exports = {getUser, getRoom, createRoom, joinRoom, shuffle, roomStatus, fetchBlackCard, getSocket};