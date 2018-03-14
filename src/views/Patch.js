import React from 'react';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';
import appStyle from 'style/AppCont.less';

class Patch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="patch" className={ appStyle.patch }>
        补丁下发
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(Patch);
