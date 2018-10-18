import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ appUser, loading }) => ({
  appUser,
  submitting: loading.effects['appUser/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = err => {
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'appUser/login',
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { appUser, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {appUser.status === 'error' &&
              appUser.type === 'account' &&
              !appUser.submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="username" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
          </Tab>
          <Tab key="weixin" tab="微信登录">
            <div className={styles.weixinDiv}>
              <iframe
                title="weixin"
                className={styles.nlogin_iframe}
                frameBorder="0"
                allowTransparency
                sandbox="allow-scripts allow-same-origin allow-top-navigation"
                scrolling="no"
                src="https://open.weixin.qq.com/connect/qrconnect?appid=wxae03120695a508ea&redirect_uri=https%3a%2f%2fwww.jianyiwork.com%2f%23%2fsrc=%2f"
              />
            </div>
          </Tab>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
