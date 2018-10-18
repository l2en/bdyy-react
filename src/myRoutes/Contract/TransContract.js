import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Form, Select, Modal, Row, Col, Card } from 'antd';
import BaiduMap from 'myComponents/baidu';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddTransContract from './AddTransContract';
import TransContractCard from './TransContractCard';
import styles from './Contract.less';

const { Option } = Select;

@connect(({ client, baseData, contract, loading }) => ({
  client: client.clientSaveData,
  baseData,
  contract: contract.contract,
  routine: contract.routine,
  routineloading: loading.effects['contract/allInfoContractRoutine'],
  contractloading: loading.effects['contract/transportInfoByRoutine'],
  submitloading: loading.effects['contract/createTransport'],
  selectClient: contract.selectClient,
  selectRoutines: contract.selectRoutines,
}))
@Form.create()
export default class TransContract extends Component {
  state = {
    addTransDrawerVisible: false, // 运输合同抽屉
    addRoutine: '',
    addPackageType: '',
    coordinates: '', // 经纬度
    showMapLines: false, // 显示路线地图
  };

  componentDidMount() {
    const { dispatch, selectClient, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithRoutineNum: true,
      pageSize: 0,
      pageNum: 1,
    };

    dispatch({
      type: 'client/fetchClient',
      payload,
    });

    if (selectClient) {
      dispatch({
        type: 'contract/allInfoContractRoutine',
        payload: {
          clientId: selectClient,
        },
      });
    }
  }

  // 选择客户
  handleSelectClient = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'contract/allInfoContractRoutine',
      payload: {
        clientId: val,
      },
    });
  };

  // 新增运输合同
  handleAddTransDrawer = (routineId, packageType) => {
    this.setState({
      addTransDrawerVisible: true,
      addRoutine: routineId,
      addPackageType: packageType,
    });
  };

  // 关闭新增合同抽屉
  handleTransClose = () => {
    this.setState({
      addTransDrawerVisible: false,
    });
  };

  // 新增运输合同提交
  handleAddContract = createTransportPayload => {
    const { dispatch, selectRoutines } = this.props;

    dispatch({
      type: 'contract/createTransport',
      payload: createTransportPayload,
      callback: () => {
        this.setState({ addTransDrawerVisible: false });
        dispatch({
          type: 'contract/transportInfoByRoutine',
          payload: {
            contractRoutineIds: selectRoutines,
          },
        });
      },
    });
  };

  // 删除运输合同
  handleDeleteTransContract = id => {
    const { dispatch, selectRoutines } = this.props;

    Modal.confirm({
      title: '删除合同',
      content: `确定删除该合同？`,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'contract/deleteTransport',
          payload: {
            id,
          },
          callback: () => {
            dispatch({
              type: 'contract/transportInfoByRoutine',
              payload: {
                contractRoutineIds: selectRoutines,
              },
            });
          },
        });
      },
      onCancel() {},
    });
    return false;
  };

  // 查看地图
  handleToMap = record => {
    console.log(record);
    // 加载地图显示
    const demoPoint = [
      { x: 106.662195, y: 26.62717 },
      { x: 106.662235, y: 26.62717 },
      { x: 106.732992, y: 26.611019 },
      { x: 106.773937, y: 26.637141 },
      { x: 106.778666, y: 26.637233 },
    ];

    this.setState({
      coordinates: demoPoint,
      showMapLines: true,
    });
  };

  // 关闭路线预览
  handleCloseMap = () => {
    this.setState({
      showMapLines: false,
    });
  };

  render() {
    const transColumns = [
      { title: '起点', align: 'center', dataIndex: 'start' },
      { title: '途经点', align: 'center', dataIndex: 'via' },
      { title: '终点', align: 'center', dataIndex: 'end' },
      {
        title: '操作',
        align: 'center',
        render: record => (
          <Fragment>
            <span
              style={{ color: 'green', cursor: 'pointer' }}
              onClick={() => this.handleToMap(record)}
            >
              查看地图
            </span>
          </Fragment>
        ),
      },
    ];
    const {
      addTransDrawerVisible,
      addPackageType,
      addRoutine,
      coordinates,
      showMapLines,
    } = this.state;
    const {
      client,
      routine: routineList,
      contract: contractList,
      routineloading,
      contractloading,
      selectClient,
      selectRoutines,
      submitloading,
    } = this.props;
    const thisClient = client.filter(i => i.id === selectClient)[0];
    const routineContractList = [];
    const rowSelection = {
      onChange: selectedRowKeys => {
        const { dispatch } = this.props;
        dispatch({
          type: 'contract/transportInfoByRoutine',
          payload: {
            contractRoutineIds: selectedRowKeys.toString(),
          },
        });
      },
    };

    if (selectRoutines) {
      selectRoutines.split(',').forEach(item => {
        const routine = routineList.filter(i => i.id.toString() === item)[0];
        if (routine) {
          routineContractList.push(routine);
        }
      });
    }

    return (
      <PageHeaderLayout title="运输合同">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={7} sm={24}>
                  <span>客户：</span>
                  <Select
                    placeholder="请选择"
                    style={{ width: '80%' }}
                    value={selectClient || undefined}
                    onSelect={this.handleSelectClient}
                  >
                    {client.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </div>
            <Table
              pagination={false}
              loading={routineloading}
              dataSource={routineList}
              rowSelection={rowSelection}
              columns={transColumns}
              rowKey={i => i.id}
            />
            {routineContractList.length > 0
              ? routineContractList.map(item => {
                  let ctList = contractList.filter(i => i.routineId === item.id);
                  ctList = ctList.length > 0 ? ctList[0].contract : [];
                  return (
                    <Card
                      key={item.id}
                      title={`路线${item.id}(${item.start}...${item.via}...${item.end})`}
                      className={styles.wrapCard}
                      headStyle={{ background: 'gray', color: 'white' }}
                    >
                      <TransContractCard
                        key={item.id}
                        routine={item}
                        loading={contractloading}
                        contractList={ctList}
                        type="edit"
                        onAddTransDrawer={(routineId, packageType) =>
                          this.handleAddTransDrawer(routineId, packageType)
                        }
                        onDeleteTransContract={id => this.handleDeleteTransContract(id)}
                      />
                    </Card>
                  );
                })
              : ''}
            <AddTransContract
              addTransDrawerVisible={addTransDrawerVisible}
              thisClient={thisClient}
              routine={routineList}
              submitloading={submitloading}
              addRoutine={addRoutine}
              addPackageType={addPackageType}
              onTransClose={this.handleTransClose}
              onAddContract={val => this.handleAddContract(val)}
            />
            {!showMapLines ? null : (
              <BaiduMap PointArr={coordinates} onClose={this.handleCloseMap} />
            )}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
