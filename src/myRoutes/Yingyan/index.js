import React, { Component } from 'react';
import { connect } from 'dva';
import Yingyan from './components/Yingyan/index';
import styles from './index.less';
import Mockyy from './components/index';

@connect(({ appUser }) => ({
  appUser,
}))

export default class WeixinLoginLoadingPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {

  }

  render() {
    return (
      <div className={styles.yingyan_wrapper}>
        <Yingyan />
        {/* <Mockyy/> */}
      </div>
    );
  }
}
