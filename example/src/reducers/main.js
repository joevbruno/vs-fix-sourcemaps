// #region ---- ACTION TYPES ----
const namespace = 'MAIN/';
const LOAD = `${namespace}LOAD`;

const initialState = {
  isFetching: true
};

export function mainReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
}

export const actionCreators = {
  load: () => {
    console.log('loading..');
    return {
      type: LOAD
    };
  }
};
