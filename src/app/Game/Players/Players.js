import React, { Component } from 'react';

import PlayersList from './PlayersList.js';

export default class Players extends Component {
    render() {
        return (
            <div className="row mx-0">
                <PlayersList />
            </div>
        );
    }
}