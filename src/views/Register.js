import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Radio, message } from 'antd';
import { Link } from 'react-router-dom';
import md5 from 'blueimp-md5';
import appStyle from 'style/Register.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Search } = Input;

class Register extends React.Component {
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
    $('.appContent').scrollTop(0);
  }
  componentWillUnmount() {
    window.clearInterval(this.state.intervalId);
  }
  regTypeChange(e) {
    this.setState(() => ({ regType: e.target.value }));
  }
  getRegVerify(value) {
    funs.getRegVerify(this, { account: value, action: 'reg' });
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          name: values.name,
          reg_type: values.reg_type,
          [values.reg_type]: values[values.reg_type],
          reg_verify: values.reg_verify,
          password: md5(values.password),
        };
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'auth/register', dataName: 'register', tip: '注册', params, callback(res) {
          if (res && res.errno === 0) {
            self.props.history.push('/login');
          }
        } }));
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    document.title = '注册 - React Native热更新-RNKit云服务';
    return (
      <div className="register" class={ appStyle.register }>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('name', { rules: [{ required: true, message: '请输入用户名' }, { min: 4, max: 12, message: '长度在 4 到 12 个字符' }] })(<Input placeholder="请输入用户名" />) }
          </FormItem>
          <FormItem className="selfFormRadio" label="注册方式">
            { getFieldDecorator('reg_type', { initialValue: 'mobile' })(
              <RadioGroup onChange={this.regTypeChange.bind(this)}>
                <Radio value={'mobile'}>手机号</Radio>
                <Radio value={'email'}>邮箱</Radio>
              </RadioGroup>) }
          </FormItem>
          { this.state.regType === 'mobile' ? <FormItem className={ `selfFormItemSize selfRegTypeSize ${this.state.time < 60 ? 'disableBtn' : ''}` }>
            { getFieldDecorator('mobile', { rules: [{ required: true, message: '请输入手机号' }, { min: 11, max: 11, message: '长度为 11 个字符' }] })(<Search onSearch={this.getRegVerify.bind(this)} placeholder="请输入手机号" enterButton={this.state.timeText.toString()} />) }
          </FormItem> : <FormItem className={`selfFormItemSize selfRegTypeSize ${this.state.time < 60 ? 'disableBtn' : ''}`}>
            { getFieldDecorator('email', { rules: [{ required: true, message: '请输入邮箱' }, { min: 6, max: 100, message: '长度在 6 到 100 个字符' }] })(<Search onSearch={this.getRegVerify.bind(this)} placeholder="请输入邮箱" enterButton={this.state.timeText.toString()} />) }
          </FormItem> }
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('reg_verify', { rules: [{ required: true, message: '请输入验证码' }, { min: 4, max: 6, message: '长度在 4 到 6 个字符' }] })(<Input placeholder="请输入验证码" />) }
          </FormItem>
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('password', { rules: [{ required: true, message: '请输入密码' }, { min: 6, max: 20, message: '长度在 6 到 20 个字符' }] })(<Input type="password" placeholder="请输入密码" />) }
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" loading={this.props.registerIsLoading} className="login-form-button">
              立即注册
            </Button>
            <div style={{ textAlign: 'center' }}><span>已有账号？</span><Link to="/login">立即登录！</Link></div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    registerIsLoading: state.registerIsLoading,
  };
};

export default connect(mapStateToProps)(Form.create()(Register));
