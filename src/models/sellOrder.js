import { allInfoSellOrder } from '../services/sellOrderApi';

export default {
  namespace: 'sellOrder',
  state: {
    pastSellOrderList: [], // 历史订单业务列表
    dateBegin: '', // 筛选项的开始日期
    dateEnd: '', // 筛选项的结束日期
  },
  effects: {
    *getPastSellOrderList({ payload }, { call, put, select }) {
      const { dateBegin, dateEnd } = yield select(state => state.sellOrder);
      const { id: companyId } = yield select(state => state.baseData.company);
      const { pageSize, pageNum } = payload;
      const response = yield call(allInfoSellOrder(), {
        companyId,
        dateBegin,
        dateEnd,
        pageSize,
        pageNum,
        status: [1, 2],
      });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            pastSellOrderList: response.data,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
