import { useState, useEffect } from "react";
// import "../styles/sliderSwitch.css";

const ToggleSwitch = ({ 
  id, 
  label, 
  defaultChecked = false, 
  onToggle 
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Handle Toggle
  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onToggle) onToggle(newState);
  };

  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <div className="switch-container">
      <label className="switch">
        <input 
          type="checkbox" 
          id={id} 
          checked={isChecked} 
          onChange={handleToggle} 
        />
        <span className="slider"></span>
      </label>
      {label && <span className="switch-label"> {label}</span>}
    </div>
  );
};

export default ToggleSwitch;
