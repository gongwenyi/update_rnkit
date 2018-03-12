import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import md5 from 'blueimp-md5';
import appStyle from 'style/Login.less';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit(e) {
    e.preventDefault();
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          loginName: values.loginName,
          password: md5(values.password),
        };
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'auth/login', dataName: 'login', tip: '登录', params, callback(res) {
          if (res && res.errno === 0) {
            jwt.setToken(res.data.token);
            self.props.dispatch({ type: 'COMMON_CHANGE', keyValue: { authIsLogin: true } });
            self.props.history.push('/applications');
          }
        } }));
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login" class={ appStyle.login }>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('loginName', { rules: [{ required: true, message: '请输入手机号或邮箱' }, { min: 3, max: 100, message: '长度在 3 到 100 个字符' }] })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入手机号或邮箱" />) }
          </FormItem>
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('password', { rules: [{ required: true, message: '请输入密码' }, { min: 6, max: 20, message: '长度在 6 到 20 个字符' }] })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />) }
          </FormItem>
          <FormItem>
{/*             { getFieldDecorator('remember', { valuePropName: 'checked', initialValue: true })(<Checkbox>记住密码</Checkbox>) } */}
            <Link className="login-form-forgot" to="/forgetPassword">忘记密码？</Link>
            <Button type="primary" htmlType="submit" loading={this.props.loginIsLoading} className="login-form-button">
              登录
            </Button>
            <div style={{ textAlign: 'center' }}><span>还没有账号？</span><Link to="/register">立即注册！</Link></div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loginIsLoading: state.loginIsLoading,
  };
};

export default connect(mapStateToProps)(Form.create()(Login));
