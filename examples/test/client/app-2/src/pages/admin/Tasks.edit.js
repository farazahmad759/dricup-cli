import React, { useState, useEffect } from "react";
import axios from "axios";
import { AdminForm } from "../../components/components.export";
import { useParams } from "react-router-dom";
// import { data as formData } from "../../datasource/tasks.form.data";
export const Tasks = () => {
  const [formData, setFormData] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    axios.get("http://localhost:8000/tasks/" + id).then((res) => {
      let _data = res.data.data;
      let data = [];
      Object.keys(_data).forEach((_key) => {
        if (_key !== "id") {
          let _field = {
            name: _key,
            title: _key,
            required: false,
            placeholder: "",
            initialValue: _data[_key],
            type: "string",
          };
          data.push(_field);
        }
      });
      setFormData(data);
    });
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
