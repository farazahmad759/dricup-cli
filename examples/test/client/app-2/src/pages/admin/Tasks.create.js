import React, { useEffect, useState, useReducer } from "react";
import { AdminForm } from "../../components/components.export";
import { data as dummyData } from "../../datasource/tasks.form.data";
import { tasksReducer } from "./../../reducers/reducers";
import { tasksApi } from "./../../apis/api";
export const Tasks = (props) => {
  const [formData, dispatchFormData] = useReducer(tasksReducer, null);
  useEffect(() => {
    async function fetchData() {
      dispatchFormData({ type: "fetch", payload: dummyData });
    }
    fetchData();
  }, []);
  if (formData === null) {
    return "Loading";
  }
  return (
    <div>
      Create Task
      <AdminForm formData={formData} action="create" />
    </div>
  );
};
