import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SaleOrBuyContract from './SaleOrBuyContract';

@connect(({ client, baseData }) => ({
  client: client.clientSaveData,
  baseData,
}))
@Form.create()
export default class Contract extends Component {
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

  render() {
    const { client, baseData } = this.props;
    return (
      <PageHeaderLayout title="销售合同">
        <Card bordered={false}>
          <SaleOrBuyContract type="sale" clientData={client} companyId={baseData.company.id} />
        </Card>
      </PageHeaderLayout>
    );
  }
}
