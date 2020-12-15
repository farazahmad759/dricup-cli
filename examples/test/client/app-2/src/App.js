import "antd/dist/antd.css";
import "./App.css";
import { default as DcAdminLayout } from "./layouts/admin.layout";
import { AdminTable } from "./components/admin/admin.table";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  Home,
  DcDashboard,
  DcTasks,
  DcTasksCreate,
  DcTasksEdit,
  DcTasksView,
} from "./pages/pages.export";
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/dashboard">
              <DcAdminLayout>
                <Switch>
                  <Route exact path="/dashboard/tasks/create">
                    <DcTasksCreate />
                  </Route>
                  <Route exact path="/dashboard/tasks/:id/edit">
                    <DcTasksEdit />
                  </Route>
                  <Route exact path="/dashboard/tasks/:id">
                    <DcTasksView />
                  </Route>
                  <Route exact path="/dashboard/tasks">
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
