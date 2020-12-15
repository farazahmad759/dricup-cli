import React, { useEffect, useState } from "react";
import { AdminForm } from "../../components/components.export";
import { data as dummyData } from "../../datasource/tasks.form.data";
export const Tasks = (props) => {
  const [formData, setFormData] = useState(dummyData);
  useEffect(() => {
    let _formData = formData;
    _formData.forEach((item, i) => {
      _formData[i].initialValue = null;
    });
    setFormData(_formData);
  }, []);
  return (
    <div>
      Create Task
      <AdminForm formData={formData} />
    </div>
  );
};
