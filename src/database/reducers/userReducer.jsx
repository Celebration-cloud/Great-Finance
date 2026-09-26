const userState = {
    status: "loading",
    error: null,
    profile: null,
    session: null,
    storage: null,
}

export const userReducer = (state = userState, { type, payload }) => {
    switch (type) {
      case "SUPA_PROFILE":
        return {...state, profile: payload};
      case "SUPA_CONFIRMED":
        return {status: "login"}
      case "SUPA_STORE":
        return {...state, storage: payload}
      case "SUPA_SESSION":
        return {...state, session: payload};
      case "SUPA_REFERRAL":
        return {...state, referral: payload}
      default:
        return state;
    }
}
