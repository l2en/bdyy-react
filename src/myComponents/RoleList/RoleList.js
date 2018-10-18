import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Table, Drawer } from 'antd';
// import RenderAuthorized from 'components/Authorized';
// import Authorized from 'components/Authorized/Authorized';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './RoleList.less';

const { Option } = Select;
const { Search } = Input;
// const { Item: FormItem } = Form;
// const cuser = JSON.parse(localStorage.getItem('cuser')) || {};
// const Authorized = RenderAuthorized(cuser.auth); // currentAuth

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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

const CreateForm = Form.create()(props => {
  const { drawerVisible, form, handleCreateCancel, handleCreateOk, type } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreateOk(fieldsValue);
    });
  };
  return (
    <Drawer
      title={type === 'current' ? '分配职位' : '绑定用户'}
      width={720}
      placement="right"
      onClose={handleCreateCancel}
      maskClosable={false}
      visible={drawerVisible}
      style={{
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: 53,
      }}
    >
      <Form hideRequiredMark>
        {type === 'carrier' || type === 'client' ? (
          <Form.Item {...formItemLayout} label="公司">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请选择公司' }],
            })(
              <Select placeholder="请选择">
                <Option value="xiao">Xiaoxiao Fu</Option>
                <Option value="mao">Maomao Zhou</Option>
              </Select>
            )}
          </Form.Item>
        ) : (
          ''
        )}
        {type === 'current' ? (
          <Form.Item {...formItemLayout} label="角色">
            {form.getFieldDecorator('role', {
              rules: [{ required: true, message: '请选择角色' }],
            })(
              <Select placeholder="请选择">
                <Option value="xiao">Xiaoxiao Fu</Option>
                <Option value="mao">Maomao Zhou</Option>
              </Select>
            )}
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item {...formItemLayout} label="手机号">
          {form.getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号' }],
          })(<Search placeholder="手机号" onSearch={value => console.log(value)} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="姓名">
          {form.getFieldDecorator('driver', {
            rules: [{ required: true, message: 'Please select an owner' }],
          })(
            <Select placeholder="Please select an owner">
              <Option value="xiao">Xiaoxiao Fu</Option>
              <Option value="mao">Maomao Zhou</Option>
            </Select>
          )}
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
          style={{
            marginRight: 8,
          }}
          onClick={handleCreateCancel}
        >
          取消
        </Button>
        <Button onClick={okHandle} type="primary">
          确认授予
        </Button>
      </div>
    </Drawer>
  );
});

@connect(({ client, carrier, role, loading }) => ({
  client: client.data,
  carrier: carrier.data,
  userlist: role.user,
  loading: loading.models.role,
}))
@Form.create()
export default class RoleList extends PureComponent {
  state = {
    formValues: {},
    createDrawerVisible: false, // 新建角色
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'client/fetchClient',
    });
    dispatch({
      type: 'carrier/getCarrierList',
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // 新建角色
  handleCreateRole = () => {
    this.setState({
      createDrawerVisible: true,
    });
  };

  // 授予角色提交
  handleCreateOk = data => {
    console.log(data);
    // this.setState({
    //   createDrawerVisible: false,
    // })
    // dispatch({
    //   type: 'rule/add',
    //   payload: {
    //     description: fields.desc,
    //   },
    // });
    // message.success('添加成功');
    // this.setState({
    //   modalVisible: false,
    // });
  };

  // 解除角色
  handleRelieveRole = () => {
    Modal.confirm({
      title: '解除角色',
      content: '确定解除该角色？',
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'));
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

  // 选择公司
  handleCompanySel = val => {
    const { dispatch, type } = this.props;

    dispatch({
      type: 'role/getUserList',
      payload: {
        companyId: val,
        type,
      },
    });
  };

  // 搜索栏
  renderOperator() {
    const { type } = this.props;
    const roleList = [{ id: 1, name: '调度' }, { id: 2, name: '财务' }];
    return (
      <div className={styles.tableListOperator}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* {type === 'client' || type === 'carrier' ? (
            <Col md={8} sm={24}>
              <span>{type === 'client' ? '客户:' : '承运商:'}</span>
              <Select
                placeholder="请选择"
                onSelect={this.handleCompanySel}
                style={{ width: '80%' }}
              >
                {type === 'client'
                  ? client.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))
                  : carrier.map(item => (
                      <Option key={item.CarrierEntity.id} value={item.CarrierEntity.id}>
                        {item.CarrierEntity.name}
                      </Option>
                    ))}
              </Select>
            </Col>
          ) : (
            ''
          )} */}
          {type === 'current' ? (
            <Col md={8} sm={24}>
              <span>角色：</span>
              <Select placeholder="请选择" style={{ width: '80%' }}>
                {roleList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
          ) : (
            ''
          )}
          <Col md={8} sm={24}>
            <Search placeholder="姓名/电话" onSearch={value => console.log(value)} />
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Button icon="plus" type="primary" onClick={() => this.handleCreateRole()}>
            {type === 'current' ? '分配职位' : '绑定用户'}
          </Button>
        </Row>
      </div>
    );
  }

  render() {
    const { loading, type, userlist } = this.props;
    const { createDrawerVisible } = this.state;
    console.log(this.props);

    const userColumns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        align: 'right',
        // render: val => `${val} `,
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="" onClick={this.handleRelieveRole}>
              解除角色
            </a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleCreateCancel: this.handleCreateCancel,
      handleCreateOk: this.handleCreateOk,
    };

    // let addAuthority = '';
    // switch (type) {
    //   case 'current':
    //     addAuthority = 'role_current_add';
    //     break;
    //   case 'client':
    //     addAuthority = 'role_client_add';
    //     break;
    //   case 'carrier':
    //     addAuthority = 'role_carrier_add';
    //     break;
    //   default:
    // }

    return (
      <PageHeaderLayout title="角色列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListOperator}> */}
            {/* <Authorized authority={["role_client_search"]}> */}
            {this.renderOperator()}
            {/* </Authorized> */}
            {/* <Authorized authority={[addAuthority]}> */}
            {/* </Authorized> */}
            {/* </div> */}
            <Table
              loading={loading}
              dataSource={userlist}
              columns={userColumns}
              onChange={this.handleTableChange}
              rowKey={i => i.id}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} drawerVisible={createDrawerVisible} type={type} />
      </PageHeaderLayout>
    );
  }
}
