import React, { Component } from 'react';

const inputStyles = {
    background: "rgba(0,0,0,1)",
    color: "white",
    border: "0"
}
const buttonStyles = {
    background: "rgba(0,0,0,1)",
    border: "0"
}

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            roomId: ""            
        }

        this.createRoom = this.createRoom.bind(this);
        this.changeUserName = this.changeUserName.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        });
    }

    joinRoom(e) {
        e.preventDefault();
        if (this.props.username != "") {
            if (this.state.roomId != "")
                this.props.connectToRoom("join", this.state.roomId);
            else alert("Ingrese la ID de una sala para unirse");
        } else alert("Cambie su nombre nombre de usuario");
    }

    changeUserName(e) {
        e.preventDefault();
        this.props.changeUserName(this.state.username);
    }

    createRoom() {
        if (this.props.username != "")
            this.props.connectToRoom("create");
        else alert("Cambie su nombre nombre de usuario");
    }

    render() {
        return (
            <div className="mx-0 d-flex flex-column align-items-center" style={{width: "100vw", maxWidth: "100vw", height: "100vh", maxHeight: "100vh"}}>
                <div className="px-0 text-center text-white">
                    <h1>Cards Against Humanity</h1>
                    <h3>Argentina Edition</h3>
                </div>
                <div className="w-75 px-0 text-center text-white">
                    <h5>Advertencia: Este juego contiene lenguaje no apto para menores de 18 años y trata con temas que podrían resultar ofensivos. Juegue a su discreción.</h5>
                </div>
                <div className="row mx-0 h-100 w-100 d-flex flex-column align-items-center">
                    <div className="col-sm-5 px-0 my-auto">
                        <div className="row mx-0">
                            <div className="col-sm-12 px-0">
                                <form onSubmit={this.changeUserName}>
                                    <div className="form-group mb-0">
                                        <input style={inputStyles} type="text" className="form-control shadow-none rounded-0" placeholder="Escriba su nombre de usuario" onChange={this.handleChange} name="username" value={this.state.username} />
                                    </div>
                                    <button style={buttonStyles} type="submit" className="btn btn-primary btn-block shadow-none rounded-0">
                                        Change Name
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="row mx-0 d-flex flex-column align-items-center mt-3">
                            <button style={buttonStyles} type="button" className="btn btn-primary btn-block shadow-none rounded-0" onClick={this.createRoom}>
                                Create Room
                            </button>
                            <div className="row mx-0 w-100 mt-3">
                                <div className="col-sm-12 px-0">
                                    <form onSubmit={this.joinRoom}>
                                        <div className="form-group mb-0">
                                            <input style={inputStyles} type="text" className="form-control shadow-none rounded-0" placeholder="Escriba la ID de la sala a unirse" onChange={this.handleChange} name="roomId" value={this.state.roomId} />
                                        </div>
                                        <button style={buttonStyles} type="submit" className="btn btn-primary btn-block shadow-none rounded-0">
                                            Join Room
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}