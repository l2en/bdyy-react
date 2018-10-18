import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SellOrder.less';

const operationTabList = [
  { key: 'createOrder', tab: '进行中的订单' },
  { key: 'historyOrder', tab: '历史订单' },
];

@connect(({ client, baseData }) => ({
  client: client.clientSaveData,
  baseData,
}))
@Form.create()
export default class TransOrder extends Component {
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
      createOrder: <div>bla</div>,
      historyOrder: <div>bla</div>,
    };

    return (
      <PageHeaderLayout title="运输订单">
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
