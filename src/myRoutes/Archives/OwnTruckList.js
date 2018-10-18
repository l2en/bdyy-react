/**
 *  【档案管理】- 承运商
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Drawer, Divider, Form, Input, Table, Button, Modal, Icon } from 'antd';
import AddTruck from './components/AddTruck';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CarrierList.less';

const { Item: FormItem } = Form;
const { confirm } = Modal;

@connect(({ ownTruck, loading, baseData }) => ({
  ownTruck,
  loading: loading.models.ownTruck,
  baseData,
}))
export default class OwnTruckList extends PureComponent {
  state = {
    addDrawerVisible: false,
    inputVal: '',
  };

  componentDidMount() {
    const { dispatch, baseData } = this.props;
    dispatch({
      type: 'ownTruck/getTruckWithDriver',
      payload: {
        companyId: baseData.company.id,
      },
    });
  }

  // 新增自有车辆
  addTruck = truckData => {
    const { dispatch, baseData } = this.props;
    const addData = truckData;
    addData.companyId = baseData.company.id;
    dispatch({
      type: 'ownTruck/addTruck',
      payload: addData,
      onSuccess: () => {
        this.setState({
          addDrawerVisible: false,
        });
        dispatch({
          type: 'ownTruck/getOwnTruckList',
          payload: {
            companyId: baseData.company.id,
            isActive: true,
          },
        });
      },
    });
  };

  // 关闭新增自有车辆抽屉
  closeOwnTruck = () => [
    this.setState({
      addDrawerVisible: false,
    }),
  ];

  // 新增自有车辆抽屉
  addDrawer = () => {
    const { addDrawerVisible } = this.state;
    return (
      <Drawer
        title="新增自有车辆"
        width={1080}
        placement="right"
        onClose={this.closeOwnTruck}
        maskClosable
        visible={addDrawerVisible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <AddTruck onAddTruck={this.addTruck} />
      </Drawer>
    );
  };

  // 解除关系确认
  showDeleteConfirm = record => {
    const { dispatch, baseData } = this.props;
    confirm({
      title: `是否解除【${record.plateNum}】车辆的绑定关系?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'ownTruck/deleteTruckRelationship',
          payload: {
            id: record.id,
          },
          onSuccess: () => {
            dispatch({
              type: 'ownTruck/getTruckWithDriver',
              payload: {
                companyId: baseData.company.id,
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

  toggleDrawer = () => {
    const { addDrawerVisible } = this.state;
    this.setState({
      addDrawerVisible: !addDrawerVisible,
    });
  };

  // 去自有车辆详情列表
  toDetails = record => {
    const { history } = this.props;
    history.push(`/ownTruckSub/OwnTruckDetails/${record.id}`);
  };

  // 搜索框输入值监听
  changeInputVal = e => {
    const { dispatch, baseData } = this.props;
    const filter = e.target.value || '';
    this.setState(
      {
        inputVal: e.target.value,
      },
      () => {
        dispatch({
          type: 'ownTruck/getOwnTruckList',
          payload: {
            companyId: baseData.company.id,
            isActive: true,
          },
          filter,
        });
      }
    );
  };

  // 渲染搜索框
  renderSimpleForm = () => {
    const { inputVal } = this.state;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              <Input
                placeholder="输入车牌号，搜索车辆"
                onChange={this.changeInputVal}
                value={inputVal}
              />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  ToolBar = () => {
    const { inputVal } = this.state;
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '20px' }}>
          <Col md={8} sm={24}>
            <Button icon="plus" type="primary" onClick={this.toggleDrawer}>
              新增车辆
            </Button>
          </Col>
          <Col md={8} sm={24} offset={8}>
            <Input
              placeholder="输入车牌号，搜索车辆"
              onChange={this.changeInputVal}
              value={inputVal}
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const {
      loading,
      ownTruck: { truckWithDrivers },
    } = this.props;
    const ownTruckColumns = [
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
        render: (text, record) => {
          return (
            <span
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => this.toDetails(record)}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: '型号',
        dataIndex: 'vehicleType',
        key: 'vehicleType',
        align: 'center',
      },
      {
        title: '司机',
        dataIndex: 'driver',
        key: 'driver',
        align: 'center',
        render: (text, record) => {
          let str = '';
          return text.map((item, index) => {
            if (index === text.length - 1) {
              str += item;
              return (
                <span key={item} style={{ color: 'rgba(0,0,0,.65)' }}>
                  {str}
                </span>
              );
            }
            str += `${item}、`;
          });
        },
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
          return (
            <Fragment>
              <span
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={() => this.toDetails(record)}
              >
                配备司机
              </span>
              <Divider type="vertical" />
              <span
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => this.showDeleteConfirm(record)}
              >
                解除关系
              </span>
            </Fragment>
          );
        },
      },
    ];
    const truckWithDriverData = [];
    truckWithDrivers.map(item => {
      if (item.drivers.length) {
        item.truck.driver = [];
        item.drivers.map(driver => {
          item.truck.driver.push(driver.name);
        });
        truckWithDriverData.push(item.truck);
      } else {
        item.truck.driver = ['--'];
        truckWithDriverData.push(item.truck);
      }
    });

    return (
      <PageHeaderLayout title="自有车辆列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.ToolBar()}
            <Table
              rowKey={item => item.plateNum}
              columns={ownTruckColumns}
              dataSource={truckWithDriverData}
              loading={loading}
            />
          </div>
          {this.addDrawer()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
