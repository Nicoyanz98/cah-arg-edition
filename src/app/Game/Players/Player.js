import React, { Component } from 'react';
import { connect } from 'react-redux';

import socket from '../../socket.js';

import { mapStateToProps } from '../../redux/index.js';

class ConnectedPlayer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, name, score } = this.props.user;
        const { host, judge, status, winner } = this.props.roomInfo.room;
        return (
            <div className="row mx-0">
                <div className="col-sm-12 px-0 d-flex justify-content-between align-items-center text-white">
                    <div className="">
                        {
                            host == id ? <span className="align-middle"><i className="material-icons h-100" style={{fontSize: "16px"}}>star</i></span> : null
                        }
                        {
                            status != "waiting for players" ? ( 
                                judge.id == id ? (
                                    <span className="align-middle"><i className="material-icons h-100" style={{fontSize: "16px"}}>gavel</i></span>
                                ) : (
                                    null
                                )
                            ) : (
                                null
                            )
                        }
                        {
                            winner != null ? (
                                winner.id == id ? <span><i className="material-icons" style={{fontSize: "16px"}}>local_fire_department</i></span>
                                : null
                            ) : null
                        }
                        {id == socket.id ? <strong>{name}</strong> : name}
                    </div>
                    <div className="">{score}</div>
                </div>
            </div>
        )
    }
}
const Player = connect(mapStateToProps)(ConnectedPlayer);

export default Player;