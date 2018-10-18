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

export const mockAlibabaData = (req = '', res) => {
  let data = {};
  if (req.type === 'businessLicense') {
    data = {
      config_str: 'null\n',
      angle: 'float',
      reg_num: 'A789BR221VF',
      name: '张三',
      type: Math.random() > 0.5 ? 'personal' : 'enterprise',
      person: 'string',
      establish_date: 'string',
      valid_period: 'string',
      address: '成都四街大大阿达的文件仍将',
      capital: '400000万',
      business: '运输',
      emblem: 'string',
      title: 'string',
      stamp: 'string',
      qrcode: 'string',
      success: Math.random() > 0.5 ? 'false' : 'true',
      request_id: '1234567',
    };
  } else {
    data = {
      address: '浙江省杭州市余杭区文一西路969号', // 地址信息
      config_str: '{\\"side\\":\\"face\\"}', // 配置信息，同输入configure
      face_rect: {
        // 人脸位置，center表示人脸矩形中心坐标，size表示人脸矩形长宽，angle表示矩形顺时针旋转的度数。
        angle: -90,
        center: {
          x: 952,
          y: 325.5,
        },
        size: {
          height: 181.99,
          width: 164.99,
        },
      },
      name: '李四', // 姓名
      nationality: '汉', // 民族
      num: '511023199408018112', // 身份证号
      sex: '男', // 性别
      birth: '20000101', // 出生日期
      success: Math.random() > 0.5 ? 'false' : 'true', // 识别结果，true表示成功，false表示失败
    };
  }

  res.json(data);
};
