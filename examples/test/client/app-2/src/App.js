import "antd/dist/antd.css";
import "./App.css";
import { default as DcAdminLayout } from "./layouts/admin.layout";
import { AdminTable } from "./components/admin/admin.table";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, DcDashboard, DcTasks } from "./pages/pages.export";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/dashboard">
              <DcAdminLayout>
                <Switch>
                  <Route path="/dashboard/tasks/:id">Edit Task</Route>
                  <Route path="/dashboard/tasks/create">Create Task</Route>
                  <Route path="/dashboard/tasks">
                    <DcTasks />
                  </Route>
                  <Route path="/">
                    <DcDashboard />
                  </Route>
                </Switch>
              </DcAdminLayout>
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
