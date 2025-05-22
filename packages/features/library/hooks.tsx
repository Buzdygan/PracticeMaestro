"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuthStatus } from '@repo/features/auth';
import { 
  addPracticeItem,
  getUserPracticeItems,
  updatePracticeItem,
  deletePracticeItem
} from '@repo/services/firebase/firestore';
import { PracticeItem, PracticeItemType } from '@repo/services/types';

export const useLibrary = () => {
  const { user } = useAuthStatus();
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all practice items for the current user
  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedItems = await getUserPracticeItems(user.uid);
      setItems(fetchedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching practice items:', err);
      setError('Failed to load practice items');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add a new practice item
  const addItem = async (item: Omit<PracticeItem, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'intervalStage'>) => {
    if (!user) {
      throw new Error('User must be logged in to add items');
    }

    try {
      const newItem = await addPracticeItem({
        ...item,
        userId: user.uid,
        intervalStage: 0
      });
      
      // Update local state
      setItems(prev => [...prev, newItem as PracticeItem]);
      return newItem;
    } catch (err) {
      console.error('Error adding practice item:', err);
      throw err;
    }
  };

  // Update an existing practice item
  const updateItem = async (id: string, updates: Partial<PracticeItem>) => {
    try {
      const updatedItem = await updatePracticeItem(id, updates);
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } as PracticeItem : item
      ));
      
      return updatedItem;
    } catch (err) {
      console.error('Error updating practice item:', err);
      throw err;
    }
  };

  // Delete a practice item
  const deleteItem = async (id: string) => {
    try {
      await deletePracticeItem(id);
      
      // Update local state
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting practice item:', err);
      throw err;
    }
  };

  // Load items when component mounts or user changes
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem
  };
}; 