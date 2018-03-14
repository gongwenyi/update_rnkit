import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Popconfirm } from 'antd';
import { withRouter } from 'react-router-dom';
import appStyle from 'style/AppCont.less';
import PropTypes from 'prop-types'; // eslint-disable-line

const FormItem = Form.Item;
const { Search } = Input;

class AppInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        const params = { ...values, key: this.props.match.params.key };
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'app/edit', dataName: 'changeAppInfo', tip: '修改', params, callback(res) {
          if (res && res.errno === 0) {
            self.props.getAppInfo();
          }
        } }));
      }
    });
  }
  deleteApp() {
    const self = this;
    self.props.dispatch(actions.saveNewOrSaveChange({ url: 'app/del', dataName: 'deleteApp', tip: '删除', params: { key: this.props.match.params.key }, callback(res) {
      if (res && res.errno === 0) {
        self.props.history.push('/applications');
      }
    } }));
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="appInfo" class={ appStyle.appInfo }>
        <p className="info-row"><label>创建时间：</label>{ funs.formalTime(this.props.appInfo.created_at) }</p>
        <p className="info-row"><label>app_key：</label>{ this.props.appInfo.key }</p>
        <p className="info-row"><label>应用状态：</label>{ this.props.appInfo.status === 1 ? '正常' : '不正常' }</p>
        { this.props.appInfo.platform === 1 ? <p className="info-row"><label>应用平台：</label><Icon type="apple" /> iOS</p>
        : this.props.appInfo.platform === 2 ? <p className="info-row"><label>应用平台：</label><Icon type="android" /> Android</p> : null }
        <p className="info-row"><label>应用包名：</label>{ this.props.appInfo.app_identifier }</p>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <FormItem label="应用名称：">
            { getFieldDecorator('name', { initialValue: this.props.appInfo.name, rules: [{ required: true, message: '请输入应用名称' }, { min: 1, max: 40, message: '长度在 1 到 40 个字符' }] })(<Input placeholder="请输入应用名称" />) }
          </FormItem>
          <FormItem label="下载地址：" style={{ marginBottom: '24px' }}>
            { getFieldDecorator('download_url', { initialValue: this.props.appInfo.download_url, rules: [{ required: false, message: '请输入下载地址' }, { min: 4, max: 200, message: '长度在 4 到 200 个字符' }] })(<Input placeholder="请输入下载地址" />) }
          </FormItem>
          <FormItem className="btnFormItem">
            <Button type="primary" htmlType="submit" loading={this.props.changeAppInfoIsLoading}>编  辑</Button>
          </FormItem>
        </Form>
        <Popconfirm placement="topLeft" title='此操作将永久删除该文件, 是否继续?' onConfirm={this.deleteApp.bind(this)} okText="确定" cancelText="取消">
          <Button type="danger" loading={this.props.deleteAppIsLoading}>删  除</Button>
        </Popconfirm>
      </div>
    );
  }
}

// 将属性声明为 JS 原生类型
AppInfo.propTypes = {
  appInfo: PropTypes.object,
  getAppInfo: PropTypes.func,
};

// 为属性指定默认值
AppInfo.defaultProps = {
  appInfo: {},
  getAppInfo: () => {},
};

const mapStateToProps = (state) => {
  return {
    changeAppInfoIsLoading: state.changeAppInfoIsLoading,
    deleteAppIsLoading: state.deleteAppIsLoading,
  };
};

export default withRouter(connect(mapStateToProps)(Form.create()(AppInfo)));
