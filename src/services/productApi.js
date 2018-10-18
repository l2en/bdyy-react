import request from '../utils/request';
// 查询全部商品
export async function getProductList() {
  return request(`/JYLogisticsClient/api/product/allInfo`, {
    method: 'GET',
  });
}
