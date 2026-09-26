const adminState = {
  status: "loading",
  error: null,
  users: null,
};

export const adminReducer = (state = adminState, { type, payload }) => {
  switch (type) {
    case "ADMIN_USERS":
      return { ...state, users: payload };
    default:
      return state;
  }
};
