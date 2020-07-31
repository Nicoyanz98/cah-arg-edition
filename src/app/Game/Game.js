import React, { Component } from 'react';
import { connect } from 'react-redux';

// Redux
import { mapStateToProps } from '../redux/index.js';

import BlackCard from './Cards/BlackCard.js';
import WhiteCards from './Cards/WhiteCards.js';
import Players from './Players/Players.js';
import Settings from './Settings/Settings.js';
import RoomStatus from './Room/RoomStatus.js';

class ConnectedGame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="row mx-0 mt-2">
                    <div className="col-sm-4 px-0">
                        <BlackCard />
                    </div>
                    <div className="col-sm-4 px-0">
                        <RoomStatus />
                        <Players />
                    </div>
                    <div className="col-sm-4 px-0">
                        <Settings />
                    </div>
                </div>
                <div className="row mx-0 mt-auto">
                    <div className="col-sm-12 px-0 pt-2">
                        <WhiteCards cardPlayed={this.props.cardPlayed} winnerCard={this.props.winnerCard} didPlay={this.props.didPlay} />
                    </div>
                </div>
            </>
        );
    }
}

const Game = connect(mapStateToProps)(ConnectedGame);

export default Game;