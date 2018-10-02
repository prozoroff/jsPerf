import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Code from './Code';
import './Task.css';

class Task extends Component {

    render() {
        const { onRemove, onChange, name, code, result, colorStyle } = this.props;
        return (
            <div className="task" style={this.style}>
                <h1 ref="title">{name}</h1> <h2 style={colorStyle}>{result}</h2>
                <button onClick={onRemove}>✕</button>
                <Code value={code} onChange={onChange} />
            </div>
        )
    }
}

Task.propTypes = {
    name: PropTypes.string,
    code: PropTypes.string,
    onRemove: PropTypes.func,
    onChange: PropTypes.func
}

export default Task
