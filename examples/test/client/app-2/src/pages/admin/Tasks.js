import React, { useReducer, useEffect } from "react";
import { AdminTable } from "./../../components/components.export";
import { tasksReducer } from "../../reducers/reducers";
import { tasksApi } from "../../apis/api";
export const Tasks = (props) => {
  const _searchParams = new URLSearchParams(window.location.search);
  let searchParams = {};
  for (var key of _searchParams.keys()) {
    searchParams[key] = _searchParams.getAll(key);
    if (_searchParams.getAll(key).length === 1) {
      searchParams[key] = _searchParams.get(key);
    }
  }
  const [data, dispatchData] = useReducer(tasksReducer, null);
  async function fetchData(params) {
    let res = await tasksApi.getAll(params);
    dispatchData({ type: "fetch", payload: res });
  }

  useEffect(() => {
    console.log(searchParams);
    fetchData({ ...searchParams });
  }, []);
  return (
    <div>
      React Admin Task Page
      <AdminTable data={data} actions={{ ...tasksApi, fetchData }} />
    </div>
  );
};
