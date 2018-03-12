import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import md5 from 'blueimp-md5';
import appStyle from 'style/Register.less';

const FormItem = Form.Item;
const { Search } = Input;

class Bind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regType: 'mobile', // 注册方式
      timeText: '获取验证码', // 获取验证码按钮文案
      time: 60, // 剩余时间
      intervalId: null, // 计时器id
    };
  }
  componentDidMount() {
    this.getUserInfo();
  }
  getUserInfo() {
    this.props.dispatch(actions.searchDetail({ url: 'auth/me', dataName: 'userInfo', tip: '获取用户信息', params: { token: jwt.getToken() } }));
  }
  componentWillUnmount() {
    window.clearInterval(this.state.intervalId);
  }
  getRegVerify(value) {
    funs.getRegVerify(this, { account: value, action: 'change' });
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        const type = self.props.userInfo.reg_type === 'mobile' ? 'email' : 'mobile';
        const params = {
          [type]: values[type],
          code: values.code,
        };
        self.props.dispatch(actions.saveNewOrSaveChange({ url: `auth/bind_${self.props.userInfo.reg_type === 'mobile' ? 'email' : 'mobile'}`, dataName: 'bind', tip: '绑定', params, callback(res) {
          if (res && res.errno === 0) {
            self.getUserInfo();
          }
        } }));
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="register" class={ appStyle.register }>
        { this.props.userInfo.mobile && this.props.userInfo.email ?
        <div style={{ width: '400px' }}>
          <h3>您已完成绑定，可使用以下三种方式登录：</h3>
          <h3>{ `用户名：${this.props.userInfo.name}` }</h3>
          <h3>{ `手机号：${this.props.userInfo.mobile}` }</h3>
          <h3>{ `邮箱：${this.props.userInfo.email}` }</h3>
        </div> :
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          { !this.props.userInfo.mobile ? <FormItem className={ `selfFormItemSize selfRegTypeSize ${this.state.time < 60 ? 'disableBtn' : ''}` }>
            { getFieldDecorator('mobile', { rules: [{ required: true, message: '请输入手机号' }, { min: 11, max: 11, message: '长度为 11 个字符' }] })(<Search onSearch={this.getRegVerify.bind(this)} placeholder="请输入手机号" enterButton={this.state.timeText.toString()} />)}</FormItem>
            : <FormItem className={`selfFormItemSize selfRegTypeSize ${this.state.time < 60 ? 'disableBtn' : ''}`}>
            { getFieldDecorator('email', { rules: [{ required: true, message: '请输入邮箱' }, { min: 6, max: 100, message: '长度在 6 到 100 个字符' }] })(<Search onSearch={this.getRegVerify.bind(this)} placeholder="请输入邮箱" enterButton={this.state.timeText.toString()} />)}</FormItem>}
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('code', { rules: [{ required: true, message: '请输入验证码' }, { min: 4, max: 6, message: '长度在 4 到 6 个字符' }] })(<Input placeholder="请输入验证码" />) }
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" loading={this.props.bindIsLoading} className="login-form-button">
              登录
            </Button>
          </FormItem>
        </Form> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bindIsLoading: state.bindIsLoading,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(Form.create()(Bind));
