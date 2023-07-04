import * as Types from '../constants/ActionTypes';

export const initialState = {
  showUserMenu: false,
  showUserProfile: {
    state: false,
    userId: '',
  },
  showProfileSettingsModal: false,
  showCallModal: false,
  showGroupMembersModal: {
    state: false,
    groupId: '',
  },
  showCreateGroupModal: false,
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
    case Types.SHOW_GROUP_MEMBERS_MODAL:
      return {
        ...state,
        showGroupMembersModal: action.payload,
      };
    case Types.SHOW_CREATE_GROUP_MODAL:
      return {
        ...state,
        showCreateGroupModal: action.payload,
      };
    default:
      return state;
  }
};

export default context;
