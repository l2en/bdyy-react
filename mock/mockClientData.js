/**
 * companyEntity = {
    id	id	
    name	名字	
    identityNumber	身份编码	
    isUser	是否为付费用户	
    type	  企业/个人
    representative   法定代表人		
    registeredCapital   注册资本		
    establishmentDate    建立时间
    adress   地址	
   } 
 */
import * as _ from 'lodash';

export const clientMockData = (req = '', res) => {
  const companyEntity = {
    id: '00001',
    name: '张三运输公司',
    identityNumber: '00001',
    isUser: false,
    type: 'company',
    representative: '张三',
    registeredCapital: '300亿元',
    establishmentDate: '2010-10-12',
    adress: '成都天府四街9999号 阿里大厦楼',
  };
  let companyEntityArr = [];
  for (let i = 0; i < 9; i += 1) {
    companyEntityArr.push(
      Object.assign({}, companyEntity, {
        id: `000${i}`,
        name: `张三${i}号的运输公司`,
        identityNumber: `000${i}`,
        isUser: Math.random() > 0.5 ? 'false' : 'true',
        type: Math.random() > 0.5 ? 'enterprise' : 'personal',
        representative: `张三${i}号`,
        registeredCapital: `${1}2亿元`,
        establishmentDate: '2010-12-21',
        adress: `成都天府四街9999号 阿里大厦1${i}楼`,
      })
    );
  }

  // 查询
  if (req.companyId && req.filter) {
    const haveData = companyEntityArr.find(item => item.name === req.filter);
    if (haveData === undefined) {
      companyEntityArr = [];
    } else {
      companyEntityArr = [];
      companyEntityArr.push(haveData);
    }
  }

  // 解除客户关系
  if (req.companyId && req.clientId) {
    const findIndex = _.findIndex(companyEntityArr, item => item.id === req.clientId);
    if (findIndex === '-1') {
      return companyEntityArr;
    } else {
      companyEntityArr.splice(findIndex, 1);
    }
  }

  // 新增客户
  if (req.companyId && req.addClientInfo) {
    const companyEntityArrLen = companyEntityArr.length;
    req.addClientInfo.id = `000${companyEntityArrLen}`;
    req.addClientInfo.isUser = false;
    companyEntityArr.push(req.addClientInfo);
  }

  // 获取客户详情
  if (req.thatcompanyId) {
    return companyEntityArr.filter(item => item.id === req.thatcompanyId);
  }

  res.json(companyEntityArr);
};
