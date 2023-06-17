import * as Types from '../constants/ActionTypes';

export const initialState = {
  isLoading: false,
  showProfileSettings: false,
  showUserProfile: {
    state: false,
    userId: "",
  },
}

const context = (state = initialState, action) => {
  switch (action.type) {
    case Types.TOGGLE_IS_LOADING:
      state.isLoading = action.payload;
    case Types.TOGGLE_PROFILE_SETTINGS:
      state.showProfileSettings = action.payload;
    case Types.TOGGLE_USER_PROFILE:
      state.showUserProfile = action.payload;
    default: return state;
  }
}

export default context;