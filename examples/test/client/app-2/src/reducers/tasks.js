function reducer(state, action) {
  switch (action.type) {
    case "create":
      return { count: state.count + 1 };
    case "update":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

exports.reducer = reducer;
