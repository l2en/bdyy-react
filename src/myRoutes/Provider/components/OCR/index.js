/**
 *  处理图片识别和图片上传到OSS
 */
import React, { Component } from 'react';
import request from 'utils/request';
import { connect } from 'dva';
import { Drawer, Form, Input, Icon, Upload, Button, Message } from 'antd';
import { getBase64 } from 'utils/getBase64';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ baseData }) => ({ baseData }))
class OCR extends Component {
  static defaultProps = {
    title: '',
    addDrawerVisible: false,
    onClose: () => {},
    onOk: () => {},
    onCancle: () => {},
  };

  state = {
    businessLicenseImg: '',
    businessLicenseImgData: {},
    loading: false,
    isDistinguishing: false,
    base64Img: '',
    file: {},
  };

  componentWillReceiveProps() {
    this.setState({
      businessLicenseImg: '',
      businessLicenseImgData: {},
    });
  }

  // 确认无误添加客户/承运商
  onSure = () => {
    const { onOk, baseData } = this.props;
    const { businessLicenseImgData, base64Img, file } = this.state;
    const addData = {};
    console.log('companyId', baseData.company.id);
    addData.companyId = baseData.company.id;
    addData.name = businessLicenseImgData.name;
    addData.identityNumber = businessLicenseImgData.reg_num;
    addData.representative = businessLicenseImgData.person;
    addData.registeredCapital = businessLicenseImgData.capital;
    addData.establishmentDate = businessLicenseImgData.establish_date;
    addData.address = businessLicenseImgData.address;
    onOk(addData, base64Img, file);
  };

  // 识别
  identify = params => {
    this.setState({ isDistinguishing: true });
    const identifyUrl = '/JYLogisticsClient/api/alibaba/businessLicenceIdentify';
    request(identifyUrl, {
      method: 'POST',
      body: params,
    }).then(resData => {
      if (resData.code) {
        this.setState({ isDistinguishing: false });
        Message.error('识别出错，请重试！');
        return;
      }
      this.setState({
        businessLicenseImgData: resData.data,
        isDistinguishing: false,
      });
    });
  };

  // 识别有误
  identifyError = () => {
    this.setState({
      businessLicenseImg: '',
      businessLicenseImgData: {},
    });
    Message.info('请重新上传');
  };

  // 上传
  handleUpload = file => {
    this.setState({ file });
    getBase64(file, base64Img => {
      const params = {
        body: base64Img.split('base64,')[1],
        side: 'face',
      };
      this.setState({
        businessLicenseImg: base64Img,
        base64Img,
      });

      this.identify(params);
    });
  };

  // 营业执照
  renderBusinessLicenseView = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { businessLicenseImgData, businessLicenseImg, loading } = this.state;
    const uploadButton = (
      <React.Fragment>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </React.Fragment>
    );
    return (
      <Form layout="horizontal">
        <FormItem {...formItemLayout} label="上传证件">
          <Upload
            name="avatar"
            listType="picture-card"
            className={styles.avataruploader}
            style={{ width: '368px!important', height: '200px!important' }}
            showUploadList={false}
            beforeUpload={this.handleUpload}
          >
            {businessLicenseImg ? <img src={businessLicenseImg} alt="avatar" /> : uploadButton}
          </Upload>
        </FormItem>
        <FormItem {...formItemLayout} label="公司名称">
          <Input disabled type="text" value={businessLicenseImgData.name || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="统一社会信用代码">
          <Input disabled type="text" value={businessLicenseImgData.reg_num || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="公司地址">
          <Input disabled type="text" value={businessLicenseImgData.address || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="法人代表">
          <Input disabled type="text" value={businessLicenseImgData.person || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="注册资本">
          <Input disabled type="text" value={businessLicenseImgData.capital || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="成立日期">
          <Input disabled type="text" value={businessLicenseImgData.establish_date || ''} />
        </FormItem>
      </Form>
    );
  };

  render() {
    const { title, onCancle, addDrawerVisible } = this.props;
    const { isDistinguishing } = this.state;
    return (
      <Drawer
        title={title}
        width={720}
        placement="right"
        onClose={onCancle}
        maskClosable
        visible={addDrawerVisible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        {this.renderBusinessLicenseView()}
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
          <Button
            style={{ marginRight: 8 }}
            onClick={this.onSure}
            type="primary"
            loading={isDistinguishing}
          >
            {isDistinguishing ? '识别中' : '确认无误'}
          </Button>
          <Button onClick={this.identifyError} type="danger">
            识别有误
          </Button>
        </div>
      </Drawer>
    );
  }
}
export default OCR;
