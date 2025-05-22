"use client";

import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Card, CardBody, CardHeader } from '@repo/ui/card';
import { useAuth } from './hooks';

// Login Form Component
export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signInWithGoogleProvider } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithGoogleProvider();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <h2 className="heading-3 text-center">Sign In</h2>
      </CardHeader>
      <CardBody>
        {error && (
          <div className="bg-error-lighter text-error rounded-md p-3 mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            variant="primary"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center my-4">
            <span className="text-text-light">Or</span>
          </div>
          
          <Button
            onClick={handleGoogleSignIn}
            fullWidth
            isLoading={isLoading}
            variant="outline"
            type="button"
          >
            Sign in with Google
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

// SignUp Form Component
export const SignUpForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <h2 className="heading-3 text-center">Create Account</h2>
      </CardHeader>
      <CardBody>
        {error && (
          <div className="bg-error-lighter text-error rounded-md p-3 mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            variant="primary"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

// AuthStatus Component
export const AuthStatus = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex items-center">
      <span className="text-small text-text-white mr-4">{user.email}</span>
      <Button
        onClick={handleLogout}
        isLoading={isLoading}
        variant="ghost"
        size="sm"
      >
        {isLoading ? 'Signing out...' : 'Sign Out'}
      </Button>
    </div>
  );
}; 