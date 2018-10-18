export const getUserList = (req, res) => {
  const { type } = req.body;
  const clientUserdata = [
    { id: 1, name: '张客户1', phone: '123456789' },
    { id: 2, name: '张客户1', phone: '123456789' },
    { id: 3, name: '张客户1', phone: '123456789' },
    { id: 4, name: '张客户1', phone: '123456789' },
    { id: 5, name: '张客户1', phone: '123456789' },
    { id: 6, name: '张客户1', phone: '123456789' },
  ];
  const carrierUserdata = [
    { id: 1, name: '张承运2', phone: '123456789' },
    { id: 2, name: '张承运2', phone: '123456789' },
    { id: 3, name: '张承运2', phone: '123456789' },
    { id: 4, name: '张承运2', phone: '123456789' },
    { id: 5, name: '张承运2', phone: '123456789' },
    { id: 6, name: '张承运2', phone: '123456789' },
  ];
  res.json({
    code: 0,
    data: type === 'client' ? clientUserdata : carrierUserdata,
  });
};

export default {
  getUserList,
};
