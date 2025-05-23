"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { useLibrary } from './hooks';
import { PracticeItem, PracticeItemType } from '@repo/services/types';

// Library container component
export const LibraryContainer = () => {
  const { items, loading, error, fetchItems, deleteItem } = useLibrary();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setShowAddForm(true);
  };

  const handleEdit = (item: PracticeItem) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowAddForm(false);
    fetchItems();
  };

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

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Practice Items</h2>
        <Button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-md"
        >
          Add New Item
        </Button>
      </div>
      
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <PracticeItemForm 
              onSubmit={handleFormSubmit} 
              onCancel={handleFormClose}
              item={selectedItem}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border">
          <p className="text-gray-600 mb-4">
            Your library is empty. Add your first practice item to get started.
          </p>
          <Button 
            onClick={handleAdd}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(item => (
            <PracticeItemCard 
              key={item.id} 
              item={item} 
              onEdit={() => handleEdit(item)} 
              onDelete={() => handleDelete(item.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Practice Item Card component
export const PracticeItemCard = ({ 
  item, 
  onEdit, 
  onDelete 
}: { 
  item: PracticeItem; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  // Helper function to safely convert any timestamp to Date
  const toDate = (timestamp: any): Date | null => {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
      return timestamp.toDate();
    }
    // Try to parse it as a date string
    const parsedDate = new Date(timestamp);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Format last practiced date
  const lastPracticedDate = toDate(item.lastPracticed);
  const lastPracticedText = lastPracticedDate 
    ? lastPracticedDate.toLocaleDateString() 
    : 'Never';
    
  // Format next due date
  const nextDueDate = toDate(item.nextDue);
  const nextDueText = nextDueDate 
    ? nextDueDate.toLocaleDateString() 
    : 'Not scheduled';
  
  // Display difficulty as stars
  const difficulty = '★'.repeat(item.difficulty) + '☆'.repeat(5 - item.difficulty);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <div className="text-sm text-gray-500 capitalize">{item.type}</div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="text-primary-600 hover:text-primary-800"
          >
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Difficulty: </span>
          <span className="text-yellow-500">{difficulty}</span>
        </div>
        <div>
          <span className="text-gray-500">Tempo: </span>
          <span>{item.targetTempoMin} - {item.targetTempoMax} BPM</span>
        </div>
        <div>
          <span className="text-gray-500">Last Practiced: </span>
          <span>{lastPracticedText}</span>
        </div>
        <div>
          <span className="text-gray-500">Next Due: </span>
          <span>{nextDueText}</span>
        </div>
      </div>
      
      {item.notes && (
        <div className="mt-3 text-sm">
          <span className="text-gray-500">Notes: </span>
          <span>{item.notes}</span>
        </div>
      )}
    </div>
  );
};

// Practice Item Form component
export const PracticeItemForm = ({ 
  onSubmit, 
  onCancel,
  item,
  isEditing
}: { 
  onSubmit: () => void; 
  onCancel: () => void;
  item?: PracticeItem | null;
  isEditing?: boolean;
}) => {
  const { addItem, updateItem } = useLibrary();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PracticeItemType>(PracticeItemType.PIECE);
  const [difficulty, setDifficulty] = useState(3);
  const [targetTempoMin, setTargetTempoMin] = useState(60);
  const [targetTempoMax, setTargetTempoMax] = useState(120);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // If editing, populate form with item data
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setType(item.type);
      setDifficulty(item.difficulty);
      setTargetTempoMin(item.targetTempoMin);
      setTargetTempoMax(item.targetTempoMax);
      setNotes(item.notes || '');
    }
  }, [item]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (targetTempoMin > targetTempoMax) {
      setError('Minimum tempo cannot be greater than maximum tempo');
      return;
    }
    
    try {
      setLoading(true);
      
      const itemData = {
        title,
        type,
        difficulty,
        targetTempoMin,
        targetTempoMax,
        notes: notes || null
      };
      
      if (isEditing && item) {
        await updateItem(item.id, itemData);
      } else {
        await addItem(itemData);
      }
      
      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save practice item');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Practice Item' : 'Add New Practice Item'}
      </h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as PracticeItemType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={PracticeItemType.PIECE}>Piece</option>
            <option value={PracticeItemType.SCALE}>Scale</option>
            <option value={PracticeItemType.CHORD}>Chord</option>
            <option value={PracticeItemType.FRAGMENT}>Fragment</option>
            <option value={PracticeItemType.PROGRESSION}>Progression</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty (1-5) *
          </label>
          <div className="flex items-center">
            <input
              id="difficulty"
              type="range"
              min="1"
              max="5"
              step="1"
              value={difficulty}
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-2 text-yellow-500">{'★'.repeat(difficulty)}{'☆'.repeat(5 - difficulty)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetTempoMin" className="block text-sm font-medium text-gray-700 mb-1">
              Min Tempo (BPM) *
            </label>
            <input
              id="targetTempoMin"
              type="number"
              min="40"
              max="300"
              value={targetTempoMin}
              onChange={(e) => setTargetTempoMin(parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="targetTempoMax" className="block text-sm font-medium text-gray-700 mb-1">
              Max Tempo (BPM) *
            </label>
            <input
              id="targetTempoMax"
              type="number"
              min="40"
              max="300"
              value={targetTempoMax}
              onChange={(e) => setTargetTempoMax(parseInt(e.target.value))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
          </Button>
        </div>
      </form>
    </div>
  );
}; 