import { useState, useContext } from "react";
import { loginUser, registerUser } from "../api.js";
import { AuthContext } from "../authContext.jsx";
import "../styles/auth.css";
import Notification from "../components/Notification.jsx";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout } = useContext(AuthContext);
  const [shake, setShake] = useState(false); // Shake effect state
  const [notification, setNotification] = useState(null); //Notification state
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        if(data.token) {
          login(data.token);
          // showNotification("Login successful!", "success")
        }
        else{
          showNotification(data.error, "error");
          triggerShake();
        }
      } else {
        const data = await registerUser(email, password);
        // alert("Registration successful! You can now log in.");
        // onsole.log(data);
        
        if (data.error) {
            showNotification(data.error, "error");
            triggerShake(); // Shake effect for registration errors
        }else{
          showNotification("Registration successful! You can now log in.", "success");
        }
        
      }
    } catch (error) {
      // alert("Error: " + error.message);
      showNotification(error.message, "error");
      triggerShake();
    }
  };

  const shortText = (text)=>{
    const pre = text.split("@")[0];
    return pre.length>15? pre.slice(0, 12).padEnd(15,"."): pre;
  }

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerShake = ()=>{
    setShake(true); // Trigger shake effect on error
    setTimeout(() => setShake(false), 500); // Remove shake effect after 0.5s
  }

  return (
    <div className="login-reg-container">
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      {user? ( // Show profile if user is logged in
        <div className="profile-container">
          <h2>Welcome, {user.email.split("@")[0]}</h2>
          <p><strong>User ID:</strong> <span title={user.id}>{shortText(user.id)}</span></p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
        ) : ( // Otherwise, show login/register form
        <>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <form onSubmit={handleSubmit} className={shake? "shake": ""}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>
          <button className="switch_auth" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </button>
        </>
      )}
    </div>
  );
};

export default Auth;
