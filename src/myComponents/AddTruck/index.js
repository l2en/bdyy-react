import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Upload, Button, Icon, Input } from 'antd';
import styles from './index.less';

const { Item: FormItem } = Form;

export default class AddTruck extends Component {
  static defaultProps = {
    carrierInfoBebind: {},
    carrierInfoBefore: {},
    imageUrlBefore: 'http://img0.imgtn.bdimg.com/it/u=3879599414,3586380266&fm=27&gp=0.jpg',
    imageUrlBehind: 'http://img5.imgtn.bdimg.com/it/u=3414562090,4004485973&fm=27&gp=0.jpg',
    uploadUrl: '/api/alibaba/businessLicenceIdentify',
    beforeUpload: () => {},
    uploadImgHandleChangebefore: () => {},
    uploadImgHandleChangebehind: () => {},
  };

  state = {};

  // 正面证件
  certificateFront = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { carrierInfoBefore } = this.props;
    return (
      <Fragment>
        <FormItem {...formItemLayout} label="车辆号码">
          <Input type="text" value={carrierInfoBefore.carId || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="车辆类型">
          <Input type="text" value={carrierInfoBefore.carType || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="所有人名称">
          <Input type="text" value={carrierInfoBefore.pesonName || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="使用性质">
          <Input type="text" value={carrierInfoBefore.howUse || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          <Input type="text" value={carrierInfoBefore.address || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="品牌型号">
          <Input type="text" value={carrierInfoBefore.brand || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="车辆识别代号">
          <Input type="text" value={carrierInfoBefore.carCode || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="发动机号码">
          <Input type="text" value={carrierInfoBefore.engineId || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="注册日期">
          <Input type="text" value={carrierInfoBefore.regData || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="发证日期">
          <Input type="text" value={carrierInfoBefore.releaseDate || ''} />
        </FormItem>
      </Fragment>
    );
  };

  // 反面证件
  certificateBack = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { carrierInfoBebind } = this.props;
    return (
      <Fragment>
        <FormItem {...formItemLayout} label="核定载人数">
          <Input type="text" value={carrierInfoBebind.personNum || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="核定载质量">
          <Input type="text" value={carrierInfoBebind.ratifyWeight || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="档案编号">
          <Input type="text" value={carrierInfoBebind.archiveId || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="总质量">
          <Input type="text" value={carrierInfoBebind.totalWeight || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="检验记录">
          <Input type="text" value={carrierInfoBebind.record || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="外廓尺寸">
          <Input type="text" value={carrierInfoBebind.size || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="准牵引总质量">
          <Input type="text" value={carrierInfoBebind.tractionWeight || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="整备质量">
          <Input type="text" value={carrierInfoBebind.allWeight || ''} />
        </FormItem>
      </Fragment>
    );
  };

  render() {
    const {
      uploadUrl,
      beforeUpload,
      uploadImgHandleChangebefore,
      imageUrlBefore,
      uploadImgHandleChangebehind,
      imageUrlBehind,
    } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Fragment>
        <Row>
          <Col span={10}>
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label="上传正面证件">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={styles.avataruploader}
                  style={{ width: '285px!important', height: '180px!important' }}
                  showUploadList={false}
                  action={uploadUrl}
                  beforeUpload={beforeUpload}
                  onChange={uploadImgHandleChangebefore}
                >
                  {imageUrlBefore ? <img src={imageUrlBefore} alt="avatar" /> : uploadButton}
                </Upload>
              </FormItem>
              {this.certificateFront()}
            </Form>
          </Col>
          <Col span={10} offset={2}>
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label="上传反面证件">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className={styles.avataruploader}
                  style={{ width: '285px!important', height: '180px!important' }}
                  showUploadList={false}
                  action={uploadUrl}
                  beforeUpload={beforeUpload}
                  onChange={uploadImgHandleChangebehind}
                >
                  {imageUrlBehind ? <img src={imageUrlBehind} alt="avatar" /> : uploadButton}
                </Upload>
              </FormItem>
              {this.certificateBack()}
            </Form>
          </Col>
        </Row>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={this.addCarrier} type="primary">
            确认无误
          </Button>
          <Button onClick={this.onClose} type="danger">
            识别有误
          </Button>
        </div>
      </Fragment>
    );
  }
}
