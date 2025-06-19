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
        padding: '0.375rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s ease-out',
        marginTop: '0.5rem',
        boxShadow: `0 4px 12px ${color.bg}40`,
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = color.hover;
        e.target.style.transform = 'translateY(-1px) scale(1.02)';
        e.target.style.boxShadow = `0 6px 16px ${color.hover}50`;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = color.bg;
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = `0 4px 12px ${color.bg}40`;
      }}
    >
      ✓ Apply Fix
    </button>
  );
};

export default ApplyButton; 