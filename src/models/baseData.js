export default {
  namespace: 'baseData',

  state: {
    company: {},
    role: {},
  },

  effects: {
    // 切换公司
    *switchCorp({ payload }, { put }) {
      const list = JSON.parse(localStorage.getItem('list') || '[]');
      const baseData = list.filter(item => item.company.id === payload)[0];
      yield put({
        type: 'switchCompany',
        payload: baseData,
      });
      localStorage.setItem('baseData', JSON.stringify(baseData));
    },
  },

  reducers: {
    switchCompany(state, action) {
      return {
        ...state,
        company: action.payload.company,
        role: action.payload.role,
      };
    },
  },
};
