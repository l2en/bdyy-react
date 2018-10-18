/**
 * 【档案管理】- 承运商
 */

import request from '../utils/request';

// 获取列表
export async function addTruck(params) {
  return request('/JYLogisticsClient/api/truck/create', {
    method: 'POST',
    body: params,
  });
}

// 绑定司机与车辆
export async function addTruckWithDriver(params) {
  return request('/JYLogisticsClient/api/truck/addTruckWithDriverOfCarrier', {
    method: 'POST',
    body: params,
  });
}

// 获取车辆详情
export async function getTruckInfo(params) {
  return request('/JYLogisticsClient/api/truck/info', {
    method: 'GET',
    urlParams: params,
  });
}