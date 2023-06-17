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

export const toggleIsLoading = (isLoading) => {
    return {
        type: Types.TOGGLE_IS_LOADING,
        payload: isLoading
    }
}

export const toogleUserMenu = (show) => {
    return {
        type: Types.TOGGLE_USER_MENU,
        payload: show
    }
}

export const toogleUserProfile = ({ state, userId }) => {
    return {
        type: Types.TOGGLE_USER_PROFILE,
        payload: { state, userId }
    }
}