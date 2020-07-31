import React, { Component } from 'react';
import { connect } from 'react-redux';

// Redux
import { mapStateToProps } from '../../redux/index.js';

class ConnectedRoomStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.roomInfo != prevProps.roomInfo) {
            this.setState({loading: false});
        }
    }

    render() {
        const { loading } = this.state;
        const { timer, status } = this.props.roomInfo.room;
        return (
            <div className="row mx-0">
                <div className="col-sm-12 px-0 d-flex align-items-center">
                    <div className="bg-light text-center rounded-lg mr-2" style={{color: "black"}}>
                        <p className="mb-0 p-2">{timer == null || status == "waiting for players" ? "-" : timer}</p>
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="mb-0 text-white">
                            {
                                !loading ? status.toUpperCase() : null
                            }
                        </h6>
                    </div>
                </div>
            </div>
        );
    }
}

const RoomStatus = connect(mapStateToProps)(ConnectedRoomStatus);

export default RoomStatus;