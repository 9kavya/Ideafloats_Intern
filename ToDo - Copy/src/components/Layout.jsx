import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TaskDetailPanel from "./TaskDetailPanel";
import { useTasks } from "../context/TaskContext";

function Layout() {
    const { selectedTaskId } = useTasks();

    return (
        <div className={`app-container ${selectedTaskId ? "detail-panel-open" : ""}`}>
            <Sidebar />
            <main className="main-content">
                <div className="content-scrollable">
                    <Outlet />
                </div>
            </main>
            {selectedTaskId && <TaskDetailPanel />}
        </div>
    );
}

export default Layout;
