import request from '../utils/request';

// 返回销售业务订单列表
export async function allInfoSellOrder(params) {
  return request('/JYLogisticsClient/api/sellOrder', {
    method: 'GET',
    urlParams: params,
  });
}
