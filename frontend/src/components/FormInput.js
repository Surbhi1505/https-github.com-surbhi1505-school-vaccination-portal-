
import React from 'react';

export default function FormInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>
      <input {...props} style={{ height: '36px', padding: '4px 8px', width: '100%' }} />
    </div>
  );
}
