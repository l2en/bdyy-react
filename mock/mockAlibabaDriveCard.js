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

export const mockAlibabaDriveCard = (req = '', res) => {
  const face = {
    config_str: 'null\n', //  配置字符串信息
    plate_num: '沪A0M084', //  车牌号码
    vehicle_type: '小型轿车', // 车辆类型
    owner: '张三', // 所有人名称
    use_character: '出租转非', // 使用性质
    addr: '浙江省宁波市江东区丁街88弄', // 地址
    model: '桑塔纳牌SVW7180LE1', // 品牌型号
    vin: 'LSVFF66R8C2116280', // 车辆识别代号
    engine_num: '416098', // 发动机号码
    register_date: '20121127', // 注册日期
    issue_date: '20130708', // 发证日期
    request_id: '84701974fb983158_20160526100112', // 请求对应的唯一表示
    success: true, // 识别成功与否 true/false
  };
  const side = {
    config_str: '{"side": "back" }', //  配置字符串信息
    appproved_passenger_capacity: '5人', //  核定载人数
    approved_load: '', //  核定载质量
    file_no: '530100001466', //  档案编号
    gross_mass: '2000kg', //  总质量
    inspection_record: '检验有效期至2014年09月云A(01)', //  检验记录
    overall_dimension: '4945x1845x1480mm', //  外廓尺寸
    traction_mass: '', //  准牵引总质量
    unladen_mass: '1505kg', //  整备质量
    plate_num: '云AD8V02', //  号牌号码
    success: true, //  识别成功与否 true / false
    request_id: '20180131144149_c440540b20a4dc079a10680ff60b2d2a', //  请求对应的唯一表示
  };
  if (req.configure === 'side') {
    res.json(side);
  } else {
    res.json(face);
  }
};
