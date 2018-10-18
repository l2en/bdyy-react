import request from '../utils/request';
// 查询全部商品
export async function getProviderList(params) {
  return request(`/JYLogisticsClient/api/company/providerAllInfo`, {
    method: 'GET',
    urlParams: params,
  });
}
