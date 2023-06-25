import * as Types from '../constants/ActionTypes';

export const initialState = {
  isLoading: false,
  showUserMenu: false,
  showUserProfile: {
    state: false,
    userId: "",
  },
  showAccountSettingsModal: false,
  showCallModal: false,
};

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
      console.log(action.payload);
      return {
        ...state,
        showUserProfile: action.payload
      };
    case Types.TOGGLE_ACCOUNT_SETTINGS_MODAL:
      return {
        ...state,
        showAccountSettingsModal: action.payload
      };
    case Types.TOGGLE_CALL_MODAL:
      return {
        ...state,
        showCallModal: action.payload
      }
    default: return state;
  }
};

export default context;