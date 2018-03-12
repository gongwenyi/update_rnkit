import { message } from 'antd';

export default {
  getRegVerify(self, params) {
    // console.log(value);
    if (self.state.time < 60) return;
    self.props.dispatch(actions.check({ url: 'auth/captcha', params, callback(res) {
      if (res && res.errno === 0) {
        window.setTimeout(() => {
          self.setState(preState => ({ timeText: 60 }));
          const intervalId = window.setInterval(() => {
            if (self.state.time > 0) {
              self.setState(preState => ({ time: preState.time - 1, timeText: preState.time - 1 }));
            } else {
              self.setState(() => ({ time: 60, timeText: '重新获取' }));
              window.clearInterval(self.state.intervalId);
            }
          }, 1000);
          self.setState(() => ({ intervalId }));
        }, 0);
        message.success('发送验证码成功,请注意查收！');
      } else if (res) {
        message.error(res.errmsg || '发送验证码失败！');
      }
    } }));
  },
};
