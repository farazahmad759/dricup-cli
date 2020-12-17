import React, { useReducer, useEffect, useState } from "react";
import { AdminTable } from "./../../components/components.export";
import { tasksReducer, urlReducer } from "../../reducers/reducers";
import { tasksApi } from "../../apis/api";
export const Tasks = (props) => {
  const [urlState, dispatchUrl] = useReducer(urlReducer, {});
  const [data, dispatchData] = useReducer(tasksReducer, null);
  async function fetchData(params) {
    let res = await tasksApi.getAll(params);
    dispatchData({ type: "fetch", payload: res });
  }

  useEffect(() => {
    dispatchUrl({ type: "getSearchParams" });
  }, []);
  useEffect(() => {
    console.log("=============");
    fetchData({ ...urlState });
  }, [urlState]);
  return (
    <div>
      React Admin Task Page
      <AdminTable
        data={data}
        actions={{ ...tasksApi, fetchData, dispatchUrl }}
      />
    </div>
  );
};
