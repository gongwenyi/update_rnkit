// state 默认值
import jwt from 'utils/jwt';

export default {
  loginIsLoading: false, // 正在登录loading
  changePasswordIsLoading: false, // 修改密码加载loading
  registerIsLoading: false, // 注册加载loading
  bindIsLoading: false, // 绑定loading
  userInfo: {}, // 用户信息
  resetPwdIsLoading: false, // 重置密码加载loading
  authIsLogin: jwt.checkAuth() || false, // 用户是否登录
  getAppListIsLoading: false, // 获取App列表加载loading
  changeAppInfoIsLoading: false, // 更新app或补丁信息加载loading
  deleteAppIsLoading: false, // 删除App加载loading
};
