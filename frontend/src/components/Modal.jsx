import React, { useState } from 'react';
import '../styles/modal.css';

const Modal = ({ isOpen, onClose, onSave, onDelete, event, setEvent, children }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  if (!isOpen) return null; // Don't render if modal is closed

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose(); // Close modal when clicking outside
    }
  };

  const handleDelete = () => {
    console.log(children);
    
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(); // Call the delete function
    setShowConfirm(false);
    onClose();  // Close the modal after deletion
  };
  
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
      <div className='top-buttons'>
        <a className="close-btn" onClick={onClose}><i className='bi bi-x-lg'></i></a>
      </div>
        {children}
        <div className="modal-buttons">
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <p>Are you sure you want to delete this event?</p>
            <button onClick={confirmDelete} className="confirm-btn">Yes, Delete</button>
            <button onClick={() => setShowConfirm(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
