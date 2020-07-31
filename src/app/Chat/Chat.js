import React, { Component } from 'react';

import MessagesWindow from './MessagesWindow.js';
import MessageForm from './MessageForm.js';

export default class Chat extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <MessagesWindow closeChat={this.props.closeChat} username={this.props.username} />
                <MessageForm newMessage={this.props.newMessage} />
            </>
        );
    }
}