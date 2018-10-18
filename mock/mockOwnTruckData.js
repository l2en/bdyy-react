/**
 * {
  plateNum,车牌号
  vehicleType,车辆类型 
  owner,业主 
  useCharacter,使用性质
  addr,地址
  model,品牌型号
  vin,车架号
  engineNum,发动机号
  registerDate,注册日期 
  issueDate,发证日期
  appprovedPassengerCapacity,核定载人数 
  approvedLoad,核定载质量
  fileNo,档案编号 
  grossMass,总质量 
  inspectionRecord,检测记录
  overallDimension,外廓尺寸 
  tractionMass,准牵引总质量 
  unladenMass,整备质量 
  companyId,所属公司的id
}
 * 
 */

export const truckMockData = (req, res) => {
  console.log('》》》》》》》》》》》》》》》》》');
  let truckEntityArr = [];
  for (let i = 0; i < 9; i += 1) {
    truckEntityArr.push({
      id: `000${i}`,
      plateNum: `川A ${i}${i}${i}${i}${i}`,
      vehicleType: Math.random() > 0.5 ? '大卡车' : '小卡车',
      owner: 'owner',
      useCharacter: `货运`,
      addr: `成都某个垰垰角角`,
      model: '东风',
      vin: `车架号`,
      engineNum: '发动机号',
      registerDate: '注册日期',
      issueDate: '发证日期',
      appprovedPassengerCapacity: '核定载人数',
      approvedLoad: '核定载质量',
      fileNo: '档案编号',
      grossMass: '总质量',
      inspectionRecord: '检测记录',
      overallDimension: '外廓尺寸',
      tractionMass: '准牵引总质量',
      unladenMass: '整备质量',
      companyId: `000${i}`,
    });
  }
  // 解除关系
  if (req.truckId) {
    // return truckEntityArr.filter(item => item.id !== req.thatId);
  }

  // 进入自有车辆详情
  if (req.thatId) {
    return truckEntityArr.filter(item => item.id === req.thatId);
  }
  if (req.truckEntity) {
    truckEntityArr.push(req.truckEntity);
  }
  // 承运商详情的车辆与司机对应关系 （一对一）
  if (req.carrierId) {
    truckEntityArr = [];
    for (let i = 0; i < 2; i += 1) {
      truckEntityArr.push({
        truck: {
          id: `000${i}`,
          plateNum: `川A ${i}${i}${i}${i}${i}`,
          vehicleType: Math.random() > 0.5 ? '大卡车' : '小卡车',
          owner: 'owner',
          useCharacter: `货运`,
          addr: `成都某个垰垰角角`,
          model: '东风',
          vin: `车架号`,
          engineNum: '发动机号',
          registerDate: '注册日期',
          issueDate: '发证日期',
          appprovedPassengerCapacity: '核定载人数',
          approvedLoad: '核定载质量',
          fileNo: '档案编号',
          grossMass: '总质量',
          inspectionRecord: '检测记录',
          overallDimension: '外廓尺寸',
          tractionMass: '准牵引总质量',
          unladenMass: '整备质量',
          companyId: `000${i}`,
        },
        driver: [
          {
            id: `000${i}`,
            name: `张三${i}`,
            phone: `1300${i}0`,
            wxOpenid: 'wx123456',
            email: '',
            isDriver: true,
          },
        ],
      });
    }
  }

  res.json(truckEntityArr);
};
