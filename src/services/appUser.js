import request from '../utils/request';

// 模拟登陆请求
export async function accountLogin() {
  return request(`/JYLogisticsClient/login/testLogin`);
}
// 微信扫码登陆
export async function weixinLogin(params) {
  return request(`/JYLogisticsClient/login/wxLogin`, {
    method: 'POST',
    body: params,
  });
}
// 发送手机验证码
export async function messageValidate(params) {
  return request(`/api/login/messageValidate`, {
    method: 'POST',
    body: params,
  });
}
// 检验手机验证码
export async function checkMessageValidate(params) {
  return request(`/api/login/checkMessageValidate`, {
    method: 'POST',
    body: params,
  });
}
// 手机验证码登陆
export async function messageLogin(params) {
  return request(`/login/messageLogin`, {
    method: 'POST',
    body: params,
  });
}

export async function setWechatOpenid(params) {
  return request(`/jianyiWeb/app/user/setWechatOpenid`, {
    method: 'POST',
    body: params,
  });
}
