import React, { Component } from 'react';
import { connect } from 'react-redux';

import Message from './Message.js';

// Redux
import { mapStateToProps } from '../redux/index.js';

class ConnectedMessagesList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-sm-12 px-0 position-absolute" style={{overflowY: "auto", bottom: "0", top: "0", right: "0", left: "0", direction: "rtl"}}>
            {
                // console.log(this.props.messages);
                this.props.messagesList.messages.map( (message, i) => {
                    return <Message message={message} key={i} username={this.props.username} />
                })
            }
            </div>
        )
    }
}

const MessagesList = connect(mapStateToProps)(ConnectedMessagesList);

export default MessagesList;