import { Message } from 'antd';
import {
  getClient,
  getClientDetailsinfo,
  deleteRelationshipWithClient,
  addClient,
  getClientDetailsLines,
  getClientUsers,
  searchClient,
} from '../services/clientService';
import { transportInfoByRoutine } from '../services/contractApi';
import { deleteRouteLine } from '../services/routeLineService';

export default {
  namespace: 'client',

  state: {
    clientDetailsData: {},
    clientSaveData: [],
    clientDetailsLines: [],
    clientUsers: [],
    transContracts: [],
  },

  effects: {
    *fetchClient({ payload, filter = '' }, { call, put }) {

        const response = yield call(getClient, payload);
        if (response.code === 0) {
          const resData = filter
            ? response.data.filter(item => item.name.indexOf(filter) !== -1)
            : response.data;
          yield put({
            type: 'clientSaveData',
            payload: resData,
          });
        } else if (response.code === 1) {
          yield put({
            type: 'clientSaveData',
            payload: [],
          });
        } else {
          Message.error('获取客户列表失败');
        }
      
    },
    *addClient({ payload, onSuccess }, { call }) {
      const response = yield call(addClient, payload);
      console.log('新增客户成功model回调', response);
      if (!response.code) {
        Message.success('新增成功');
        onSuccess();
        return;
      }
      if (response.code === 6) {
        Message.info('客户已存在');
        return;
      }
      Message.error('新增失败');
    },
    *searchClient({ payload }, { call, put }) {
      const response = yield call(searchClient, payload);
      yield put({
        type: 'clientSaveData',
        payload: response,
      });
    },
    *deleteRelationshipWithClient({ payload, callback }, { call }) {
      const response = yield call(deleteRelationshipWithClient, payload);
      if (!response.code) {
        callback();
        return;
      }
      Message.error('删除失败');
    },
    // 客户详情
    *getClientInfo({ payload }, { call, put }) {
      const response = yield call(getClientDetailsinfo, payload);
      console.log('======客户详情返回', response);
      if (response.code) return;
      const resData = response.data;
      yield put({
        type: 'clientDetailsData',
        payload: resData,
      });
    },
    // 客户详情路线
    *getClientDetailsLines({ payload }, { call, put }) {
      const response = yield call(getClientDetailsLines, payload);
      console.log('model路线查询', response);
      if (response.code === 0) {
        yield put({
          type: 'clientDetailsLines',
          payload: response.data,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'clientDetailsLines',
          payload: [],
        });
        return;
      }
      Message.error('服务器暂无响应，请稍后再试');
    },
    // 删除路线
    *deleteRouteLine({ payload, success }, { call }) {
      const response = yield call(deleteRouteLine, payload);
      console.log('删除返回', response);
      if (response.code === 0) {
        success();
        return;
      }
      Message.error('删除失败');
    },

    // 获取客户的用户
    *getClientUsers({ payload }, { call, put }) {
      const response = yield call(getClientUsers, payload);
      console.log('客户的公司用户', response);
      if (response.code === 0) {
        yield put({
          type: 'clientUsers',
          payload: response.data,
        });
        return;
      }
      if (response.code === 1) {
        yield put({
          type: 'clientUsers',
          payload: [],
        });
        return;
      }
      Message.error('客户的用户获取出错');
    },
    // 根据路线查询合同
    *transportInfoByRoutine({ payload }, { call, put }) {
      const response = yield call(transportInfoByRoutine, payload);
      if (!response.code) {
        yield put({
          type: 'changeTransContract',
          payload: response.data,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeTransContract',
          payload: [],
        });
      } else {
        Message.error('获取运输合同失败');
      }
    },
  },

  reducers: {
    clientSaveData(state, action) {
      return {
        ...state,
        clientSaveData: action.payload,
      };
    },
    clientDetailsData(state, action) {
      return {
        ...state,
        clientDetailsData: action.payload,
      };
    },
    clientDetailsLines(state, action) {
      return {
        ...state,
        clientDetailsLines: action.payload,
      };
    },
    clientUsers(state, action) {
      return {
        ...state,
        clientUsers: action.payload,
      };
    },
    changeTransContract(state, action) {
      return {
        ...state,
        transContracts: action.payload,
      };
    },
  },
};
