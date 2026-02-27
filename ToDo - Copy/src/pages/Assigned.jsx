import { useTasks } from "../context/TaskContext";
import TaskItem from "../components/TaskItem";
import { MdPersonOutline } from "react-icons/md";

function Assigned() {
    const { tasks } = useTasks();
    const assignedTasks = [];

    return (
        <div className="page page-assigned">
            <header className="list-header">
                <h2 className="list-title" style={{ color: "#86efac" }}> {/* Light green */}
                    <MdPersonOutline size={32} /> Assigned to me
                </h2>
            </header>

            <div className="tasks-list-container">
                {assignedTasks.length > 0 ? (
                    assignedTasks.map(task => <TaskItem key={task.id} task={task} />)
                ) : (
                    <div className="empty-state">
                        <div style={{
                            color: "#86efac",
                            fontSize: "20px",
                            fontWeight: 500,
                            maxWidth: "400px",
                            width: "100%",
                            lineHeight: "1.4"
                        }}>
                            Tasks that are assigned to you show up here
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Assigned;
