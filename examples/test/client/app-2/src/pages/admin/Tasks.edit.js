import Axios from "axios";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AdminForm } from "../../components/components.export";
// import { data as formData } from "../../datasource/tasks.form.data";
export const Tasks = () => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/tasks/1").then((res) => {
      let _data = res.data.data;
      let data = [];
      Object.keys(_data).forEach((_key) => {
        let _field = {
          name: _key,
          title: _key,
          required: false,
          placeholder: "",
          initialValue: _data[_key],
          type: "string",
        };
        data.push(_field);
      });
      setFormData(data);
      console.log(res.data.data);
      // setFormData(res.data.data);
    });
  }, []);
  return (
    <div>
      Edit Task
      <AdminForm formData={formData} action="update" />
    </div>
  );
};
