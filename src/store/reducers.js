import defaultState from './state';

export default (state = 0, action) => {
  // 第一次初始化
  state = state || defaultState;

  // 判断action传过来的是什么，并执行对应的处理
  switch (action.type) {
    case 'COMMON_CHANGE':
      return { ...state, ...action.keyValue };
    default:
      return state;
  }
};
