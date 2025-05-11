import React from 'react';

export default function Card({ children, style, className = '' }) {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: 'var(--card-bg)',
        borderLeft: '6px solid var(--card-border)',
        borderRadius: '12px',
        padding: '20px',
        margin: '10px 0',
        boxShadow: '0 4px 12px var(--card-hover)',
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      {children}
    </div>
  );
}
