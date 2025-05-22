"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  fullWidth = false,
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses = "btn";
  const variantClasses = {
    "primary": "btn-primary",
    "secondary": "btn-secondary",
    "outline": "btn-outline",
    "ghost": "btn-ghost"
  };
  
  const sizeClasses = {
    "sm": "btn-sm",
    "md": "",
    "lg": "btn-lg"
  };
  
  const buttonClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    isLoading ? "opacity-75 cursor-not-allowed" : "",
    className
  );
  
  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
