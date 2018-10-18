import React, { Component } from 'react';
import moment from 'moment';
import { Button, Drawer, Form, Select, DatePicker, Input, InputNumber, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create({
  mapPropsToFields(props) {
    const { thisClient, thisProvider } = props;
    return {
      clientId: Form.createFormField({ value: thisClient ? thisClient.id : '' }),
      providerId: Form.createFormField({ value: thisProvider ? thisProvider.id : undefined }),
    };
  },
})
export default class AddSaleOrBuyContract extends Component {
  state = {
    visible: false,
    thisClient: null,
    thisProvider: null,
    submitloading: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.addSaleDrawerVisible,
      thisClient: nextProps.thisClient,
      thisProvider: nextProps.thisProvider,
      submitloading: nextProps.submitloading,
    });
  }

  // 关闭新增合同抽屉
  handleSaleClose = () => {
    const { onSaleClose } = this.props;

    onSaleClose();
  };

  // 新增运输合同提交
  handleAddContract = e => {
    const { form, onAddContract } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const createSalePayload = Object.assign({}, values, {
          date: moment(values.date).format('YYYY-MM-DD'),
        });
        onAddContract(createSalePayload);
      }
    });
  };

  render = () => {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { form, provider, productOption, type } = this.props;
    const { visible, thisClient, submitloading, thisProvider } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Drawer
        title={type === 'sale' ? '新建销售合同' : '新增购买合同'}
        width={500}
        placement="right"
        onClose={this.handleSaleClose}
        visible={visible}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Form layout="horizontal" onSubmit={this.handleAddContract}>
          {type === 'sale' ? (
            <FormItem {...formItemLayout} label="客户">
              {thisClient ? thisClient.name : ''}
            </FormItem>
          ) : (
            ''
          )}
          {type === 'sale' ? (
            <FormItem {...formItemLayout} style={{ display: 'none' }}>
              {getFieldDecorator('clientId', {
                rules: [],
              })(<Input />)}
            </FormItem>
          ) : (
            ''
          )}
          {type === 'sale' ? (
            <FormItem {...formItemLayout} label="供应商">
              {getFieldDecorator('providerId', {
                rules: [
                  {
                    required: true,
                    message: '请选择供应商',
                  },
                ],
              })(
                <Select placeholder="请选择" style={{ width: 250 }}>
                  {provider.length > 0
                    ? provider.map(item => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })
                    : ''}
                </Select>
              )}
            </FormItem>
          ) : (
            ''
          )}
          {type === 'buy' ? (
            <FormItem {...formItemLayout} label="供应商">
              {thisProvider ? thisProvider.name : ''}
            </FormItem>
          ) : (
            ''
          )}
          {type === 'buy' ? (
            <FormItem {...formItemLayout} style={{ display: 'none' }}>
              {getFieldDecorator('providerId', {
                rules: [],
              })(<Input />)}
            </FormItem>
          ) : (
            ''
          )}
          <FormItem {...formItemLayout} label="商品">
            {getFieldDecorator('product', {
              rules: [
                {
                  required: true,
                  message: '请选择商品',
                },
              ],
            })(<Cascader options={productOption} placeholder="请选择" style={{ width: 250 }} />)}
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
            loading={submitloading}
            onClick={this.handleAddContract}
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
          <Button onClick={this.handleSaleClose} type="danger">
            取消
          </Button>
        </div>
      </Drawer>
    );
  };
}
