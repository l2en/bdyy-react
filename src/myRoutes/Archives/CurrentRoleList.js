import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Table, Drawer, Message } from 'antd';
// import RenderAuthorized from 'components/Authorized';
// import Authorized from 'components/Authorized/Authorized';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CurrentRoleList.less';

const { Option } = Select;
const { Search } = Input;
// const cuser = JSON.parse(localStorage.getItem('cuser')) || {};
// const Authorized = RenderAuthorized(cuser.auth); // currentAuth

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@connect(({ baseData, role, loading, filter }) => ({
  baseData,
  userlist: role.user,
  user: role.soleUser,
  userloading: loading.effects['role/getUserList'],
  bindloading: loading.effects['role/bindUserRole'],
  roleList: role.roleList,
  selectRole: role.selectRole,
  filter,
}))
@Form.create({
  mapPropsToFields(props) {
    const { user = {} } = props;
    return {
      userId: Form.createFormField({ value: JSON.stringify(user) === '{}' ? '' : user.id }),
    };
  },
})
export default class CurrentRoleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createDrawerVisible: false, // 新建角色
    };
  }

  componentDidMount() {
    const { dispatch, baseData, selectRole, filter = '' } = this.props;
    const userListPayload = {
      companyId: baseData.company.id,
      role: selectRole,
    };

    dispatch({
      type: 'role/getRoleList',
    });

    if (selectRole) {
      dispatch({
        type: 'role/getUserList',
        payload: userListPayload,
        filter,
      });
    }
  }

  // 选择角色
  handleSelectRole = val => {
    const { dispatch, baseData, filter = '' } = this.props;
    const payload = {
      companyId: baseData.company.id,
      role: val,
    };

    // if(val){
    dispatch({
      type: 'role/getUserList',
      payload,
      filter,
    });
    // }
  };

  // 搜索
  handleSearch = filter => {
    const { dispatch, baseData, selectRole } = this.props;
    const payload = {
      companyId: baseData.company.id,
      role: selectRole,
    };

    if (selectRole) {
      dispatch({
        type: 'role/getUserList',
        payload,
        filter,
      });
    }
  };

  // 新建角色
  handleCreateRole = () => {
    this.setState({
      createDrawerVisible: true,
    });
  };

  // 新建-搜索手机号
  handleSearchUser = val => {
    const { dispatch } = this.props;

    dispatch({
      type: 'role/getUser',
      payload: {
        phone: val,
      },
    });
  };

  // 授予角色提交
  handleCreateOk = data => {
    const { dispatch, baseData, selectRole } = this.props;
    const cuser = JSON.parse(localStorage.getItem('cuser') || '{}');
    const bindUserRolePayload = Object.assign(
      {},
      data,
      { creatorId: cuser.id },
      { companyId: baseData.company.id }
    );
    const getUserListPayload = Object.assign(
      {},
      { role: selectRole },
      { companyId: baseData.company.id }
    );

    dispatch({
      type: 'role/bindUserRole',
      payload: bindUserRolePayload,
      callback: () => {
        this.setState({ createDrawerVisible: false });
        dispatch({
          type: 'role/getUserList',
          payload: getUserListPayload,
        });
      },
    });
  };

  // 解除角色
  handleRelieveRole = record => {
    const { dispatch, baseData, selectRole, roleList } = this.props;
    const terminatePayload = Object.assign(
      {},
      { userId: record.id },
      { roleId: selectRole },
      { companyId: baseData.company.id }
    );
    const getUserListPayload = Object.assign(
      {},
      { role: selectRole },
      { companyId: baseData.company.id }
    );
    const thisRole = roleList.filter(item => item.id === selectRole)[0];

    Modal.confirm({
      title: '解除职位',
      content: `确定解除 ${record.name} 的 ${thisRole.role} 职位？`,
      cancelText: '取消',
      okText: '确定',
      onOk() {
        dispatch({
          type: 'role/terminate',
          payload: terminatePayload,
          callback: () => {
            dispatch({
              type: 'role/getUserList',
              payload: getUserListPayload,
            });
          },
        });
      },
      onCancel() {},
    });
    return false;
  };

  // 关闭抽屉
  handleCreateCancel = () => {
    this.setState({
      createDrawerVisible: false,
    });
  };

  renderAddForm() {
    const { form, user = {}, roleList = [], selectRole, bindloading } = this.props;
    const { createDrawerVisible } = this.state;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (!fieldsValue.userId) Message.error('请先检索客户');
        if (err) return;
        form.resetFields();
        this.handleCreateOk(fieldsValue);
      });
    };
    return (
      <Drawer
        title="分配职位"
        width={500}
        placement="right"
        onClose={this.handleCreateCancel}
        visible={createDrawerVisible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="角色">
            {roleList.length > 0 && selectRole
              ? roleList.filter(item => item.id === selectRole)[0].role
              : ''}
          </Form.Item>
          <Form.Item {...formItemLayout} style={{ display: 'none' }}>
            {form.getFieldDecorator('roleId', {
              rules: [{ required: true, message: '请选择角色' }],
              initialValue: selectRole,
            })(<Input />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="手机号">
            <Search
              placeholder="手机号"
              style={{ width: 250 }}
              onSearch={phone => this.handleSearchUser(phone)}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="用户">
            {JSON.stringify(user) === '{}' ? '请搜索用户' : `${user.name} ${user.phone}`}
          </Form.Item>
          <Form.Item {...formItemLayout} style={{ display: 'none' }}>
            {form.getFieldDecorator('userId', {
              rules: [{ required: true, message: '请确认用户' }],
            })(<Input />)}
          </Form.Item>
        </Form>
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
          <Button
            style={{ marginRight: 8 }}
            loading={bindloading}
            onClick={okHandle}
            type="primary"
          >
            确认
          </Button>
          <Button onClick={this.handleCreateCancel} type="danger">
            取消
          </Button>
        </div>
      </Drawer>
    );
  }

  render() {
    const { userloading, userlist, roleList = [], selectRole } = this.props;
    const userColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: record => (
          <Fragment>
            <span
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => this.handleRelieveRole(record)}
            >
              解除职位
            </span>
          </Fragment>
        ),
      },
    ];
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>给本公司员工分配职位，将已注册用户与本公司职位绑定</p>
      </div>
    );

    return (
      <PageHeaderLayout title="分配职位" content={content}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}> */}
            {/* <Authorized authority={["role_client_search"]}> */}
            {/* </Authorized> */}
            {/* <Authorized authority={[addAuthority]}> */}
            {/* </Authorized> */}
            {/* </div> */}
            <div className={styles.tableListOperator}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <span style={{ width: '20%' }}>角色：</span>
                  <Select
                    placeholder="请选择"
                    style={{ width: '80%' }}
                    value={selectRole || undefined}
                    onSelect={val => this.handleSelectRole(val)}
                  >
                    {roleList.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.role}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col md={8} sm={24}>
                  <Search placeholder="姓名/手机号" onSearch={value => this.handleSearch(value)} />
                </Col>
              </Row>
            </div>
            <div className={styles.tableListOperator}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={16} sm={48}>
                  <Button
                    icon="plus"
                    type="primary"
                    disabled={!selectRole}
                    onClick={this.handleCreateRole}
                  >
                    分配新职位
                  </Button>
                </Col>
              </Row>
            </div>
            <Table
              loading={userloading}
              dataSource={userlist}
              columns={userColumns}
              rowKey={i => i.id}
              pagination={false}
            />
          </div>
        </Card>
        {this.renderAddForm()}
      </PageHeaderLayout>
    );
  }
}
