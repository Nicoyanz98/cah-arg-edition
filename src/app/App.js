import React, { Component } from 'react';
import {Switch, Route, Link, Redirect, withRouter} from "react-router-dom";
import { connect } from 'react-redux';

import Chat from './Chat/Chat.js';
import Game from './Game/Game.js';
import HomePage from './HomePage.js';

import { mapDispatchToProps, mapStateToProps } from './redux/index.js';

import socket from './socket.js';
import fetch from 'node-fetch';

class ConnectedApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardsToPlay: 1,
            cardsPlayed: [],
            didPlay: false,
            username: "",
            openChat: false
        };
        this.newMessage = this.newMessage.bind(this);
        this.cardPlayed = this.cardPlayed.bind(this);
        this.newCardPlayed = this.newCardPlayed.bind(this);
        this.winnerCard = this.winnerCard.bind(this);
        this.setCardToPlayLimit = this.setCardToPlayLimit.bind(this);
        this.changeUserName = this.changeUserName.bind(this);
        this.connectToRoom = this.connectToRoom.bind(this);
        this.closeChat = this.closeChat.bind(this);
        this.openChat = this.openChat.bind(this);
    }

    componentDidMount() {
        socket.on("chat message", data => {
            this.props.addMessage(data);
        });
        socket.on('user', data => {
            this.props.setInfoUser({user: data});
        })
        socket.on("users", data => {
            this.props.updateUsers(data);
        });
        socket.on('user deck', data => {
            this.props.setUserDeck({deck: data});
        });
        socket.on('game finished', data => {
            this.props.setRoomWinner({winner: data});
        });
        socket.on("room connection", data => {
            this.props.setRoom(data);

            if (data.cards.black != null)
                this.setCardToPlayLimit(data.cards);
                        
            fetch(`/api/cards/white/7`, {
                method: 'POST',
                body: JSON.stringify({deck: data.cards.white.deck}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    this.props.setUserDeck({deck: data});
                    socket.emit("user deck", data);
                })
                .catch(err => console.log(err));
        });
        socket.on("room host", data => {
            this.props.changeRoomHost(data);
        });
        socket.on("room status", data => {
            if (data.status == "players selecting cards") this.setState({...this.state, didPlay: false})
            this.props.updateRoomStatus(data);
        });
        socket.on("room timer", data => {
            if (data.timer == 0) {
                if (this.props.roomInfo.room.status == "players selecting cards" && !this.state.didPlay) {
                    var limit = this.state.cardsToPlay - this.state.cardPlayed.length;
                    for (var i = 0; i < limit; i++) {
                        this.cardPlayed(this.props.userDeck.deck[Math.floor(Math.random() * this.props.userDeck.deck.length)]);
                    }
                } else if (this.props.roomInfo.room.status == "judge choosing a card" && socket.id == this.props.roomInfo.room.judge.id){
                    const deck = this.props.roomInfo.room.cards.white.played;
                    this.winnerCard(deck[Math.floor(Math.random() * deck.length)]);
                } else if ((this.props.roomInfo.room.status == "card chosen" || this.props.roomInfo.room.status == "waiting for players") && this.props.userDeck.deck.length < 7) {
                    console.log("here")
                    fetch(`/api/cards/white/${7-this.props.userDeck.deck.length}`, {
                        method: 'POST',
                        body: JSON.stringify({deck: this.props.roomInfo.room.cards.white.deck}),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            data.map(card => {
                                this.props.addCardToUserDeck(card);
                                socket.emit("user deck add", card)
                            })
                        })
                        .catch(err => console.log(err));
                }
            }                
            this.props.roomTime(data);
        });
        socket.on("room judge", data => {
            this.props.setRoomJudge(data);
        });
        socket.on('room black card', data => {
            this.props.setBlackCard(data);
            this.setCardToPlayLimit(data);
        });
        socket.on('room white cards', data => {
            this.props.updateRoomDeck(data);
        });
        socket.on('room cards played', data => {
            this.props.setTableCards(data);
        });
        socket.on('room card chosen', data => {
            this.props.roundCardWinner(data);
        });
    }

    setCardToPlayLimit(data) {
        if (data.black.content.split('<blank>').length-1 > 1)
            this.setState({
                ...this.state,
                cardsToPlay: data.black.content.split('<blank>').length-1
            });
    }

    newMessage(content) {
        const message = {
            sender: this.props.userInfo.user.name,
            content: content
        };

        socket.emit('message', message);
    }

    cardPlayed(cardContent, newCard = false) {
        // Create card
        const card = {
            user: socket.id,
            card: cardContent,
            newCard: newCard
        };

        if (this.state.cardsPlayed.filter(item => item.card._id == card.card._id).length == 0) // Check if the cards to play are not repeted
            this.setState({
                ...this.state,
                cardsPlayed: [...this.state.cardsPlayed, card]
            }, () => {
                if (this.state.cardsPlayed.length == this.state.cardsToPlay) { // Check if i have enough cards to play ready
                    this.setState({
                        ...this.state,
                        didPlay: true
                    });
                    socket.emit('user deck delete', this.state.cardsPlayed);
                    socket.emit('card played', this.state.cardsPlayed);
                    this.setState({...this.state, cardsPlayed: []})
                }
            });
        else {
            var cards = this.state.cardsPlayed.filter(item => item.card._id != card.card._i);
            this.setState({
                ...this.state,
                cardPlayed: cards
            }); // Cancel the repeted card
        }
    }

    winnerCard(deckContent) {
        const cardsContent = deckContent.map(card => card.card)
        const cards = {
            user: deckContent[0].user,
            cards: cardsContent
        }

        socket.emit('judge choice', cards);
    }

    newCardPlayed(cardContent) {
        fetch(`/api/cards/new/white`, {
            method: 'POST',
            body: JSON.stringify({content: cardContent}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                this.cardPlayed(data, true)
            })
            .catch(err => console.log(err));
    }

    changeUserName(username) {
        this.setState({...this.state, username: username})
        socket.emit('change username', {name: username})
    }

    connectToRoom(action, roomId = null) {
        fetch(`/api/room/${action == 'create' ? "new" : roomId}`, {
            method: 'POST',
            body: JSON.stringify({
                socket: socket.id,
                user: this.props.userInfo.user
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.err)
                    this.props.history.push(`/room/${data.room}`)
                else {
                    alert(data.err);
                }
            })
            .catch(err => console.log(err));
    }

    closeChat() {
        this.setState({
            ...this.state,
            openChat: false
        })
    }

    openChat() {
        this.setState({
            ...this.state,
            openChat: true
        })
    }

    render() {
        return (
            <React.Fragment>
                <Switch>
                    <React.Fragment>
                        <div className="row mx-0 w-100 h-100" style={{background: "#000"}}>
                            <Route exact path="/">
                                <HomePage changeUserName={this.changeUserName} connectToRoom={this.connectToRoom} username={this.state.username} />
                            </Route>
                            <Route exact path="/room/:roomId">
                                <div className="row mx-0 h-100 w-100" style={{minHeight: "100vh"}}>
                                    <div className="col-sm-12 px-0 d-flex flex-column">
                                        <Game cardPlayed={this.cardPlayed} winnerCard={this.winnerCard} didPlay={this.state.didPlay} newCardPlayed={this.newCardPlayed} />
                                    </div>
                                    <button className="button" className="btn btn-primary shadow-none position-fixed d-flex justify-content-around text-white rounded-circle" style={{background: "rgba(0,0,0,1)", border: "0", bottom: "10px", right: "10px"}} onClick={this.openChat}>
                                        <i className="material-icons">forum</i>
                                    </button>
                                    <div className={`col-sm-3 px-0 ${this.state.openChat ? "d-flex" : "d-none"} flex-column position-fixed bg-light h-100`} style={{right: "0", zIndex: "100"}}>
                                        <Chat newMessage={this.newMessage} closeChat={this.closeChat} username={this.state.username} />
                                    </div>
                                </div>
                            </Route>
                            <div className="row mx-0 w-100 pt-3 bg-light">
                                <div className="col-sm-12">
                                    <h6>Cards Against Humanity: Argentina Edition 2020</h6>
                                    <p>El juego Cards Against Humanity no me pretenece. Este es solo un proyecto sin fines de lucro hecho por un fan del juego original, con el fin de poder jugarlo de online, en castellano, con frases personalizadas y poder practicar programación. Cards Against Humanity pertenecen a sus respectivos creadores y dueños.</p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                </Switch>
            </React.Fragment>
        );
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default withRouter(App);