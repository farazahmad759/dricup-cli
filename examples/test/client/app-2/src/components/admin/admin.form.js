import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";
import { tasksApi } from "./../../apis/api";
const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
export const AdminForm = (props) => {
  const [form] = Form.useForm();
  const onGenderChange = (value) => {};

  const onFinish = async (values) => {
    console.log("create/update", values);
    if (props.action === "create") {
      tasksApi.createOne({
        data: values,
        msg: "New task created successfully",
      });
    } else if (props.action === "update") {
      tasksApi.updateOne({
        data: values,
        id: props.id,
        msg: "Task updated successfully with id = " + props.id,
      });
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    let initialValues = {};
    if (props.formData.constructor === [].constructor) {
      props.formData.forEach((item) => {
        initialValues[item.name] = item.initialValue;
      });
      form.setFieldsValue(initialValues);
    }
  }, []);

  if (props.formData === null) {
    return "Loading";
  }
  if (props.formData.error) {
    return props.formData.error;
  }
  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      {props.formData.map((item, i) => {
        return (
          <Form.Item
            key={i}
            name={item.name}
            label={item.title}
            rules={[{ required: item.required }]}
          >
            {item.type.includes("string") ? (
              <Input />
            ) : item.type.includes("text") ? (
              <TextArea rows={4} />
            ) : item.type.includes("dropdown") ? (
              <Select
                placeholder={item.placeholder}
                onChange={onGenderChange}
                allowClear
              >
                {item.options.map((_option, j) => {
                  return (
                    <Option key={j} value={_option.value}>
                      {_option.title}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              ""
            )}
          </Form.Item>
        );
      })}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};
