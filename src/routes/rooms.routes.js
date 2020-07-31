const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { getUser, getRoom, createRoom, joinRoom, getSocket } = require('../functions');

router.post('/new', (req, res, next) => {
    const socket = getSocket(req.body.socket, req.io);
    createRoom(socket, req.rooms, req.body.user, req.io, req.baseURL);
    console.log(`a user (${getUser(socket, req.users).id}) is connected to "${getRoom(socket, req.rooms).id}"`);
    req.io.to("room-"+getRoom(socket, req.rooms).id).emit('users', getRoom(socket, req.rooms).users);
    res.json({room: getRoom(socket, req.rooms).id});
})

router.post('/:roomId', (req, res, next) => {
    const socket = getSocket(req.body.socket, req.io);

    if (req.params.roomId.length <= 5) {
        if (req.rooms.length != 0 && req.rooms.filter(room => room.id == req.params.roomId).length != 0) {
            if (req.rooms.filter(room => room.id == req.params.roomId)[0].users.length < 6) {
                joinRoom(socket, req.rooms[_.findIndex(req.rooms, room => room.id == req.params.roomId)], req.body.user, req.io);

                console.log(`a user (${getUser(socket, req.users).id}) is connected to "${getRoom(socket, req.rooms).id}"`);
                req.io.to("room-"+getRoom(socket, req.rooms).id).emit('users', getRoom(socket, req.rooms).users);
                res.json({room: getRoom(socket, req.rooms).id});
            } else
                res.json({err: "Room full"});
        } else {
            res.json({err: "Room doesn't exist"})
        }
    } else {
        res.json({err: "Wrong Room ID"});
    }
})


module.exports = router;