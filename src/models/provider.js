import { Message } from 'antd';
import {
  getProviderList,
  deleteProvider,
  addProvider,
  getProviderIdInfo,
} from '../services/providerService';

export default {
  namespace: 'provider',

  state: {
    providerList: [],
    providerIdInfo: {},
  },

  effects: {
    *getProviderList({ payload, filter = '' }, { call, put }) {
      const response = yield call(getProviderList, payload);
      const resData = filter
        ? response.data.filter(item => item.name.indexOf(filter) !== -1)
        : response.data;
      if (!response.code) {
        yield put({
          type: 'providerList',
          payload: resData,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'providerList',
          payload: [],
        });
        return;
      }
      Message.error('服务器暂无响应');
    },
    // 删除
    *deleteProvider({ payload, onSuccess }, { call }) {
      const response = yield call(deleteProvider, payload);
      if (!response.code) {
        onSuccess();
        return;
      }
      Message.error('删除失败');
    },

    // 新增供应商
    *addProvider({ payload, onSuccess }, { call }) {
      console.log('新建供应商参数model===>', payload);
      const response = yield call(addProvider, payload);
      console.log('新建供应商', response);
      if (!response.code) {
        onSuccess();
        Message.success('添加成功');
        return;
      }
      if (response.code === 6) {
        Message.info('新增数据已存在');
        return;
      }
      Message.error('新增失败');
    },

    // 供应商详情
    *getProviderIdInfo({ payload }, { call, put }) {
      const response = yield call(getProviderIdInfo, payload);
      console.log('供应商详情', response);
      if (!response.code) {
        yield put({
          type: 'providerIdInfo',
          payload: response.data,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'providerIdInfo',
          payload: {},
        });
      }
    },
  },

  reducers: {
    providerList(state, action) {
      return {
        ...state,
        providerList: action.payload,
      };
    },
    providerIdInfo(state, action) {
      return {
        ...state,
        providerIdInfo: action.payload,
      };
    },
  },
};
