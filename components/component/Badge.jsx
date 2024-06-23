import React from 'react';

const Badge = ({ variant, onClick, children }) => {
    return (
        <span
            onClick={onClick}
            className={`px-2 py-1 cursor-pointer rounded-full text-xs font-medium ${variant === 'outline' ? 'bg-transparent border border-blue-500 text-blue-500' : 'bg-blue-500 text-white'}`}
        >
            {children}
        </span>
    );
};

export default Badge;
