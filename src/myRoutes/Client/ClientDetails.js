import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, Button, Modal, Drawer, Form, Select } from 'antd';
import DescriptionList from 'components/DescriptionList';
import BaiduMap from 'myComponents/baidu';
import NewMapLine from 'myComponents/NewMapLine';
import * as _ from 'lodash';
import Avatar from 'myComponents/Avatar';
import PreviewImg from 'myComponents/PreviewImg';
import TransContractCard from '../Contract/TransContractCard';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ClientDeatils.less';
import 'style/index.less';

const { Description } = DescriptionList;
const { confirm } = Modal;
const { Option } = Select;
const { Item: FormItem } = Form;

@connect(({ client, loading, role, user, baseData, routine }) => ({
  client,
  baseData,
  role,
  user,
  routine,
  loading: loading.effects['client/getClientInfo'],
  transContractsLoading: loading.effects['client/transportInfoByRoutine'],
}))
class ClientDetails extends Component {
  state = {
    coordinates: [], // 地图坐标
    addDrawerVisible: false,
    showMapSetModal: false,
    showMapLines: false,
    selectUserId: '',
    contractModalVisible: false, // 查看路线合同modal
    thisRoutine: {}, // 当前查看路线
    previewVisible: false,
    previewUrl: '',
  };

  //  身份证
  componentDidMount() {
    const { dispatch, match } = this.props;

    dispatch({
      type: 'client/getClientInfo',
      payload: {
        clientId: match.params.clientId,
        isWithRoutineNum: true,
      },
    });
    dispatch({
      type: 'client/getClientDetailsLines',
      payload: {
        clientId: match.params.clientId,
      },
    });
    dispatch({
      type: 'client/getClientUsers',
      payload: {
        clientId: match.params.clientId,
      },
    });
  }

  onCloseAddUser = () => {
    this.setState({
      addDrawerVisible: false,
    });
  };

  // 关闭头像预览
  onCloseAvatar = () => {
    this.setState({
      previewVisible: false,
    });
  };

  // 确认添加客户公司的用户
  addClientPerson = () => {
    const { dispatch, match } = this.props;
    const { selectUserId } = this.state;
    dispatch({
      type: 'user/addClientUser',
      payload: {
        clientId: Number(match.params.clientId),
        userId: selectUserId,
      },
      onSuccess: () => {
        dispatch({
          type: 'client/getClientUsers',
          payload: {
            clientId: match.params.clientId,
          },
        });
        this.toggleDrawer();
      },
    });
  };

  toggleDrawer = () => {
    const { addDrawerVisible } = this.state;
    this.setState({
      addDrawerVisible: !addDrawerVisible,
    });
  };

  handleSelUserId = val => {
    this.setState({
      selectUserId: val,
    });
  };

  // 新增路线
  toggleMapChoose = () => {
    const { showMapSetModal } = this.state;
    this.setState({
      showMapSetModal: !showMapSetModal,
    });
  };

  // 加载地图显示
  loadMap = coor => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routine/infoContractRoutine',
      payload: {
        id: coor.id,
      },
      onSuccess: routineData => {
        this.setState({
          coordinates: routineData,
          showMapLines: true,
        });
      },
    });
  };

  handleContractModalCancel = () => {
    this.setState({
      contractModalVisible: false,
    });
  };

  addPeroson = () => {
    this.setState({
      addDrawerVisible: true,
    });
  };

  // 关闭路线预览
  closeMap = () => {
    this.setState({
      showMapLines: false,
    });
  };

  addClientUserChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserInfo',
      payload: {
        phone: value,
      },
    });
  };

  // 头像预览
  preview = url => {
    this.setState({
      previewVisible: true,
      previewUrl: url,
    });
  };

  // 去合同页面
  toContract = routine => {
    const { dispatch } = this.props;

    dispatch({
      type: 'client/transportInfoByRoutine',
      payload: {
        contractRoutineIds: routine.id.toString(),
      },
    });

    this.setState({
      contractModalVisible: true,
      thisRoutine: routine,
    });
  };

  // 新建路线
  addMapLine = (siteList, distance) => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'routine/createContractRoutine',
      payload: {
        clientId: Number(match.params.clientId),
        siteList: JSON.stringify(siteList),
        distance: Number(distance.split('公里')[0]) * 1000,
      },
      onSuccess: () => {
        dispatch({
          type: 'client/getClientDetailsLines',
          payload: {
            clientId: match.params.clientId,
          },
        });
        this.setState({
          showMapSetModal: false,
        });
      },
    });
  };

  // 关闭路线
  deleteRoadLine = record => {
    const { dispatch, match } = this.props;
    confirm({
      title: '确认关闭该路线?',
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch({
          type: 'client/deleteRouteLine',
          payload: {
            id: record.id,
          },
          success: () => {
            dispatch({
              type: 'client/getClientDetailsLines',
              payload: {
                clientId: match.params.clientId,
              },
            });
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 资料
  renderClientInfoView = () => {
    const {
      client: { clientDetailsData },
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={20}>
            {clientDetailsData.type === 'enterprise' ? (
              <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
                <Description term="法人代表">
                  {clientDetailsData.representative || '--'}
                </Description>
                <Description term="注册资本">
                  {clientDetailsData.registeredCapital || '--'}
                </Description>
                <Description term="成立日期">
                  {clientDetailsData.establishmentDate || '--'}
                </Description>
                <Description term="公司名称">{clientDetailsData.name || '--'}</Description>
                <Description term="公司地址">{clientDetailsData.address || '--'}</Description>
                <Description term="统一社会信用代码">
                  {clientDetailsData.identityNumber || '--'}
                </Description>
              </DescriptionList>
            ) : (
              <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
                <Description term="姓名">{clientDetailsData.name || '--'}</Description>
                <Description term="身份证号码">
                  {clientDetailsData.identityNumber || '--'}
                </Description>
              </DescriptionList>
            )}
          </Col>
          <Col span={4}>
            <Avatar
              onPreview={this.preview}
              type={clientDetailsData.type}
              userInfo={clientDetailsData}
            />
          </Col>
        </Row>
      </Fragment>
    );
  };

  // 路线
  renderClientRoutesView = () => {
    const {
      loading,
      client: { clientDetailsLines },
    } = this.props;
    const routLinesColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '起点',
        dataIndex: 'start',
        key: 'start',
        align: 'center',
      },
      {
        title: '途经点',
        dataIndex: 'via',
        key: 'via',
        align: 'center',
      },
      {
        title: '终点',
        dataIndex: 'end',
        key: 'end',
        align: 'center',
      },
      {
        title: '查看',
        dataIndex: 'toView',
        key: 'toView',
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <span
              style={{ color: 'green', cursor: 'pointer' }}
              onClick={() => this.loadMap(record)}
            >
              地图
            </span>
            <Divider type="vertical" />
            <span
              style={{ color: 'green', cursor: 'pointer' }}
              onClick={() => this.toContract(record)}
            >
              合同
            </span>
          </Fragment>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
        render: (text, record) => (
          <span
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={() => this.deleteRoadLine(record)}
          >
            关闭路线
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Divider style={{ marginBottom: 32 }} />
        <Row>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div className={styles.title}>运输线路</div>
            <Button type="primary" onClick={this.toggleMapChoose}>
              + 新增路线
            </Button>
          </Col>
        </Row>
        <Table
          rowKey={i => i.id}
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          dataSource={clientDetailsLines}
          columns={routLinesColumns}
        />
      </Fragment>
    );
  };

  // 客户的用户
  renderClientUserView = () => {
    const {
      loading,
      client: { clientUsers },
    } = this.props;
    const clientUsersColums = [
      {
        title: '身份',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
    ];

    return (
      <Fragment>
        <Divider style={{ marginBottom: 32 }} />
        <Row>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div className={styles.title}>客户公司用户</div>
            <Button type="primary" onClick={this.addPeroson}>
              管理身份
            </Button>
          </Col>
        </Row>
        <Table
          rowKey={i => i.id}
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          dataSource={clientUsers}
          columns={clientUsersColums}
        />
      </Fragment>
    );
  };

  renderDrawer = () => {
    const { addDrawerVisible } = this.state;
    const {
      user: { userInfo },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 12 },
      },
    };
    let willAddClientUser = [];
    if (!_.isEmpty(userInfo)) {
      willAddClientUser = [];
      willAddClientUser.push(userInfo);
    }
    return (
      <Drawer
        width={450}
        placement="right"
        maskClosable
        onClose={this.onCloseAddUser}
        visible={addDrawerVisible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form>
          <FormItem {...formItemLayout} label="添加用户">
            <Select
              showSearch
              placeholder="输入手机号，进行搜索"
              optionFilterProp="children"
              notFoundContent="暂无此用户"
              onSearch={this.addClientUserChange}
              onChange={this.handleSelUserId}
              showArrow
              filterOption={false}
              style={{ width: '100%' }}
            >
              {willAddClientUser.map(d => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button style={{ marginRight: 8 }} onClick={this.addClientPerson} type="primary">
              确认
            </Button>
            <Button onClick={this.onCloseAddUser} type="danger">
              取消
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  };

  renderContractModal = () => {
    const { thisRoutine, contractModalVisible } = this.state;
    const { transContractsLoading, client } = this.props;
    return (
      <Modal
        title={`路线${thisRoutine.id}(${thisRoutine.start}...${thisRoutine.via}...${
          thisRoutine.end
        })`}
        visible={contractModalVisible}
        okText=""
        onCancel={this.handleContractModalCancel}
        width={800}
        footer={[
          <Button key="back" type="danger" onClick={this.handleContractModalCancel}>
            关闭
          </Button>,
        ]}
      >
        <TransContractCard
          routine={thisRoutine}
          loading={transContractsLoading}
          contractList={client.transContracts.length > 0 ? client.transContracts[0].contract : {}}
          type="watch"
        />
      </Modal>
    );
  };

  render() {
    const { coordinates, showMapSetModal, showMapLines, previewVisible, previewUrl } = this.state;

    return (
      <PageHeaderLayout title="客户详情">
        <Card bordered={false}>
          {this.renderClientInfoView()}
          {this.renderClientRoutesView()}
          {this.renderClientUserView()}
        </Card>
        {!showMapLines ? null : <BaiduMap PointArr={coordinates} onClose={this.closeMap} />}
        {!showMapSetModal ? null : (
          <NewMapLine
            onCancel={this.toggleMapChoose}
            onCloseMask={this.toggleMapChoose}
            onOk={this.addMapLine}
          />
        )}
        {this.renderDrawer()}
        {this.renderContractModal()}
        <PreviewImg
          previewVisible={previewVisible}
          onCancle={this.onCloseAvatar}
          previewUrl={previewUrl}
        />
      </PageHeaderLayout>
    );
  }
}
export default ClientDetails;
