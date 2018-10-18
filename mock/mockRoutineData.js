export const allInfoContractRoutine = (req, res) => {
  const { clientId } = req.body;
  const data = [
    { id: 1, clientId: '00001', carrierId: 1, start: '成都', via: '雅安-石棉', end: '泸定' },
    { id: 2, clientId: '00001', carrierId: 1, start: '拉萨', via: '西宁-西安', end: '北京w' },
    { id: 3, clientId: '00002', carrierId: 1, start: '拉萨123', via: '西宁-西安', end: '北京g' },
    { id: 4, clientId: '00002', carrierId: 1, start: '拉萨asd', via: '西宁-西安', end: '北京2g' },
    { id: 5, clientId: '00002', carrierId: 1, start: '拉萨12', via: '西宁-西安', end: '北京sd' },
    { id: 6, clientId: '00003', carrierId: 1, start: '拉萨421', via: '西宁-西安', end: '北京ds' },
    { id: 7, clientId: '00003', carrierId: 1, start: '拉萨asad', via: '西宁-西安', end: '北京gg' },
  ]
  res.json({
    code: 0,
    data: data.filter(item => item.clientId === clientId),
  });
};

export default {
  allInfoContractRoutine,
};
