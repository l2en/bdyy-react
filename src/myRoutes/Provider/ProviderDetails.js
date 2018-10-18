import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Button, Modal, Drawer, Form, Select } from 'antd';
import DescriptionList from 'components/DescriptionList';
import Avatar from 'myComponents/Avatar';
import PreviewImg from 'myComponents/PreviewImg';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const { confirm } = Modal;
const { Option } = Select;
const { Item: FormItem } = Form;

@connect(({ client, loading, role, user, provider }) => ({
  client,
  role,
  provider,
  user,
  loading: loading.effects['client/getClientInfo'],
}))
class ProviderDetails extends Component {
  state = {
    addDrawerVisible: false,
    showMapSetModal: false,
    previewVisible: false,
    previewUrl: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'provider/getProviderIdInfo',
      payload: {
        providerId: match.params.providerId,
      },
    });
  }

  //  关闭头像预览
  onCloseAvatar = () => {
    this.setState({
      previewVisible: false,
    });
  };

  //  去合同页面
  toContract = () => {
    const { history } = this.props;
    history.push({ pathname: '/archives/contract' });
  };

  //  新增路线
  toggleMapChoose = () => {
    const { showMapSetModal } = this.state;
    this.setState({
      showMapSetModal: !showMapSetModal,
    });
  };

  //  确认添加客户公司的用户
  addClientPerson = () => {
    console.log('添加客户公司的用户');
  };

  //  关闭添加客户公司用户
  toggleDrawer = () => {
    this.setState({
      addDrawerVisible: false,
    });
  };

  //  新增客户公司的用户
  addPeroson = () => {
    this.setState({
      addDrawerVisible: true,
    });
  };

  //  添加公司用户
  addClientUserChange = value => {
    console.log('供应商信息value', value);
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserInfo',
      payload: {
        phone: value,
        wxOpenid: '',
        id: '',
      },
    });
  };

  //  关闭路线
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

  //  头像预览
  preview = url => {
    this.setState({
      previewVisible: true,
      previewUrl: url,
    });
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
    return (
      <Drawer
        width={450}
        placement="right"
        maskClosable={false}
        onClose={this.toggleDrawer}
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
              style={{ width: 200 }}
              placeholder="选择添加用户"
              optionFilterProp="children"
              notFoundContent="暂无此用户"
              onSearch={this.addClientUserChange}
              showArrow
            >
              {userInfo && <Option value={userInfo.name}>{userInfo.name}</Option>}
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
            <Button onClick={this.toggleDrawer} type="danger">
              取消
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  };

  // 资料
  renderClientInfoView = () => {
    const {
      provider: { providerIdInfo },
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={20}>
            <DescriptionList size="large" title="供应商信息" style={{ marginBottom: 32 }}>
              <Description term="法人代表">{providerIdInfo.representative || '--'}</Description>
              <Description term="注册资本">{providerIdInfo.registeredCapital || '--'}</Description>
              <Description term="成立日期">{providerIdInfo.establishmentDate || '--'}</Description>
              <Description term="公司名称">{providerIdInfo.name || '--'}</Description>
              <Description term="公司地址">{providerIdInfo.address || '--'}</Description>
              <Description term="统一社会信用代码">
                {providerIdInfo.identityNumber || '--'}
              </Description>
            </DescriptionList>
          </Col>
          <Col span={4}>
            <Avatar onPreview={this.preview} userInfo={providerIdInfo} type="enterprise" />
          </Col>
        </Row>
      </Fragment>
    );
  };

  render() {
    const { previewVisible, previewUrl } = this.state;
    return (
      <PageHeaderLayout title="供应商详情">
        <Card bordered={false}>{this.renderClientInfoView()}</Card>
        {this.renderDrawer()}
        <PreviewImg
          previewVisible={previewVisible}
          onCancle={this.onCloseAvatar}
          previewUrl={previewUrl}
        />
      </PageHeaderLayout>
    );
  }
}
export default ProviderDetails;
