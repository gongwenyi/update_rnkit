import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import md5 from 'blueimp-md5';
import appStyle from 'style/ChangePassword.less';

const FormItem = Form.Item;

class ChangePassword extends React.Component {
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
          old_password: md5(values.old_password),
          new_password: md5(values.new_password),
        };
        self.props.dispatch(actions.saveNewOrSaveChange({ url: 'auth/change_password', dataName: 'changePassword', tip: '修改密码', params, callback(res) {
          if (res && res.errno === 0) {
            jwt.removeToken();
            self.props.history.push('/login');
          }
        } }));
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="changePassword" class={ appStyle.changePassword }>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <h3>您正在通过原密码修改密码</h3>
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('old_password', { rules: [{ required: true, message: '请输入原密码' }, { min: 6, max: 20, message: '长度在 6 到 20 个字符' }] })(<Input type="password" placeholder="请输入原密码" />) }
          </FormItem>
          <FormItem className="selfFormItemSize">
            { getFieldDecorator('new_password', { rules: [{ required: true, message: '请输入新密码' }, { min: 6, max: 20, message: '长度在 6 到 20 个字符' }] })(<Input type="password" placeholder="请输入新密码" />) }
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" loading={this.props.changePasswordIsLoading} className="login-form-button">
              修改密码
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    changePasswordIsLoading: state.changePasswordIsLoading,
  };
};

export default connect(mapStateToProps)(Form.create()(ChangePassword));
