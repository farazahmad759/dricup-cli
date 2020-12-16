import axios from "axios";
export const dcApi = {
  fetchFormData: async (params) => {
    let res = await axios.get("http://localhost:8000/tasks/" + params.id);
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
};

export default dcApi;
