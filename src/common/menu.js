import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'dashboard',
  },
  {
    name: '贸易伙伴',
    icon: 'database',
    path: 'businessPartner',
    children: [
      {
        name: '客户',
        path: 'client',
      },
      {
        name: '承运商',
        path: 'carrier',
      },
      {
        name: '供应商',
        path: 'provider',
      },
    ],
  },
  {
    name: '合同',
    icon: 'schedule',
    path: 'contract',
    children: [
      {
        name: '运输合同',
        path: 'transContract',
      },
      {
        name: '销售合同',
        path: 'saleContract',
      },
      {
        name: '购买合同',
        path: 'buyContract',
      },
    ],
  },
  {
    name: '订单',
    icon: 'profile',
    path: 'order',
    children: [
      {
        name: '运输订单',
        path: 'transOrder',
      },
      {
        name: '销售订单',
        path: 'sellOrder',
      },
    ],
  },
  {
    name: '档案',
    icon: 'setting',
    path: 'archives',
    children: [
      {
        name: '自有车辆',
        path: 'ownTruck',
      },
      {
        name: '分配职位',
        // authority: ['role'],
        path: 'role',
      },
    ],
  },
  {
    name: '鹰眼',
    icon: 'eye',
    path: 'yingyan',
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
