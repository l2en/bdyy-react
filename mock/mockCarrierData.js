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

export const carrierMockData = (req, res) => {
  let CarrierEntityArr = [];
  for (let i = 0; i < 9; i += 1) {
    CarrierEntityArr.push(
      Object.assign(
        {},
        {
          CarrierEntity: {
            id: `000${i}`,
            name: `张三${i}号的运输公司`,
            identityNumber: `000${i}`,
            type: Math.random() > 0.5 ? 'enterprise' : 'personal',
            representative: `张三${i}号`,
            registeredCapital: `${1}2亿元`,
            establishmentDate: '2010-12-21',
            adress: `成都天府四街9999号 阿里大厦1${i}楼`,
          },
        },
        { isDispatcher: 'false' }
      )
    );
  }
  // 查询
  if (req.companyId && req.searchCarrierId) {
    const haveData = CarrierEntityArr.find(item => item.CarrierEntity.id === req.searchCarrierId);
    if (haveData === undefined) {
      CarrierEntityArr = [];
    } else {
      CarrierEntityArr = [];
      CarrierEntityArr.push(haveData);
    }
  }

  // 解除承运商关系
  if (req.companyId && req.carrierId) {
    const findIndex = _.findIndex(
      CarrierEntityArr,
      item => item.CarrierEntity.id === req.carrierId
    );
    if (findIndex === '-1') {
      return CarrierEntityArr;
    } else {
      CarrierEntityArr.splice(findIndex, 1);
    }
  }

  // 新建承运商
  if (req.carrierAddInfo) {
    // let tempAddObj = {}
    // tempAddObj.CarrierEntity = {
    //         id: `0010`,
    //         name: `新来的`,
    //         identityNumber: `0010`,
    //         type: Math.random() > 0.5 ? 'enterprise' : 'personal',
    //         representative: '新来的',
    //         registeredCapital: `702元`,
    //         establishmentDate: '2010-12-21',
    //         adress: `成都天府四街9999号 阿里大厦666楼`,
    // }
    // tempAddObj.isDispatcher =  Math.random() > 0.5 ? 'true' : 'false';
    // CarrierEntityArr.push(tempAddObj);
  }

  // 获取承运商详情
  if (req.thatcompanyId) {
    return CarrierEntityArr.filter(item => item.CarrierEntity.id === req.thatcompanyId);
  }

  res.json(CarrierEntityArr);
};
