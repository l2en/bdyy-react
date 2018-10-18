import {
  alibabaIdCardIdentify,
  alibabaVehicleLicenceIdentify,
  alibabBusinessLicenceIdentify,
  getSTSToken,
} from '../services/alibabaService';
import { Message } from 'antd';

export default {
  namespace: 'alibaba',

  state: {
    alibabaData: {},
    alibabaAuth: {},
    alibabaBusinessLicence: {},
    alibabaIdCardIdentify: {},
  },

  effects: {
    // 身份证
    *alibabaIdCardIdentify(_, { put }) {
      // const response = yield call(alibabaIdCardIdentify, payload);
      const response = { code: 0, data: { name: '张三', num: '12435242' } };
      const resData = response.data;
      yield put({
        type: 'alibabaIdCardIdentify',
        payload: resData,
      });
    },
    // 驾驶证
    *alibabaVehicleLicenceIdentify({ payload }, { call, put }) {
      const response = yield call(alibabaVehicleLicenceIdentify, payload);
      yield put({
        type: 'alibabaData',
        payload: response,
      });
    },
    // 营业执照
    *alibabBusinessLicenceIdentify({ payload }, { call, put }) {
      const response = yield call(alibabBusinessLicenceIdentify, payload);
      console.log('alibabaBusinessLicence-营业执照识别model', response);
      if (response.code === 0) {
        yield put({
          type: 'alibabaBusinessLicence',
          payload: response.data,
        });
        return;
      }
      Message.error('识别出错,请重新上传识别');
    },
    // 获取阿里巴巴STS授权
    *getSTSToken({ payload, onSuccess }, { call }) {
      const response = yield call(getSTSToken, payload);
      console.log('STSmodel', response);
      if (response.code) return;
      // yield put({
      //   type: 'alibabaAuth',
      //   payload: response.data,
      // });
      onSuccess(response.data);
    },
  },

  reducers: {
    alibabaData(state, action) {
      return {
        ...state,
        alibabaData: action.payload,
      };
    },
    alibabaAuth(state, action) {
      return {
        ...state,
        alibabaAuth: action.payload,
      };
    },
    alibabaBusinessLicence(state, action) {
      return {
        ...state,
        alibabaBusinessLicence: action.payload,
      };
    },
    alibabaIdCardIdentify(state, action) {
      return {
        ...state,
        alibabaIdCardIdentify: action.payload,
      };
    },
  },
};
