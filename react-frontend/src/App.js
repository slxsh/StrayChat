import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Main from './Components/Main'
import Chat from './Components/Chat'

import './App.css'
class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Main} />
                    <Route path="/chat" component={Chat} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        )
    }
}

export default App