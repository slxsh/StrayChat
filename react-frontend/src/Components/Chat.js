import React from 'react'
import PropagateLoader from 'react-spinners/PropagateLoader'
import { PulseLoader } from 'react-spinners'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'

import './Chat.css'
import Button from './Button'

var moment = require('moment')

class Chat extends React.Component {
    constructor() {
        super()
        this.state = {
            isFinding : true,
            isTyping : false,
            messages : [],
            input : '',
        }
        this.userFound = this.userFound.bind(this)
        this.setDisconnected = this.setDisconnected.bind(this)
        this.setMessage = this.setMessage.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.clearInput = this.clearInput.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.setTyping = this.setTyping.bind(this)
        this.btnRef = React.createRef() //send button
        this.msgRef = React.createRef() //chat section
    }
    //when user is found
    userFound() {
        this.setState({ isFinding : false })
    }
    //to emit 'typing' msg and store message in state
    handleInput(e) {
        e.preventDefault()
        this.setState({ input : e.target.value })
        if(e.target.value === '')
            this.socket.emit('notyping')
        else
            this.socket.emit('typing')
    }
    //scroll down whenever new message is added
    scrollDown() {
        this.msgRef.current.scrollTop = this.msgRef.current.scrollHeight
    }
    //to send message when enter is hit
    handleEnter(e) {
        if(e.key === 'Enter') {
            this.btnRef.current.click()
        }
    }
    //to empty input when message is sent
    clearInput() {
        this.setState({ input : '' })
    }
    //to send message to backend and clear input area
    sendMessage(e) {
        e.preventDefault()
        if(this.state.input.length > 0 ) {
            this.socket.emit('message', {
                message : this.state.input
            })
            this.clearInput()
        }
    }
    //storing incoming messages from backend into state and scrolling down
    setMessage(data) {
        this.setState(prevState => ({messages : [...prevState.messages, data]}))
        this.scrollDown()
    }
    //to set typing state
    setTyping(bool) {
        this.setState({ isTyping : bool })
        this.scrollDown()
    }
    //to add 'user left the chat' when disconnects
    setDisconnected() {
        this.setState(prevState => ({messages : [...prevState.messages, { id : 'disconnected' }]}))
        this.scrollDown()
    }

    componentDidMount() {
        this.socket = io.connect('http//:localhost:4000')
        this.socket.on('found', () => this.userFound())
        this.socket.on('message', (data) => {
            this.setTyping(false)
            this.setMessage(data)
        })
        this.socket.on('notyping', () => this.setTyping(false))
        this.socket.on('typing', () => this.setTyping(true))
        this.socket.on('disconnected', () => this.setDisconnected())
    }

    componentWillUnmount() {
        this.socket.disconnect() // to close socket after clicking 'leave' or exiting website
    }

    render() {
        // if no user found yet
        if(this.state.isFinding) {
            return (
                <div id="chat-wrapper">
                <div id="chat-card">
                    <div id="btn-leave-wrapper">
                        <Link to="/"><div id="btn-leave">X</div></Link>
                    </div>
                    <div id="loading-section">
                        <PropagateLoader 
                            size={10}
                            color="#ffffff"
                            loading={true}
                            margin={3}
                        /> <br/>
                        <div>Finding someone to join you!</div>
                    </div>
                        <div id="input-section">
                            <input id="input-text" placeholder="Message Here" type="text" disabled/>
                            <div id="btn-send">
                                <Button text=">" width="50px" />
                            </div> 
                            </div>
                        </div>
                    <img id="#logo" src={require('../assets/logo.png')} alt="Logo" width="50px" />
                </div>
            )
        }
        // if a user found to chat
        else {
            return (
                <div id="chat-wrapper">
                    <div id="chat-card">
                        <div id="btn-leave-wrapper">
                            <Link to="/"><div id="btn-leave">X</div></Link>
                        </div>
                        <div id="message-section" ref={this.msgRef}>
                            <div id="initial-msg">
                                <img src={require('../assets/hi.png')} alt="Hi" width="100" />
                                <div>
                                    Someone just joined!
                                </div>
                            </div>
                            {this.state.messages.map(item => {
                                if(item.id === 'disconnected')
                                    return (
                                        <div id="disconnected">
                                            <img src={require('../assets/bye.png')} alt="Bye" width="80" />
                                            <div>User left the chat</div>
                                        </div>
                                    )
                                if(item.id === this.socket.id)
                                        return (
                                            <div className="user-wrapper">
                                                <div className="user-msg">
                                                    {item.message}
                                                    <div className="time-msg">
                                                        {moment.utc(item.date).local().format('h:mm a')}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                return (
                                    <div className="stranger-wrapper">
                                        <div className="stranger-msg">
                                            {item.message}
                                            <div className="time-msg">
                                                {moment.utc(item.date).local().format('h:mm a')}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}    
                            { this.state.isTyping && (
                                <div id="typing">  
                                    <b>Typing </b><span>&nbsp;&nbsp;</span>
                                    <PulseLoader 
                                        size={5}
                                        color="#ffffff"
                                        loading={true}
                                        margin={3}
                                    />
                                </div>
                            )}
                        </div>
                        <div id="input-section">
                            <input id="input-text" name="message" autoComplete="off" placeholder="Message Here" type="text" onChange={this.handleInput} value={this.state.input} onKeyPress={this.handleEnter.bind(this)} maxLength={5000} />
                            <div id="btn-send" onClick={this.sendMessage} ref={this.btnRef}>
                                <Button text=">" width="50px" />
                            </div> 
                        </div>
                    </div>
                    <img id="#logo" src={require('../assets/logo.png')} alt="Logo" width="50px" />
                </div>
            )
        }    
    }
}

export default Chat
