import React, { Component } from 'react';

export default class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        e.preventDefault();
        var content = this.state.content.trim();
        if (content != "") {
            this.props.newMessage(content);
            this.setState({ content: "" });
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="row mx-0">
                <div className="col-sm-12 px-0">
                    <form onSubmit={this.sendMessage}>
                        <div className="row mx-0 border border-dark">
                            <div className="col-sm-9 px-0">
                                <div className="form-group mb-0">
                                    <input type="text" className="form-control shadow-none border-0 rounded-0" placeholder="Escribe un mensaje" onChange={this.handleChange} name="content" value={this.state.content} />
                                </div>
                            </div>
                            <div className="col-sm-3 px-0">
                                <button type="submit" className="btn btn-primary btn-block shadow-none rounded-0 border-0 h-100 d-flex justify-content-around" style={{background: "rgba(0,0,0,1)"}}>
                                    <i className="material-icons">send</i>
                                </button>
                            </div>
                            
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}