/**
 * 【档案管理】- 客户
 */
import request from '../utils/request';

// 客户列表
export async function getClient(params) {
  return request('/JYLogisticsClient/api/company/clientAllInfo', {
    method: 'GET',
    urlParams: params,
  });
}
// 按公司名称查询
export async function searchClient(params) {
  return request('/JYLogisticsClient/api/company/clientAllInfo', {
    method: 'POST',
    body: params,
  });
}

// 新建客户
export async function addClient(params) {
  return request('/JYLogisticsClient/api/company/createClient', {
    method: 'POST',
    body: params,
  });
}
// 解除客户关系
export async function deleteRelationshipWithClient(params) {
  return request('/JYLogisticsClient/api/company/deleteClient', {
    method: 'POST',
    body: params,
  });
}
// 获取客户详情
export async function getClientDetailsinfo(params) {
  return request('/JYLogisticsClient/api/company/clientInfo', {
    method: 'GET',
    urlParams: params,
  });
}
// 获取客户详情路线
export async function getClientDetailsLines(params) {
  return request('/JYLogisticsClient/api/routine/allInfoContractRoutine', {
    method: 'GET',
    urlParams: params,
  });
}

// 获取客户用户数据
export async function getClientUsers(params) {
  return request('/JYLogisticsClient/api/user/allInfoOfClient', {
    method: 'GET',
    urlParams: params,
  });
}
