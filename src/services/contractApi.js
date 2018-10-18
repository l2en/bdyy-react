import request from '../utils/request';
// 新增运输合同
export async function createTransport(params) {
  return request(`/JYLogisticsClient/api/contract/createTransport`, {
    method: 'POST',
    body: params,
  });
}
// 删除运输合同
export async function deleteTransport(params) {
  return request(`/JYLogisticsClient/api/contract/deleteTransport`, {
    method: 'POST',
    body: params,
  });
}
// 按路线查询运输合同
export async function transportInfoByRoutine(params) {
  return request(`/JYLogisticsClient/api/contract/transportInfoByRoutines`, {
    method: 'POST',
    body: params,
  });
}
// 新增销售合同
export async function createSell(params) {
  return request(`/JYLogisticsClient/api/contract/createSell`, {
    method: 'POST',
    body: params,
  });
}
// 删除销售合同
export async function deleteSell(params) {
  return request(`/JYLogisticsClient/api/contract/deleteSell`, {
    method: 'POST',
    body: params,
  });
}
// 按客户查询销售合同
export async function queryListSellByClient(params) {
  return request(`/JYLogisticsClient/api/contract/queryListSellByClient`, {
    method: 'POST',
    body: params,
  });
}
// 按供应商查询购买合同
export async function purchaseInfoByProvider(params) {
  return request(`/JYLogisticsClient/api/contract/purchaseInfoByProvider`, {
    method: 'POST',
    body: params,
  });
}
// 新增购买合同
export async function createPurchase(params) {
  return request(`/JYLogisticsClient/api/contract/createPurchase`, {
    method: 'POST',
    body: params,
  });
}
// 删除购买合同
export async function deletePurchase(params) {
  return request(`/JYLogisticsClient/api/contract/deletePurchase`, {
    method: 'POST',
    body: params,
  });
}
