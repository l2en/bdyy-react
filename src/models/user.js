import { Message } from 'antd';
import { query as queryUsers, queryCurrent, getUserInfo, addClientUser, addCarrierUser } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    userInfo: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      if (response.code === 0) {
        yield put({
          type: 'userInfo',
          payload: response.data,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'userInfo',
          payload: {},
        });
        return;
      }
      Message.error('服务器暂无响应');
    },
    *addClientUser({ payload, onSuccess }, { call }) {
      console.log('新增客户用户参数====》', payload)
      const response = yield call(addClientUser, payload);
      console.log('绑定客户用户', response)
      if(!response.code){
        onSuccess();
        Message.success('新建成功');
        return;
      }
      Message.error('新建失败');
    },

    *addCarrierUser({ payload, onSuccess }, { call }) {
      const response = yield call(addCarrierUser, payload);
      console.log('绑定承运商用户', response)
      if(!response.code){
        onSuccess();
        Message.success('新建成功');
        return;
      }
      Message.error('新建失败');
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    userInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
  },
};
