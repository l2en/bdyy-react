import request from '../utils/request';

// 获取自有车辆列表
export async function getOwnTruckList(params) {
  return request('/JYLogisticsClient/api/truck/allInfoOfSelf', {
    method: 'GET',
    urlParams: params,
  });
}

// 获取自有车辆详情
export async function getOwnTruckDetails(params) {
  return request('/JYLogisticsClient/api/truck/info', {
    method: 'GET',
    urlParams: params,
  });
}

// 获取自有车辆与司机绑定关系 && 列表
export async function getTruckWithDriver(params) {
  return request('/JYLogisticsClient/api/truck/allInfoWithDriverOfSelf', {
    method: 'GET',
    urlParams: params,
  });
}

// 解除truck关系
export async function deleteTruckRelationship(params) {
  return request('/JYLogisticsClient/api/truck/delete', {
    method: 'POST',
    body: params,
  });
}

// 新增一个自有车辆与司机的配对
export async function addDriverWithTruck(params) {
  return request('/JYLogisticsClient/api/truck/addTruckWithDriverOfSelf', {
    method: 'POST',
    body: params,
  });
}

// 添加自由车辆
export async function addTruck(params) {
  return request('/JYLogisticsClient/api/truck/create', {
    method: 'POST',
    body: params,
  });
}

// 解除车辆与司机的绑定关系
export async function deleteOwnTruckWithDriver(params) {
  return request('/JYLogisticsClient/api/truck/deleteTruckWithDriverOfSelf', {
    method: 'POST',
    body: params,
  });
}
