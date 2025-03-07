import { useContext, useState } from "react";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import "../assets/icons/font/bootstrap-icons.json"

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.email}`; // Placeholder avatar
    // console.log(user);

    const shortName = (email)=>{
        const pre = email.split("@")[0];
        return pre.length>15? pre.slice(12).padEnd(15,"."): pre;
    }

  return (
    <header className="header">
      {/* <div className="logo">My App</div> */}
      {user && (
        <div className="header-right">
          <div className="dropdown">
            <img
              src={defaultAvatar} // Always show this avatar
              alt="User Avatar"
              className="avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <a onClick={() => navigate("/auth/me")} id="username"><i className="bi bi-person"></i><span id="nick"> {shortName(user.email)} </span></a>
                <a onClick={() => navigate("/settings")}><i className="bi bi-gear"></i> Settings</a>
                <a onClick={logout}><i className="bi bi-box-arrow-right"></i> Logout</a>
              </div>
            )}
          </div>
        </div>
       )} 
    </header>
  );
};

export default Header;
