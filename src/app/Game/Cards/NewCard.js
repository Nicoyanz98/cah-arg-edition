import React, { Component } from 'react';

import socket from '../../socket.js';

const inputStyles = {
    background: "rgba(255,255,255,1)",
    color: "black",
    border: "0"
}
const buttonStyles = {
    background: "rgba(0,0,0,1)",
    border: "0"
}

export default class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ""
        }

        this.selectCard = this.selectCard.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    selectCard(e, status, judge, didPlay) {
        e.preventDefault();
        if (status == "players selecting cards" && judge != socket.id && !didPlay)
            this.props.newCardPlayed(this.state.content);
    }

    handleChange(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { status, judge } = this.props;
        const didPlay = this.props.didPlay || null;

        return (
            <div
                className="text-dark bg-light m-2 rounded-lg"
                style={{
                    minHeight: "125px",
                    width: "125px",
                    background: "white",
                    fontSize: "14px"
                }}
            >
                <div className="row mx-0">
                    <div className="col-sm-12 px-0">
                        {
                            status == "players selecting cards" ?
                                <form className="d-flex flex-column" onSubmit={(e) => this.selectCard(e, status, judge, didPlay)}>
                                    <div className="form-group mb-auto">
                                        <input style={inputStyles} type="text" className="form-control shadow-none font-weight-bold rounded-0" placeholder="Escriba el contenido de la carta" onChange={this.handleChange} name="content" value={this.state.content} />
                                    </div>
                                    <button style={buttonStyles} type="submit" className="btn btn-primary btn-block shadow-none rounded-0">
                                        Play New Card
                                    </button>
                                </form>
                            : null
                        }
                    </div>
                </div>
            </div>
        )        
    }
}