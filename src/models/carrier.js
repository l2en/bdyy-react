import { Message } from 'antd';
import {
  getCarrierList,
  searchCarrier,
  getCarrierInfo,
  deleteRelationshipWithCarrier,
  addCarrier,
  getCarrierDetailsTruck,
  getCarrierUsers,
} from '../services/carrierService';

export default {
  namespace: 'carrier',

  state: {
    code: 0,
    data: [],
    carrierListData: [],
    carrierDetailsData: {},
    carrierUsers: [],
    carrierTrucksData: [],
  },

  effects: {
    *getCarrierList({ payload, filter = '' }, { call, put }) {
      const response = yield call(getCarrierList, payload);
      if (!response.code) {
        const resData = filter
          ? response.data.filter(item => item.name.indexOf(filter) !== -1)
          : response.data;
        yield put({
          type: 'carrierListData',
          payload: resData,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'carrierListData',
          payload: [],
        });
        return;
      }
      Message.error('服务器暂无响应');
    },

    // 按名称查询承运商
    *searchCarrier({ payload }, { call, put }) {
      const response = yield call(searchCarrier, payload);
      yield put({
        type: 'carrierData',
        payload: response,
      });
    },
    // 解除承运商关系
    *deleteRelationshipWithCarrier({ payload, onSuccess }, { call }) {
      const response = yield call(deleteRelationshipWithCarrier, payload);
      if (!response.code) {
        onSuccess();
      } else {
        Message.error('删除失败');
      }
    },
    // 查询承运商详情
    *getCarrierInfo({ payload }, { call, put }) {
      const response = yield call(getCarrierInfo, payload);
      const resData = response.data;
      if (response.code) return;
      yield put({
        type: 'carrierDetailsData',
        payload: resData,
      });
    },
    // 新建承运商
    *addCarrier({ payload, onSuccess }, { call }) {
      const response = yield call(addCarrier, payload);
      if (!response.code) {
        Message.success('新增成功');
        onSuccess();
        return;
      }
      if (response.code === 6) {
        Message.info('新增数据已存在');
        return;
      }
      Message.error('新增失败');
    },
    // 承运商的用户
    *getCarrierUsers({ payload }, { call, put }) {
      const response = yield call(getCarrierUsers, payload);
      if (!response.code) {
        yield put({
          type: 'carrierUsers',
          payload: response.data,
        });
        // return;
      }
      if (response.code === 1) {
        yield put({
          type: 'carrierUsers',
          payload: [],
        });
      }
    },
    // 获取车辆与司机绑定关系
    *getCarrierDetailsTruck({ payload }, { call, put }) {
      console.log('承运商车辆司机配对信息====》model参数', payload);
      const response = yield call(getCarrierDetailsTruck, payload);
      console.log('承运商车辆司机配对信息====》model', response);
      if (!response.code) {
        yield put({
          type: 'carrierTrucksData',
          payload: response.data,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'carrierTrucksData',
          payload: [],
        });
      }
    },
  },

  reducers: {
    carrierData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    carrierListData(state, action) {
      return {
        ...state,
        carrierListData: action.payload,
      };
    },
    carrierDetailsData(state, action) {
      return {
        ...state,
        carrierDetailsData: action.payload,
      };
    },
    carrierUsers(state, action) {
      return {
        ...state,
        carrierUsers: action.payload,
      };
    },
    carrierTrucksData(state, action) {
      return {
        ...state,
        carrierTrucksData: action.payload,
      };
    },
  },
};
