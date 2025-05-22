"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuthStatus } from '@repo/features/auth';
import { 
  getDuePracticeItems,
  addPracticeSession,
} from '@repo/services/firebase/firestore';
import { PracticeItem, PracticeSession } from '@repo/services/types';
import { updateItemProgress } from '@repo/services/spaced-repetition/leitner';

export const usePracticeSession = () => {
  const { user } = useAuthStatus();
  const [dueItems, setDueItems] = useState<PracticeItem[]>([]);
  const [currentItem, setCurrentItem] = useState<PracticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Fetch due practice items for the current user
  const fetchDueItems = useCallback(async () => {
    if (!user) {
      setDueItems([]);
      setCurrentItem(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedItems = await getDuePracticeItems(user.uid);
      
      // Ensure we have a valid array of items
      const items = Array.isArray(fetchedItems) ? fetchedItems : [];
      setDueItems(items);
      
      // Set current item
      if (items.length > 0) {
        const firstItem = items[0];
        if (firstItem && typeof firstItem === 'object' && 'id' in firstItem) {
          setCurrentItem(firstItem);
        } else {
          setCurrentItem(null);
        }
      } else {
        setCurrentItem(null);
      }
      
      setError(null);
      setSessionCompleted(items.length === 0);
    } catch (err) {
      console.error('Error fetching due practice items:', err);
      setError('Failed to load practice items');
      setDueItems([]);
      setCurrentItem(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load items when component mounts or user changes
  useEffect(() => {
    fetchDueItems();
  }, [fetchDueItems]);

  // Complete the current practice item
  const completeItem = async (status: 'completed' | 'struggled' | 'skipped', actualTempo?: number, notes?: string) => {
    if (!currentItem || !user) {
      return;
    }

    try {
      // Record the practice session
      const session: Omit<PracticeSession, 'id'> = {
        userId: user.uid,
        itemId: currentItem.id,
        date: new Date(),
        status,
        actualTempo,
        notes
      };
      
      await addPracticeSession(session);
      
      // Update the item's interval stage and next due date
      await updateItemProgress(currentItem.id, status);
      
      // Find the next item
      const currentIndex = dueItems.findIndex(item => item.id === currentItem.id);
      
      if (currentIndex >= 0 && currentIndex + 1 < dueItems.length) {
        // Get the next item safely
        const nextItem = dueItems[currentIndex + 1];
        // Only set if we have a valid item with an id
        if (nextItem && typeof nextItem === 'object' && 'id' in nextItem) {
          setCurrentItem(nextItem);
        } else {
          setCurrentItem(null);
          setSessionCompleted(true);
        }
      } else {
        // No more items to practice
        setCurrentItem(null);
        setSessionCompleted(true);
      }
    } catch (err) {
      console.error('Error completing practice item:', err);
      setError('Failed to save practice session');
    }
  };

  return {
    dueItems,
    currentItem,
    loading,
    error,
    sessionCompleted,
    fetchDueItems,
    completeItem
  };
};