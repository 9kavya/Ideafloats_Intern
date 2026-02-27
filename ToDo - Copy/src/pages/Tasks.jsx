import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import TaskList from "../components/TaskList";
import ListMenu from "../components/ListMenu";
import {
    MdList,
    MdMoreHoriz,
    MdPersonAdd,
    MdChromeReaderMode
} from "react-icons/md";
import "../styles/Tasks.css";

function Tasks() {
    const { listId } = useParams();
    const { tasks, lists, deleteList } = useTasks();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const currentListId = listId || "default";
    const currentList = lists.find(l => l.id === currentListId);

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isRightClick, setIsRightClick] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
                setIsRightClick(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    if (!currentList && listId) return <div>List not found</div>;
    if (!currentList) return null;

    const filteredTasks = tasks.filter(t => t.listId === currentListId);

    const handleDeleteList = () => {
        if (window.confirm(`Are you sure you want to delete "${currentList.name}"?`)) {
            deleteList(currentListId);
            navigate("/");
        }
    };

    return (
        <div className="page page-tasks">
            <header
                className="list-header"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setMenuPosition({ x: e.clientX, y: e.clientY });
                    setIsRightClick(true);
                    setShowMenu(true);
                }}
            >
                <div>
                    <h1 className="list-title">
                        <span style={{ color: "var(--accent-color)" }}><MdList /></span>
                        {currentList.name}
                    </h1>
                    <p className="list-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <button className="list-menu-btn"><MdPersonAdd size={20} /></button>
                    <button className="list-menu-btn"><MdChromeReaderMode size={20} /></button>
                    <div className="list-menu-container" ref={menuRef}>
                        <button
                            className="list-menu-btn"
                            onClick={(e) => {
                                setIsRightClick(false);
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPosition({ x: rect.left - 200, y: rect.bottom + 8 });
                                setShowMenu(!showMenu);
                            }}
                        >
                            <MdMoreHoriz size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {showMenu && (
                <div style={{
                    position: "fixed",
                    top: Math.min(menuPosition.y, window.innerHeight - 320),
                    left: Math.max(20, Math.min(menuPosition.x, window.innerWidth - 260)),
                    zIndex: 4000
                }}>
                    <ListMenu onClose={() => { setShowMenu(false); setIsRightClick(false); }} onDelete={handleDeleteList} />
                </div>
            )}

            <TaskList tasks={filteredTasks} listId={currentListId} />
        </div>
    );
}

export default Tasks;
