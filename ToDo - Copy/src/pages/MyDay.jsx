import { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskItem from "../components/TaskItem";
import { MdWbSunny, MdAdd, MdLightbulbOutline, MdMoreHoriz, MdSort } from "react-icons/md";
import { format } from "date-fns";

function MyDay() {
    const { tasks, addTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const myDayTasks = tasks.filter(t => t.addedToMyDay);

    const handleAddMyDayTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        addTask(newTaskTitle, "default", { addedToMyDay: true, myDayDate: new Date().toISOString() });
        setNewTaskTitle("");
    };

    const todayStr = format(new Date(), "EEEE, d MMMM"); // "Wednesday, 18 February" format

    return (
        <div className="page page-my-day" style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>

            {/* Background Image */}
            <div
                className="my-day-background"
                style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
                    backgroundImage: "url('https://images.unsplash.com/photo-1542665976-b548d433430d?q=80&w=1974&auto=format&fit=crop')", // Berlin TV tower approx
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.7)" // Darken slightly for text readability
                }}
            />

            {/* Header */}
            <header className="list-header" style={{ padding: "0 8px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 className="list-title" style={{ color: "#fff", fontSize: "32px", fontWeight: "300" }}>
                        My Day
                    </h1>
                    <p className="list-date" style={{ color: "rgba(255,255,255,0.9)", fontSize: "20px", marginTop: "4px" }}>{todayStr}</p>
                </div>
                <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                    <button title="Sort" style={{ color: "#fff", opacity: 0.8 }}><MdSort size={22} /></button>
                    <button title="Suggestions" style={{ color: "#fff", opacity: 0.8 }}><MdLightbulbOutline size={22} /></button>
                    <button title="Options" style={{ color: "#fff", opacity: 0.8 }}><MdMoreHoriz size={22} /></button>
                </div>
            </header>

            {/* Task List (Scrollable Area) */}
            <div className="tasks-list-container" style={{ flex: 1, overflowY: "auto", padding: "0 8px 60px 8px" }}>
                <div className="tasks-list">
                    {myDayTasks.filter(t => !t.completed).map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>

                {myDayTasks.some(t => t.completed) && (
                    <div style={{ marginTop: "24px" }}>
                        <h4 style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px", background: "rgba(0,0,0,0.3)", display: "inline-block", padding: "2px 8px", borderRadius: "4px" }}>Completed</h4>
                        <div className="completed-tasks-list" style={{ opacity: 0.8 }}>
                            {myDayTasks.filter(t => t.completed).map((task) => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Floating Input */}
            <div style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                right: "16px",
                zIndex: 10
            }}>
                <form
                    onSubmit={handleAddMyDayTask}
                    style={{
                        backgroundColor: "rgba(30,30,30, 0.85)",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 16px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        backdropFilter: "blur(10px)",
                        height: "50px"
                    }}
                >
                    <MdAdd size={24} color="#fff" style={{ marginRight: "12px" }} />
                    <input
                        type="text"
                        placeholder="Add a task"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            padding: "12px 0",
                            fontSize: "1rem",
                            color: "#fff",
                            height: "100%"
                        }}
                    />
                    {newTaskTitle && (
                        <button type="submit" style={{ fontSize: "14px", color: "var(--accent-color)" }}>ADD</button>
                    )}
                </form>
            </div>

        </div>
    );
}

export default MyDay;
