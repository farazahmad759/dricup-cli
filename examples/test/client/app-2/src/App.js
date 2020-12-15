import "antd/dist/antd.css";
import "./App.css";
import { default as DcAdminLayout } from "./layouts/admin.layout";
import { AdminTable } from "./components/admin.table";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/dashboard">
              <DcAdminLayout>
                <Switch>
                  <Route path="/dashboard/tasks">
                    <div
                      className="site-layout-background"
                      style={{ padding: 24, minHeight: 360 }}
                    >
                      <AdminTable />
                    </div>
                  </Route>
                  <Route path="/">
                    <div>Dashboard</div>
                  </Route>
                </Switch>
              </DcAdminLayout>
            </Route>
            <Route path="/">
              <div>Home</div>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
