import { useNavigate } from "react-router-dom";
import { MdAdd, MdSettings, MdSync, MdClose } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "../styles/AccountMenu.css";

export default function AccountMenu({ isOpen, onClose }) {
  const { currentUser, signedInAccounts, switchAccount, signoutAccount, signin } = useAuth();
  const navigate = useNavigate();
  const [switchingEmail, setSwitchingEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignOut = (e, email) => {
    e.stopPropagation();
    const isCurrent = email === currentUser?.email;
    signoutAccount(email);
    if (isCurrent) {
      onClose();
      navigate("/signin", { replace: true });
    }
  };

  const handleCloseModal = () => {
    onClose();
    setSwitchingEmail(null);
    setPassword("");
    setError("");
  };

  const handleAddAccountClick = () => {
    onClose();
    navigate("/signup?addAccount=true");
  };

  const handleAccountClick = (email) => {
    if (email === currentUser?.email) return;
    setSwitchingEmail(email);
    setPassword("");
    setError("");
  };

  const handleConfirmSwitch = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setIsVerifying(true);

    try {
      // Use existing signin logic to verify credentials
      await signin(switchingEmail, password);

      // If signin succeeds, switchAccount will complete the state change
      const switched = switchAccount(switchingEmail);
      if (switched) {
        onClose();
        navigate("/my-day", { replace: true });
      }
    } catch (err) {
      setError("Invalid password");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  // Filter and deduplicate accounts
  const accounts = (Array.isArray(signedInAccounts) ? signedInAccounts : [])
    .filter((a, i, self) => self.findIndex(s => s.email === a.email) === i);

  return (
    <>
      <div className="account-menu-backdrop" onClick={handleCloseModal} />

      <div className="account-modal">
        <div className="account-modal-header">
          <h2>Manage accounts</h2>
          <button className="close-btn" onClick={handleCloseModal}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="account-modal-content">
          <div className="accounts-list-container">
            {accounts.map((account) => {
              const isActive = account.email === currentUser?.email;
              const isSwitching = account.email === switchingEmail;

              return (
                <div key={account.email} className="account-item-wrapper">
                  <div
                    className={`account-item ${isActive ? "active" : ""}`}
                    onClick={() => handleAccountClick(account.email)}
                  >
                    <div className="account-avatar">
                      {account?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="account-info">
                      <div className="account-name">{account?.name}</div>
                      <div className="account-email">{account?.email}</div>
                    </div>
                    <button
                      className="signout-btn"
                      onClick={(e) => handleSignOut(e, account.email)}
                    >
                      Sign out
                    </button>
                  </div>

                  {isSwitching && (
                    <form className="password-prompt" onSubmit={handleConfirmSwitch} onClick={(e) => e.stopPropagation()}>
                      <p className="prompt-text">Enter password to switch account</p>
                      <div className="prompt-input-group">
                        <input
                          autoFocus
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={error ? "error" : ""}
                          disabled={isVerifying}
                        />
                        <div className="prompt-actions">
                          <button type="submit" className="confirm-btn" disabled={isVerifying || !password}>
                            {isVerifying ? "Verifying..." : "Confirm"}
                          </button>
                          <button type="button" className="prompt-cancel-btn" onClick={() => setSwitchingEmail(null)} disabled={isVerifying}>
                            Cancel
                          </button>
                        </div>
                      </div>
                      {error && <span className="error-text">{error}</span>}
                    </form>
                  )}
                </div>
              );
            })}
          </div>

          <button className="add-account-btn" onClick={handleAddAccountClick}>
            <MdAdd size={24} />
            <span>Add account</span>
          </button>
        </div>

        <div className="account-modal-footer">
          <button className="footer-btn">
            <MdSettings size={20} />
            <span>Settings</span>
          </button>
          <button className="footer-btn">
            <MdSync size={20} />
            <span>Sync</span>
          </button>
        </div>
      </div>
    </>
  );
}
