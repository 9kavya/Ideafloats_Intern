import { useTasks } from "../context/TaskContext";
import { MdCalendarToday, MdAdd } from "react-icons/md";
import TaskItem from "../components/TaskItem";
import { format, isToday, isTomorrow, isPast, isFuture } from "date-fns";
import { useState } from "react";

function Planned() {
    const { tasks, addTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState("");

    // Show tasks with dueDate OR reminder
    const plannedTasks = tasks.filter(t => t.dueDate || t.reminder);

    // Sorting: prioritize dueDate, fall back to reminder
    plannedTasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(a.reminder);
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(b.reminder);
        return dateA - dateB;
    });

    // Grouping
    const getGroupDate = (t) => t.dueDate ? new Date(t.dueDate) : new Date(t.reminder);

    const groups = {
        past: plannedTasks.filter(t => isPast(getGroupDate(t)) && !isToday(getGroupDate(t))),
        today: plannedTasks.filter(t => isToday(getGroupDate(t))),
        tomorrow: plannedTasks.filter(t => isTomorrow(getGroupDate(t))),
        later: plannedTasks.filter(t => isFuture(getGroupDate(t)) && !isTomorrow(getGroupDate(t)) && !isToday(getGroupDate(t)))
    };

    const handleAddPlanned = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        // Default to today for planned? Or just add without date and let user set it?
        // Microsoft To Do behavior: "Planned" adds usually imply adding with a date. 
        // Let's add with Today as default if added from Planned view.
        addTask(newTaskTitle, "default", { dueDate: format(new Date(), 'yyyy-MM-dd') });
        setNewTaskTitle("");
    };

    return (
        <div className="page page-planned">
            <header className="list-header">
                <h1 className="list-title" style={{ color: "var(--success-color)" }}>
                    <MdCalendarToday /> Planned
                </h1>
            </header>

            <form
                onSubmit={handleAddPlanned}
                style={{
                    marginBottom: "16px",
                    backgroundColor: "var(--bg-input)",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px"
                }}
            >
                <MdAdd size={24} color="var(--success-color)" />
                <input
                    type="text"
                    placeholder="Add a task due today"
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

            {Object.entries(groups).map(([key, groupTasks]) => {
                if (groupTasks.length === 0) return null;
                let label = "Later";
                if (key === 'past') label = "Earlier";
                if (key === 'today') label = "Today";
                if (key === 'tomorrow') label = "Tomorrow";

                return (
                    <div key={key} style={{ marginBottom: "24px" }}>
                        <h3 style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "capitalize" }}>{label} ({groupTasks.length})</h3>
                        <div>
                            {groupTasks.map(task => <TaskItem key={task.id} task={task} />)}
                        </div>
                    </div>
                )
            })}

            {plannedTasks.length === 0 && (
                <div className="empty-state">
                    No planned tasks
                </div>
            )}
        </div>
    );
}

export default Planned;
