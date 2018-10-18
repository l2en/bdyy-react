import request from '../utils/request';

// 阿里巴巴驾驶证识别
export async function alibabaVehicleLicenceIdentify(params) {
  return request('/JYLogisticsClient/api/alibaba/vehicleLicenceIdentify', {
    method: 'POST',
    body: params,
  });
}
// 阿里巴巴身份证识别
export async function alibabaIdCardIdentify(params) {
  return request('/JYLogisticsClient/api/alibaba/idCardIdentify', {
    method: 'POST',
    body: params,
  });
}

// 阿里巴巴营业执照识别
export async function alibabBusinessLicenceIdentify(params) {
  return request('/JYLogisticsClient/api/alibaba/businessLicenceIdentify', {
    method: 'POST',
    body: params,
  });
}

// 获取阿里巴巴STS授权码
export async function getSTSToken(params) {
  return request('/JYLogisticsClient/api/alibaba/requestSTSToken', {
    method: 'POST',
    body: params,
  });
}
