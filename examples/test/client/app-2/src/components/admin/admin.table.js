import React, { useState } from "react";
import { Table, Input, Button, Space } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

export const AdminTable = (props) => {
  const [state, setState] = useState({
    searchText: "",
    searchedColumn: "",
  });

  const data = [
    {
      key: "1",
      title: "John Brown",
      description: 32,
      status: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      title: "Joe Black",
      description: 42,
      status: "London No. 1 Lake Park",
    },
    {
      key: "3",
      title: "Jim Green",
      description: 32,
      status: "Sidney No. 1 Lake Park",
    },
    {
      key: "4",
      title: "Jim Red",
      description: 32,
      status: "London No. 2 Lake Park",
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
      //   ...hhh(),
      ...getColumnSearchProps("description"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
    },
  ];
  function getColumnSearchProps(dataIndex) {
    let searchInput = "";
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      },
      render: (text) =>
        state.searchedColumn === dataIndex
          ? // <Highlighter
            //   highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            //   searchWords={[state.searchText]}
            //   autoEscape
            //   textToHighlight={text ? text.toString() : ""}
            // />
            text
          : text,
    };
  }
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};
