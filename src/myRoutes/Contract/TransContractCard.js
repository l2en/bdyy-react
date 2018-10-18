import React, { Component, Fragment } from 'react';
import { Button, Card, Table } from 'antd';

const pkType = {
  BULK: '散装',
  BAG: '袋装',
}

export default class TransContractCard extends Component {
  state = {};

  // 新增运输合同
  handleAddTransDrawer = (id, type) => {
    const { onAddTransDrawer } = this.props;

    onAddTransDrawer(id, type);
  };

  // 删除运输合同
  handleDeleteTransContract = id => {
    const { onDeleteTransContract } = this.props;

    onDeleteTransContract(id);
  };

  render() {
    const { routine, loading, contractList, type } = this.props;
    const routeColumns = [
      { title: '时间段', align: 'center', dataIndex: 'activeDate' },
      { title: '销售价格', align: 'center', dataIndex: 'clientPrice' },
      {
        title: '承运价格',
        align: 'center',
        dataIndex: 'carrierPrice',
        render: record => record || '-',
      },
      {
        title: '自运价格',
        align: 'center',
        dataIndex: 'driverPrice',
        render: record => record || '-',
      },
    ]

    if(type === 'edit'){
      routeColumns.push({
        title: '操作',
        align: 'center',
        render: record => (
          <Fragment>
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => this.handleDeleteTransContract(record.id)}
            >
              删除
            </span>
          </Fragment>
        ),
      });
    };

    const bulk = contractList.length > 0 ? contractList.filter(j => j.packagingType === pkType.BULK) : [];
    const bags = contractList.length > 0 ? contractList.filter(j => j.packagingType === pkType.BAG) : [];

    return (
      <Fragment>
        <Card
          type="inner"
          title={`${pkType.BULK}车`}
          extra={
            type === 'edit' ? (
              <Button
                icon="plus"
                size="small"
                type="primary"
                onClick={() => this.handleAddTransDrawer(routine.id, pkType.BULK)}
              >
                新建合同
              </Button>):undefined
          }
        >
          <Table
            pagination={false}
            size="small"
            dataSource={bulk}
            loading={loading}
            columns={routeColumns}
            rowKey={i => i.id}
          />
        </Card>
        <Card
          style={{ marginTop: 16 }}
          type="inner"
          title={`${pkType.BAG}车`}
          extra={
            type === 'edit' ? (
              <Button
                icon="plus"
                size="small"
                type="primary"
                onClick={() => this.handleAddTransDrawer(routine.id, pkType.BAG)}
              >
                新建合同
              </Button>):undefined
          }
        >
          <Table
            pagination={false}
            size="small"
            dataSource={bags}
            loading={loading}
            columns={routeColumns}
            rowKey={i => i.id}
          />
        </Card>
      </Fragment>
    );
  }
}
