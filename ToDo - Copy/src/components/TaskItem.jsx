import { useTasks } from "../context/TaskContext";
import { MdCheck, MdStar, MdStarBorder, MdWbSunny, MdCalendarToday, MdNote, MdDeleteOutline, MdAlarm, MdRepeat } from "react-icons/md";
import { clsx } from 'clsx';
import { format, isToday, isPast, isTomorrow } from "date-fns";
import { useState } from "react";

function getDueDateLabel(dateStr) {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, d MMM");
}

function getDueDateColor(dateStr) {
    const date = new Date(dateStr);
    if (isToday(date)) return "#5b8af0"; // blue for today
    if (isPast(date)) return "#f87171"; // red for overdue
    return "var(--text-secondary)";
}

function MetaDot() {
    return <span style={{ color: "var(--text-tertiary)", fontSize: "10px", lineHeight: 1 }}>•</span>;
}

function TaskItem({ task }) {
    const { toggleTaskCompletion, toggleTaskImportance, setSelectedTaskId, selectedTaskId, deleteTask } = useTasks();
    const [isHovered, setIsHovered] = useState(false);

    const isSelected = selectedTaskId === task.id;

    const handleSelect = () => {
        setSelectedTaskId(task.id);
    };

    // Collect metadata chips in order
    const chips = [];

    if (task.addedToMyDay) {
        chips.push(
            <span key="myday" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <MdWbSunny size={12} style={{ flexShrink: 0 }} />
                <span>My Day</span>
            </span>
        );
    }

    if (task.steps && task.steps.length > 0) {
        chips.push(
            <span key="steps">
                {task.steps.filter(s => s.completed).length}/{task.steps.length}
            </span>
        );
    }

    if (task.dueDate) {
        const color = getDueDateColor(task.dueDate);
        chips.push(
            <span key="due" style={{ display: "flex", alignItems: "center", gap: "3px", color }}>
                <MdCalendarToday size={12} style={{ flexShrink: 0 }} />
                <span>{getDueDateLabel(task.dueDate)}</span>
            </span>
        );
    }

    if (task.repeat) {
        chips.push(
            <span key="repeat" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <MdRepeat size={12} />
            </span>
        );
    }

    if (task.reminder) {
        const reminderDate = new Date(task.reminder);
        chips.push(
            <span key="reminder" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <MdAlarm size={12} style={{ flexShrink: 0 }} />
                <span>{format(reminderDate, "EEE, d MMM")}</span>
            </span>
        );
    }

    if (task.note && chips.length === 0) {
        // Only show note icon if no other chips (to avoid clutter)
        chips.push(
            <span key="note" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <MdNote size={12} />
            </span>
        );
    }

    // Interleave with dots
    const metaRow = [];
    chips.forEach((chip, idx) => {
        if (idx > 0) metaRow.push(<MetaDot key={`dot-${idx}`} />);
        metaRow.push(chip);
    });

    return (
        <div
            onClick={handleSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={clsx("task-item", { "selected": isSelected, "completed": task.completed })}
            style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                backgroundColor: isSelected ? "var(--bg-selected)" : "rgba(33, 33, 33, 0.9)",
                borderRadius: "4px",
                marginBottom: "2px",
                cursor: "pointer",
                transition: "background-color 0.2s",
                border: "none",
                position: "relative",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                minHeight: "52px"
            }}
        >
            {/* Checkbox */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskCompletion(task.id);
                }}
                className="checkbox-circle"
                style={{
                    marginRight: "14px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `2px solid ${task.completed ? "var(--accent-color)" : "var(--text-tertiary)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: task.completed ? "var(--accent-color)" : "transparent",
                    flexShrink: 0,
                    transition: "border-color 0.2s, background-color 0.2s"
                }}
            >
                {task.completed && <MdCheck size={14} color="#fff" />}
            </button>

            {/* Task Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px", overflow: "hidden" }}>
                {/* Title */}
                <span style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "var(--text-tertiary)" : "#fff",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                    {task.title}
                </span>

                {/* Metadata Row */}
                {metaRow.length > 0 && (
                    <div style={{
                        display: "flex",
                        gap: "6px",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        overflow: "hidden"
                    }}>
                        {metaRow}
                    </div>
                )}
            </div>

            {/* Right side actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "8px", flexShrink: 0 }}>
                {/* Delete - hover only */}
                {(isHovered || isSelected) && (
                    <button
                        title="Delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                        }}
                        style={{
                            padding: "4px",
                            color: "var(--text-tertiary)",
                            display: "flex",
                            alignItems: "center",
                            opacity: 0.7,
                        }}
                    >
                        <MdDeleteOutline size={18} />
                    </button>
                )}

                {/* Star */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskImportance(task.id);
                    }}
                    style={{ padding: "4px", color: "var(--text-tertiary)", display: "flex", alignItems: "center" }}
                >
                    {task.important
                        ? <MdStar size={20} color="#5b8af0" />
                        : <MdStarBorder size={20} color="var(--text-tertiary)" />
                    }
                </button>
            </div>
        </div>
    );
}

export default TaskItem;
