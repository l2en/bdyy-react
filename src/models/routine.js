import { Message } from 'antd';
import { allInfoContractRoutine, createContractRoutine,infoContractRoutine } from '../services/routineApi';

export default {
  namespace: 'routine',

  state: {

  },

  effects: {
    // 根据客户获取路线
    *allInfoContractRoutine({ payload }, { call, put }) {
      const response = yield call(allInfoContractRoutine, payload);
      if (response.code === 0) {
        yield put({
          type: 'changeRoutineList',
          payload: response.data,
        });
      } else {
        Message.error('获取路线失败');
      }
    },
    *createContractRoutine({ payload, onSuccess }, { call }) {
      const response = yield call(createContractRoutine, payload);
      console.log('路线新建返回model========>', response)
      if(!response.code){
        onSuccess();
        Message.success('新建成功');
        return;
      }
      Message.error('新建失败');
    },
    // 根据路线id获取单条路线坐标等信息
    *infoContractRoutine({ payload, onSuccess }, { call }) {
      const response = yield call(infoContractRoutine, payload);
      console.log('获取单条路线坐标model', response)
      if(!response.code){
        onSuccess(response.data.site);
        return;
      }
      Message.error('路线获取失败，稍后重试')
    },
  },

  reducers: {
    changeRoutineList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
