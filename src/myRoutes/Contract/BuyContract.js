import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SaleOrBuyContract from './SaleOrBuyContract';

@connect(({ baseData }) => ({
  baseData,
}))
@Form.create()
export default class Contract extends Component {
  render() {
    const { baseData } = this.props;
    return (
      <PageHeaderLayout title="购买合同">
        <Card bordered={false}>
          <SaleOrBuyContract type="buy" companyId={baseData.company.id} />,
        </Card>
      </PageHeaderLayout>
    );
  }
}
