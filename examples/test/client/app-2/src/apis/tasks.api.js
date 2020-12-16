import axios from "axios";
import { message } from "antd";
export const dcApi = {
  createOne: async (params) => {
    let res = await axios.post("http://localhost:8000/tasks", params.data);
    if (params.msg) {
      message.success(params.msg);
    }
    return res.data.data;
  },
  updateOne: async (params) => {
    let res = await axios.put(
      "http://localhost:8000/tasks/" + params.id,
      params.data
    );
    if (params.msg) {
      message.success(params.msg);
    }
    return res.data.data;
  },
  deleteOne: async (params) => {
    let res = await axios.delete(
      "http://localhost:8000/tasks/" + params.id,
      params.data
    );
    if (params.msg) {
      message.success(params.msg);
    }
    return res.data.data;
  },
  getFormData: async (params) => {
    let res = await axios.get("http://localhost:8000/tasks/" + params.id);
    if (!res.data.data) {
      return { error: "Task not found with id = " + params.id };
    }
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

    return data;
  },
  getAll: async (params) => {
    let res = await axios.get("http://localhost:8000/tasks");
    if (!res.data.data) {
      return { error: "Error in fetching tasks" };
    }
    let _data = res.data.data;
    _data.forEach((item, i) => {
      _data[i].key = _data[i].id;
    });
    return _data;
  },
};

export default dcApi;
