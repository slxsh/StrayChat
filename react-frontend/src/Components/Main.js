import React from 'react'
import { Link } from 'react-router-dom'

import Button from './Button'
import './Main.css'

class Main extends React.Component {
    constructor() {
        super()
    }
    render() {
        return (
            <div id="main-wrapper">
                <div id="wrapper">
                    <img src={require('../assets/logo.png')} width="50px" alt="Logo" id="logo" />
                    <div id="desc-wrapper">
                        <p className="main-desc">CHAT</p>
                        <p className="main-desc">WITH</p>
                        <p className="main-desc">STRANGERS</p>
                        <div id="not-main-wrapper">
                            <p className="not-main-desc">Connect and socialize with random</p>
                            <p className="not-main-desc">people on the internet looking to do the same</p>
                        </div>
                    </div>
                    <div id="main-btn-wrapper">
                        <Link to="/chat"><Button text="Start Chatting" width="150px" /></Link>
                    </div>
                </div>
                <div id="about-wrapper">
                    <div id="about-text">
                        <h1 id="about-head">STRAYCHAT</h1>
                        <div id="about-body">
                            <div id="rules-wrapper">
                                <p>Anonymous chatting is just a click away! You don't need any account. <br/> Avoid revealing any personal details or any sensitive information. Please don't get involved in racism, hate speech or any form of harassment. Be respectful. If you encounter a misbehaving individual feel free to leave the chat. Don't use any scripts or bots to initiate a chat. Happy socializing!</p>
                            </div>
                            <div id="developer">
                                Designed & Developed by
                                <p id="name"><a href="https://github.com/slxsh" target="_blank" rel="noopener noreferrer">Imtiaz Alam</a></p>
                            </div>
                            <div id="github">
                                Open sourced on <br/><br/>
                                <a href="https://github.com/slxsh/StrayChat" target="_blank" rel="noopener noreferrer"><Button text="Github" width="150px" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main