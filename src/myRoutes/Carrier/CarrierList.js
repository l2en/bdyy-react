/**
 *  【档案管理】- 承运商
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Table, Button, Modal, Icon } from 'antd';
import uploadToOSS from 'utils/uploadToOSS';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CarrierList.less';
import OCR from './components/OCR';

const { confirm } = Modal;

@connect(({ carrier, loading, baseData, alibaba }) => ({
  carrier,
  baseData,
  alibaba,
  loading: loading.models.carrier,
}))
export default class ClientList extends PureComponent {
  state = {
    addDrawerVisible: false,
    inputVal: '',
  };

  componentDidMount() {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithTruckNum: true,
      pageNum: 0,
      pageSize: 0,
    };
    dispatch({
      type: 'carrier/getCarrierList',
      payload,
    });
  }

  // 删除承运商
  showDeleteConfirm = record => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithTruckNum: true,
      pageNum: 0,
      pageSize: 0,
    };
    confirm({
      title: `是否解除与【${record.name}】的业务关系?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'carrier/deleteRelationshipWithCarrier',
          payload: {
            id: record.id,
          },
          onSuccess: () => {
            dispatch({
              type: 'carrier/getCarrierList',
              payload,
            });
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 去详情
  toDetails = carrierId => {
    const { history } = this.props;
    history.push(`/carrierSub/carrierdetails/${carrierId}`);
  };

  changeInputVal = e => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithTruckNum: true,
      pageNum: 0,
      pageSize: 0,
    };
    this.setState({
      inputVal: e.target.value,
    });
    dispatch({
      type: 'carrier/getCarrierList',
      payload,
      filter: e.target.value,
    });
  };

  // 确认无误
  pushCarrier = (data, base64Img, file) => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithTruckNum: true,
      pageNum: 0,
      pageSize: 0,
    };
    data.companyId = baseData.company.id
    dispatch({
      type: 'carrier/addCarrier',
      payload: data,
      onSuccess: () => {
        const toOSSInfo = {};
        toOSSInfo.name = data.name;
        toOSSInfo.identityNumber = data.identityNumber;
        uploadToOSS(toOSSInfo, base64Img, file);
        dispatch({
          type: 'carrier/getCarrierList',
          payload,
        });
        this.setState({
          addDrawerVisible: false,
        });
      },
    });
  };

  closeAddNewCarrier = () => {
    this.setState({
      addDrawerVisible: false,
    });
  };

  openAddNewCarrier = () => {
    this.setState({
      addDrawerVisible: true,
    });
  };

  ToolBar = () => {
    const { inputVal } = this.state;
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '20px' }}>
          <Col md={8} sm={24}>
            <Button icon="plus" type="primary" onClick={this.openAddNewCarrier}>
              新增承运商
            </Button>
          </Col>
          <Col md={8} sm={24} offset={8}>
            <Input
              placeholder="按承运商名称搜索"
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
      carrier: { carrierListData },
      loading,
    } = this.props;
    const { addDrawerVisible } = this.state;
    const carrierListColums = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '承运商',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        render: (text, record) => {
          return (
            <span
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => this.toDetails(record.id)}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: '车辆数量',
        dataIndex: 'truckNum',
        key: 'truckNum',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
          // console.log('不能删除啊', record);
          return (
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => this.showDeleteConfirm(record)}
            >
              解除关系
            </span>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="承运商列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {this.ToolBar()}
            <Table
              rowKey={i => i.id}
              columns={carrierListColums}
              dataSource={carrierListData}
              loading={loading}
            />
          </div>
        </Card>

        <OCR
          addDrawerVisible={addDrawerVisible}
          title="新增承运商"
          onCancle={this.closeAddNewCarrier}
          onOk={this.pushCarrier}
        />
      </PageHeaderLayout>
    );
  }
}
