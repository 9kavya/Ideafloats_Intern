import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown, MdPersonAdd, MdSettings, MdSync } from "react-icons/md";
import "../styles/ProfileMenu.css";

export default function ProfileMenu({ userName, userEmail, onManageAccounts }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManageAccounts = () => {
    setIsOpen(false);
    onManageAccounts();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Account options"
      >
        <div className="profile-avatar">
          {getUserInitials(userName)}
        </div>
        <div className="profile-info">
          <div className="profile-name">{userName || "User"}</div>
          <div className="profile-email">{userEmail}</div>
        </div>
        <MdKeyboardArrowDown
          size={20}
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <button
            className="profile-menu-item"
            onClick={handleManageAccounts}
          >
            <MdPersonAdd size={20} />
            <span>Manage accounts</span>
          </button>

          <button className="profile-menu-item">
            <MdSettings size={20} />
            <span>Settings</span>
          </button>

          <button className="profile-menu-item">
            <MdSync size={20} />
            <span>Sync</span>
          </button>
        </div>
      )}
    </div>
  );
}
