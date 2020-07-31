import React, { Component } from 'react';
import { connect } from 'react-redux';

import Player from './Player.js'

// Redux
import { mapStateToProps } from '../../redux/index.js';

class ConnectedPlayersList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-sm-12 px-0">
                {
                    this.props.usersList.users.map((user, i) => {
                        return (
                            <Player user={user} key={i} />
                        )
                    })
                }
            </div>
        );
    }
}

const PlayersList = connect(mapStateToProps)(ConnectedPlayersList);

export default PlayersList;