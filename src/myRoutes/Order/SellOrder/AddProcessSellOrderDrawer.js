import React, { Component } from 'react';
import moment from 'moment';
import { Button, Drawer, Form, Select, DatePicker, Input, InputNumber, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create({
  // mapPropsToFields(props) {
  //   const { thisClient, thisProvider } = props;
  //   return {
  //     clientId: Form.createFormField({ value: thisClient ? thisClient.id : '' }),
  //     providerId: Form.createFormField({ value: thisProvider ? thisProvider.id : undefined }),
  //   };
  // },
})
export default class AddProcessSellOrderDrawer extends Component {
  state = {
    visible: false,
    // submitloading: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.addProcessSellOrderDrawerVisible,
      // submitloading: nextProps.submitloading,
    });
  }

  // 关闭新增抽屉
  handleProcessSellOrderDrawerClose = () => {
    const { onProcessSellOrderDrawerClose } = this.props;

    onProcessSellOrderDrawerClose();
  };

  // 新增提交
  handleAddProcessSellOrder = e => {
    const { form, onAddProcessSellOrder } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // const createSalePayload = Object.assign({}, values, {
        //   date: moment(values.date).format('YYYY-MM-DD'),
        // });
        onAddProcessSellOrder(values);
      }
    });
  };

  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { form } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Drawer
        title="新建销售订单"
        width={500}
        placement="right"
        onClose={this.handleProcessSellOrderDrawerClose}
        visible={visible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form layout="horizontal" onSubmit={this.handleAddProcessSellOrder}>
          <FormItem {...formItemLayout} label="价格">
            {getFieldDecorator('price', {
              rules: [
                {
                  required: true,
                  message: '请输入销售价格',
                },
              ],
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
            // loading={submitloading}
            onClick={this.handleAddProcessSellOrder}
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
          <Button onClick={this.handleProcessSellOrderDrawerClose} type="danger">
            取消
          </Button>
        </div>
      </Drawer>
    );
  };
}
