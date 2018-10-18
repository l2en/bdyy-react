import React, { Component } from 'react';
import request from 'utils/request';
import { connect } from 'dva';
import { Drawer, Form, Input, Icon, Upload, Radio, Button, Switch, Message } from 'antd';
import { getBase64 } from 'utils/getBase64';
import styles from './index.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
    certificateType: 'businessLicense',
    businessLicenseImg: '',
    businessLicenseImgData: {},
    idCardImg: '',
    idCardImgData: {},
    subCompanyName: '',
    loading: false,
    isSubCompany: false,
    base64Img: '', // 上传的图片
    file: {},
  };

  componentWillReceiveProps() {
    this.setState({
      businessLicenseImg: '',
      businessLicenseImgData: {},
      idCardImg: '',
      idCardImgData: {},
      certificateType: 'businessLicense',
      subCompanyName: '',
      isSubCompany: false,
    });
  }

  // 识别有误
  identifyError = () => {
    this.setState({
      businessLicenseImg: '',
      businessLicenseImgData: {},
      idCardImg: '',
      idCardImgData: {},
      subCompanyName: '',
      isSubCompany: false,
      base64Img: '',
    });
    Message.info('请重新上传');
  };

  // 是否为子公司
  handleIsSubCompany = val => {
    this.setState({
      isSubCompany: val,
    });
  };

  // 子公司名
  handleSubCompanyName = e => {
    this.setState({
      subCompanyName: e.target.value,
    });
  };

  // 切换上传证件类型
  changeCardType = e => {
    this.setState({
      certificateType: e.target.value,
      businessLicenseImgData: {},
      idCardImgData: {},
      businessLicenseImg: '',
      idCardImg: '',
      subCompanyName: '',
      isSubCompany: false,
      base64Img: '',
    });
  };

  // 识别
  identify = (params, file, base64Img) => {
    const { certificateType } = this.state;
    const identifyUrl =
      certificateType === 'businessLicense'
        ? '/JYLogisticsClient/api/alibaba/businessLicenceIdentify'
        : '/JYLogisticsClient/api/alibaba/idCardIdentify';
    request(identifyUrl, {
      method: 'POST',
      body: params,
    }).then(resData => {
      if (resData.code) {
        Message.error('识别出错，请重试！');
        return;
      }
      if (certificateType === 'businessLicense') {
        this.setState({
          businessLicenseImgData: resData.data,
          base64Img,
        });
      } else {
        this.setState({
          idCardImgData: resData.data,
          base64Img,
        });
      }
    });
  };

  // 上传
  handleUpload = file => {
    console.log('文件解析', file);
    this.setState({ file });
    const { certificateType } = this.state;
    getBase64(file, base64Img => {
      const params = {
        body: base64Img.split('base64,')[1],
        side: 'face',
      };
      if (certificateType === 'businessLicense') {
        this.setState({
          businessLicenseImg: base64Img,
        });
      } else {
        this.setState({
          idCardImg: base64Img,
        });
      }
      this.identify(params, file, base64Img);
    });
  };

  // 营业执照
  renderBusinessLicenseView = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const {
      businessLicenseImgData,
      businessLicenseImg,
      certificateType,
      isSubCompany,
      loading,
      subCompanyName,
    } = this.state;
    const uploadButton = (
      <React.Fragment>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </React.Fragment>
    );
    return (
      <Form layout="horizontal">
        <FormItem {...formItemLayout} label="选择客户的证件类型">
          <RadioGroup onChange={this.changeCardType} value={certificateType}>
            <Radio value="businessLicense">营业执照</Radio>
            <Radio value="idCard">身份证</Radio>
          </RadioGroup>
        </FormItem>
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
        <FormItem {...formItemLayout} label="是否为子公司">
          <Switch defaultChecked={isSubCompany} onChange={this.handleIsSubCompany} />
        </FormItem>
        {isSubCompany ? (
          <FormItem {...formItemLayout} label="请输入本公司子名称">
            <Input type="text" onChange={this.handleSubCompanyName} value={subCompanyName} />
          </FormItem>
        ) : null}
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

  // 身份证识别
  renderIDcardView = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { idCardImgData, idCardImg, certificateType, loading } = this.state;
    const uploadButton = (
      <React.Fragment>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </React.Fragment>
    );
    return (
      <Form layout="horizontal">
        <FormItem {...formItemLayout} label="选择客户的证件类型">
          <RadioGroup onChange={this.changeCardType} value={certificateType}>
            <Radio value="businessLicense">营业执照</Radio>
            <Radio value="idCard">身份证</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} label="上传证件">
          <Upload
            name="avatar"
            listType="picture-card"
            className={styles.avataruploader}
            style={{ width: '368px!important', height: '200px!important' }}
            showUploadList={false}
            beforeUpload={this.handleUpload}
          >
            {idCardImg ? <img src={idCardImg} alt="avatar" /> : uploadButton}
          </Upload>
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          <Input disabled type="text" value={idCardImgData.name || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="身份证号">
          <Input disabled type="text" value={idCardImgData.num || ''} />
        </FormItem>
      </Form>
    );
  };

  // 确认无误添加客户/承运商
  onSure = () => {
    const { onOk, baseData } = this.props;
    const {
      businessLicenseImgData,
      idCardImgData,
      certificateType,
      isSubCompany,
      subCompanyName,
      base64Img,
      file,
    } = this.state;
    const addData = {};

    if (certificateType === 'businessLicense') {
      addData.companyId = baseData.company.id;
      addData.name = isSubCompany
        ? `${businessLicenseImgData.name}-${subCompanyName}`
        : businessLicenseImgData.name;
      addData.identityNumber = businessLicenseImgData.reg_num;
      addData.type = 'enterprise';
      addData.representative = businessLicenseImgData.person;
      addData.registeredCapital = businessLicenseImgData.capital;
      addData.establishmentDate = businessLicenseImgData.establish_date;
      addData.address = businessLicenseImgData.address;
    } else {
      addData.companyId = baseData.company.id;
      addData.name = idCardImgData.name;
      addData.identityNumber = idCardImgData.num;
      addData.type = 'human';
    }
    onOk(addData, base64Img, file);
  };

  render() {
    const { title, onCancle, addDrawerVisible } = this.props;
    const { certificateType } = this.state;
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
        {addDrawerVisible
          ? certificateType === 'businessLicense'
            ? this.renderBusinessLicenseView()
            : this.renderIDcardView()
          : null}
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
          <Button style={{ marginRight: 8 }} onClick={this.onSure} type="primary">
            确认无误
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
