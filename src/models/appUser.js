import { routerRedux } from 'dva/router';
import { Message } from 'antd';
import { accountLogin, weixinLogin } from '../services/appUser';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
// import { actionList } from '../utils/constant';

export default {
  namespace: 'appUser',

  state: {
    status: undefined,
    user: {},
    list: [],
  },

  effects: {
    *login(_, { call, put }) {
      const response = yield call(accountLogin);
      let loginResult;
      if (response.code === 0) {
        if (response.data.list.length > 0) {
          loginResult = {
            status: 'ok',
            currentAuthority: response.data.list[0].role.authority,
            user: response.data.user,
            list: response.data.list,
          };

          yield put({
            type: 'changeLoginStatus',
            payload: loginResult,
          });

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('cuser', JSON.stringify(response.data.user));
          localStorage.setItem('list', JSON.stringify(response.data.list));
          reloadAuthorized();
          yield put(routerRedux.push('/'));
        } else {
          Message.error('请先绑定公司');
        }
      } else {
        Message.error(response.msg);
      }
    },
    *weixinLogin({ payload }, { call, put }) {
      const response = yield call(weixinLogin, payload);
      let loginResult;
      if (response.code === 0) {
        loginResult = {
          status: 'ok',
          type: payload.type,
          currentAuthority: response.data.list[0].role.authority,
          user: response.data.user,
          list: response.data.list,
        };
      } else {
        // loginResult = {
        //   status: 'error',
        //   type: payload.type,
        //   currentAuthority: 'guest',
        //   user: {},
        //   list: [],
        // };
      }

      yield put({
        type: 'changeLoginStatus',
        payload: loginResult,
      });

      if (loginResult.status === 'ok') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('cuser', JSON.stringify(response.data.user));
        localStorage.setItem('list', JSON.stringify(response.data.list));
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    // *setWechatOpenid({ payload }, { call, put }) {
    //   const response = yield call(setWechatOpenid, payload);
    //   let res;
    //   if (response === 1) {
    //     res = {
    //       status: 'setOpenidOk',
    //       type: payload.type,
    //     };
    //   } else {
    //     res = {
    //       status: 'setOpenidError',
    //       type: payload.type,
    //     };
    //   }
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: res,
    //   });
    // },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        localStorage.clear();
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
