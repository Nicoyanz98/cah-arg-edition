import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from './Card.js';

// Redux
import { mapStateToProps } from '../../redux/index.js';

class ConnectedBlackCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            black: null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.roomInfo != prevProps.roomInfo) {
            if (this.props.roomInfo.room != undefined && this.props.roomInfo.room.cards.black != undefined)
                this.setState({loading: false, black: this.props.roomInfo.room.cards.black});
        }
    }

    render() {
        const { loading, black } = this.state;
        const { status } = this.props.roomInfo.room;
        return (
            <>
                <div className="row mx-0">
                    {
                        !loading ? <Card card={black} status={status} /> : null
                    }
                </div>
            </>
        );
    }
}

const BlackCards = connect(mapStateToProps)(ConnectedBlackCards);

export default BlackCards;