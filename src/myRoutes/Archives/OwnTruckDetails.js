import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, Button, Drawer, Form, Select, Modal } from 'antd';
import DescriptionList from 'components/DescriptionList';
import * as _ from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OwnTruckDetails.less';

const { Description } = DescriptionList;
const { Option } = Select;
const { Item: FormItem } = Form;
const { confirm } = Modal;

@connect(({ ownTruck, loading, user, baseData }) => ({
  ownTruck,
  baseData,
  user,
  loading: loading.models.ownTruck,
}))
class OwnTruckDetails extends Component {
  state = {
    addDrawerVisible: false,
    driverId: '',
  };

  componentDidMount() {
    const { dispatch, match, baseData } = this.props;
    console.log('获取id', match.params.id);
    dispatch({
      type: 'ownTruck/getOwnTruckDetails',
      payload: {
        id: match.params.id,
      },
    });
    // 自有车辆获取车辆与司机绑定关系
    dispatch({
      type: 'ownTruck/getTruckWithDriver',
      payload: {
        companyId: Number(baseData.company.id),
      },
    });
  }

  // Drawer控制
  toggleDrawer = () => {
    const { addDrawerVisible } = this.state;
    this.setState({
      addDrawerVisible: !addDrawerVisible,
    });
  };

  // 选择变化事件
  handleTruckChange = val => {
    console.log('输入值变化', val);
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserInfo',
      payload: {
        phone: val,
      },
    });
  };

  handleTruckSelected = val => {
    this.setState({
      driverId: val,
    });
  };

  // 新增一个自有车辆与司机的配对
  addDriver = () => {
    const {
      dispatch,
      baseData,
      ownTruck: { ownTruckDetails },
    } = this.props;
    const { driverId } = this.state;
    this.setState({
      addDrawerVisible: false,
    });
    dispatch({
      type: 'ownTruck/addDriverWithTruck',
      payload: {
        companyId: baseData.company.id,
        truckId: ownTruckDetails.id,
        driverId,
      },
      onSuccess: () => {
        dispatch({
          type: 'ownTruck/getTruckWithDriver',
          payload: {
            companyId: Number(baseData.company.id),
          },
        });
      },
    });
  };

  // 关闭车辆与司机绑定
  closeOwnTruckwithDriver = () => {
    this.setState({
      addDrawerVisible: false,
    });
  };

  renderAddDriverView = () => {
    const { addDrawerVisible } = this.state;
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
    let willAddUser = [];
    if (!_.isEmpty(userInfo)) {
      willAddUser = [];
      willAddUser.push(userInfo);
    }
    return (
      <Drawer
        width={450}
        placement="right"
        maskClosable
        onClose={this.closeOwnTruckwithDriver}
        visible={addDrawerVisible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form>
          <FormItem {...formItemLayout} label="选择司机">
            <Select
              showSearch
              placeholder="输入电话，选择司机"
              optionFilterProp="children"
              onChange={this.handleTruckSelected}
              onSearch={this.handleTruckChange}
              notFoundContent="暂无此司机"
              showArrow
              filterOption={false}
              style={{ width: '100%' }}
            >
              {willAddUser.map(user => (
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
            <Button style={{ marginRight: 8 }} onClick={this.addDriver} type="primary">
              确认
            </Button>
            <Button onClick={this.closeOwnTruckwithDriver} type="danger">
              取消
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  };

  deleteRoadLine = record => {
    const { baseData, dispatch, match } = this.props;
    confirm({
      title: `是否解除【${record.name}】的绑定关系?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const deleteData = {
          companyId: baseData.company.id,
          truckId: Number(match.params.id),
          driverId: record.id,
        };
        dispatch({
          type: 'ownTruck/deleteOwnTruckWithDriver',
          payload: deleteData,
          onSuccess: () => {
            dispatch({
              type: 'ownTruck/getTruckWithDriver',
              payload: {
                companyId: Number(baseData.company.id),
              },
            });
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  renderTruckInfoView = () => {
    const goodsColumns = [
      {
        title: '司机',
        dataIndex: 'name',
        key: 'name',
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
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        render: (text, record) => (
          <span
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={() => this.deleteRoadLine(record)}
          >
            解除司机
          </span>
        ),
      },
    ];
    const {
      ownTruck: { ownTruckDetails },
      match,
      loading,
    } = this.props;
    const {
      ownTruck: { truckWithDrivers },
    } = this.props;
    const filterDriverWithTruck = truckWithDrivers.length
      ? truckWithDrivers.filter(item => item.truck.id === Number(match.params.id))[0].drivers
      : [];
    const truckInfo = ownTruckDetails || {};
    return (
      <Card bordered={false}>
        <DescriptionList
          size="large"
          title={`车辆： ${truckInfo.plateNum} `}
          style={{ marginBottom: 32 }}
        >
          <Description term="车辆号码">{truckInfo.plateNum || '--'}</Description>
          <Description term="车辆类型">{truckInfo.vehicleType || '--'} </Description>
          <Description term="所有人名称">{truckInfo.owner || '--'}</Description>
          <Description term="使用性质">{truckInfo.useCharacter || '--'}</Description>
          <Description term="地址">{truckInfo.addr || '--'}</Description>
          <Description term="品牌型号">{truckInfo.model || '--'}</Description>
          <Description term="车辆识别代号">{truckInfo.vin || '--'}</Description>
          <Description term="注册日期">{truckInfo.registerDate || '--'}</Description>
          <Description term="发证日期">{truckInfo.issueDate || '--'}</Description>
          <Description term="核定载人数">
            {truckInfo.appprovedPassengerCapacity || '--'}
          </Description>
          <Description term="核定载质量">{truckInfo.approvedLoad || '--'}</Description>
          <Description term="档案编号">{truckInfo.fileNo || '--'}</Description>
          <Description term="总质量">{truckInfo.grossMass || '--'}</Description>
          <Description term="检验记录">{truckInfo.inspectionRecord || '--'}</Description>
          <Description term="外廓尺寸">{truckInfo.overallDimension || '--'}</Description>
          <Description term="准牵引总质量">{truckInfo.tractionMass || '--'}</Description>
          <Description term="整备质量">{truckInfo.unladenMass || '--'}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <Row>
          <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className={styles.title}>配置司机</div>
            <Button type="primary" onClick={this.toggleDrawer}>
              + 新增司机
            </Button>
          </Col>
        </Row>
        <Table
          rowKey={i => i.id}
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          onClose={this.closeDrawer}
          dataSource={filterDriverWithTruck || []}
          columns={goodsColumns}
        />
      </Card>
    );
  };

  render() {
    return (
      <PageHeaderLayout title="自有车辆详情">
        {this.renderTruckInfoView()}
        {this.renderAddDriverView()}
      </PageHeaderLayout>
    );
  }
}
export default OwnTruckDetails;
