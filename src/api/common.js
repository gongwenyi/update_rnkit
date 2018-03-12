import * as fetch from '@/utils/fetch';

const commonApi = {
  /*
    公共接口
  */
  get(preParams) { // get请求
    return fetch.get(preParams.url, preParams);
  },
  post(preParams) { // post请求
    return fetch.post(preParams.url, preParams);
  },
};

export default commonApi;
