import request from 'utils/request';

// 上传图片到oss
const getSTStoken = () => {
  return new Promise((resolve, reject) => {
    const ossUrl = '/JYLogisticsClient/api/alibaba/requestSTSToken';
    const params = {
      actionType: 'AccessPicFactory',
    };
    request(ossUrl, {
      method: 'POST',
      body: params,
    }).then(resData => {
      if (!resData.code) {
        resolve(resData.data);
      } else {
        reject();
      }
    });
  });
};

export default getSTStoken;
