import React, { Component } from 'react';
import { Icon } from 'antd';
import download from 'utils/download';
import OSS from 'ali-oss';
import getSTStoken from 'utils/getSTStoken';
import styles from './index.less';

class Avatar extends Component {
  static defaultProps = {
    onPreview: () => {},
  };

  state = {};

  downloadAvatar = () => {
    const { userInfo } = this.props;
    getSTStoken()
      .then(STSParames => {
        const client = new OSS({
          region: 'oss-cn-shenzhen',
          accessKeyId: STSParames.credentials.accessKeyId,
          accessKeySecret: STSParames.credentials.accessKeySecret,
          stsToken: STSParames.credentials.securityToken,
          bucket: 'jianyi-logistics',
        });
        const objName = `${userInfo.name}_${userInfo.identityNumber}.jpg`;
        const url = client.signatureUrl(objName);
        download(url, objName);
      })
      .catch(e => {
        console.log('获取STSToken异常捕获======>', e);
      });
  };

  preview = () => {
    const { onPreview, userInfo } = this.props;
    getSTStoken()
      .then(STSParames => {
        const client = new OSS({
          region: 'oss-cn-shenzhen',
          accessKeyId: STSParames.credentials.accessKeyId,
          accessKeySecret: STSParames.credentials.accessKeySecret,
          stsToken: STSParames.credentials.securityToken,
          bucket: 'jianyi-logistics',
        });
        const objName = `${userInfo.name}_${userInfo.identityNumber}.jpg`;
        const url = client.signatureUrl(objName);
        console.log('获取预览地址', url);
        onPreview(url, objName);
      })
      .catch(e => {
        console.log('获取STSToken异常捕获======>', e);
      });
  };

  render() {
    const { type } = this.props;
    const imgUrl =
      type === 'enterprise'
        ? 'https://upload-images.jianshu.io/upload_images/9899783-6e0529fb35e01a51.jpeg'
        : 'https://upload-images.jianshu.io/upload_images/9899783-eb339578448badb3.jpg';
    return (
      <div className={styles.avatar}>
        <img className={styles.detailsimg} alt="用户头像" src={imgUrl} />
        <div className={styles.avatardialog}>
          {/* <Icon type="fanticon anticon-eye-o" theme="outlined" onClick={this.preview} /> */}
          <Icon type="fullscreen" theme="outlined" onClick={this.preview} />

          <Icon type="download" theme="outlined" onClick={this.downloadAvatar} />
        </div>
      </div>
    );
  }
}
export default Avatar;
