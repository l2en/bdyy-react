import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ProcessSellOrder from './ProcessSellOrder'
import styles from './SellOrder.less';

const operationTabList = [
  { key: 'createOrder', tab: '进行中的订单' },
  { key: 'historyOrder', tab: '历史订单' },
];

/* const columnsOfPastOrder = [
  {
    title: '下单日期',
    dataIndex: 'orderDate',
    key: 'orderDate',
  },
  {
    title: '单号',
    dataIndex: 'orderCode',
    key: 'orderCode',
  },
  {
    title: '出厂日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '客户',
    dataIndex: 'client',
    key: 'client',
  },
  {
    title: '供应商',
    dataIndex: 'provider',
    key: 'provider',
  },
  {
    title: '商品',
    dataIndex: 'product',
    key: 'product',
  },
  {
    title: '出厂数量',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: '车牌号',
    dataIndex: 'plateNum',
    key: 'plateNum',
  },
  {
    title: '销售单价',
    dataIndex: 'sellPrice',
    key: 'sellPrice',
  },
  {
    title: '购买单价',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
]; */

@connect(({ client, baseData }) => ({
  client: client.clientSaveData,
  baseData,
}))
@Form.create()
export default class SellOrder extends Component {
  state = {
    operationkey: 'createOrder',
  };

  componentDidMount() {
    const { dispatch, baseData } = this.props;
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
  }

  // 切换tab
  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  render() {
    const { operationkey } = this.state;
    // const { client = [], baseData } = this.props;

    const contentList = {
      createOrder: <ProcessSellOrder />,
      historyOrder: <div>bla</div>,
    };

    return (
      <PageHeaderLayout title="销售订单">
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[operationkey]}
        </Card>
      </PageHeaderLayout>
    );
  }
}
