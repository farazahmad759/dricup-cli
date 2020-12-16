import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { AdminForm } from "../../components/components.export";
import { useParams } from "react-router-dom";
import { tasksReducer } from "./../../reducers/reducers";
import { tasksApi } from "./../../apis/api";
// import { data as formData } from "../../datasource/tasks.form.data";
export const Tasks = () => {
  const [formData, dispatchFormData] = useReducer(tasksReducer, null);
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      let data = await tasksApi.getFormData({ id });
      dispatchFormData({ type: "fetch", payload: data });
    }
    fetchData();
  }, []);
  if (formData === null) {
    return "Loading";
  }
  return (
    <div>
      Edit Task #{id}
      <AdminForm formData={formData} action="update" id={id} />
    </div>
  );
};
