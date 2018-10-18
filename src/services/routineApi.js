import request from '../utils/request';
// 新增合同路线
export async function createContractRoutine(params) {
  return request(`/JYLogisticsClient/api/routine/createContractRoutine`, {
    method: 'POST',
    body: params,
  });
}
// 删除合同路线
export async function deleteContractRoutine(params) {
  return request(`/JYLogisticsClient/api/routine/deleteContractRoutine`, {
    method: 'POST',
    body: params,
  });
}
// 查询单条合同路线
export async function infoContractRoutine(params) {
  return request(`/JYLogisticsClient/api/routine/infoContractRoutine`, {
    method: 'GET',
    urlParams: params,
  });
}
// 查询某个客户的全部合同路线
export async function allInfoContractRoutine(params) {
  return request(`/JYLogisticsClient/api/routine/allInfoContractRoutine`, {
    method: 'POST',
    body: params,
  });
}
