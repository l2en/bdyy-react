import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table, Badge, Row, Col, Button, Menu, InputNumber, Input,Dropdown, Icon } from 'antd';
import PrcessEditable from './ProcessEditable';
import AddProcessSellOrderDrawer from './AddProcessSellOrderDrawer'
import styles from './ProcessSellOrder.less';

@connect(({ baseData }) => ({
  baseData,
}))
@Form.create()
export default class ProcessSellOrder extends Component {
  state = {
    addProcessSellOrderDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, baseData } = this.props;
    // const payload = {
    //   companyId: baseData.company.id,
    //   isWithRoutineNum: true,
    //   pageSize: 0,
    //   pageNum: 1,
    // };

    // dispatch({
    //   type: 'client/fetchClient',
    //   payload,
    // });
  }

  handleEditProcess = () =>{

  }

  // 新建进行中的订单
  handleCreateProcessOrder=()=>{
    this.setState({
      addProcessSellOrderDrawerVisible: true,
    });
  }

  // 关闭
  handleProcessSellOrderDrawerClose=()=>{
    this.setState({
      addProcessSellOrderDrawerVisible: false,
    });
  }

  handleAddProcessSellOrder = createPayload => {
    const { dispatch  } = this.props;
    console.log(createPayload)
  };

  render() {
    const { addProcessSellOrderDrawerVisible } = this.state;
    // const { client = [], baseData } = this.props;
    const orderList = [
      {
        id: '1',
        orderNum: 'OD001',
        providerName: '峨胜水泥厂',
        clientName: '四川路桥',
        orderDate: '2018-10-01',
        orderItems: [
          {
            id: '1',
            plateNum: '33',
            productName: '水泥',
            productType: 'PO42.5',
            productPackagingType: '散装',
            date: '2018-10-01',
            sellPrice: '222',
            purchasePrice: '333',
            status: 0, // 0,1,2
          },
          {
            id: '2',
            plateNum: '33',
            productName: '水泥',
            productType: 'PO42.5',
            productPackagingType: '散装',
            date: '2018-10-01',
            sellPrice: '222',
            purchasePrice: '333',
            status: 0, // 0,1,2
          },
        ],
      },
      {
        id: '2',
        orderNum: 'OD002',
        providerName: '简诣网络',
        clientName: '四川路桥',
        orderDate: '2018-10-01',
        orderItems: [
          {
            id: '2',
            plateNum: '33',
            productName: '水泥',
            productType: 'PO42.5',
            productPackagingType: '散装',
            date: '2018-10-01',
            sellPrice: '222',
            purchasePrice: '333',
            status: 1, // 0,1,2
          },
        ],
      },
    ];

    const columns = [
      { title: '订单号', dataIndex: 'orderNum', key: 'orderNum' },
      { title: '客户', dataIndex: 'clientName', key: 'clientName' },
      { title: '供应商', dataIndex: 'providerName', key: 'providerName' },
      { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate' },
    ];

    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={16} sm={48}>
              <Button
                icon="plus"
                type="primary"
                // disabled={!selectRole}
                onClick={this.handleCreateProcessOrder}
              >
                新建
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          className={styles.tableNest}
          columns={columns}
          expandedRowRender={(order) => <PrcessEditable orderItems={order.orderItems} />}
          dataSource={orderList}
          rowKey={i => i.id}
        />
        <AddProcessSellOrderDrawer
          addProcessSellOrderDrawerVisible={addProcessSellOrderDrawerVisible}
          onProcessSellOrderDrawerClose={this.handleProcessSellOrderDrawerClose}
          onAddProcessSellOrder={val => this.handleAddProcessSellOrder(val)}
        />
      </div>
    );
  }
}
