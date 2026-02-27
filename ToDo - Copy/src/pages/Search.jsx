import { useTasks } from "../context/TaskContext";
import { useSearchParams } from "react-router-dom";
import { MdStarBorder, MdStar } from "react-icons/md";
import { useState } from "react";

// Highlight matching text
function Highlight({ text = "", query = "" }) {
    if (!query.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} style={{ background: "transparent", color: "var(--accent-color)", fontWeight: 700 }}>{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </span>
    );
}

function SearchResultItem({ task, query, lists, onToggleImportance, onToggleCompletion }) {
    const listObj = lists.find(l => l.id === task.listId);
    const listName = listObj?.name || "Tasks";
    const listIcon = listObj?.icon || null;
    const completedSteps = task.steps?.filter(s => s.completed).length || 0;
    const totalSteps = task.steps?.length || 0;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: "1px solid var(--border-color)",
                gap: "14px",
                cursor: "pointer",
                transition: "background 0.12s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
            {/* Completion circle */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleCompletion(task.id); }}
                style={{
                    width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${task.completed ? "var(--accent-color)" : "var(--text-tertiary)"}`,
                    background: task.completed ? "var(--accent-color)" : "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
            >
                {task.completed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {/* Task details */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: "14px",
                    color: task.completed ? "var(--text-tertiary)" : "var(--text-primary)",
                    textDecoration: task.completed ? "line-through" : "none",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                    <Highlight text={task.title} query={query} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px", fontSize: "12px", color: "var(--text-tertiary)", flexWrap: "wrap" }}>
                    <span>{listIcon || "📋"} {listName}</span>
                    {totalSteps > 0 && (
                        <span style={{ opacity: 0.7 }}>· {completedSteps} of {totalSteps}</span>
                    )}
                    {task.note && (
                        <span style={{ opacity: 0.7 }}>· 📝</span>
                    )}
                    {task.dueDate && (
                        <span style={{ opacity: 0.7 }}>
                            · 📅 {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                    )}
                </div>
            </div>

            {/* Star */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleImportance(task.id); }}
                style={{ color: task.important ? "#f87171" : "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", display: "flex", flexShrink: 0 }}
            >
                {task.important ? <MdStar size={20} /> : <MdStarBorder size={20} />}
            </button>
        </div>
    );
}

function Search() {
    const { tasks, lists, toggleTaskCompletion, toggleTaskImportance } = useTasks();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const lowerQ = query.toLowerCase().trim();

    const results = lowerQ
        ? tasks.filter(t =>
            t.title?.toLowerCase().includes(lowerQ) ||
            t.note?.toLowerCase().includes(lowerQ) ||
            t.steps?.some(s => s.title?.toLowerCase().includes(lowerQ))
        )
        : [];

    return (
        <div className="page" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <header style={{ padding: "20px 20px 8px 20px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {query ? `${results.length} RESULTS` : "Search"}
                </h2>
            </header>

            <div style={{ flex: 1, overflowY: "auto" }}>
                {!query && (
                    <div style={{ padding: "48px 20px", color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center" }}>
                        Type in the search bar to find your tasks.
                    </div>
                )}

                {query && results.length === 0 && (
                    <div style={{ padding: "48px 20px", color: "var(--text-tertiary)", fontSize: "14px", textAlign: "center" }}>
                        No tasks match "<strong style={{ color: "var(--text-secondary)" }}>{query}</strong>"
                    </div>
                )}

                {results.map(task => (
                    <SearchResultItem
                        key={task.id}
                        task={task}
                        query={query}
                        lists={lists}
                        onToggleCompletion={toggleTaskCompletion}
                        onToggleImportance={toggleTaskImportance}
                    />
                ))}
            </div>
        </div>
    );
}

export default Search;
