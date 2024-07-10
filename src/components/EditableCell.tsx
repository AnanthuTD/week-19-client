import React from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { User } from "../types";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  fallbackDataIndex: string;
  title: string;
  inputType: "number" | "text" | "select";
  record: User;
  index: number;
  key: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  fallbackDataIndex,
  title,
  inputType,
  record,
  ...restProps
}) => {
  let inputNode: JSX.Element | null = null;

  switch (inputType) {
    case "number":
      inputNode = <InputNumber />;
      break;
    case "select":
      inputNode = (
        <Select
          options={[
            { value: "admin", label: "admin" },
            { value: "user", label: "user" },
          ]}
        />
      );
      break;
    default:
      inputNode = <Input />;
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex || fallbackDataIndex || "unknown"}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        restProps.children
      )}
    </td>
  );
};

export default EditableCell;
