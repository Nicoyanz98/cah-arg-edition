import React, { Component } from 'react';

import MessagesList from './MessagesList.js';

export default class MessagesWindow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="rom mx-0 position-relative d-flex justify-content-between text-white" style={{background: "rgba(0,0,0,1)"}}>
                    <h3 className="px-2">Chat</h3>
                    <button className="button" className="btn btn-primary shadow-none text-center" style={{background: "transparent", border: "0"}} onClick={this.props.closeChat}>
                        <i className="material-icons">clear</i>
                    </button>
                </div>
                <div className="row mx-0 flex-grow-1 position-relative border-right border-dark" style={{transform: "rotate(180deg)"}}>
                    <MessagesList username={this.props.username} />
                </div>
            </>
        );
    }
}