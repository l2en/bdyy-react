import { Message } from 'antd';
import { getClient } from '../services/clientService';

export default {
  namespace: 'yingyan',

  state: {
    yingyan_basicData: {},
  },

  effects: {
    *getYingyanBasicData({ payload }, { call, put }) {
      const response = yield call(getClient, payload);
      const resData = response.data;

      yield put({
        type: 'yingyanBasicData',
        payload: resData,
      });
    },
  },

  reducers: {
    yingyanBasicData(state, action) {
      return {
        ...state,
        yingyan_basicData: action.payload,
      };
    },
  },
};
