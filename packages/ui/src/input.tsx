"use client";

import React, { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helper, 
    fullWidth = true, 
    className = '', 
    labelClassName = '',
    inputClassName = '',
    errorClassName = '',
    helperClassName = '',
    id,
    ...props 
  }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={classNames('form-group', fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label 
            htmlFor={inputId}
            className={classNames('form-label', labelClassName)}
          >
            {label}
          </label>
        )}
        
        <input
          id={inputId}
          ref={ref}
          className={classNames('form-input', inputClassName)}
          {...props}
        />
        
        {error && (
          <div className={classNames('form-error', errorClassName)}>
            {error}
          </div>
        )}
        
        {helper && !error && (
          <div className={classNames('text-small text-gray-500 mt-1', helperClassName)}>
            {helper}
          </div>
        )}
      </div>
    );
  }
); 