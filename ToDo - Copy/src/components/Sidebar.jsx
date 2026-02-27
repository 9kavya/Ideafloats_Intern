import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import AccountMenu from "./AccountMenu";
import ListMenu from "./ListMenu";
import {
    MdOutlineWbSunny,
    MdStarBorder,
    MdOutlineCalendarToday,
    MdPersonOutline,
    MdOutlineFlag,
    MdOutlineHome,
    MdList,
    MdAdd,
    MdMenu,
    MdSearch,
    MdClose,
    MdOutlineCreateNewFolder,
    MdMoreHoriz,
    MdExpandMore,
    MdCropSquare
} from "react-icons/md";
import "../styles/Tasks.css";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
    const { lists, createList, isSidebarOpen, setIsSidebarOpen, tasks, groups, createGroup } = useTasks();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [newListTitle, setNewListTitle] = useState("");
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [activeMenuListId, setActiveMenuListId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [pendingGroupId, setPendingGroupId] = useState(null);

    useEffect(() => {
        if (!location.pathname.startsWith("/search")) setSearchQuery("");
    }, [location.pathname]);

    const handleAddList = (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) { setIsCreatingList(false); return; }
        createList(newListTitle);
        setNewListTitle("");
        setIsCreatingList(false);
    };

    const handleCreateGroup = () => {
        const newGroup = createGroup("Untitled group");
        setPendingGroupId(newGroup.id);
    };

    const navItems = [
        { to: "/my-day", label: "My Day", icon: <MdOutlineWbSunny />, count: tasks.filter(t => t.addedToMyDay && !t.completed).length, color: "var(--text-secondary)" },
        { to: "/important", label: "Important", icon: <MdStarBorder />, count: tasks.filter(t => t.important && !t.completed).length, color: "#f87171" },
        { to: "/planned", label: "Planned", icon: <MdOutlineCalendarToday />, count: tasks.filter(t => t.dueDate && !t.completed).length, color: "#22d3ee" },
        { to: "/assigned", label: "Assigned to me", icon: <MdPersonOutline />, count: 0, color: "#86efac" },
        { to: "/flagged", label: "Flagged email", icon: <MdOutlineFlag />, count: 0, color: "#fca5a5" },
        { to: "/tasks", label: "Tasks", icon: <MdOutlineHome />, count: tasks.filter(t => t.listId === "default" && !t.completed).length, color: "#60a5fa" },
    ];

    const ungroupedLists = lists.filter(l => l.id !== "default" && !l.groupId);

    if (!isSidebarOpen) {
        return (
            <div style={{ position: "absolute", top: 16, left: 16, zIndex: 100 }}>
                <button onClick={() => setIsSidebarOpen(true)}><MdMenu size={24} color="var(--text-primary)" /></button>
            </div>
        );
    }

    return (
        <>
            <aside
                className="sidebar"
                style={{
                    width: "var(--sidebar-width)",
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    flexShrink: 0,
                    userSelect: "none",
                }}
            >
                {/* Profile */}
                <div style={{ padding: "12px 16px" }}>
                    <ProfileMenu
                        userName={currentUser?.name}
                        userEmail={currentUser?.email}
                        onManageAccounts={() => setShowAccountMenu(true)}
                    />
                </div>

                {/* Search */}
                <div style={{ padding: "0 16px 12px 16px" }}>
                    <div style={{
                        display: "flex", alignItems: "center",
                        background: "var(--bg-input)", borderRadius: "4px", padding: "4px 8px",
                        border: searchQuery ? "1px solid var(--accent-color)" : "1px solid transparent",
                        transition: "border 0.15s",
                    }}>
                        <MdSearch color="var(--accent-color)" size={20} />
                        <input
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => {
                                const q = e.target.value;
                                setSearchQuery(q);
                                if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
                                else navigate("/my-day");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") { setSearchQuery(""); navigate("/my-day"); }
                            }}
                            style={{
                                background: "transparent", border: "none", color: "var(--text-primary)",
                                fontSize: "13px", width: "100%", padding: "4px 8px", outline: "none",
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(""); navigate("/my-day"); }}
                                style={{ color: "var(--text-tertiary)", display: "flex", padding: "2px", background: "none", border: "none", cursor: "pointer" }}
                            >
                                <MdClose size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
                    {navItems.map((item) => (
                        <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} count={item.count} color={item.color} />
                    ))}

                    <div style={{ height: "1px", background: "var(--border-color)", margin: "8px 16px" }} />

                    {/* Ungrouped custom lists */}
                    {ungroupedLists.map((list) => (
                        <DraggableNavItem
                            key={list.id}
                            list={list}
                            tasks={tasks}
                            isMenuOpen={activeMenuListId === list.id}
                            onToggleMenu={() => setActiveMenuListId(activeMenuListId === list.id ? null : list.id)}
                            onCloseMenu={() => setActiveMenuListId(null)}
                        />
                    ))}

                    {/* Groups */}
                    {groups.map((group) => (
                        <GroupItem
                            key={group.id}
                            group={group}
                            isNew={pendingGroupId === group.id}
                            onNewCommitted={() => setPendingGroupId(null)}
                            tasks={tasks}
                            lists={lists}
                            activeMenuListId={activeMenuListId}
                            setActiveMenuListId={setActiveMenuListId}
                        />
                    ))}

                    {/* New list input */}
                    {isCreatingList && (
                        <form onSubmit={handleAddList} style={{ padding: "8px 8px" }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="List name"
                                value={newListTitle}
                                onChange={(e) => setNewListTitle(e.target.value)}
                                onBlur={() => !newListTitle && setIsCreatingList(false)}
                                style={{
                                    background: "var(--bg-input)",
                                    border: "1px solid var(--accent-color)",
                                    color: "var(--text-primary)",
                                    width: "100%", padding: "6px 8px", borderRadius: "4px",
                                }}
                            />
                        </form>
                    )}
                </nav>

                {/* Footer */}
                <div style={{
                    padding: "16px",
                    borderTop: "1px solid var(--border-color)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    minHeight: "56px", flexShrink: 0
                }}>
                    <button
                        onClick={() => setIsCreatingList(true)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-primary)", fontSize: "15px", background: "transparent", border: "none", cursor: "pointer", padding: "8px", borderRadius: "4px" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                            <path d="M12 4v16M4 12h16" />
                        </svg>
                        <span style={{ fontWeight: 400 }}>New list</span>
                    </button>

                    <div className="group-btn-wrapper">
                        <button
                            onClick={handleCreateGroup}
                            style={{ color: "var(--text-primary)", display: "flex", padding: "8px", borderRadius: "4px", background: "transparent", border: "none", cursor: "pointer" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 4H6C4.895 4 4 4.895 4 6v12c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2v-7" />
                                <path d="M9 4v16M20 3v6M17 6h6" />
                            </svg>
                        </button>
                        <div className="group-btn-tooltip">Create a new group</div>
                    </div>
                </div>
            </aside>

            <AccountMenu isOpen={showAccountMenu} onClose={() => setShowAccountMenu(false)} />
        </>
    );
}

// ─── NavItem (built-in, non-draggable) ───────────────────────────────────────
function NavItem({ to, icon, label, count, color }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => isActive ? "nav-item active sidebar-nav-item" : "nav-item sidebar-nav-item"}
            style={({ isActive }) => ({
                display: "flex", alignItems: "center", padding: "8px 12px",
                borderRadius: "4px", textDecoration: "none", color: "var(--text-primary)",
                backgroundColor: isActive ? "var(--bg-selected)" : "transparent",
                fontSize: "14px", marginBottom: "2px",
            })}
        >
            <span style={{ marginRight: "16px", display: "flex", fontSize: "20px", color: color || "var(--text-tertiary)" }}>{icon}</span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
            {count > 0 && <span style={{ fontSize: "12px", color: "var(--text-tertiary)", marginLeft: "8px" }}>{count}</span>}
        </NavLink>
    );
}

// ─── DraggableNavItem (custom lists outside groups) ───────────────────────────
function DraggableNavItem({ list, tasks, isMenuOpen, onToggleMenu, onCloseMenu }) {
    const navigate = useNavigate();
    const { deleteList } = useTasks();
    const menuRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const count = tasks.filter(t => t.listId === list.id && !t.completed).length;

    const handleDelete = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (window.confirm(`Delete "${list.name}"?`)) {
            deleteList(list.id);
            if (onCloseMenu) onCloseMenu();
            navigate("/");
        }
    };

    useEffect(() => {
        if (!isMenuOpen) return;
        const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target) && onCloseMenu) onCloseMenu(); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isMenuOpen, onCloseMenu]);

    return (
        <div
            ref={menuRef}
            style={{ position: "relative" }}
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("listId", list.id); e.dataTransfer.effectAllowed = "move"; }}
        >
            <NavLink
                to={`/list/${list.id}`}
                onContextMenu={(e) => { e.preventDefault(); setMenuPosition({ x: e.clientX, y: e.clientY }); if (!isMenuOpen && onToggleMenu) onToggleMenu(); }}
                className={({ isActive }) => isActive ? "nav-item active sidebar-nav-item" : "nav-item sidebar-nav-item"}
                style={({ isActive }) => ({
                    display: "flex", alignItems: "center", padding: "8px 12px",
                    borderRadius: "4px", textDecoration: "none", color: "var(--text-primary)",
                    backgroundColor: isActive ? "var(--bg-selected)" : "transparent",
                    fontSize: "14px", marginBottom: "2px", cursor: "grab",
                })}
            >
                <span style={{ marginRight: "16px", display: "flex", fontSize: "20px", color: "var(--text-tertiary)" }}>
                    {list.icon ? <span style={{ fontSize: "16px" }}>{list.icon}</span> : <MdList />}
                </span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{list.name}</span>
                <button
                    className="sidebar-list-menu-btn"
                    style={{ padding: "4px", borderRadius: "4px", opacity: isMenuOpen ? 1 : "" }}
                    onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPosition({ x: rect.left - 200, y: rect.bottom + 8 });
                        if (onToggleMenu) onToggleMenu();
                    }}
                >
                    <MdMoreHoriz size={18} />
                </button>
                {count > 0 && <span style={{ fontSize: "12px", color: "var(--text-tertiary)", marginLeft: "8px" }}>{count}</span>}
            </NavLink>
            {isMenuOpen && (
                <div style={{ position: "fixed", top: Math.min(menuPosition.y, window.innerHeight - 320), left: Math.min(menuPosition.x, window.innerWidth - 260), zIndex: 4000 }}>
                    <ListMenu onClose={onCloseMenu} onDelete={handleDelete} />
                </div>
            )}
        </div>
    );
}

// ─── GroupItem ────────────────────────────────────────────────────────────────
function GroupItem({ group, isNew, onNewCommitted, tasks, lists, activeMenuListId, setActiveMenuListId }) {
    const { deleteGroup, renameGroup, setLists } = useTasks();
    const [collapsed, setCollapsed] = useState(false);
    const [groupName, setGroupName] = useState(group.name);
    const [isEditing, setIsEditing] = useState(!!isNew);
    const inputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const dragCounter = useRef(0);

    useEffect(() => { setGroupName(group.name); }, [group.name]);

    // Auto-focus + select when new group is created
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const commitRename = () => {
        const trimmed = groupName.trim();
        renameGroup(group.id, trimmed || "Untitled group");
        if (!trimmed) setGroupName("Untitled group");
        setIsEditing(false);
        if (onNewCommitted) onNewCommitted();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); commitRename(); }
        if (e.key === "Escape") { setGroupName(group.name); setIsEditing(false); if (onNewCommitted) onNewCommitted(); }
    };

    // Drag counter avoids flicker when hovering over child elements
    const onDragEnter = (e) => { e.preventDefault(); dragCounter.current++; setIsDragOver(true); };
    const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
    const onDragLeave = () => { dragCounter.current--; if (dragCounter.current === 0) setIsDragOver(false); };
    const onDrop = (e) => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragOver(false);
        const listId = e.dataTransfer.getData("listId");
        if (!listId) return;
        setLists(prev => (Array.isArray(prev) ? prev : []).map(l => l.id === listId ? { ...l, groupId: group.id } : l));
        setCollapsed(false);
    };

    const groupLists = lists.filter(l => l.groupId === group.id);

    return (
        <div
            style={{ margin: "4px 0" }}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            {/* ── Header ── */}
            <div
                style={{
                    display: "flex", alignItems: "center",
                    padding: "8px 10px", gap: "8px",
                    borderRadius: "6px",
                    background: isDragOver ? "var(--bg-hover)" : "transparent",
                    border: isEditing ? "1px solid var(--accent-color)" : "1px solid transparent",
                    transition: "background 0.15s, border 0.15s",
                    cursor: "pointer",
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (window.confirm(`Delete group "${group.name}"?`)) deleteGroup(group.id);
                }}
            >
                {/* Square icon*/}
                <span style={{ display: "flex", color: "var(--text-tertiary)", flexShrink: 0, fontSize: "18px" }}>
                    <MdCropSquare />
                </span>

                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            flex: 1, background: "transparent", border: "none",
                            outline: "none", color: "var(--text-primary)", fontSize: "14px", minWidth: 0,
                        }}
                    />
                ) : (
                    <span
                        style={{ flex: 1, fontSize: "14px", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", userSelect: "none" }}
                        onClick={() => setCollapsed(!collapsed)}
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {group.name}
                    </span>
                )}

                {/* Chevron ∧ / ∨ */}
                <span
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: "flex", alignItems: "center",
                        color: "var(--text-tertiary)", fontSize: "20px", flexShrink: 0,
                        transition: "transform 0.2s ease",
                        transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                        userSelect: "none",
                    }}
                >
                    <MdExpandMore />
                </span>
            </div>

            {/* ── Body (expanded) ── */}
            {!collapsed && (
                <div style={{ paddingLeft: "8px" }}>
                    {/* Lists inside group */}
                    {groupLists.map((list) => (
                        <div key={list.id} onDragStart={(e) => e.stopPropagation()}>
                            <DraggableNavItem
                                list={list}
                                tasks={tasks}
                                isMenuOpen={activeMenuListId === list.id}
                                onToggleMenu={() => setActiveMenuListId(activeMenuListId === list.id ? null : list.id)}
                                onCloseMenu={() => setActiveMenuListId(null)}
                            />
                        </div>
                    ))}

                    {/* Drop zone — always present; shows hint text when empty */}
                    <div
                        style={{
                            display: "flex", alignItems: "center",
                            padding: "8px 12px", margin: "2px 0 4px 0", borderRadius: "4px",
                            borderLeft: isDragOver
                                ? "3px solid var(--accent-color, #6366f1)"
                                : "3px solid rgba(255,255,255,0.15)",
                            background: isDragOver ? "rgba(99,102,241,0.08)" : "transparent",
                            color: "var(--text-tertiary)", fontSize: "13px",
                            transition: "border-color 0.15s, background 0.15s",
                            userSelect: "none", minHeight: "32px",
                        }}
                    >
                        {groupLists.length === 0 ? "Drag here to add lists" : ""}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
