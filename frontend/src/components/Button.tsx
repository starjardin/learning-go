import React from 'react';

type ButtonProps = {
    color?: string;
    text?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
};

const Button: React.FC<ButtonProps & { className?: string }> = ({
    color = '',
    text = '',
    onClick,
    type = "button",
    children,
    className,
}) => (
    <button
        type={type}
        style={{
            ...(color ? { color } : {}),
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
        }}
        onClick={onClick}
        className={className}
    >
        {text}
        {children}
    </button>
);

export default Button;