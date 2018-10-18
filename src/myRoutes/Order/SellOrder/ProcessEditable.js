import React, { Component } from 'react';
import { Table, Popconfirm, Badge } from 'antd';
import ProcessEditableCell from './ProcessEditableCell';
import ProcessEditableFormRow from './ProcessEditableFormRow';
import ProcessEditableContext from './ProcessEditableContext'
import styles from './ProcessSellOrder.less';

export default class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = { data111: props.orderItems, editingId: '' };

    this.columns = [
      { title: '路线数', dataIndex: 'plateNum', key: 'plateNum', editable: true },
      { title: '商品名称', key: 'product',editable: true, render: record => `${record.productName}/${record.productType}/${record.productPackagingType}` },
      { title: '日期', dataIndex: 'date', key: 'date', editable: true  },
      { title: '销售价格', dataIndex: 'sellPrice', key: 'sellPrice', editable: true  },
      { title: '购买价格', dataIndex: 'purchasePrice', key: 'purchasePrice', editable: true  },
      { title: '状态', key: 'status', editable: true, render: (record) => !record.status ? <span><Badge status="success" />待确认</span> : <span><Badge status="error" />作废</span> },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <ProcessEditableContext.Consumer>
                    {form => (
                      <span
                        style={{ marginRight: 8, color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => this.save(form, record.id)}
                      >
                        保存
                      </span>
                    )}
                  </ProcessEditableContext.Consumer>
                  <Popconfirm
                    title="确定取消编辑?"
                    onConfirm={() => this.cancel(record.id)}
                  >
                    <span
                      style={{ color: 'red', cursor: 'pointer' }}
                    >
                      取消
                    </span>
                  </Popconfirm>
                </span>
              ) : (
                <span
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => this.edit(record.id)}
                >
                  编辑
                </span>
              )}
            </div>
          );
        },
      },
    ]
  }

  isEditing = (record) => {
    const { editingId } = this.state;
    return record.id === editingId;
  };

  cancel = () => {
    this.setState({ editingId: '' });
  };

  edit(id) {
    this.setState({ editingId: id });
  }

  save(form, id) {
    const { data111 } = this.state;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...data111];
      const index = newData.findIndex(item => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data111: newData, editingId: '' });
      } else {
        newData.push(row);
        this.setState({ data111: newData, editingId: '' });
      }
    });
  }

  render() {
    const components = {
      body: {
        row: ProcessEditableFormRow,
        cell: ProcessEditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      console.log(col);
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          type: col.key,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    console.log(columns);

    const { orderItems } = this.props;

    return (
      <Table
        className={styles.editable}
        rowClassName={styles.editableRow}
        bordered
        components={components}
        dataSource={orderItems}
        columns={columns}
        rowKey={i=>i.id}
        pagination={false}
      />
    );
  }
}