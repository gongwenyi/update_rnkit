// state 默认值
import jwt from 'utils/jwt';

console.log(jwt.checkAuth());

export default {
  loginIsLoading: false, // 正在登录loading
  changePasswordIsLoading: false, // 修改密码加载loading
  registerIsLoading: false, // 注册加载loading
  bindIsLoading: false, // 绑定loading
  userInfo: {}, // 用户信息
  resetPwdIsLoading: false, // 重置密码加载loading
  authIsLogin: jwt.checkAuth() || false, // 用户是否登录
};
