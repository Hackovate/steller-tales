import React from 'react';

const AlienMascot = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="alien animate-float hover:scale-110 transition-all duration-300 cursor-pointer">
        <div className="alien-body animate-pulse"></div>
        <div className="alien-head">
          <div className="alien-eye alien-eye-left animate-ping"></div>
          <div className="alien-eye alien-eye-right animate-ping delay-150"></div>
          <div className="alien-mouth animate-pulse"></div>
        </div>
        <div className="alien-antenna alien-antenna-left animate-wiggle">
          <div className="antenna-tip animate-spin-slow"></div>
        </div>
        <div className="alien-antenna alien-antenna-right animate-wiggle delay-300">
          <div className="antenna-tip animate-spin-slow delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AlienMascot;