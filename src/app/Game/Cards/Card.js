import React, { Component } from 'react';

import socket from '../../socket.js';

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.selectCard = this.selectCard.bind(this);
    }

    selectCard(card, deck, type, status, judge, didPlay) {
        if (status == "players selecting cards" && judge != socket.id && type == "deck" && !didPlay)
            this.props.cardPlayed(card);
        else if (status == "judge choosing a card" && judge == socket.id && type == "played") {
            this.props.winnerCard(deck);
        }
    }
    
    renderCardUser(user, status, roundWinner) {
        if (user != null && roundWinner != null) {
            if (status == "card chosen" || status == "game finished")
                return (
                    <div>
                        <div className="text-center p-2">
                        {
                            roundWinner.user.id == user.id ? (
                                user.id == socket.id ? (
                                    <strong>
                                        <p className="mb-0"><i className="material-icons" style={{fontSize: "16px"}}>thumb_up</i></p>
                                        <p className="mb-0">{user.name.length > 10 ? user.name.substr(0,10)+"..." : user.name}</p>
                                    </strong>
                                ) : (
                                    <>
                                        <p className="mb-0"><i className="material-icons" style={{fontSize: "16px"}}>thumb_up</i></p>
                                        <p className="mb-0">{user.name.length > 10 ? user.name.substr(0,10)+"..." : user.name}</p>
                                    </>
                                )
                            ) : (
                                user.id == socket.id ? (
                                    <strong>
                                        {user.name.length > 10 ? user.name.substr(0,10)+"..." : user.name}
                                    </strong>
                                ) : (
                                    user.name.length > 10 ? user.name.substr(0,10)+"..." : user.name
                                )
                            )
                        }
                        </div>
                    </div>
                )
        }
    }

    render() {
        const { status, judge } = this.props;
        const type = this.props.type || null;
        const card = this.props.card || null;
        const user = this.props.cardUser || null;
        const roundWinner = this.props.roundWinner || null;
        const deck = this.props.deck || null;
        const didPlay = this.props.didPlay || null;

        return (
            <div
                className={`${type != null ? "text-dark bg-light m-2" : "text-light mx-auto border border-light"} rounded-lg`}
                style={{
                    cursor: `${status == "waiting for players" || status == "card chosen" || status == "game finished" ? (
                            ""
                        ) : (
                            judge == socket.id ? (
                                type == "deck" ? (
                                    ""
                                ) : (
                                    status == "judge choosing a card" ? 
                                        "pointer" : ""
                                )
                            ) : (
                                type == "deck" ?
                                    status == "players selecting cards" ? (
                                        !didPlay ?
                                            "pointer" : ""
                                    ) : ""
                                : (
                                    ""
                                )
                            )   
                        )}`,
                    minHeight: "125px",
                    width: "125px",
                    background: `${card != null && card.type == "black" ? "black" : "white"}`,
                    borderWidth: `${card != null && card.type == "black" ? "2px !important" : "0"}`,
                    fontSize: "14px"
                }}
                onClick={() => this.selectCard(card, deck, type, status, judge, didPlay)}
            >
                {
                    deck != null ? (
                        deck.map((item, key) => {
                            var user = item.user;
                            var card = item.card;
                            return (
                                <React.Fragment key={key={key}}>
                                    <div
                                        className={`${card.type == 'white' ? "text-dark" : "text-light"} p-2 font-weight-bold border-black ${deck.length == 1 ? "" : "border-top"}`}
                                    >
                                        {
                                            card.type == 'black' ? (
                                                card.content.includes('<blank>') ?
                                                    card.content.replace('<blank>', '_______')
                                                : card.content
                                            ) : (
                                                status == "players selecting cards" ? (
                                                    user != null ? (
                                                        user.id == socket.id ? (
                                                            card.content
                                                        ) : null
                                                    ) : null
                                                ) : (
                                                    (status == "judge choosing a card" || status == "card chosen" || status == "game finished") && type == "played" ? (
                                                        card.content
                                                    ) : null
                                                )
                                            )
                                        }
                                    </div>
                                    {this.renderCardUser(user,status,roundWinner)}
                                </React.Fragment>
                            )
                        })
                    ) : (
                        <>
                            <div className={`${card.type == 'white' ? "text-dark" : "text-light"} p-2 font-weight-bold`}>
                                {
                                    card.type == 'black' ? (
                                        card.content.includes('<blank>') ?
                                            card.content.replace('<blank>', '_______')
                                        : card.content
                                    ) : (
                                        user != null ? (
                                            user.id == socket.id ? (
                                                card.content
                                            ) : null
                                        ) : status == "players selecting cards" ?
                                            card.content
                                        : status == "judge choosing a card" && type == "played" ? (
                                            card.content
                                        ) : null
                                    )
                                }
                            </div>
                        </>
                    )
                }                
            </div>
        )        
    }
}