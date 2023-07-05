import * as Types from '../constants/ActionTypes';

export const initialState = {
  showUserMenu: false,
  showUserProfile: {
    state: false,
    userId: '',
  },
  showProfileSettingsModal: false,
  showCallModal: false,
  showChannelMembersModal: {
    state: false,
    channelId: '',
  },
  showCreateChannelModal: false,
};

const context = (state = initialState, action) => {
  switch (action.type) {
    case Types.SHOW_USER_MENU:
      return {
        ...state,
        showUserMenu: action.payload,
      };
    case Types.SHOW_USER_PROFILE:
      return {
        ...state,
        showUserProfile: action.payload,
      };
    case Types.SHOW_PROFILE_SETTINGS_MODAL:
      return {
        ...state,
        showProfileSettingsModal: action.payload,
      };
    case Types.SHOW_CALL_MODAL:
      return {
        ...state,
        showCallModal: action.payload,
      };
    case Types.SHOW_CHANNEL_MEMBERS_MODAL:
      return {
        ...state,
        showChannelMembersModal: action.payload,
      };
    case Types.SHOW_CREATE_CHANNEL_MODAL:
      return {
        ...state,
        showCreateChannelModal: action.payload,
      };
    default:
      return state;
  }
};

export default context;
