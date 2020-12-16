import React, { useState } from "react";
import { AdminForm } from "../../components/components.export";
import { useParams } from "react-router-dom";
export const Tasks = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState([]);
  return (
    <div>
      Task #{id}
      <AdminForm formData={formData} />
    </div>
  );
};
