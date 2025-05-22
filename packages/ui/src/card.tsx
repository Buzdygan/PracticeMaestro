"use client";

import React from 'react';
import classNames from 'classnames';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={classNames('card', className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={classNames('card-header', className)}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return (
    <div className={classNames('card-body', className)}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={classNames('card-footer', className)}>
      {children}
    </div>
  );
};
