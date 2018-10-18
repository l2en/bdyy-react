import { Message } from 'antd';
import { addTruck, addTruckWithDriver, getTruckInfo } from '../services/truckService';

export default {
  namespace: 'truck',

  state: {
    truckData: {},
    truckInfo: {}
  },

  effects: {
    // 新增车辆
    *addTruck({ payload, onSuccess }, { call, put }) {
      const response = yield call(addTruck, payload);
      console.log('新增车辆model里========>', response);
      if (!response.code) {
        Message.success('新建成功');
        onSuccess();
        return;
      }
      if (response.code === 6) {
        Message.info('车辆已存在');
        return;
      }
      Message.error('新建失败');
    },
    *addTruckWithDriver({ payload, onSuccess }, { call }) {
      console.log('绑定司机与车辆参数-------------------', payload);
      const response = yield call(addTruckWithDriver, payload);
      console.log('绑定司机与车辆model返回',response );
      if (!response.code) {
        Message.success('绑定成功');
        onSuccess();
        return;
      }
      Message.error('绑定失败');
    },

    // 车辆详情
    *getTruckInfo({ payload }, { call, put }) {
      console.log('车辆查询', payload)
      const response = yield call(getTruckInfo, payload);
      console.log('车辆查询返回', response)
      if (!response.code) {
        yield put({
          type: 'truckInfo',
          payload: response.data,
        });
        return;
      }
      yield put({
        type: 'truckInfo',
        payload: {}
      });
    },
  },

  reducers: {
    truckData(state, action) {
      return {
        ...state,
        truckData: action.payload,
      };
    },
    truckInfo(state, action) {
      return {
        ...state,
        truckInfo: action.payload,
      };
    },
  },
};
