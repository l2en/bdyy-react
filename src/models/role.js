import { Message } from 'antd';
import {
  getUserList,
  getUser,
  getRoleList,
  bindUserRole,
  terminate,
  bindOutsideUser,
} from '../services/roleAndUserApi';

export default {
  namespace: 'role',

  state: {
    selectRole: '',
    user: [],
    soleUser: {},
    roleList: [],
  },

  effects: {
    // 获取全部角色(不带权限)
    *getRoleList(_, { call, put }) {
      const response = yield call(getRoleList);
      if (!response.code) {
        yield put({
          type: 'changeRoleList',
          payload: response.data,
        });
      } else {
        Message.error('获取角色失败');
      }
    },
    // 获取用户列表
    *getUserList({ payload, filter }, { call, put }) {
      const response = yield call(getUserList, payload);
      if (!response.code) {
        const userlist = response.data.filter(
          item => item.phone.indexOf(filter) !== -1 || item.name.indexOf(filter) !== -1
        );
        yield put({
          type: 'changeUserList',
          payload: userlist,
          selectRole: payload.role,
        });
      } else {
        Message.error('获取用户列表失败');
      }
    },
    // 用手机号获取单个用户
    *getUser({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      if (!response.code) {
        yield put({
          type: 'changeUser',
          payload: response.data,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeUser',
          payload: {},
        });
        Message.warning('没有查询到用户');
      } else {
        Message.error('查询用户失败');
      }
    },
    // 用手机号获取单个用户
    *bindUserRole({ payload, callback }, { call }) {
      const response = yield call(bindUserRole, payload);
      if (!response.code) {
        Message.success('分配职位成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else if (response.code === 1801) {
        Message.warning(response.msg);
      } else {
        Message.error('分配角色失败');
      }
    },
    // 解除角色
    *terminate({ payload, callback }, { call }) {
      const response = yield call(terminate, payload);
      if (!response.code) {
        Message.success('解除职位成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else {
        Message.error('解除职位失败');
      }
    },

    *bindOutsideUser({ payload, onSuccess }, { call }) {
      console.log('授予外来客户一个客户的用户或者承运商的角色参数', payload);
      const response = yield call(bindOutsideUser, payload);
      console.log('绑定客户的用户', response);
      if (!response.code) {
        Message.success('绑定成功');
        onSuccess();
        return;
      }
      Message.error('绑定失败');
    },
  },

  reducers: {
    changeRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
      };
    },
    changeUserList(state, action) {
      return {
        ...state,
        user: action.payload,
        selectRole: action.selectRole,
      };
    },
    changeUser(state, action) {
      return {
        ...state,
        soleUser: action.payload,
      };
    },
  },
};
