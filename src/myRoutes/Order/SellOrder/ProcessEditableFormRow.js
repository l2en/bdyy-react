import React from 'react';
import { Form } from 'antd';
import ProcessEditableContext from './ProcessEditableContext'

const EditableRow = ({ form, index, ...props }) => (
  <ProcessEditableContext.Provider value={form}>
    <tr {...props} />
  </ProcessEditableContext.Provider>
);

const ProcessEditableFormRow = Form.create()(EditableRow);

export default ProcessEditableFormRow;