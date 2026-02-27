import { useTasks } from "../context/TaskContext";
import TaskList from "../components/TaskList";
import { MdStar } from "react-icons/md";
import { useState } from "react";
import TaskItem from "../components/TaskItem";
import { MdAdd } from "react-icons/md";

function Important() {
    const { tasks, addTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const importantTasks = tasks.filter(t => t.important);

    const handleAddImportant = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle, "default", { important: true });
        setNewTaskTitle("");
    };

    return (
        <div className="page page-important">
            <header className="list-header">
                <h1 className="list-title" style={{ color: "var(--accent-color)" }}>
                    <MdStar color="var(--accent-color)" /> Important
                </h1>
            </header>

            <form
                onSubmit={handleAddImportant}
                style={{
                    marginBottom: "16px",
                    backgroundColor: "var(--bg-input)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px"
                }}
            >
                <MdAdd size={24} color="var(--accent-color)" />
                <input
                    type="text"
                    placeholder="Add a task"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        padding: "12px",
                        fontSize: "1rem"
                    }}
                />
            </form>

            <div className="tasks-list">
                {importantTasks.filter(t => !t.completed).map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>

            {importantTasks.length === 0 && (
                <div className="empty-state">
                    <div style={{ color: "var(--accent-color)", fontSize: "20px", fontWeight: 500 }}>
                        Try starring some tasks to see them here.
                    </div>
                </div>
            )}

            {importantTasks.some(t => t.completed) && (
                <div style={{ marginTop: "24px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--text-tertiary)", marginBottom: "8px" }}>Completed</h4>
                    <div className="completed-tasks-list" style={{ opacity: 0.8 }}>
                        {importantTasks.filter(t => t.completed).map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Important;
