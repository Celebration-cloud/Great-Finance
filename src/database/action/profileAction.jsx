import { toaster } from "evergreen-ui";

export const profileAction = (userData) => async (dispatch, getState) => {
    try {
        console.log(userData)
        dispatch({ type: "SUPA_PROFILE", payload: userData });
    } catch (error) {
         toaster.danger(error.message)
    }
}
