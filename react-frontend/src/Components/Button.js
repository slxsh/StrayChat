import React from 'react'

import './Button.css'

class Button extends React.Component {
    
    render() {
        return (
            <div id="btn" style={{ width : this.props.width }}>
                <div id="btn-text">
                    {this.props.text}
                </div>
            </div>
        )
    }
}

export default Button