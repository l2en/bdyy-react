import OSS from 'ali-oss';
import getSTStoken from './getSTStoken';

const getImgFromOSS = objectName => {
  getSTStoken()
    .then(STSParames => {
      const client = new OSS({
        region: 'oss-cn-shenzhen',
        accessKeyId: STSParames.credentials.accessKeyId,
        accessKeySecret: STSParames.credentials.accessKeySecret,
        stsToken: STSParames.credentials.securityToken,
        bucket: 'jianyi-logistics',
      });
      const url = client.signatureUrl(objectName);
      console.log('getFromOSS', url);
      // let result = client.list();
      // console.log('sts文件列表=======>', result);

      result.then(res => {
          console.log('sts文件列表=======>', res);
      })
    })
    .catch(e => {
      console.log('获取STSToken异常捕获======>', e);
    });
};

export default getImgFromOSS;
