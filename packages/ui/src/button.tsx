"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  appName?: string;
}

export const Button = ({ 
  children, 
  className = "", 
  appName = "Practice Maestro",
  onClick,
  ...props
}: ButtonProps) => {
  const handleClick = onClick || (() => alert(`Hello from your ${appName} app!`));
  
  return (
    <button
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
