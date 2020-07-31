import React, { Component } from 'react';

export default class Message extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { content, sender } = this.props.message;
        return (
            <div className="row mx-0 w-100"  style={{transform: "rotate(180deg)", direction: "ltr"}}>
                <div className="col-sm-12 px-0 w-100" style={{wordWrap: "break-word"}}>
                    <p className="mb-0 px-2"><strong>{sender == this.props.username ? "Me" : sender.toString()}:</strong> {content}</p>
                </div>
            </div>
        )
    }
}