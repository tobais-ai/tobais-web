import React from 'react';

export function Logo({ className = "", width = 40, height = 40 }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2"/>
      <path d="M17.5 14.5C17.5 14.5 20 12 24 14.5C28 17 26.5 22 24 23.5C21.5 25 18 25 15.5 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 27L22 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default Logo;