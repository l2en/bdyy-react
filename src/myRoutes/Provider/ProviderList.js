/**
 *  【档案管理】-客户
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Table, Button, Modal, Icon } from 'antd';
import uploadToOSS from 'utils/uploadToOSS';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OCR from './components/OCR';

const { confirm } = Modal;

@connect(({ alibaba, baseData, loading, provider }) => ({
  provider,
  alibaba,
  baseData,
  loading: loading.models.provider,
}))
export default class ProviderList extends Component {
  state = {
    inputVal: '',
    addDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      pageSize: 0,
      pageNum: 0,
    };
    dispatch({
      type: 'provider/getProviderList',
      payload,
    });
  }

  // 查看详情
  toDetails = record => {
    const { history } = this.props;
    history.push(`/providerSub/providerdetails/${record.id}`);
  };

  // 解除关系
  showDeleteConfirm = record => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      pageSize: 0,
      pageNum: 0,
    };
    confirm({
      title: `是否解除与【${record.name}】的业务关系?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'provider/deleteProvider',
          payload: {
            id: record.id,
          },
          onSuccess: () => {
            dispatch({
              type: 'provider/getProviderList',
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

  // 查询供应商
  changeInputVal = e => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithRoutineNum: true,
      pageSize: 0,
      pageNum: 1,
    };
    const filter = e.target.value || '';
    this.setState(
      {
        inputVal: e.target.value,
      },
      () => {
        dispatch({
          type: 'provider/getProviderList',
          payload,
          filter,
        });
      }
    );
  };

  // 确认无误
  pushProvider = (data, base64Img, file) => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      pageSize: 0,
      pageNum: 0,
    };
    data.companyId = baseData.company.id;
    dispatch({
      type: 'provider/addProvider',
      payload: data,
      onSuccess: () => {
        dispatch({
          type: 'provider/getProviderList',
          payload,
        });
        const toOSSInfo = {};
        toOSSInfo.name = data.name;
        toOSSInfo.identityNumber = data.identityNumber;
        uploadToOSS(toOSSInfo, base64Img, file);
        this.setState({
          addDrawerVisible: false,
        });
      },
    });
  };

  // 抽屉控制
  toggleDrawer = () => {
    const { addDrawerVisible } = this.state;
    this.setState({
      addDrawerVisible: !addDrawerVisible,
    });
  };

  ToolBar = () => {
    const { inputVal } = this.state;
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: '20px' }}>
          <Col md={8} sm={24}>
            <Button type="primary" style={{ marginBottom: '20px' }} onClick={this.toggleDrawer}>
              {' '}
              + 新增供应商
            </Button>
          </Col>
          <Col md={8} sm={24} offset={8}>
            <Input
              placeholder="按供应商名称搜索"
              onChange={this.changeInputVal}
              value={inputVal}
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
          </Col>
        </Row>
      </div>
    );
  };

  // 抽屉控制
  toggleDrawer = () => {
    const { addDrawerVisible } = this.state;
    this.setState({
      addDrawerVisible: !addDrawerVisible,
    });
  };

  // 关闭抽屉
  closeAddProvider = () => {
    this.setState({
      addDrawerVisible: false,
    });
  };

  render() {
    const { addDrawerVisible } = this.state;
    const {
      provider: { providerList },
      loading,
    } = this.props;
    const clientListColumns = [
      {
        key: 'id',
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        key: 'name',
        title: '公司',
        dataIndex: 'name',
        align: 'center',
        render: (text, record) => (
          <span
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => this.toDetails(record)}
          >
            {text}
          </span>
        ),
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
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
      <PageHeaderLayout title="供应商列表">
        <Card bordered={false}>
          {this.ToolBar()}
          <Table
            columns={clientListColumns}
            dataSource={providerList}
            loading={loading}
            rowKey={i => i.id}
          />
        </Card>
        <OCR
          addDrawerVisible={addDrawerVisible}
          title="新建供应商"
          onCancle={this.closeAddProvider}
          onOk={this.pushProvider}
        />
      </PageHeaderLayout>
    );
  }
}
