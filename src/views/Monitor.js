import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import appStyle from 'style/AppCont.less';

const { Column } = Table;

class Monitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statisticsInfo: [], // 补丁统计信息
    };
  }
  componentDidMount() {
    const self = this;
    self.props.dispatch(actions.searchDetail({ url: 'statistics/info', tip: '获取统计信息', params: { appKey: this.props.match.params.key }, callback(res) {
      if (res && res.errno === 0 && self.table) {
        self.setState(preState => ({ statisticsInfo: res.data || [] }));
      }
    } }));
  }
  render() {
    document.title = '实时监控 - React Native热更新-RNKit云服务';
    return (
      <div className="monitor" class={ appStyle.monitor }>
        <Table dataSource={this.state.statisticsInfo} ref={(table) => { this.table = table; }} bordered rowKey="hash">
          <Column title="补丁名称" dataIndex="name" key="name" />
          <Column title="数量" dataIndex="count" key="count" />
          <Column title="创建时间" dataIndex="created_at" key="created_at" render={funs.formalTime} />
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(Monitor);
