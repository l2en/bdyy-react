import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Upload, Button, Icon, Input, Message } from 'antd';
import styles from './index.less';
import { getBase64 } from 'utils/getBase64';
import request from 'utils/request';
import { connect } from 'dva';

const { Item: FormItem } = Form;
@connect(({ baseData }) => ({ baseData }))
export default class AddTruck extends Component {
  static defaultProps = {
    onAddTruck: () => {},
  };

  state = {
    carrierInfoBebind: {},
    carrierInfoBefore: {},
    imageUrlBefore: '',
    imageUrlBehind: '',
  };

  componentWillReceiveProps() {
    this.setState({
      carrierInfoBebind: {},
      carrierInfoBefore: {},
      imageUrlBefore: '',
      imageUrlBehind: '',
    });
  }

  // 正面证件
  certificateFront = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      style: {
        marginBottom: '15px',
      },
    };
    const { carrierInfoBefore } = this.state;
    return (
      <Fragment>
        <FormItem {...formItemLayout} label="车辆号码">
          <Input disabled type="text" value={carrierInfoBefore.plate_num || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="车辆类型">
          <Input disabled type="text" value={carrierInfoBefore.vehicle_type || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="所有人名称">
          <Input disabled type="text" value={carrierInfoBefore.owner || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="使用性质">
          <Input disabled type="text" value={carrierInfoBefore.use_character || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          <Input disabled type="text" value={carrierInfoBefore.addr || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="品牌型号">
          <Input disabled type="text" value={carrierInfoBefore.model || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="车辆识别代号">
          <Input disabled type="text" value={carrierInfoBefore.vin || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="发动机号码">
          <Input disabled type="text" value={carrierInfoBefore.engine_num || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="注册日期">
          <Input disabled type="text" value={carrierInfoBefore.register_date || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="发证日期">
          <Input disabled type="text" value={carrierInfoBefore.issue_date || ''} />
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
    const { carrierInfoBebind } = this.state;

    return (
      <Fragment>
        <FormItem {...formItemLayout} label="核定载人数">
          <Input
            disabled
            type="text"
            value={carrierInfoBebind.appproved_passenger_capacity || ''}
          />
        </FormItem>
        <FormItem {...formItemLayout} label="核定载质量">
          <Input disabled type="text" value={carrierInfoBebind.approved_load || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="档案编号">
          <Input disabled type="text" value={carrierInfoBebind.file_no || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="总质量">
          <Input disabled type="text" value={carrierInfoBebind.gross_mass || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="检验记录">
          <Input disabled type="text" value={carrierInfoBebind.inspection_record || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="外廓尺寸">
          <Input disabled type="text" value={carrierInfoBebind.overall_dimension || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="准牵引总质量">
          <Input disabled type="text" value={carrierInfoBebind.traction_mass || ''} />
        </FormItem>
        <FormItem {...formItemLayout} label="整备质量">
          <Input disabled type="text" value={carrierInfoBebind.unladen_mass || ''} />
        </FormItem>
      </Fragment>
    );
  };

  // 识别
  identify = (params, side) => {
    request('/JYLogisticsClient/api/alibaba/vehicleLicenceIdentify', {
      method: 'POST',
      body: params,
    }).then(resData => {
      console.log('识别出来了', resData);
      if (resData.code) {
        Message.error('识别出错，请重试！');
        return;
      }
      if (side === 'face') {
        this.setState({
          carrierInfoBefore: resData.data,
        });
      } else {
        this.setState({
          carrierInfoBebind: resData.data,
        });
      }
    });
  };

  // 识别有误
  handleIdentifyError = () => {
    console.log('识别有误');
    this.setState({
      carrierInfoBebind: {},
      carrierInfoBefore: {},
      imageUrlBefore: '',
      imageUrlBehind: '',
    });
    Message.info('请重新上传');
  };
  // 上传
  handleUpload = (file, side) => {
    getBase64(file, base64Img => {
      const params = {
        body: base64Img.split('base64,')[1],
        side: side,
      };
      side === 'face'
        ? this.setState({
            imageUrlBefore: base64Img,
          })
        : this.setState({
            imageUrlBehind: base64Img,
          });

      this.identify(params, side);
    });
  };

  // 添加车辆
  addTruck = () => {
    const { onAddTruck, baseData } = this.props;
    const { carrierInfoBefore, carrierInfoBebind } = this.state;

    let addTruckData = {};
    addTruckData.plateNum = carrierInfoBefore.plate_num;
    addTruckData.vehicleType = carrierInfoBefore.vehicle_type;
    addTruckData.owner = carrierInfoBefore.owner;
    addTruckData.addr = carrierInfoBefore.addr;
    addTruckData.model = carrierInfoBefore.model;
    addTruckData.vin = carrierInfoBefore.vin;
    addTruckData.engineNum = carrierInfoBefore.engine_num;
    addTruckData.registerDate = carrierInfoBefore.register_date;
    addTruckData.issueDate = carrierInfoBefore.issue_date;
    addTruckData.appprovedPassengerCapacity = carrierInfoBebind.appproved_passenger_capacity;
    addTruckData.approvedLoad = carrierInfoBebind.approved_load;
    addTruckData.fileNo = carrierInfoBebind.file_no;
    addTruckData.grossMass = carrierInfoBebind.gross_mass;
    addTruckData.inspectionRecord = carrierInfoBebind.inspection_record;
    addTruckData.overallDimension = carrierInfoBebind.overall_dimension;
    addTruckData.tractionMass = carrierInfoBebind.traction_mass;
    addTruckData.unladenMass = carrierInfoBebind.unladen_mass;
    addTruckData.companyId = baseData.company.id;
    onAddTruck(addTruckData);
  };

  render() {
    console.log('正面证件信息', this.setState.carrierInfoBefore);
    console.log('反面证件信息', this.setState.carrierInfoBebind);

    const { imageUrlBefore, imageUrlBehind } = this.state;
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
                  loading={true}
                  style={{ width: '285px!important', height: '180px!important' }}
                  showUploadList={false}
                  beforeUpload={file => this.handleUpload(file, 'face')}
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
                  beforeUpload={file => this.handleUpload(file, 'back')}
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
          <Button style={{ marginRight: 8 }} onClick={this.addTruck} type="primary">
            确认无误
          </Button>
          <Button onClick={this.handleIdentifyError} type="danger">
            识别有误
          </Button>
        </div>
      </Fragment>
    );
  }
}
