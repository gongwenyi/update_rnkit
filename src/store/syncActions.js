// 定义一些异步 action 的方法
import { message } from 'antd';
import Api from '../api';

export default {
  /*
   *表单检查验证GET方式
   */
  check(preParams) {
    return async (dispatch) => { // eslint-disable-line
      const { callback } = preParams;
      try {
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: true } }); // 开始loading
        const response = await Api.common.get(preParams);
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
        if (callback) callback(response);
      } catch (error) {
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
        message.error('接口异常，请稍后重试！');
        if (callback) callback();
        console.log(error);
        console.log(`${preParams.url}接口异常`);
      }
    };
  },
  /*
   *表单检查验证POST方式
   */
  checkPOST(preParams) {
    return async (dispatch) => { // eslint-disable-line
      const { callback } = preParams;
      try {
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: true } }); // 开始loading
        const response = await Api.common.post(preParams);
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
        if (callback) callback(response);
      } catch (error) {
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
        message.error('接口异常，请稍后重试！');
        if (callback) callback();
        console.log(error);
        console.log(`${preParams.url}接口异常`);
      }
    };
  },
  /*
   *查询详情等对象GET方式
   */
  searchDetail(preParams) {
    return async (dispatch) => { // eslint-disable-line
      const { callback } = preParams;
      try {
        const response = await Api.common.get(preParams);
        if (preParams.dataName && response.errno === 0) dispatch({ type: 'COMMON_CHANGE', keyValue: { [preParams.dataName]: response.data } }); // 保存信息
        if (response.errno !== 0) message.error(response.errmsg || `${preParams.tip}失败`);
        if (callback) callback(response);
      } catch (error) {
        message.error('接口异常，请稍后重试！');
        if (callback) callback();
        console.log(error);
        console.log(`${preParams.url}接口异常`);
      }
    };
  },
  /*
   *查询详情等对象POST方式
   */
  searchDetailPOST(preParams) {
    return async (dispatch) => { // eslint-disable-line
      const { callback } = preParams;
      try {
        const response = await Api.common.post(preParams);
        if (preParams.dataName && response.errno === 0) dispatch({ type: 'COMMON_CHANGE', keyValue: { [preParams.dataName]: response.data } }); // 保存信息
        if (response.errno !== 0) message.error(response.errmsg || `${preParams.tip}失败`);
        if (callback) callback(response);
      } catch (error) {
        message.error('接口异常，请稍后重试！');
        if (callback) callback();
        console.log(error);
        console.log(`${preParams.url}接口异常`);
      }
    };
  },
  /*
   *提交新增或修改
   */
  saveNewOrSaveChange(preParams) {
    return async (dispatch) => { // eslint-disable-line
      const { callback } = preParams;
      try {
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: true } }); // 开始loading
        const response = await Api.common.post(preParams);
        if (response.errno === 0) { // 成功
          if (!preParams.notUseTip) message.success(response.errmsg || `${preParams.tip || '操作'}成功`);
          if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
          if (callback) callback(response);
          return;
        }
        if (!preParams.notUseTip) message.error(response.errmsg || `${preParams.tip || '操作'}失败`);
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
        if (callback) callback(response);
      } catch (error) {
        message.error('接口异常，请稍后重试！');
        if (preParams.dataName) dispatch({ type: 'COMMON_CHANGE', keyValue: { [`${preParams.dataName}IsLoading`]: false } }); // 结束loading
        if (callback) callback();
        console.log(error);
        console.log(`${preParams.url}接口异常`);
      }
    };
  },
};
