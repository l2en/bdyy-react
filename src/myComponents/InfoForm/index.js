import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

class InfoForm extends PureComponent {
  static defaultProps = {
    formList: [
      {
        lable: '姓名',
        value: '张三23333333',
      },
      {
        lable: '统一社会代码',
        value: '1111111111',
      },
      {
        lable: '成立时间',
        value: '2017-09-13',
      },
      {
        lable: '注册资金',
        value: '3000万（人民币）',
      },
    ],
  };

  handleSubmit = e => {
    const {
      form: { validateFields },
    } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { formList } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {formList.map(item => {
          return (
            <FormItem {...formItemLayout} label={item.name} key={item}>
              {getFieldDecorator(`${item.name}`, {
                rules: [
                  {
                    type: '',
                    message: '!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              })(<Input value={item.value} />)}
            </FormItem>
          );
        })}
      </Form>
    );
  }
}
export default InfoForm;
