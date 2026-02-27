import { useTasks } from "../context/TaskContext";
import TaskItem from "../components/TaskItem";
import { MdOutlineFlag } from "react-icons/md";

function Flagged() {
    const { tasks } = useTasks();
    const flaggedTasks = []; // Placeholder

    return (
        <div className="page page-flagged">
            <header className="list-header">
                <h2 className="list-title" style={{ color: "#fca5a5" }}> {/* Light Red */}
                    <MdOutlineFlag size={32} /> Flagged email
                </h2>
            </header>

            <div className="tasks-list-container">
                {flaggedTasks.length > 0 ? (
                    flaggedTasks.map(task => <TaskItem key={task.id} task={task} />)
                ) : (
                    <div className="empty-state">
                        <div style={{
                            color: "#fca5a5",
                            fontSize: "20px",
                            fontWeight: 500,
                            maxWidth: "400px",
                            width: "100%",
                            lineHeight: "1.4"
                        }}>
                            Messages you flag will show up as tasks here.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Flagged;
