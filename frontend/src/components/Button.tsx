import React from 'react';

type ButtonProps = {
    color?: string;
    text?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
    disabled?: boolean;
};

const Button: React.FC<ButtonProps & { className?: string }> = ({
    color = '',
    text = '',
    onClick,
    type = "button",
    children,
    className,
    disabled
}) => (
    <button
        disabled={disabled}
        type={type}
        style={{
            ...(color ? { color } : {}),
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            opacity: disabled ? 0.6 : 1,
        }}
        onClick={onClick}
        className={className}
    >
        {text}
        {children}
    </button>
);

export default Button;