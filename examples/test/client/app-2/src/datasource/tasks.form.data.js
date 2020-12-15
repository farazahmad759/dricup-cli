let data = [
  {
    name: "title",
    title: "Title",
    required: true,
    placeholder: "",
    initialValue: "New task",
    type: "string",
  },
  {
    name: "description",
    title: "Description",
    required: false,
    placeholder: "",
    initialValue: "New task's description",
    type: "text",
  },
  {
    name: "status",
    title: "Status",
    required: true,
    placeholder: "Select status",
    initialValue: "todo",
    type: "dropdown",
    options: [
      {
        title: "Todo",
        value: "todo",
      },
      {
        title: "Completed",
        value: "completed",
      },
    ],
  },
];

exports.data = data;
