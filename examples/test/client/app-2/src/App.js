import "antd/dist/antd.css";
import "./App.css";
import PageLayout from "./pages/admin/PageLayout";
import { AdminTable } from "./components/admin.table";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AdminTable />
        <PageLayout>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            content
          </div>
        </PageLayout>
      </header>
    </div>
  );
}

export default App;
