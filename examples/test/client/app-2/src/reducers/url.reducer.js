function reducer(state, action) {
  switch (action.type) {
    case "getSearchParams":
      console.log("called");
      const _searchParams = new URLSearchParams(window.location.search);
      let _sp = {};
      for (var key of _searchParams.keys()) {
        _sp[key] = _searchParams.getAll(key);
        if (_searchParams.getAll(key).length === 1) {
          _sp[key] = _searchParams.get(key);
        }
      }
      return _sp;
    case "set":
      return action.payload;
    default:
      throw new Error();
  }
}

exports.reducer = reducer;
