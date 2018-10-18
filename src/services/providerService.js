/**
 * 供应商
 */
import request from '../utils/request';

export async function getProviderList(params) {
  return request('/JYLogisticsClient/api/company/providerAllInfo', {
    method: 'GET',
    urlParams: params,
  });
}

export async function deleteProvider(params) {
  return request('/JYLogisticsClient/api/company/deleteProvider', {
    method: 'POST',
    body: params,
  });
}

// 新建供应商
export async function addProvider(params) {
  return request('/JYLogisticsClient/api/company/createProvider', {
    method: 'POST',
    body: params,
  });
}

export async function getProviderIdInfo(params) {
  return request('/JYLogisticsClient/api/company/providerInfo', {
    method: 'GET',
    urlParams: params,
  });
}
