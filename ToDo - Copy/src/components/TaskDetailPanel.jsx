import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import { useTasks } from "../context/TaskContext";
import {
    MdClose,
    MdWbSunny,
    MdDeleteOutline,
    MdCheckBoxOutlineBlank,
    MdCheckBox,
    MdAdd,
    MdStarBorder,
    MdStar,
    MdAlarm,
    MdCalendarToday,
    MdEventRepeat,
    MdPersonOutline,
    MdAttachFile,
    MdKeyboardArrowRight,
    MdNextWeek,
    MdArrowDropDown,
    MdHistory,
    MdChevronLeft,
    MdChevronRight,
    MdArrowDropUp,
    MdApps,
    MdViewWeek,
    MdCalendarViewMonth,
    MdCalendarViewDay,
    MdAutoAwesome,
    MdMoreVert,
    MdOutlineRadioButtonUnchecked,
    MdCheckCircleOutline
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {
    format,
    isToday,
    isTomorrow,
    addDays,
    nextSunday,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths
} from "date-fns";
import "../styles/TaskDetailPanel.css";

function CustomCalendar({ selectedDate, onSave, onCancel }) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const [tempSelectedDate, setTempSelectedDate] = useState(selectedDate ? new Date(selectedDate) : null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    return (
        <div className="calendar-popover" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-header">
                <div className="calendar-title">{format(currentMonth, "MMMM, yyyy")}</div>
                <div className="calendar-nav">
                    <button className="calendar-nav-btn" onClick={handlePrevMonth}><MdArrowDropUp size={24} /></button>
                    <button className="calendar-nav-btn" onClick={handleNextMonth}><MdArrowDropDown size={24} /></button>
                </div>
            </div>

            <div className="calendar-grid">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                ))}
                {days.map(day => (
                    <div
                        key={day.toString()}
                        className={`calendar-day ${!isSameMonth(day, monthStart) ? "other-month" : ""} ${isToday(day) ? "today" : ""} ${tempSelectedDate && isSameDay(day, tempSelectedDate) ? "selected" : ""}`}
                        onClick={() => setTempSelectedDate(day)}
                    >
                        {format(day, "d")}
                    </div>
                ))}
            </div>

            <div className="calendar-footer">
                <button className="calendar-btn cancel" onClick={onCancel}>Cancel</button>
                <button className="calendar-btn save" onClick={() => onSave(tempSelectedDate)}>Save</button>
            </div>
        </div>
    );
}

function ReminderMenu({ onSelect }) {
    return (
        <div className="dropdown-popover" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-item" onClick={() => onSelect('today')}>
                <div className="icon"><MdHistory size={20} /></div>
                <div className="label">Later today</div>
                <div className="info">14:00</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('tomorrow')}>
                <div className="icon"><MdKeyboardArrowRight size={20} /></div>
                <div className="label">Tomorrow</div>
                <div className="info">Tue, 09:00</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('nextWeek')}>
                <div className="icon"><MdNextWeek size={20} /></div>
                <div className="label">Next week</div>
                <div className="info">Sun, 09:00</div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={() => onSelect('custom')}>
                <div className="icon"><MdCalendarToday size={18} /></div>
                <div className="label">Pick a date & time</div>
            </div>
        </div>
    );
}

function StepMenu({ step, onSelect }) {
    if (!step) return null;
    return (
        <div className="dropdown-popover" onClick={(e) => e.stopPropagation()} style={{ width: "200px" }}>
            <div className="dropdown-item" onClick={() => onSelect('toggle')}>
                <div className="icon"><MdCheckCircleOutline size={18} /></div>
                <div className="label">Mark as {step.completed ? "uncompleted" : "completed"}</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('promote')}>
                <div className="icon"><MdAdd size={18} /></div>
                <div className="label">Promote to task</div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={() => onSelect('delete')}>
                <div className="icon" style={{ color: "#ff5f5f" }}><MdDeleteOutline size={18} /></div>
                <div className="label" style={{ color: "#ff5f5f" }}>Delete step</div>
            </div>
        </div>
    );
}

function DueDateMenu({ onSelect }) {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const nextWk = nextSunday(today);

    return (
        <div className="dropdown-popover due-date-popover" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-item" onClick={() => onSelect('today')}>
                <div className="icon"><MdCalendarToday size={18} /></div>
                <div className="label">Today</div>
                <div className="info">{format(today, 'EEE')}</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('tomorrow')}>
                <div className="icon"><MdNextWeek size={18} /></div>
                <div className="label">Tomorrow</div>
                <div className="info">{format(tomorrow, 'EEE')}</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('nextWeek')}>
                <div className="icon"><MdEventRepeat size={18} /></div>
                <div className="label">Next week</div>
                <div className="info">{format(nextWk, 'EEE')}</div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={() => onSelect('pickDate')}>
                <div className="icon"><MdCalendarToday size={18} /></div>
                <div className="label">Pick a date</div>
            </div>
        </div>
    );
}

function RepeatMenu({ onSelect }) {
    return (
        <div className="dropdown-popover" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-item" onClick={() => onSelect('daily')}>
                <div className="icon"><MdApps size={20} /></div>
                <div className="label">Daily</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('weekdays')}>
                <div className="icon"><MdCalendarViewMonth size={20} /></div>
                <div className="label">Weekdays</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('weekly')}>
                <div className="icon"><MdViewWeek size={18} /></div>
                <div className="label">Weekly</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('monthly')}>
                <div className="icon"><MdCalendarViewDay size={18} /></div>
                <div className="label">Monthly</div>
            </div>
            <div className="dropdown-item" onClick={() => onSelect('yearly')}>
                <div className="icon"><MdAutoAwesome size={18} /></div>
                <div className="label">Yearly</div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={() => onSelect('custom')}>
                <div className="icon"><MdEventRepeat size={20} /></div>
                <div className="label">Custom</div>
            </div>
        </div>
    );
}

function CustomRepeatDialog({ onSave, onCancel }) {
    const [count, setCount] = useState(1);
    const [frequency, setFrequency] = useState('days');

    return (
        <div className="custom-repeat-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-title">Repeat every ...</div>
            <div className="dialog-content">
                <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min="1"
                    className="repeat-number-input"
                />
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="repeat-frequency-select"
                >
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                    <option value="years">years</option>
                </select>
            </div>
            <div className="dialog-footer">
                <button className="dialog-btn cancel" onClick={onCancel}>Cancel</button>
                <button className="dialog-btn save" onClick={() => onSave(count, frequency)}>Save</button>
            </div>
        </div>
    );
}

function TaskDetailPanel() {
    const {
        tasks,
        selectedTaskId,
        setSelectedTaskId,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        toggleTaskImportance,
        toggleMyDay,
        addStep,
        toggleStepCompletion,
        promoteStep,
        deleteStep
    } = useTasks();

    const task = tasks.find(t => t.id === selectedTaskId);
    const [newStepTitle, setNewStepTitle] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState(null); // 'dueDate' or 'reminder'
    const [showDueDateMenu, setShowDueDateMenu] = useState(false);
    const [showRepeatMenu, setShowRepeatMenu] = useState(false);
    const [showCustomRepeat, setShowCustomRepeat] = useState(false);
    const [showReminderPicker, setShowReminderPicker] = useState(false);
    const [showStepMenu, setShowStepMenu] = useState(false);
    const [activeStepId, setActiveStepId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const panelRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleTitleChange = (e) => {
        updateTask(task.id, { title: e.target.value });
    };

    const handleNoteChange = (e) => {
        updateTask(task.id, { note: e.target.value });
    };

    const handleAddStep = (e) => {
        e.preventDefault();
        if (!newStepTitle.trim()) return;
        addStep(task.id, newStepTitle);
        setNewStepTitle("");
    };

    const formatDueDate = (dateStr) => {
        if (!dateStr) return "Add due date";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Add due date";
        if (isToday(date)) return "Due Today";
        if (isTomorrow(date)) return "Due Tomorrow";
        return `Due ${format(date, "EEE, MMM d")}`;
    };

    const handleCalendarSave = (date) => {
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            if (datePickerTarget === 'dueDate') {
                updateTask(task.id, { dueDate: formattedDate });
            } else if (datePickerTarget === 'reminder') {
                updateTask(task.id, { reminder: formattedDate });
            }
        }
        setShowDatePicker(false);
        setDatePickerTarget(null);
    };

    const handleStepMenuSelect = (option) => {
        setShowStepMenu(false);
        if (option === 'toggle') {
            toggleStepCompletion(task.id, activeStepId);
        } else if (option === 'promote') {
            promoteStep(task.id, activeStepId);
        } else if (option === 'delete') {
            deleteStep(task.id, activeStepId);
        }
        setActiveStepId(null);
    };

    const handleDueDateMenuSelect = (option) => {
        setShowDueDateMenu(false);
        let date = null;
        if (option === 'today') date = new Date();
        else if (option === 'tomorrow') date = addDays(new Date(), 1);
        else if (option === 'nextWeek') date = nextSunday(new Date());
        else if (option === 'pickDate') {
            setDatePickerTarget('dueDate');
            setShowDatePicker(true);
            return;
        }

        if (date) {
            updateTask(task.id, { dueDate: format(date, 'yyyy-MM-dd') });
        }
    };

    const handleRepeatSelect = (option) => {
        setShowRepeatMenu(false);
        if (option === 'custom') {
            setShowCustomRepeat(true);
            return;
        }

        let repeat = null;
        if (option === 'daily') repeat = 'Daily';
        else if (option === 'weekdays') repeat = 'Weekdays';
        else if (option === 'weekly') repeat = 'Weekly';
        else if (option === 'monthly') repeat = 'Monthly';
        else if (option === 'yearly') repeat = 'Yearly';

        if (repeat) {
            updateTask(task.id, { repeat });
        }
    };

    const handleCustomRepeatSave = (count, frequency) => {
        const repeatStr = `Every ${count} ${frequency}`;
        updateTask(task.id, { repeat: repeatStr });
        setShowCustomRepeat(false);
    };

    const formatReminder = (dateStr) => {
        if (!dateStr) return <span style={{ color: "var(--text-primary)" }}>Remind me</span>;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return <span style={{ color: "var(--text-primary)" }}>Remind me</span>;

        let timeStr = format(date, "HH:mm");

        let datePart = format(date, "MMM d");
        if (isToday(date)) datePart = "Today";
        if (isTomorrow(date)) datePart = "Tomorrow";

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ color: "var(--accent-color)", fontWeight: 500 }}>Remind me at {timeStr}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{datePart}</span>
            </div>
        );
    };

    const handleReminderSelect = (option) => {
        setShowReminderPicker(false);
        let date = new Date();

        if (option === 'today') {
            date.setHours(14, 0, 0, 0);
        } else if (option === 'tomorrow') {
            date = addDays(date, 1);
            date.setHours(9, 0, 0, 0);
        } else if (option === 'nextWeek') {
            date = nextSunday(date);
            date.setHours(9, 0, 0, 0);
        } else if (option === 'custom') {
            setDatePickerTarget('reminder');
            setShowDatePicker(true);
            return;
        }

        if (date) {
            updateTask(task.id, { reminder: date.toISOString() });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // In a real app, we'd upload these. Here we'll store names/metadata.
        const newFiles = files.map(f => ({
            id: uuidv4(),
            name: f.name,
            size: f.size,
            type: f.type,
            addedAt: new Date().toISOString()
        }));

        updateTask(task.id, {
            attachments: [...(task.attachments || []), ...newFiles]
        });

        // Clear input
        e.target.value = '';
    };

    const removeAttachment = (fileId) => {
        updateTask(task.id, {
            attachments: task.attachments.filter(f => f.id !== fileId)
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if clicking inside any active popover
            const isClickInsidePopover = event.target.closest('.dropdown-popover') ||
                event.target.closest('.calendar-popover') ||
                event.target.closest('.custom-repeat-dialog');

            if (isClickInsidePopover) return;

            // Otherwise check if clicking outside the triggers
            if (showReminderPicker && !event.target.closest('.reminder-picker-container')) setShowReminderPicker(false);
            if (showDueDateMenu && !event.target.closest('.due-date-menu-container')) setShowDueDateMenu(false);
            if (showRepeatMenu && !event.target.closest('.repeat-picker-container')) setShowRepeatMenu(false);
            if (showCustomRepeat) setShowCustomRepeat(false);
            if (showDatePicker) setShowDatePicker(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDatePicker, showDueDateMenu, showReminderPicker, showRepeatMenu, showCustomRepeat, showStepMenu]);

    if (!task) return null;

    return (
        <motion.div
            ref={panelRef}
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="task-detail-panel"
            style={{
                width: "var(--detail-panel-width)",
                background: "var(--bg-secondary)",
                borderLeft: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 100,
                boxShadow: "-4px 0 16px rgba(0,0,0,0.3)"
            }}
        >
            {/* Dismiss / Close Button */}
            <button
                title="Dismiss detail view"
                onClick={() => setSelectedTaskId(null)}
                style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 200,
                    padding: "8px",
                    color: "var(--text-tertiary)",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: "4px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
                <MdClose size={20} />
            </button>

            <div style={{ flex: 1, overflowY: "auto", padding: "48px 24px 24px 24px" }}>

                {/* Header Section */}
                <div style={{
                    display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px",
                    background: "var(--bg-input)", padding: "16px", borderRadius: "4px"
                }}>
                    <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        style={{ marginTop: "2px" }}
                    >
                        {task.completed
                            ? <MdCheckBox size={24} color="var(--accent-color)" />
                            : <MdCheckBoxOutlineBlank size={24} color="var(--text-tertiary)" />}
                    </button>

                    <div style={{ flex: 1 }}>
                        <input
                            value={task.title}
                            onChange={handleTitleChange}
                            style={{
                                fontSize: "1.1rem",
                                background: "transparent",
                                border: "none",
                                fontWeight: 500,
                                width: "100%",
                                padding: 0,
                                color: task.completed ? "var(--text-tertiary)" : "var(--text-primary)",
                                textDecoration: task.completed ? "line-through" : "none"
                            }}
                        />
                    </div>

                    <button onClick={() => toggleTaskImportance(task.id)}>
                        {task.important
                            ? <MdStar size={24} color="var(--accent-color)" />
                            : <MdStarBorder size={24} color="var(--text-tertiary)" />}
                    </button>
                </div>

                {/* Steps Section */}
                <div className="panel-section" style={{ marginBottom: "16px", background: "var(--bg-input)", borderRadius: "4px" }}>
                    {task.steps && task.steps.map(step => (
                        <div key={step.id} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
                            <button onClick={() => toggleStepCompletion(task.id, step.id)} style={{ color: step.completed ? "var(--accent-color)" : "var(--text-tertiary)", marginTop: "2px" }}>
                                {step.completed ? <MdCheckCircleOutline size={20} /> : <MdOutlineRadioButtonUnchecked size={20} />}
                            </button>
                            <span style={{
                                textDecoration: step.completed ? "line-through" : "none",
                                color: step.completed ? "var(--text-tertiary)" : "var(--text-primary)",
                                flex: 1,
                                fontSize: "0.95rem"
                            }}>
                                {step.title}
                            </span>
                            <button
                                className="step-menu-trigger"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setMenuPosition({ x: rect.right, y: rect.bottom });
                                    setActiveStepId(step.id);
                                    setShowStepMenu(true);
                                }}
                                style={{ color: "var(--text-tertiary)", padding: "4px", cursor: "pointer", background: "transparent", border: "none" }}
                            >
                                <MdMoreVert size={20} />
                            </button>
                        </div>
                    ))}

                    <form onSubmit={handleAddStep} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px" }}>
                        <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--accent-color)" }}>
                            <MdAdd size={20} />
                        </button>
                        <input
                            placeholder={task.steps && task.steps.length > 0 ? "Next step" : "Add step"}
                            value={newStepTitle}
                            onChange={e => setNewStepTitle(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                flex: 1,
                                color: "var(--text-primary)",
                                fontSize: "0.95rem",
                                outline: "none"
                            }}
                            className="placeholder-accent"
                        />
                    </form>
                </div>

                <div style={{ height: "1px", background: "var(--border-color)", marginBottom: "16px" }} />

                {/* My Day Toggle */}
                <div
                    style={{
                        display: "flex", alignItems: "center", gap: "16px",
                        padding: "16px",
                        borderRadius: "4px",
                        color: task.addedToMyDay ? "var(--accent-color)" : "var(--text-secondary)",
                        cursor: "pointer",
                        marginBottom: "8px"
                    }}
                    onClick={() => toggleMyDay(task.id)}
                    className="panel-action-btn"
                >
                    <MdWbSunny size={20} />
                    <span style={{ flex: 1, fontSize: "0.95rem" }}>
                        {task.addedToMyDay ? "Added to My Day" : "Add to My Day"}
                    </span>
                    {task.addedToMyDay && (
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMyDay(task.id); }}
                            style={{ color: "var(--text-tertiary)" }}
                        >
                            <MdClose size={18} />
                        </button>
                    )}
                </div>

                <div style={{ height: "1px", background: "var(--border-color)", marginBottom: "16px" }} />

                {/* Date/Reminder Group */}
                <div style={{ background: "var(--bg-input)", borderRadius: "4px", marginBottom: "16px" }}>
                    {/* Remind Me */}
                    <div
                        className="panel-row reminder-picker-container"
                        style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid var(--border-color)", cursor: "pointer" }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({ x: rect.left, y: rect.bottom });
                            setShowReminderPicker(!showReminderPicker);
                        }}
                    >
                        <MdAlarm size={20} color={task.reminder ? "var(--accent-color)" : "var(--text-tertiary)"} />
                        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                            {formatReminder(task.reminder)}
                        </div>
                        {task.reminder && (
                            <button
                                onClick={(e) => { e.stopPropagation(); updateTask(task.id, { reminder: null }) }}
                                className="clear-action-btn"
                            >
                                <MdClose size={20} color="var(--text-secondary)" />
                            </button>
                        )}
                    </div>

                    {/* Due Date */}
                    <div
                        className="panel-row due-date-menu-container"
                        style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid var(--border-color)", cursor: "pointer" }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({ x: rect.left, y: rect.bottom });
                            setShowDueDateMenu(!showDueDateMenu);
                        }}
                    >
                        <MdCalendarToday size={20} color={task.dueDate ? "var(--accent-color)" : "var(--text-tertiary)"} />
                        <span style={{ color: task.dueDate ? "var(--accent-color)" : "var(--text-primary)", flex: 1, fontSize: "0.95rem", fontWeight: task.dueDate ? 500 : 400 }}>
                            {formatDueDate(task.dueDate)}
                        </span>
                        {task.dueDate && (
                            <button
                                onClick={(e) => { e.stopPropagation(); updateTask(task.id, { dueDate: null }) }}
                                className="clear-action-btn"
                            >
                                <MdClose size={20} color="var(--text-secondary)" />
                            </button>
                        )}
                    </div>

                    {/* Repeat */}
                    <div
                        className="panel-row repeat-picker-container"
                        style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({ x: rect.left, y: rect.bottom });
                            setShowRepeatMenu(!showRepeatMenu);
                        }}
                    >
                        <MdEventRepeat size={20} color={task.repeat ? "var(--accent-color)" : "var(--text-tertiary)"} />
                        <span style={{ color: task.repeat ? "var(--accent-color)" : "var(--text-primary)", flex: 1, fontSize: "0.95rem", fontWeight: task.repeat ? 500 : 400 }}>
                            {task.repeat || "Repeat"}
                        </span>
                        {task.repeat && (
                            <button
                                onClick={(e) => { e.stopPropagation(); updateTask(task.id, { repeat: null }) }}
                                className="clear-action-btn"
                            >
                                <MdClose size={20} color="var(--text-secondary)" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Assign To & Add File Group */}
                <div style={{ background: "var(--bg-input)", borderRadius: "4px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderBottom: "1px solid var(--border-color)", color: "var(--text-primary)", cursor: "pointer" }}>
                        <MdPersonOutline size={22} color="var(--text-tertiary)" />
                        <span style={{ fontSize: "0.95rem" }}>Assign to</span>
                    </div>

                    <div
                        style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", color: "var(--text-primary)", cursor: "pointer" }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <MdAttachFile size={22} color="var(--text-tertiary)" style={{ transform: "rotate(45deg)" }} />
                        <span style={{ fontSize: "0.95rem" }}>Add file</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>
                </div>

                {/* Attachments List */}
                {task.attachments && task.attachments.length > 0 && (
                    <div className="attachments-list" style={{ marginBottom: "16px" }}>
                        {task.attachments.map(file => (
                            <div key={file.id} className="attachment-item" style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 16px",
                                background: "var(--bg-input)",
                                borderRadius: "4px",
                                marginBottom: "4px"
                            }}>
                                <MdAttachFile size={18} color="var(--text-tertiary)" style={{ transform: "rotate(45deg)" }} />
                                <span style={{ flex: 1, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {file.name}
                                </span>
                                <button onClick={() => removeAttachment(file.id)} className="clear-action-btn">
                                    <MdClose size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <textarea
                    placeholder="Add note"
                    value={task.note || ""}
                    onChange={handleNoteChange}
                    style={{
                        background: "var(--bg-input)",
                        border: "none",
                        resize: "none",
                        minHeight: "100px",
                        padding: "16px",
                        borderRadius: "4px",
                        fontFamily: "inherit",
                        width: "100%",
                        color: "var(--text-primary)",
                        fontSize: "0.95rem"
                    }}
                />
            </div>

            {/* Portals - Rendered using createPortal to avoid clipping and transformation issues */}
            {showReminderPicker && createPortal(
                <div style={{ position: "fixed", top: Math.min(menuPosition.y + 4, window.innerHeight - 300), left: Math.min(menuPosition.x, window.innerWidth - 300), zIndex: 9999 }}>
                    <ReminderMenu onSelect={handleReminderSelect} />
                </div>,
                document.body
            )}
            {showDueDateMenu && createPortal(
                <div style={{ position: "fixed", top: Math.min(menuPosition.y + 4, window.innerHeight - 300), left: Math.min(menuPosition.x, window.innerWidth - 300), zIndex: 9999 }}>
                    <DueDateMenu onSelect={handleDueDateMenuSelect} />
                </div>,
                document.body
            )}
            {showRepeatMenu && createPortal(
                <div style={{ position: "fixed", top: Math.min(menuPosition.y + 4, window.innerHeight - 300), left: Math.min(menuPosition.x, window.innerWidth - 300), zIndex: 9999 }}>
                    <RepeatMenu onSelect={handleRepeatSelect} />
                </div>,
                document.body
            )}
            {showCustomRepeat && createPortal(
                <div style={{ position: "fixed", top: Math.min(menuPosition.y + 4, window.innerHeight - 300), left: Math.min(menuPosition.x, window.innerWidth - 300), zIndex: 9999 }}>
                    <CustomRepeatDialog onSave={handleCustomRepeatSave} onCancel={() => setShowCustomRepeat(false)} />
                </div>,
                document.body
            )}
            {showDatePicker && createPortal(
                <div style={{ position: "fixed", top: Math.min(menuPosition.y, window.innerHeight - 380), left: menuPosition.x, zIndex: 9999 }}>
                    <CustomCalendar
                        selectedDate={datePickerTarget === 'reminder' ? task.reminder : task.dueDate}
                        onSave={handleCalendarSave}
                        onCancel={() => { setShowDatePicker(false); setDatePickerTarget(null); }}
                    />
                </div>,
                document.body
            )}
            {showStepMenu && activeStepId && createPortal(
                <div style={{ position: "fixed", top: Math.min(menuPosition.y, window.innerHeight - 200), left: Math.min(menuPosition.x - 200, window.innerWidth - 200), zIndex: 9999 }}>
                    <StepMenu step={task.steps.find(s => s.id === activeStepId)} onSelect={handleStepMenuSelect} />
                </div>,
                document.body
            )}

            {/* Footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-secondary)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                    Created {task.createdAt ? (isToday(new Date(task.createdAt)) ? "today" : `on ${format(new Date(task.createdAt), "EEE, MMM d")}`) : ""}
                </span>
                <button onClick={() => deleteTask(task.id)} style={{ color: "var(--text-tertiary)", padding: "4px" }} title="Delete task">
                    <MdDeleteOutline size={20} />
                </button>
            </div>

        </motion.div>
    );
}

export default TaskDetailPanel;
