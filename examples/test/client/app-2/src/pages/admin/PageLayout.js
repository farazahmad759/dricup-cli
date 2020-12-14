import { Layout, Menu } from "antd";
import { sidebar as sidebarData } from "../../datasource/admin.data";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const PageLayout = (props) => {
  console.log(sidebarData);
  return (
    <Layout>
      <Header className="header">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">
            <div className="logo">nav 1</div>
          </Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>{" "}
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["0.0"]}>
            {sidebarData.items.map((item, i) => {
              if (item.link) {
                return <Menu.Item key={item.key}>{item.title}</Menu.Item>;
              }
              return (
                <SubMenu key="sub1" title={item.title}>
                  {item.children.map((level1, j) => {
                    return (
                      <Menu.Item key={level1.key}>{level1.title}</Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        </Sider>
        <Content style={{ margin: "24px 16px 0" }}>{props.children}</Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default PageLayout;
