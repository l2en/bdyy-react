import React, { Component } from 'react';
import moment from 'moment';
import { Button, Drawer, Form, DatePicker, Input, InputNumber } from 'antd';

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    const { thisClient, addRoutine, addPackageType } = props;
    return {
      client: Form.createFormField({ value: thisClient ? thisClient.id : '' }),
      contractRoutineId: Form.createFormField({ value: addRoutine }),
      packagingType: Form.createFormField({ value: addPackageType }),
    };
  },
})
export default class AddTransContract extends Component {
  state = {
    visible: false,
    thisClient: null,
    submitloading: false,
    routine: [],
    addRoutine: '',
    packagingType: '',
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.addTransDrawerVisible,
      thisClient: nextProps.thisClient,
      submitloading: nextProps.submitloading,
      routine: nextProps.routine,
      addRoutine: nextProps.addRoutine,
      packagingType: nextProps.addPackageType,
    });
  }

  // 关闭新增合同抽屉
  handleTransClose = () => {
    const { onTransClose } = this.props;

    onTransClose();
  };

  // 新增运输合同提交
  handleAddContract = e => {
    const { form, onAddContract } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const createTransportPayload = Object.assign({}, values, {
          date: moment(values.date).format('YYYY-MM-DD'),
        });
        onAddContract(createTransportPayload);
      }
    });
  };

  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { form } = this.props;
    const {
      visible,
      thisClient,
      submitloading,
      routine = [],
      addRoutine,
      packagingType,
    } = this.state;
    const { getFieldDecorator } = form;
    // thisRoute = routine
    return (
      <Drawer
        title="新建运输合同"
        width={500}
        placement="right"
        onClose={this.handleTransClose}
        visible={visible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form layout="horizontal" onSubmit={this.handleAddContract}>
          <FormItem {...formItemLayout} label="客户">
            {thisClient ? thisClient.name : ''}
          </FormItem>
          <FormItem {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('client', {
              rules: [],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="路线">
            {routine.length > 0 && addRoutine
              ? `${routine.filter(item => item.id === addRoutine)[0].start}...${
                  routine.filter(item => item.id === addRoutine)[0].via
                }...${routine.filter(item => item.id === addRoutine)[0].end}`
              : ''}
          </FormItem>
          <FormItem {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('contractRoutineId', {
              rules: [
                {
                  required: true,
                  message: '请选择路线',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="包装类型">
            {packagingType || ''}
          </FormItem>
          <FormItem {...formItemLayout} style={{ display: 'none' }}>
            {getFieldDecorator('packagingType', {
              rules: [
                {
                  required: true,
                  message: '请选择包装类型',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="开始执行日期">
            {getFieldDecorator('date', {
              rules: [
                {
                  required: true,
                  message: '请选择日期',
                },
              ],
            })(<DatePicker style={{ width: 250 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="销售价格">
            {getFieldDecorator('clientPrice', {
              rules: [
                {
                  required: true,
                  message: '请输入销售价格',
                },
              ],
            })(<InputNumber min={0} style={{ width: 250 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="自运价格">
            {getFieldDecorator('driverPrice', {
              rules: [],
            })(<InputNumber min={0} style={{ width: 250 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="承运价格">
            {getFieldDecorator('carrierPrice', {
              rules: [],
            })(<InputNumber min={0} style={{ width: 250 }} />)}
          </FormItem>
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
            loading={submitloading}
            onClick={this.handleAddContract}
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
          <Button onClick={this.handleTransClose} type="danger">
            取消
          </Button>
        </div>
      </Drawer>
    );
  };
}
