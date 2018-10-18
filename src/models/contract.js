import { Message } from 'antd';
import {
  createTransport,
  deleteTransport,
  transportInfoByRoutine,
  createSell,
  deleteSell,
  queryListSellByClient,
  purchaseInfoByProvider,
  createPurchase,
  deletePurchase,
} from '../services/contractApi';
import { allInfoContractRoutine } from '../services/routineApi';
import { getProductList } from '../services/productApi';
import { getProviderList } from '../services/providerApi';

export default {
  namespace: 'contract',

  state: {
    selectClient: '', // 运输合同已选客户
    selectRoutines: '', // 运输合同已选路线
    contract: [], // 运输合同列表
    routine: [], // 运输合同-路线列表
    selectClientSale: '', // 销售合同已选客户
    saleContract: [], // 销售合同列表
    product: [], // 商品列表
    productOption: [], // 商品级联设置
    provider: [], // 供应商列表
    buyContract: [], // 购买合同列表
    selectProvider: '', // 购买合同已选供应商
  },

  effects: {
    // 新增运输合同
    *createTransport({ payload, callback }, { call }) {
      const response = yield call(createTransport, payload);
      if (!response.code) {
        Message.success('新增运输合同成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else if (response.code === 14) {
        Message.error(response.msg);
      } else {
        Message.error('新增运输合同失败');
      }
    },
    // 删除运输合同
    *deleteTransport({ payload, callback }, { call }) {
      const response = yield call(deleteTransport, payload);
      if (!response.code) {
        Message.success('删除运输合同成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else {
        Message.error('删除运输合同失败');
      }
    },
    // 根据客户获取路线
    *allInfoContractRoutine({ payload }, { call, put }) {
      const response = yield call(allInfoContractRoutine, payload);
      if (!response.code) {
        yield put({
          type: 'changeContractList',
          payload: [],
          selectRoutines: '',
        });

        yield put({
          type: 'changeRoutineList',
          payload: response.data,
          selectClient: payload.clientId,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeContractList',
          payload: [],
          selectRoutines: '',
        });

        yield put({
          type: 'changeRoutineList',
          payload: [],
          selectClient: payload.clientId,
        });
      } else {
        yield put({
          type: 'changeContractList',
          payload: [],
          selectRoutines: '',
        });

        yield put({
          type: 'changeRoutineList',
          payload: [],
          selectClient: payload.clientId,
        });
        Message.error('获取路线失败');
      }
    },
    // 根据路线查询合同
    *transportInfoByRoutine({ payload }, { call, put }) {
      const response = yield call(transportInfoByRoutine, payload);
      if (!response.code) {
        yield put({
          type: 'changeContractList',
          payload: response.data,
          selectRoutines: payload.contractRoutineIds,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeContractList',
          payload: [],
          selectRoutines: payload.contractRoutineIds,
        });
      } else {
        Message.error('获取运输合同失败');
      }
    },
    // 新增销售合同
    *createSell({ payload, callback }, { call }) {
      const response = yield call(createSell, payload);
      if (!response.code) {
        Message.success('新增销售合同成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else if (response.code === 14) {
        Message.error(response.msg);
      } else {
        Message.error('新增销售合同失败');
      }
    },
    // 删除销售合同
    *deleteSell({ payload, callback }, { call }) {
      const response = yield call(deleteSell, payload);
      if (!response.code) {
        Message.success('删除销售合同成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else {
        Message.error('删除销售合同失败');
      }
    },
    // 根据客户获取销售合同
    *queryListSellByClient({ payload, providerFilter = '', productFilter = [] }, { call, put }) {
      const response = yield call(queryListSellByClient, payload);
      if (!response.code) {
        const productFilterlist =
          productFilter.length > 0
            ? response.data.filter(
                item =>
                  item.productName === productFilter[0] &&
                  item.productType === productFilter[1] &&
                  item.productPackagingType === productFilter[2]
              )
            : response.data;
        const filterList = providerFilter
          ? productFilterlist.filter(item => item.providerId === providerFilter)
          : productFilterlist;
        yield put({
          type: 'changeSaleContractList',
          payload: filterList,
          selectClientSale: payload.clientId,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeSaleContractList',
          payload: [],
          selectClientSale: payload.clientId,
        });
      } else {
        yield put({
          type: 'changeSaleContractList',
          payload: [],
          selectClientSale: payload.clientId,
        });
        Message.error('获取销售合同失败');
      }
    },
    // 获取全部商品列表
    *getProductList(_, { call, put }) {
      const response = yield call(getProductList);
      if (!response.code) {
        const product = response.data;
        const option = [];
        const nameStash = [];
        product.forEach(item => {
          if (nameStash.indexOf(item.name) < 0) {
            option.push({ value: item.name, label: item.name, children: [] });
            nameStash.push(item.name);
          }
        });

        option.forEach(item => {
          const list = product.filter(i => i.name === item.value);
          const typeStash = [];
          list.forEach(i => {
            if (typeStash.indexOf(i.type) < 0) {
              item.children.push({ value: i.type, label: i.type, children: [] });
              typeStash.push(i.type);
            }
          });
        });

        option.forEach(item => {
          item.children.forEach(i => {
            const list = product.filter(j => j.name === item.value && j.type === i.value);
            const packagingStash = [];
            list.forEach(j => {
              if (packagingStash.indexOf(j.packagingType) < 0) {
                i.children.push({ value: j.packagingType, label: j.packagingType });
                packagingStash.push(j.packagingType);
              }
            });
          });
        });

        yield put({
          type: 'changeProductList',
          product: response.data,
          productOption: option,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeProductList',
          product: [],
          productOption: [],
        });
      } else {
        Message.error('获取商品列表失败');
      }
    },
    // 获取全部供应商列表
    *getProviderList({ payload }, { call, put }) {
      const response = yield call(getProviderList, payload);
      if (!response.code) {
        yield put({
          type: 'changeProviderList',
          payload: response.data,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeProviderList',
          payload: [],
        });
      } else {
        Message.error('获取供应商列表失败');
      }
    },
    // 根据供应商获取购买合同
    *purchaseInfoByProvider({ payload, filter = [] }, { call, put }) {
      const response = yield call(purchaseInfoByProvider, payload);
      if (!response.code) {
        const purchaselist =
          filter.length > 0
            ? response.data.filter(
                item =>
                  item.productName === filter[0] &&
                  item.productType === filter[1] &&
                  item.productPackagingType === filter[2]
              )
            : response.data;
        yield put({
          type: 'changeBuyContractList',
          payload: purchaselist,
          selectProvider: payload.providerId,
        });
      } else if (response.code === 1) {
        yield put({
          type: 'changeBuyContractList',
          payload: [],
          selectProvider: payload.providerId,
        });
      } else {
        yield put({
          type: 'changeBuyContractList',
          payload: [],
          selectProvider: payload.providerId,
        });
        Message.error('获取购买合同失败');
      }
    },
    // 新增购买合同
    *createPurchase({ payload, callback }, { call }) {
      const response = yield call(createPurchase, payload);
      if (!response.code) {
        Message.success('新增购买合同成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else if (response.code === 14) {
        Message.error(response.msg);
      } else {
        Message.error('新增购买合同失败');
      }
    },
    // 删除购买合同
    *deletePurchase({ payload, callback }, { call }) {
      const response = yield call(deletePurchase, payload);
      if (!response.code) {
        Message.success('删除购买合同成功');
        if (callback && typeof callback === 'function') {
          callback();
        }
      } else {
        Message.error('删除购买合同失败');
      }
    },
  },

  reducers: {
    changeContractList(state, action) {
      return {
        ...state,
        contract: action.payload,
        selectRoutines: action.selectRoutines,
      };
    },
    changeRoutineList(state, action) {
      return {
        ...state,
        routine: action.payload,
        selectClient: action.selectClient,
      };
    },
    changeSaleContractList(state, action) {
      return {
        ...state,
        saleContract: action.payload,
        selectClientSale: action.selectClientSale,
      };
    },
    changeProductList(state, action) {
      return {
        ...state,
        product: action.product,
        productOption: action.productOption,
      };
    },
    changeProviderList(state, action) {
      return {
        ...state,
        provider: action.payload,
      };
    },
    changeBuyContractList(state, action) {
      return {
        ...state,
        buyContract: action.payload,
        selectProvider: action.selectProvider,
      };
    },
  },
};
