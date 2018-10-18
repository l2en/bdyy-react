export const createTransport = (req, res) => {
  res.json([
    {
      key: '00001',
      companyId: '00001',
      filter: '张三运输公司',
      roadLineNum: 49,
    },
    {
      key: '00002',
      companyId: '00002',
      filter: '泸州某运输公司',
      roadLineNum: 12,
    },
    {
      key: '00003',
      companyId: '00003',
      filter: '成都某运输公司',
      roadLineNum: 1202,
    },
  ]);
};

export const deleteTransport = (req, res) => {
  res.json([
    {
      key: '00002',
      companyId: '00002',
      filter: '泸州某运输公司',
      roadLineNum: 12,
    },
    {
      key: '00003',
      companyId: '00003',
      filter: '成都某运输公司',
      roadLineNum: 1202,
    },
  ]);
};

export const transportInfoByRoutine = (req, res) => {
  const data = [
    {
      routineId: 1,
      contract: [
        {
          id: 1,
          contractRoutineId: 1,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 2,
          contractRoutineId: 2,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 3,
          contractRoutineId: 3,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
    {
      routineId: 2,
      contract: [
        {
          id: 1,
          contractRoutineId: 1,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 3,
          contractRoutineId: 3,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 4,
          contractRoutineId: 4,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 6,
          contractRoutineId: 6,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
    {
      routineId: 3,
      contract: [
        {
          id: 4,
          contractRoutineId: 4,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 5,
          contractRoutineId: 5,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 6,
          contractRoutineId: 6,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
    {
      routineId: 4,
      contract: [
        {
          id: 2,
          contractRoutineId: 2,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 3,
          contractRoutineId: 3,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 4,
          contractRoutineId: 4,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 5,
          contractRoutineId: 5,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 6,
          contractRoutineId: 6,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
    {
      routineId: 5,
      contract: [
        {
          id: 1,
          contractRoutineId: 1,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 2,
          contractRoutineId: 2,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 4,
          contractRoutineId: 4,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
    {
      routineId: 6,
      contract: [
        {
          id: 1,
          contractRoutineId: 1,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 4,
          contractRoutineId: 4,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 5,
          contractRoutineId: 5,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 6,
          contractRoutineId: 6,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
    {
      routineId: 7,
      contract: [
        {
          id: 1,
          contractRoutineId: 1,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 2,
          contractRoutineId: 2,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 3,
          contractRoutineId: 3,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '散装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 4,
          contractRoutineId: 4,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 5,
          contractRoutineId: 5,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
        {
          id: 6,
          contractRoutineId: 6,
          clientPrice: 16,
          carrierPrice: 80,
          driverPrice: 60,
          packagingType: '袋装',
          date: '2018.10.11',
          isActive: true,
        },
      ],
    },
  ];

  const { ids } = req.body;
  const idslist = ids.split(',');
  const resData = [];

  idslist.forEach(i => {
    data.forEach(j => {
      if (j.routineId === Number(i)) resData.push(j);
    });
  });

  res.json({
    code: 0,
    data: resData,
  });
};

export default {
  createTransport,
  deleteTransport,
  transportInfoByRoutine,
};
