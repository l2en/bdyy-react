import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'baseData'], () =>
        import('../layouts/BasicLayout')
      ),
    },
    '/dashboard': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../myRoutes/Dashboard/Workplace')
      ),
    },
    // 【档案管理】 - 客户
    '/businessPartner/client': {
      name: '客户',
      component: dynamicWrapper(app, ['client', 'alibaba', 'baseData'], () =>
        import('../myRoutes/Client/ClientList')
      ),
    },
    '/clientSub/clientdetails/:clientId': {
      name: '客户详情',
      component: dynamicWrapper(app, ['client', 'alibaba', 'role', 'user', 'routine'], () =>
        import('../myRoutes/Client/ClientDetails')
      ),
    },
    // 【档案管理】 - 承运人
    '/businessPartner/carrier': {
      name: '承运人',
      component: dynamicWrapper(app, ['carrier', 'alibaba'], () =>
        import('../myRoutes/Carrier/CarrierList')
      ),
    },
    '/carrierSub/carrierdetails/:carrierId': {
      name: '承运商详情',
      component: dynamicWrapper(app, ['carrier', 'alibaba', 'truck', 'user', 'role'], () =>
        import('../myRoutes/Carrier/CarrierDetails')
      ),
    },
    // 供应商
    '/businessPartner/provider': {
      name: '供应商',
      component: dynamicWrapper(app, ['provider', 'alibaba'], () =>
        import('../myRoutes/Provider/ProviderList')
      ),
    },
    '/providerSub/providerdetails/:providerId': {
      name: '供应商详情',
      component: dynamicWrapper(
        app,
        ['carrier', 'alibaba', 'truck', 'user', 'provider', 'role'],
        () => import('../myRoutes/Provider/ProviderDetails')
      ),
    },
    // 合同
    '/contract/transContract': {
      name: '运输',
      component: dynamicWrapper(app, ['client', 'contract', 'routine', 'baseData'], () =>
        import('../myRoutes/Contract/TransContract')
      ),
    },
    '/contract/saleContract': {
      name: '销售',
      component: dynamicWrapper(app, ['client', 'contract', 'routine', 'baseData'], () =>
        import('../myRoutes/Contract/SaleContract')
      ),
    },
    '/contract/buyContract': {
      name: '购买',
      component: dynamicWrapper(app, ['client', 'contract', 'routine', 'baseData'], () =>
        import('../myRoutes/Contract/BuyContract')
      ),
    },
    // 订单
    '/order/transOrder': {
      name: '运输',
      component: dynamicWrapper(app, ['client', 'contract', 'routine', 'baseData'], () =>
        import('../myRoutes/Order/TransOrder')
      ),
    },
    '/order/sellOrder': {
      name: '销售',
      component: dynamicWrapper(app, ['client', 'contract', 'routine', 'baseData'], () =>
        import('../myRoutes/Order/SellOrder/SellOrder')
      ),
    },
    // 档案
    '/archives/ownTruck': {
      name: '自有车辆',
      component: dynamicWrapper(app, ['ownTruck', 'truck'], () =>
        import('../myRoutes/Archives/OwnTruckList')
      ),
    },
    // 自有车辆详情
    '/ownTruckSub/OwnTruckDetails/:id': {
      name: '自有车辆详情',
      component: dynamicWrapper(app, ['ownTruck', 'user'], () =>
        import('../myRoutes/Archives/OwnTruckDetails')
      ),
    },
    '/archives/role': {
      name: '分配职位',
      // authority: 'role_current',
      component: dynamicWrapper(app, ['role', 'baseData'], () =>
        import('../myRoutes/Archives/CurrentRoleList')
      ),
    },
    '/yingyan': {
      name: '鹰眼',
      component: dynamicWrapper(app, ['role', 'baseData'], () => import('../myRoutes/Yingyan')),
    },
    // 登录
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['appUser'], () => import('../myRoutes/User/Login')),
    },
    '/user/regist': {
      component: dynamicWrapper(app, ['appUser'], () => import('../myRoutes/User/Register')),
    },
    '/user/weixin-login': {
      component: dynamicWrapper(app, ['appUser'], () =>
        import('../myRoutes/User/WeixinLoginLoading')
      ),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../myRoutes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../myRoutes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
