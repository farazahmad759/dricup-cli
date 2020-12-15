let data = [
  {
    name: "title",
    title: "Title",
    required: true,
    placeholder: "",
    initialValue: "New task",
    type: "input:text",
  },
  {
    name: "description",
    title: "Description",
    required: false,
    placeholder: "",
    initialValue: "New task's description",
    type: "input:textarea",
  },
  {
    name: "status",
    title: "Status",
    required: true,
    placeholder: "Select gender",
    initialValue: "male",
    type: "dropdown",
  },
];

exports.data = data;
