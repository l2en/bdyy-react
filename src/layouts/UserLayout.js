import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/ic_jianyi.png';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 简诣网络出品
  </Fragment>
);

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '简诣物流';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 简诣物流`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>简诣物流</span>
                </Link>
              </div>
              <div className={styles.desc}>简诣物流 是泸定最具影响力的智能 物流 运输管理平台</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
            </Switch>
          </div>
          <GlobalFooter links={[]} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
