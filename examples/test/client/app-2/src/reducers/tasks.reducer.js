function reducer(state, action) {
  switch (action.type) {
    case "fetch":
      return action.payload;
    default:
      throw new Error();
  }
}

exports.reducer = reducer;
