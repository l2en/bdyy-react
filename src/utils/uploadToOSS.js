import request from 'utils/request';
import OSS from 'ali-oss';

// 上传图片到oss
const uploadToOSS = (toOSSInfo, base64Img, file) => {
  const ossUrl = '/JYLogisticsClient/api/alibaba/requestSTSToken';
  const params = {
    actionType: 'AccessPicFactory',
  };
  request(ossUrl, {
    method: 'POST',
    body: params,
  }).then(resData => {
    const client = new OSS({
      region: 'oss-cn-shenzhen',
      accessKeyId: resData.data.credentials.accessKeyId,
      accessKeySecret: resData.data.credentials.accessKeySecret,
      stsToken: resData.data.credentials.securityToken,
      bucket: 'jianyi-logistics',
    });
    const fileName = `${toOSSInfo.name}_${toOSSInfo.identityNumber}.jpg`;
    try {
      const result = client.put(fileName, file);
      result.then(res => {
        console.log('上传结果', res);
      });
    } catch (e) {
      console.log('阿里云存储图片异常捕获>>>>>', e);
    }
  });
};

export default uploadToOSS;
