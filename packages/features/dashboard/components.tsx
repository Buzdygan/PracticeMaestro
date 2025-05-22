"use client";

import React from 'react';
import { Button } from '@repo/ui/button';
import { useDashboard } from './hooks';
import { PracticeItemType } from '@repo/services/types';

// Helper function to format minutes into hours and minutes
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
};

// Dashboard container component
export const DashboardContainer = () => {
  const { stats, loading, error, refreshData } = useDashboard();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <Button 
          onClick={refreshData}
          className="ml-4 bg-red-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Retry
        </Button>
      </div>
    );
  }

  const { 
    totalItems, 
    completedSessions, 
    struggledSessions, 
    skippedSessions, 
    dueItems, 
    totalPracticeTime,
    itemsByType 
  } = stats;
  
  const totalSessions = completedSessions + struggledSessions + skippedSessions;
  
  // Calculate success rate
  const successRate = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Items" 
          value={totalItems.toString()} 
          icon="📚"
        />
        <StatCard 
          title="Due Today" 
          value={dueItems.toString()}
          icon="⏰"
          highlight={dueItems > 0}
        />
        <StatCard 
          title="Success Rate" 
          value={`${successRate}%`}
          icon="🎯"
        />
        <StatCard 
          title="Practice Time" 
          value={formatTime(totalPracticeTime)}
          icon="⏱️"
        />
      </div>
      
      {/* Practice Item Types */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Items by Type</h3>
        
        <div className="space-y-3">
          {Object.values(PracticeItemType).map(type => (
            <div key={type} className="flex items-center">
              <div className="w-1/3 text-gray-600 capitalize">{type}</div>
              <div className="w-2/3">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 rounded-full"
                    style={{ 
                      width: totalItems > 0 
                        ? `${((itemsByType[type] || 0) / totalItems) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <div className="text-sm mt-1">{itemsByType[type] || 0} items</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Practice Sessions Stats */}
      {totalSessions > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Practice Sessions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedSessions}</div>
              <div className="text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{struggledSessions}</div>
              <div className="text-gray-500">Struggled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-500">{skippedSessions}</div>
              <div className="text-gray-500">Skipped</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Call to Action */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
        <p className="text-gray-600 mb-4">
          {dueItems > 0 
            ? `You have ${dueItems} item${dueItems > 1 ? 's' : ''} due for practice today.`
            : 'You have no items due today, but you can still practice or add new items.'}
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => window.location.href = '/practice'}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Start Practicing
          </Button>
          <Button 
            onClick={() => window.location.href = '/library'}
            className="border border-primary-600 text-primary-600 px-4 py-2 rounded-md"
          >
            Manage Library
          </Button>
        </div>
      </div>
    </div>
  );
};

// Stat Card component
interface StatCardProps {
  title: string;
  value: string;
  icon?: string;
  highlight?: boolean;
}

export const StatCard = ({ title, value, icon, highlight }: StatCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${highlight ? 'border-l-4 border-primary-600' : ''}`}>
      <div className="flex items-center mb-2">
        {icon && <span className="text-xl mr-2">{icon}</span>}
        <h3 className="text-gray-500 text-sm">{title}</h3>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}; 