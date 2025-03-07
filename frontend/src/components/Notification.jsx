import { useEffect, useState } from "react";
import "../styles/notification.css";

const Notification = ({ message, type, onClose, duration=3000 }) => {

    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setProgress(0);
        const timer = setTimeout(() => {
        onClose();
        }, duration); // Auto-dismiss after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose, duration]);

  return (
    <div className={`notification ${type}`}>
        {message}
        <div className="progress-bar" style={{ width: `${progress}%`, transition: `width ${duration}ms linear` }}></div>
    </div>
    );
};

export default Notification;
