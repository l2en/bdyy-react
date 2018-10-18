import request from '../utils/request';

// 删除路线
export async function deleteRouteLine(params) {
  return request('/JYLogisticsClient/api/routine/deleteContractRoutine', {
    method: 'POST',
    body: params,
  });
}
