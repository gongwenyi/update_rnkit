import Axios from 'axios';
import qs from 'qs';

// 创建Axios实例
const service = Axios.create({
  baseURL: '', // api的base_url
  timeout: 60000, // 请求超时时间
});

// 请求hook
service.interceptors.request.use((config) => {
  // 请求headers中加入token
  if (jwt.checkAuth()) {
    config.headers['X-Authorization'] = jwt.getToken();
  }
  return config;
});

// 拦截每一次请求返回结果，并对结果进行处理
service.interceptors.response.use((response) => {
  // 如果token过期，清除token，跳转到登录页面
  if (response.data.errno === 401 && jwt.checkAuth()) {
    jwt.removeToken();
    window.location.replace('/login');
    return false;
  }
  // 获取后台返回的json数据
  return response.data;
}, (error) => {
  return Promise.reject(error);
});

export function post(url, preParams) {
  if (preParams.requireMode === 'json') return service.post(`/api_service/api/v1/${url}`, preParams.params, { headers: { 'Content-Type': 'application/json' } });
  if (preParams.requireMode === 'form-data') {
    const formData = new FormData();
    Object.keys(preParams.params).forEach((key) => {
      formData.append(key, preParams.params[key]);
    });
    return service.post(`/api_service/api/v1/${url}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  return service.post(`/api_service/api/v1/${url}`, qs.stringify(preParams.params));
}

export function get(url, preParams) {
  return service.get(`/api_service/api/v1/${url}`, { params: preParams.params });
}
