import {
    MdSort,
    MdPrint,
    MdMailOutline,
    MdPushPin,
    MdDeleteOutline,
    MdDriveFileRenameOutline
} from "react-icons/md";
import "../styles/Tasks.css";

function ListMenu({ onClose, onDelete }) {
    return (
        <div className="list-menu-popover" onClick={(e) => e.stopPropagation()} style={{ position: "absolute", zIndex: 3000 }}>
            <div className="list-menu-item">
                <div className="icon"><MdDriveFileRenameOutline size={20} /></div>
                <div className="label">Rename list</div>
            </div>
            <div className="list-menu-item">
                <div className="icon"><MdSort size={20} /></div>
                <div className="label">Sort by</div>
                <div style={{ color: "var(--text-tertiary)" }}>{">"}</div>
            </div>

            <div className="list-menu-divider"></div>

            <div className="list-menu-item">
                <div className="icon"><MdPrint size={20} /></div>
                <div className="label">Print list</div>
            </div>
            <div className="list-menu-item">
                <div className="icon"><MdMailOutline size={20} /></div>
                <div className="label">Email list</div>
            </div>
            <div className="list-menu-item">
                <div className="icon"><MdPushPin size={20} /></div>
                <div className="label">Pin to Start</div>
            </div>

            <div className="list-menu-divider"></div>

            <div className="list-menu-item danger" onClick={onDelete}>
                <div className="icon"><MdDeleteOutline size={20} /></div>
                <div className="label">Delete list</div>
            </div>
        </div>
    );
}

export default ListMenu;
