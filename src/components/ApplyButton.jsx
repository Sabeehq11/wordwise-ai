import React from 'react';

const ApplyButton = ({ original, corrected, onApply, type = 'default' }) => {
  if (!onApply) return null;

  const colors = {
    demo: { bg: '#10b981', hover: '#059669' },
    modern: { bg: '#1e40af', hover: '#1d4ed8' },
    legacy: { bg: '#166534', hover: '#15803d' },
    default: { bg: '#6366f1', hover: '#4f46e5' }
  };

  const color = colors[type] || colors.default;

  return (
    <button
      onClick={() => onApply(original, corrected)}
      style={{
        backgroundColor: color.bg,
        color: 'white',
        border: 'none',
        padding: '0.25rem 0.75rem',
        borderRadius: '0.25rem',
        fontSize: '0.75rem',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.2s',
        marginTop: '0.25rem'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = color.hover;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = color.bg;
      }}
    >
      ✓ Apply Fix
    </button>
  );
};

export default ApplyButton; 