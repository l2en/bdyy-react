import React, { Component } from 'react';
import moment from 'moment';
import { Input, InputNumber, DatePicker, Select, Form, Badge } from 'antd';
import ProcessEditableContext from './ProcessEditableContext'

const { Option } = Select;
const FormItem = Form.Item;

export default class ProcessEditableCell extends Component {
  getInput = () => {
    const { inputType } = this.props;
    if (inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderEditCell = form => {
    const { getFieldDecorator } = form;
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      type,
      ...restProps
    } = this.props;

    if (!editing){
      return restProps.children;
    }

    switch(type){
      case 'plateNum':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('plateNum', {
              rules: [{
                required: true,
                message: `请输入路线数!`,
              }],
              initialValue: record[type],
            })(<InputNumber />)}
          </FormItem>
        );
      case 'product':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('product', {
              rules: [{
                required: true,
                message: `请选择商品!`,
              }],
            })(<DatePicker />)}
          </FormItem>
        );
      case 'date':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('date', {
              rules: [{
                required: true,
                message: `请选择日期!`,
              }],
              initialValue: moment(record[type], 'YYYY-MM-DD'),
            })(<DatePicker />)}
          </FormItem>
        );
      case 'sellPrice':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('sellPrice', {
              rules: [{
                required: true,
                message: `请输入销售价格!`,
              }],
              initialValue: record[type],
            })(<InputNumber />)}
          </FormItem>
        );
      case 'purchasePrice':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('purchasePrice', {
              rules: [{
                required: true,
                message: `请输入购买价格!`,
              }],
              initialValue: record[type],
            })(<InputNumber />)}
          </FormItem>
        );
      case 'status':
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('status', {
              rules: [{
                required: true,
                message: `Please Input ${title}!`,
              }],
              initialValue: record[type],
            })(
              <Select
                style={{ width:100 }}
                // onSelect={this.handleSelectClient}
              >
                <Option value={0}>
                  {<span><Badge status="processing" />待确认</span>}
                </Option>
                <Option value={1}>
                  {<span><Badge status="success" />已出厂</span>}
                </Option>
                <Option value={2}>
                  {<span><Badge status="error" />作废</span>}
                </Option>
              </Select>)}
          </FormItem>
        );
      default: return restProps.children;
    }
  }

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      type,
      ...restProps
    } = this.props;

    return (
      <ProcessEditableContext.Consumer>
        {(form) => {
          return (
            <td {...restProps}>
              {this.renderEditCell(form)}
            </td>
          );
        }}
      </ProcessEditableContext.Consumer>
    );
  }
}