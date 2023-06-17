import * as Types from '../constants/ActionTypes';

export const initialState = {
  isLoading: false,
  showUserMenu: false,
  showUserProfile: {
    state: false,
    userId: "",
  },
}

const context = (state = initialState, action) => {
  switch (action.type) {
    case Types.TOGGLE_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case Types.TOGGLE_USER_MENU:
      return {
        ...state,
        showUserMenu: action.payload
      };
    case Types.TOGGLE_USER_PROFILE:
      return {
        ...state,
        showUserProfile: action.payload
      };
    default: return state;
  }
}

export default context;