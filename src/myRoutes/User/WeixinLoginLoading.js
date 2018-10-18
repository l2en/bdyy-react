import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Button } from 'antd';
import Login from 'components/Login';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ appUser }) => ({
  appUser,
}))
export default class WeixinLoginLoadingPage extends Component {
  state = {
    type: 'account',
  };

  componentDidMount() {
    const { hash } = window.location;
    const { dispatch } = this.props;
    const { type } = this.state;
    const pos = hash.indexOf('?code=') + 6;
    const pos2 = hash.indexOf('&state=');
    const code = pos2 === -1 ? hash.substr(pos) : hash.substring(pos, pos2);
    dispatch({
      type: 'appUser/weixinLogin',
      payload: {
        code,
        type,
      },
    });
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { dispatch, appUser } = this.props;
    const { openid } = appUser;

    if (!err) {
      dispatch({
        type: 'appUser/setWechatOpenid',
        payload: {
          ...values,
          type,
          openid,
        },
      });
    }
  };

  render() {
    const { appUser, submitting } = this.props;
    const loading = (
      <Row>
        <Col span={8} offset={10}>
          <Spin size="large" tip={<h1>验证客户身份中...</h1>} />
        </Col>
      </Row>
    );
    const fail = (
      <div>
        <Row>
          <Col span={7} offset={9}>
            <Login defaultActiveKey="account" onSubmit={this.handleSubmit}>
              {appUser.status === 'errorSetOpenid' &&
                !appUser.submitting &&
                this.renderMessage('账户或密码错误')}
              <Tab key="account" tab="微信账号尚未与App账号绑定">
                <UserName name="username" placeholder="用户名" />
                <Password name="password" placeholder="密码" />
              </Tab>
              <Submit loading={submitting}>绑定账户</Submit>
            </Login>
          </Col>
        </Row>
        <Row>
          <Col span={8} offset={11}>
            <Button href="http://localhost:8008/#/user/login">返回登录页面</Button>
          </Col>
        </Row>
      </div>
    );
    const backPage = (
      <div>
        <Row>
          <Col span={9} offset={8}>
            <h1>账号绑定成功，返回登录页重新登录</h1>
          </Col>
        </Row>
        <Row>
          <Col span={8} offset={11}>
            <Button href="http://localhost:8008/#/user/login">返回登录页面</Button>
          </Col>
        </Row>
      </div>
    );
    let thing;
    switch (appUser.status) {
      case 'error': {
        thing = fail;
        break;
      }
      case 'setOpenidError': {
        thing = fail;
        break;
      }
      case 'setOpenidOk': {
        thing = backPage;
        break;
      }
      default: {
        thing = loading;
      }
    }
    return <div>{thing}</div>;
  }
}
