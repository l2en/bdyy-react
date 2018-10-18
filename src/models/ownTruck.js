import { Message } from 'antd';
import {
  getOwnTruckList,
  getOwnTruckDetails,
  deleteTruckRelationship,
  addDriverWithTruck,
  addTruck,
  getTruckWithDriver,
  deleteOwnTruckWithDriver,
} from '../services/ownTruckService';

export default {
  namespace: 'ownTruck',

  state: {
    data: [],
    ownTruckListData: [],
    ownTruckDetails: {},
    truckWithDrivers: [],
  },

  effects: {
    // 自有车辆列表
    *getOwnTruckList({ payload, filter = '' }, { call, put }) {
      const response = yield call(getOwnTruckList, payload);
      const resData = filter
        ? response.data.filter(item => item.plateNum.indexOf(filter) !== -1)
        : response.data;
      if (!response.code) {
        yield put({
          type: 'ownTruckListData',
          payload: resData,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'ownTruckListData',
          payload: [],
        });
      }
    },
    // 添加自由车辆
    *addTruck({ payload, onSuccess }, { call }) {
      const response = yield call(addTruck, payload);
      if (!response.code) {
        onSuccess();
        Message.success('新增成功');
        return;
      }
      if (response.code === 6) {
        Message.info('车辆已存在');
        return;
      }
      Message.error('新增失败');
    },
    // 自有车辆详情 && 列表
    *getOwnTruckDetails({ payload }, { call, put }) {
      const response = yield call(getOwnTruckDetails, payload);
      if (!response.code) {
        yield put({
          type: 'ownTruckDetails',
          payload: response.data,
        });
      }
    },
    // 解除truck的关系
    *deleteTruckRelationship({ payload, onSuccess }, { call }) {
      const response = yield call(deleteTruckRelationship, payload);
      if (!response.code) {
        onSuccess();
        return;
      }
      Message.error('删除失败');
    },
    // 为车辆添加一个司机
    *addDriverWithTruck({ payload, onSuccess }, { call }) {
      const response = yield call(addDriverWithTruck, payload);
      if (!response.code) {
        onSuccess();
        Message.success('新建成功');
        return;
      }
      if (response.code === 6) {
        Message.success('新增数据已存在');
        return;
      }
      Message.error(response.msg);
    },
    // 获取车辆与司机绑定关系
    *getTruckWithDriver({ payload }, { call, put }) {
      const response = yield call(getTruckWithDriver, payload);

      console.log('获取model车辆司机绑定关系', response);
      if (!response.code) {
        yield put({
          type: 'truckWithDrivers',
          payload: response.data,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'truckWithDrivers',
          payload: [],
        });
      }
    },
    // 解除司机与车辆绑定
    *deleteOwnTruckWithDriver({ payload, onSuccess }, { call }) {
      const response = yield call(deleteOwnTruckWithDriver, payload);
      if (!response.code) {
        onSuccess();
        return;
      }
      Message.error('删除失败');
    },
  },

  reducers: {
    ownTruckData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    ownTruckListData(state, action) {
      return {
        ...state,
        ownTruckListData: action.payload,
      };
    },
    ownTruckDetails(state, action) {
      return {
        ...state,
        ownTruckDetails: action.payload,
      };
    },
    truckWithDrivers(state, action) {
      return {
        ...state,
        truckWithDrivers: action.payload,
      };
    },
  },
};
