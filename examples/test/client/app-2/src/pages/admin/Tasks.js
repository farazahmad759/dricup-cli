import React, { useReducer, useEffect } from "react";
import { AdminTable } from "./../../components/components.export";
import { tasksReducer } from "../../reducers/reducers";
import { tasksApi } from "../../apis/api";

export const Tasks = (props) => {
  const [data, dispatchData] = useReducer(tasksReducer, null);
  useEffect(() => {
    async function fetchData() {
      let res = await tasksApi.getAll({});
      dispatchData({ type: "fetch", payload: res });
    }
    fetchData();
  }, []);
  return (
    <div>
      React Admin Task Page
      <AdminTable data={data} />
    </div>
  );
};
