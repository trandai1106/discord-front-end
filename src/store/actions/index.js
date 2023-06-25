import * as Types from './../constants/ActionTypes';

export const saveUserToRedux = (userInfor) => {
    return {
        type: Types.SAVE_USER_TO_REDUX,
        payload: userInfor
    }
}

export const removeUserOutOfRedux = (userInfor) => {
    return {
        type: Types.REMOVE_USER_OUT_OF_REDUX,
        payload: userInfor
    }
}

export const showUserMenu = (show) => {
    return {
        type: Types.SHOW_USER_MENU,
        payload: show
    }
}

export const showUserProfile = ({ state, userId }) => {
    return {
        type: Types.SHOW_USER_PROFILE,
        payload: { state, userId }
    }
}

export const showProfileSettingsModal = (show) => {
    return {
        type: Types.SHOW_PROFILE_SETTINGS_MODAL,
        payload: show
    }
};

export const showCallModal = (show) => {
    return {
        type: Types.SHOW_CALL_MODAL,
        payload: show
    }
};

export const showGroupMembersModal = (show) => {
    return {
        type: Types.SHOW_GROUP_MEMBERS_MODAL,
        payload: show
    }
}; 