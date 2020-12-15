import React, { useEffect } from "react";
import { Form, Input, Button, Select } from "antd";
const { Option } = Select;

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

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    let initialValues = {};
    props.formData.forEach((item) => {
      initialValues[item.name] = item.initialValue;
    });
    form.setFieldsValue(initialValues);
  }, []);

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
            {item.type.includes("input") ? (
              <Input />
            ) : item.type.includes("dropdown") ? (
              <Select
                placeholder={item.placeholder}
                onChange={onGenderChange}
                allowClear
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
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
