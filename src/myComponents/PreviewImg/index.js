import React, { Component } from 'react';
import { Modal } from 'antd';

class PreviewImg extends Component {
  static defaultProps = {
    previewVisible: false,
    previewUrl: '',
    onCancle: () => {},
  };

  state = {};

  render() {
    const { previewVisible, onCancle, previewUrl } = this.props;
    return (
      <div>
        <Modal visible={previewVisible} footer={null} onCancel={onCancle}>
          <img alt="example" style={{ width: '100%' }} src={previewUrl} />
        </Modal>
      </div>
    );
  }
}
export default PreviewImg;
