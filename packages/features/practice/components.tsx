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
    completeItem 
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
          You've completed all your practice items for today. Great job!
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.href = '/library'}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Return to Library
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
  const [showFeedback, setShowFeedback] = useState(false);

  const handlePractice = () => {
    setShowFeedback(true);
  };

  const handleComplete = (status: 'completed' | 'struggled' | 'skipped') => {
    onComplete(status, actualTempo, notes.trim() || null);
    setShowFeedback(false);
    setActualTempo(undefined);
    setNotes('');
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
      
      {!showFeedback ? (
        <div className="mt-8 text-center">
          <Button 
            onClick={handlePractice}
            className="bg-primary-600 text-white px-6 py-3 rounded-md text-lg"
          >
            I've Practiced This
          </Button>
        </div>
      ) : (
        <div className="mt-6 border-t pt-6">
          <h4 className="font-medium mb-4">How did it go?</h4>
          
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
          
          <div className="mb-4">
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
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button 
              onClick={() => handleComplete('completed')}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Mastered It
            </Button>
            <Button 
              onClick={() => handleComplete('struggled')}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              Struggled
            </Button>
            <Button 
              onClick={() => handleComplete('skipped')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Skip for Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 