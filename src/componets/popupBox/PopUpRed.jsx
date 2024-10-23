import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { RiInformation2Line } from "react-icons/ri";
import './Popup.css';

const PopUp = ({ message, onClose, type }) => {
  const [active, setActive] = useState(!!message);

  useEffect(() => {
    if (message) {
      setActive(true);

      const timer = setTimeout(() => {
        setActive(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const handleClose = () => {
    setActive(false);
    onClose();
  };

  const popupClass = type === 'red' ? 'toast-red' : 'toast-green';

  return (
    <div className={`toast ${popupClass} ${active ? 'active' : ''}`}>
      <div className="toast-content fadeIn">
        <RiInformation2Line className='text-white text-2xl' />
        <div className="message">
          <span className="message-text text-1">{message}</span>
        </div>
      </div>
      <i className="uil uil-multiply toast-close text-dark flex" onClick={handleClose}>
        <IoClose />
      </i>
      <div className="progress"></div>
    </div>
  );
};

export default PopUp;
