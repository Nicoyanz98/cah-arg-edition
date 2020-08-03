import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from './Card.js';
import NewCard from './NewCard.js';

// Redux
import { mapStateToProps } from '../../redux/index.js';

class ConnectedWhiteCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            played: [],
            roundWinner: null,
            judge: null,
            deck: []
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.roomInfo != prevProps.roomInfo) {
            if (this.props.roomInfo.room != undefined && this.props.userDeck.deck != undefined)
                this.setState({
                    loading: false,
                    played: this.props.roomInfo.room.cards.white.played,
                    roundWinner: this.props.roomInfo.room.cards.white.roundWinner,
                    judge: this.props.roomInfo.room.judge,
                    deck: this.props.userDeck.deck
                });
            if (this.props.userDeck.deck.length != prevProps.userDeck.deck.length)
                this.setState({
                    ...this.state,
                    deck: this.props.userDeck.deck
                });
        }
    }

    render() {
        const { played, roundWinner, deck, judge } = this.state;
        const { loading } = this.state;
        const { status } = this.props.roomInfo.room;
        return (
            <div className="row mx-0">
                <div className="col-sm-12 px-0">
                    {
                        !loading ? (
                            <>
                                <div className="row mx-0 d-flex flex-row pb-3" style={{minHeight: "141px", top: 0}}>
                                    {
                                        played.length > 0 ? (
                                            played.map((deck, i) => {
                                                return <Card deck={deck} status={status} type="played" judge={judge.id} roundWinner={roundWinner} key={i} winnerCard={this.props.winnerCard} />
                                            })
                                        ) : null
                                    }                                        
                                </div>
                                <div className="row mx-0 d-flex flex-row pb-3" style={{bottom: 0}}>
                                    {
                                        deck.map((card, i) => {
                                            return <Card card={card} status={status} type="deck" judge={judge.id} key={i} cardPlayed={this.props.cardPlayed} didPlay={this.props.didPlay} />;
                                        })  
                                    }
                                    <NewCard status={status} judge={judge.id} didPlay={this.props.didPlay} newCardPlayed={this.props.newCardPlayed} />
                                </div>
                            </>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

const WhiteCards = connect(mapStateToProps)(ConnectedWhiteCards);

export default WhiteCards;