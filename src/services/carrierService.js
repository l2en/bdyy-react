/**
 * 【档案管理】- 承运商
 */

import request from '../utils/request';

// 获取列表
export async function getCarrierList(params) {
  return request('/JYLogisticsClient/api/company/carrierAllInfo', {
    method: 'POST',
    body: params,
  });
}
// 按名称查询承运商
export async function searchCarrier(params) {
  return request('/api/company/carrierAllInfo', {
    method: 'POST',
    body: params,
  });
}
// 解除承运商关系
export async function deleteRelationshipWithCarrier(params) {
  return request('/JYLogisticsClient/api/company/deleteCarrier', {
    method: 'POST',
    body: params,
  });
}
// 获取承运商详情
export async function getCarrierInfo(params) {
  return request('/JYLogisticsClient/api/company/carrierInfo', {
    method: 'GET',
    urlParams: params,
  });
}
// 承运商详情的司机车辆对应信息
export async function getCarrierDetailsTruck(params) {
  return request('/JYLogisticsClient/api/truck/allInfoWithDriverOfCarrier', {
    method: 'GET',
    urlParams: params,
  });
}
// 新建承运商
export async function addCarrier(params) {
  return request('/JYLogisticsClient/api/company/createCarrier', {
    method: 'POST',
    body: params,
  });
}
// 获取承运商用户
export async function getCarrierUsers(params) {
  return request('/JYLogisticsClient/api/user/allInfoOfCarrier', {
    method: 'GET',
    urlParams: params,
  });
}
