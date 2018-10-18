import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function getUserInfo(params) {
  return request('/JYLogisticsClient/api/user/info', {
    method: 'GET',
    urlParams: params,
  });
}
export async function addClientUser(params) {
  return request('/JYLogisticsClient/api/user/addClientUser', {
    method: 'POST',
    body: params,
  });
}
export async function addCarrierUser(params) {
  return request('/JYLogisticsClient/api/user/addCarrierUser', {
    method: 'POST',
    body: params,
  });
}