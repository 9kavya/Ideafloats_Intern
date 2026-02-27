import { useState } from "react";
import TaskItem from "./TaskItem";
import { MdAdd } from "react-icons/md";
import { useTasks } from "../context/TaskContext";

function TaskList({ tasks, listId, showAddInput = true, placeholder = "Add a task" }) {
    const { addTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        // If listId is provided (e.g. custom list), use it.
        // If we are in "Important" or "My Day", we might need to handle properties differently.
        // For now, assume generic list adding. Wrappers can handle specific "addedToMyDay" logic if needed, 
        // but the generic addTask in context needs to know context. 
        // Let's pass extra props via the wrapper or just handle listId.

        addTask(newTaskTitle, listId);
        setNewTaskTitle("");
    };

    return (
        <div style={{ paddingBottom: "100px" }}> {/* Padding for scrolling */}

            {/* Task form placed at top or bottom? To Do usually has it at top or bottom depending on version. Let's put it at bottom of list or top? 
          Microsoft To Do web usually has it at the top of the list or floating? 
          Actually it's often at the top *under* the header.
      */}

            {showAddInput && (
                <form
                    onSubmit={handleAddTask}
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
                        placeholder={placeholder}
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
            )}

            {/* Incomplete Tasks */}
            <div className="tasks-list">
                {tasks.filter(t => !t.completed).map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>

            {/* Completed Tasks Accordion (Simplified) */}
            {tasks.some(t => t.completed) && (
                <div style={{ marginTop: "24px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--text-tertiary)", marginBottom: "8px" }}>Completed</h4>
                    <div className="completed-tasks-list" style={{ opacity: 0.8 }}>
                        {tasks.filter(t => t.completed).map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskList;
