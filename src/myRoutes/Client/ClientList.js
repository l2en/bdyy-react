/**
 *  【档案管理】-客户
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Table, Button, Modal, Icon } from 'antd';
import uploadToOSS from 'utils/uploadToOSS';
import OCR from './components/OCR';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { confirm } = Modal;

@connect(({ client, alibaba, baseData, loading }) => ({
  client,
  alibaba,
  baseData,
  loading: loading.models.client,
}))
export default class ClientList extends Component {
  state = {
    inputVal: '',
    addDrawerVisible: false,
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

  // 查看详情
  toDetails = record => {
    const { history } = this.props;
    history.push(`/clientSub/clientdetails/${record.id}`);
  };

  // 解除关系
  showDeleteConfirm = (id, name) => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithRoutineNum: true,
      pageSize: 0,
      pageNum: 1,
    };
    confirm({
      title: `是否解除与【${name}】的业务关系?`,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'client/deleteRelationshipWithClient',
          payload: {
            id,
          },
          callback: () => {
            dispatch({
              type: 'client/fetchClient',
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

  // 查询客户
  changeInputVal = e => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithRoutineNum: true,
      pageSize: 0,
      pageNum: 1,
    };
    const filter = e.target.value || '';
    const filterFn = () => {
      dispatch({
        type: 'client/fetchClient',
        payload,
        filter,
      });
    };
    this.setState({ inputVal: e.target.value }, () => {
      filterFn();
    });
  };

  // 确认无误
  pushClient = (data, base64Img, file) => {
    const { dispatch, baseData } = this.props;
    const payload = {
      companyId: baseData.company.id,
      isWithRoutineNum: true,
      pageSize: 0,
      pageNum: 1,
    };
    data.companyId = baseData.company.id
    dispatch({
      type: 'client/addClient',
      payload: data,
      onSuccess: () => {
        const toOSSInfo = {};
        toOSSInfo.name = data.name;
        toOSSInfo.identityNumber = data.identityNumber;
        uploadToOSS(toOSSInfo, base64Img, file);
        dispatch({
          type: 'client/fetchClient',
          payload,
        });
        this.setState({
          addDrawerVisible: false,
        });
      },
    });
  };

  // 抽屉控制
  closeAddNewClient = () => {
    this.setState({
      addDrawerVisible: false,
    });
  };

  openAddNewClient = () => {
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
            <Button type="primary" style={{ marginBottom: '20px' }} onClick={this.openAddNewClient}>
              + 新增客户{' '}
            </Button>
          </Col>
          <Col md={8} sm={24} offset={8}>
            <Input
              placeholder="按客户名称搜索"
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
      client: { clientSaveData },
      loading,
    } = this.props;
    const { addDrawerVisible } = this.state;
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
        title: '路线数量',
        dataIndex: 'contractRoutineNum',
        key: 'contractRoutineNum',
        align: 'center',
        render: text => <span>{text}条</span>,
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
          return (
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => this.showDeleteConfirm(record.id, record.name)}
            >
              解除关系
            </span>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="客户列表">
        <Card bordered={false}>
          {this.ToolBar()}
          <Table
            columns={clientListColumns}
            dataSource={clientSaveData}
            loading={loading}
            rowKey={i => i.id}
          />
        </Card>
        <OCR
          addDrawerVisible={addDrawerVisible}
          title="新增客户"
          onCancle={this.closeAddNewClient}
          onOk={this.pushClient}
        />
      </PageHeaderLayout>
    );
  }
}
