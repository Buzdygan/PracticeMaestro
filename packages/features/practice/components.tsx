"use client";

import React, { useState } from 'react';
import { Button } from '@repo/ui/button';
import { usePracticeSession } from './hooks';
import { PracticeItem } from '@repo/services/types';

// Practice Container component
export const PracticeContainer = () => {
  const { 
    currentItem, 
    dueItems, 
    loading, 
    error, 
    sessionCompleted, 
    completeItem,
    fetchDueItems 
  } = usePracticeSession();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading practice items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Practice Complete!</h2>
        <p className="text-gray-600 mb-6">
          You've completed your current practice session. Great job!
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => window.location.href = '/library'}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Return to Library
          </Button>
          <Button 
            onClick={() => fetchDueItems()}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Continue Practicing
          </Button>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">No Practice Items</h2>
        <p className="text-gray-600 mb-6">
          You don't have any practice items due today. Add some items to your library to get started.
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.href = '/library'}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Go to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-primary-50 p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Practicing {dueItems.length} items
          </h2>
          <div className="text-sm text-gray-500">
            Item {dueItems.findIndex(item => item.id === currentItem.id) + 1} of {dueItems.length}
          </div>
        </div>
      </div>
      
      <PracticeItemView 
        item={currentItem} 
        onComplete={completeItem} 
      />
    </div>
  );
};

// Practice Item View component
export const PracticeItemView = ({ 
  item, 
  onComplete 
}: { 
  item: PracticeItem; 
  onComplete: (status: 'completed' | 'struggled' | 'skipped', actualTempo?: number, notes?: string | null) => void; 
}) => {
  const [actualTempo, setActualTempo] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number>(3); // Default to middle rating

  // Map the 1-5 rating to a status
  const getRatingStatus = (rating: number): 'completed' | 'struggled' | 'skipped' => {
    if (rating >= 4) return 'completed';
    if (rating >= 2) return 'struggled';
    return 'skipped';
  };

  const handleSubmit = () => {
    const status = getRatingStatus(rating);
    onComplete(status, actualTempo, notes.trim() || null);
    setActualTempo(undefined);
    setNotes('');
    setRating(3);
  };
  
  const handleSkip = () => {
    onComplete('skipped', undefined, 'Skipped by user');
    setActualTempo(undefined);
    setNotes('');
    setRating(3);
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
      <div className="text-sm text-gray-500 capitalize mb-4">{item.type}</div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium mb-2">Target Tempo</h4>
          <div className="text-lg">{item.targetTempoMin} - {item.targetTempoMax} BPM</div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Difficulty</h4>
          <div className="text-yellow-500 text-lg">
            {'★'.repeat(item.difficulty)}{'☆'.repeat(5 - item.difficulty)}
          </div>
        </div>
      </div>
      
      {item.notes && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Notes</h4>
          <div className="bg-gray-50 p-3 rounded border text-gray-700">
            {item.notes}
          </div>
        </div>
      )}
      
      <div className="mt-6 border-t pt-6">
        <h4 className="font-medium mb-4">How did it go?</h4>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate your performance (1-5)
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <span className={`${rating >= star ? 'text-blue-500' : 'text-white border border-gray-300 rounded-full'}`}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <div className="text-sm mt-1 text-gray-600">
            {rating === 1 && 'Poor - Need much more practice'}
            {rating === 2 && 'Fair - Struggled with parts'}
            {rating === 3 && 'Good - Making progress'}
            {rating === 4 && 'Very good - Almost there'}
            {rating === 5 && 'Excellent - Mastered it'}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual Tempo (Optional)
          </label>
          <input
            type="number"
            min="1"
            max="300"
            value={actualTempo || ''}
            onChange={(e) => setActualTempo(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="BPM"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Practice Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Add any notes about your practice session..."
          />
        </div>
        
        <div className="flex justify-end mt-6 space-x-4">
          <Button 
            onClick={handleSkip}
            className="border border-gray-300 px-6 py-2 rounded-md"
          >
            Skip
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-primary-600 text-white px-6 py-2 rounded-md"
          >
            Completed
          </Button>
        </div>
      </div>
    </div>
  );
}; 