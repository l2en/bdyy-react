import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, Button, Drawer, Form, Select, Modal } from 'antd';
import DescriptionList from 'components/DescriptionList';
import * as _ from 'lodash';
import PreviewImg from 'myComponents/PreviewImg';
import Avatar from 'myComponents/Avatar';
import AddTruck from './components/AddTruck';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CarrierDetails.less';

const { Description } = DescriptionList;
const { Option } = Select;
const { Item: FormItem } = Form;
const { confirm } = Modal;

@connect(({ carrier, ownTruck, loading, user, baseData, truck }) => ({
  carrier,
  baseData,
  user,
  truck,
  loading: loading.models.carrier,
  ownTruck,
}))
class ClientDetails extends Component {
  state = {
    Size: {
      width: '1080px',
      height: '700px',
    },
    modalVisiable: false,
    drawerVisiable: false,
    addCarrierUserVisible: false,
    selectUserId: '',
    truckId: '',
    driverId: '',
    previewVisible: false,
    previewUrl: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'carrier/getCarrierInfo',
      payload: {
        carrierId: match.params.carrierId,
        isWithTruckNum: true,
      },
    });
    dispatch({
      type: 'carrier/getCarrierDetailsTruck',
      payload: {
        carrierId: Number(match.params.carrierId),
      },
    });
    dispatch({
      type: 'carrier/getCarrierUsers',
      payload: {
        carrierId: match.params.carrierId,
      },
    });
  }

  // 关闭头像预览
  onCloseAvatar = () => {
    this.setState({
      previewVisible: false,
    });
  };

  // 新增车辆
  addTruck = truckData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'truck/addTruck',
      payload: truckData,
      onSuccess: () => {
        this.setState({
          modalVisiable: false,
        });
      },
    });
  };

  // 抽屉显示控制
  toggleDrawer = () => {
    const { drawerVisiable } = this.state;
    this.setState({
      drawerVisiable: !drawerVisiable,
    });
  };

  // 车辆select
  handleTruckSelected = value => {
    this.setState({
      truckId: value,
    });
  };

  handleTruckSearch = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'truck/getTruckInfo',
      payload: {
        plateNum: val,
      },
    });
  };

  // 司机select
  handleDriverChange = value => {
    this.setState({
      driverId: value,
    });
  };

  handleDriverSearch = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserInfo',
      payload: {
        phone: val,
      },
    });
  };

  //  绑定司机无车辆情况下添加车辆
  notFoundtoAddTruck = () => {
    const { drawerVisiable } = this.state;
    this.setState(
      {
        drawerVisiable: !drawerVisiable,
      },
      () => {
        this.setState({
          modalVisiable: true,
        });
      }
    );
  };

  addTruckWithDriverRela = () => {
    const { dispatch, match } = this.props;
    const { truckId, driverId } = this.state;
    dispatch({
      type: 'truck/addTruckWithDriver',
      payload: {
        carrierId: Number(match.params.carrierId),
        truckId,
        driverId,
      },
      onSuccess: () => {
        dispatch({
          type: 'carrier/getCarrierDetailsTruck',
          payload: {
            carrierId: Number(match.params.carrierId),
          },
        });
        this.toggleDrawer();
      },
    });
  };

  // 新增车辆关闭
  closeAddTruck = () => {
    this.setState({
      drawerVisiable: false,
    });
  };

  drawerDialog = () => {
    const { drawerVisiable } = this.state;
    const {
      truck: { truckInfo },
      user: { userInfo },
    } = this.props;
    let willSelectData = [];
    let willSelectDriverData = [];
    if (!_.isEmpty(truckInfo)) {
      willSelectData = [];
      willSelectData.push(truckInfo);
    }

    if (!_.isEmpty(userInfo)) {
      willSelectDriverData = [];
      willSelectDriverData.push(userInfo);
    }
    return (
      <Drawer
        title="新增车辆"
        width={400}
        placement="right"
        onClose={this.closeAddTruck}
        maskClosable
        visible={drawerVisiable}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form>
          <FormItem label="选择车辆">
            <Select
              showSearch
              placeholder="输入车牌，选择车辆"
              optionFilterProp="children"
              onChange={this.handleTruckSelected}
              notFoundContent={<a onClick={this.notFoundtoAddTruck}>添加车辆</a>}
              onSearch={this.handleTruckSearch}
              showArrow
              filterOption={false}
              style={{ width: '100%' }}
            >
              {willSelectData.map(d => (
                <Option key={d.id} value={d.id}>
                  {d.plateNum}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="指定司机">
            <Select
              showSearch
              placeholder="输入电话号码，查询司机"
              optionFilterProp="children"
              onChange={this.handleDriverChange}
              notFoundContent="无此用户信息"
              onSearch={this.handleDriverSearch}
              showArrow
              filterOption={false}
              style={{ width: '100%' }}
            >
              {willSelectDriverData.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </FormItem>
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
            <Button style={{ marginRight: 8 }} onClick={this.addTruckWithDriverRela} type="primary">
              确认
            </Button>
            <Button onClick={() => this.setState({ drawerVisiable: false })} type="danger">
              取消
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  };

  // 头像预览
  preview = url => {
    this.setState({
      previewVisible: true,
      previewUrl: url,
    });
  };

  // 上传车辆信息
  uploadTruckInfo = () => {
    const { modalVisiable, Size } = this.state;

    return (
      <Modal
        title="上传车辆信息"
        visible={modalVisiable}
        onCancel={this.modalHandleCancle}
        width={Size.width}
        height={Size.height}
        footer={null}
        bodyStyle={{ padding: 0 }}
        style={{ top: '10px' }}
        closable
        maskClosable
      >
        <AddTruck onAddTruck={this.addTruck} />
      </Modal>
    );
  };

  // 解除承运商中车辆与司机的绑定关系
  deleteCarrierAndDriverRelationship = record => {
    confirm({
      title: '解除绑定',
      content: `确定解除【${record.plateNum}】与 司机【${record.driverName}】的绑定关系？`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('解除绑定'); // 暂时没有解除
      },
      onCancel() {
        console.log('取消绑定');
      },
    });
  };

  // 详情信息展示--对象是企业时
  enterpriseInfo = () => {
    const {
      carrier: { carrierDetailsData },
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={20}>
            <DescriptionList size="large" title="承运商信息" style={{ marginBottom: 32 }}>
              <Description term="公司名称">{carrierDetailsData.name}</Description>
              <Description term="统一社会信用代码">{carrierDetailsData.identityNumber}</Description>
              <Description term="公司地址">{carrierDetailsData.address}</Description>
              <Description term="法人代表">{carrierDetailsData.name}</Description>
              <Description term="注册资本">{carrierDetailsData.registeredCapital}</Description>
              <Description term="成立日期">{carrierDetailsData.establishmentDate}</Description>
            </DescriptionList>
          </Col>
          <Col span={4}>
            <Avatar
              onPreview={this.preview}
              userInfo={carrierDetailsData}
              type={carrierDetailsData.type}
            />
          </Col>
        </Row>
        <Divider style={{ marginBottom: 32 }} />
      </Fragment>
    );
  };

  // 详情信息展示--对象是个人时
  personalInfo = () => {
    const {
      // carrier: { data },
      carrier: { carrierDetailsData },
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={20}>
            <DescriptionList size="large" title="承运商信息" style={{ marginBottom: 32 }}>
              <Description term="姓名">{carrierDetailsData.name}</Description>
              <Description term="身份证号码">{carrierDetailsData.identityNumber}</Description>
            </DescriptionList>
          </Col>
          <Col span={4}>
            <Avatar
              onPreview={this.preview}
              userInfo={carrierDetailsData}
              type={carrierDetailsData.type}
            />
          </Col>
        </Row>
        <Divider style={{ marginBottom: 32 }} />
      </Fragment>
    );
  };

  // 运输车辆模块
  carLine = () => {
    const { loading } = this.props;
    const carrierTruckColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '车牌号',
        dataIndex: 'plateNum',
        key: 'plateNum',
        align: 'center',
      },
      {
        title: '司机',
        dataIndex: 'driverName',
        key: 'driverName',
        align: 'center',
      },
      {
        title: '车辆型号',
        dataIndex: 'vehicleType',
        key: 'vehicleType',
        align: 'center',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        align: 'center',
        render: (text, record) => {
          return (
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => this.deleteCarrierAndDriverRelationship(record)}
            >
              解除绑定
            </span>
          );
        },
      },
    ];
    const {
      carrier: { carrierTrucksData },
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div className={styles.title}>运输车辆</div>
            <Button type="primary" onClick={this.toggleDrawer}>
              新增车辆
            </Button>
          </Col>
        </Row>
        <Table
          rowKey={i => i.id}
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          dataSource={carrierTrucksData}
          columns={carrierTruckColumns}
        />
        <Divider style={{ marginBottom: 32 }} />
      </Fragment>
    );
  };

  modalHandleCancle = () => {
    this.setState({
      modalVisiable: false,
    });
  };

  // 关闭添加用户抽屉
  closeAddUser = () => {
    this.setState({
      addCarrierUserVisible: false,
    });
  };

  toggleAddCarrierUserVisible = () => {
    const { addCarrierUserVisible } = this.state;
    this.setState({
      addCarrierUserVisible: !addCarrierUserVisible,
    });
  };

  // 添加承运商用户
  addCarrierPeople = () => {
    const { dispatch, match } = this.props;
    const { selectUserId } = this.state;
    dispatch({
      type: 'user/addCarrierUser',
      payload: {
        carrierId: Number(match.params.carrierId),
        userId: selectUserId,
      },
      onSuccess: () => {
        dispatch({
          type: 'carrier/getCarrierUsers',
          payload: {
            carrierId: match.params.carrierId,
          },
        });
        this.toggleAddCarrierUserVisible();
      },
    });
  };

  addCarrierUserChange = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserInfo',
      payload: {
        phone: val,
      },
    });
  };

  handleSelUserId = val => {
    this.setState({
      selectUserId: val,
    });
  };

  renderCarrier = () => {
    const {
      carrier: { carrierDetailsData },
    } = this.props;
    return (
      <Card bordered={false}>
        {carrierDetailsData.type === 'human' ? this.personalInfo() : this.enterpriseInfo()}
        {carrierDetailsData.dispatcher ? null : this.carLine()}
        {this.uploadTruckInfo()}
        {this.renderCarrierUserView()}
      </Card>
    );
  };

  // 承运商用户
  renderCarrierUserView = () => {
    const {
      carrier: { carrierUsers },
    } = this.props;
    const carrierUsersColumns = [
      {
        title: '身份',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
    ];

    return (
      <Fragment>
        <Row>
          <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className={styles.title}>承运商公司用户</div>
            <Button type="primary" onClick={this.toggleAddCarrierUserVisible}>
              管理身份
            </Button>
          </Col>
        </Row>
        <Table
          rowKey={i => i.id}
          style={{ marginBottom: 24 }}
          pagination={false}
          dataSource={carrierUsers}
          columns={carrierUsersColumns}
        />
      </Fragment>
    );
  };

  renderAddCarrierUserView = () => {
    const { addCarrierUserVisible } = this.state;
    const {
      user: { userInfo },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 12 },
      },
    };
    let willAddClientUser = [];
    if (_.isEmpty(userInfo)) {
      willAddClientUser = [];
      willAddClientUser.push(userInfo);
    }
    return (
      <Drawer
        width={450}
        placement="right"
        maskClosable
        onClose={this.closeAddUser}
        visible={addCarrierUserVisible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form>
          <FormItem {...formItemLayout} label="添加用户">
            <Select
              showSearch
              placeholder="选择添加用户"
              optionFilterProp="children"
              notFoundContent="暂无此用户,请先注册"
              onSearch={this.addCarrierUserChange}
              onChange={this.handleSelUserId}
              showArrow
              filterOption={false}
              style={{ width: '100%' }}
            >
              <Option key={userInfo.id} value={userInfo.id}>
                {userInfo.name}
              </Option>
              {willAddClientUser.map(d => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </FormItem>
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
            <Button style={{ marginRight: 8 }} onClick={this.addCarrierPeople} type="primary">
              确认
            </Button>
            <Button onClick={this.closeAddUser} type="danger">
              取消
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  };

  render() {
    const { previewVisible, previewUrl } = this.state;

    return (
      <PageHeaderLayout title="承运商详情">
        {this.renderCarrier()}
        {this.drawerDialog()}
        {this.renderAddCarrierUserView()}
        <PreviewImg
          previewVisible={previewVisible}
          onCancle={this.onCloseAvatar}
          previewUrl={previewUrl}
        />
      </PageHeaderLayout>
    );
  }
}
export default ClientDetails;
