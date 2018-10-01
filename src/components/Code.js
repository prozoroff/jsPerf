import React, { Component } from 'react';
import PropTypes from 'prop-types'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

class Code extends Component {

  render() {
  	const { onChange, value } = this.props;
    return (
       <AceEditor
    		mode="javascript"
    		theme="github"
    		height="150px"
    		width="100%"
    		value={value}
    		onChange={onChange}
    		editorProps={{$blockScrolling: true}}
  		/>
    );
  }
}

Code.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
}

export default Code;