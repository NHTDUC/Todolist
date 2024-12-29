import React from "react";
import "../styles/ModeSwitch.css";

const ModeSwitch = ({ isDragMode, setIsDragMode }) => {
  return (
    <div className="mode-switch">
      <button
        onClick={() => setIsDragMode(true)}
        className={isDragMode ? "active" : ""}
      >
        Drag Mode
      </button>
      <button
        onClick={() => setIsDragMode(false)}
        className={!isDragMode ? "active" : ""}
      >
        Sort Mode
      </button>
    </div>
  );
};

export default ModeSwitch;
