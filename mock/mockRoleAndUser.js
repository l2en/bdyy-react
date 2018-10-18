export const getUserList = (req, res) => {
  const { company, role } = req.body;
  const data1 = [
    { id: 1, name: '张00001', phone: '12345567888', role: 1 },
    { id: 2, name: '张00002', phone: '12345567888', role: 1 },
    { id: 3, name: '张00003', phone: '12345567888', role: 2 },
    { id: 4, name: '张00004', phone: '12345567888', role: 1 },
    { id: 5, name: '张00005', phone: '12345567888', role: 2 },
    { id: 6, name: '张00006', phone: '12345567888', role: 1 },
    { id: 7, name: '张00007', phone: '12345567888', role: 2 },
    { id: 8, name: '张00008', phone: '12345567888', role: 1 },
    { id: 9, name: '张00009', phone: '12345567888', role: 2 },
    { id: 10, name: '张000010', phone: '12345567888', role: 2 },
    { id: 11, name: '张000011', phone: '12345567888', role: 2 },
    { id: 12, name: '张000012', phone: '12345567888', role: 1 },
    { id: 13, name: '张000013', phone: '12345567888', role: 1 },
  ];

  const data2 = [
    { id: 1, name: '网00001', phone: '12345567888', role: 1 },
    { id: 2, name: '网00002', phone: '12345567888', role: 1 },
    { id: 3, name: '网00003', phone: '12345567888', role: 2 },
    { id: 4, name: '网00004', phone: '12345567888', role: 1 },
    { id: 5, name: '网00005', phone: '12345567888', role: 2 },
    { id: 6, name: '网00006', phone: '12345567888', role: 1 },
    { id: 7, name: '网00007', phone: '12345567888', role: 2 },
    { id: 8, name: '网00008', phone: '12345567888', role: 1 },
    { id: 9, name: '网00009', phone: '12345567888', role: 2 },
    { id: 10, name: '网000010', phone: '12345567888', role: 2 },
    { id: 11, name: '网000011', phone: '12345567888', role: 2 },
    { id: 12, name: '网000012', phone: '12345567888', role: 1 },
    { id: 13, name: '网000013', phone: '12345567888', role: 1 },
  ];
  let data = [];
  if (company === 1) {
    data = data1;
  } else {
    data = data2;
  }

  res.json({
    code: 0,
    data: data.filter(item => item.role === role),
  });
};

export const getUser = (req, res) => {
  const { phone } = req.body;
  const data1 = { id: 1, name: '张继和', phone: '18628810672' };
  const data2 = { id: 2, name: '罗林', phone: '18658195652' };
  const data3 = { id: 3, name: '康莘林', phone: '18628068576' };
  let data = [];
  switch (phone) {
    case '18628810672':
      data = data1;
      break;
    case '18658195652':
      data = data2;
      break;
    case '18628068576':
      data = data3;
      break;
    default:
  }

  res.json({
    code: 0,
    data,
  });
};

export default {
  getUserList,
  getUser,
};
