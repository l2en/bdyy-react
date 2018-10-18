import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Menu, Icon, Dropdown, Divider, Select } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';

const { Option } = Select;

@connect(({ baseData }) => ({
  baseData,
}))
export default class GlobalHeader extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    const list = JSON.parse(localStorage.getItem('list') || '[]');
    const thisBaseData = JSON.parse(localStorage.getItem('baseData') || '{}');
    if (thisBaseData.company) {
      dispatch({
        type: 'baseData/switchCorp',
        payload: thisBaseData.company.id,
      });
    } else {
      dispatch({
        type: 'baseData/switchCorp',
        payload: list[0].company.id,
      });
    }
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  handleSwitchCompany = val => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseData/switchCorp',
      payload: val,
    });
    window.location.reload();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { currentUser = {}, collapsed, isMobile, logo, onMenuClick, baseData } = this.props;
    const list = JSON.parse(localStorage.getItem('list') || '[]');
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <span className={styles.name}>
                <Icon type="user" />
                {currentUser ? currentUser : 'noname'}
              </span>
            </span>
          </Dropdown>
        </div>
        <div className={styles.right} style={{ width: '20%' }}>
          <Select
            placeholder="请选择"
            value={baseData.company.id ? baseData.company.id : list[0].company.id}
            style={{ width: '100%' }}
            onSelect={val => this.handleSwitchCompany(val)}
          >
            {list.map(item => (
              <Option key={item.company.id} value={item.company.id}>
                {item.company.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}
