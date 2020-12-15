import React from "react";
import { AdminForm } from "../../components/components.export";
import { data as formData } from "../../datasource/tasks.form.data";
export const Tasks = () => {
  return (
    <div>
      Edit Task
      <AdminForm formData={formData} />
    </div>
  );
};
