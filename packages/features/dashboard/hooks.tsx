"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuthStatus } from '@repo/features/auth';
import { 
  getUserPracticeItems, 
  getItemPracticeSessions 
} from '@repo/services/firebase/firestore';
import { PracticeItem, PracticeSession } from '@repo/services/types';

interface PracticeStats {
  totalItems: number;
  completedSessions: number;
  struggledSessions: number;
  skippedSessions: number;
  dueItems: number;
  totalPracticeTime: number; // in minutes (estimated)
  itemsByType: Record<string, number>;
}

export const useDashboard = () => {
  const { user } = useAuthStatus();
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [stats, setStats] = useState<PracticeStats>({
    totalItems: 0,
    completedSessions: 0,
    struggledSessions: 0,
    skippedSessions: 0,
    dueItems: 0,
    totalPracticeTime: 0,
    itemsByType: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setItems([]);
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all practice items
      const practiceItems = await getUserPracticeItems(user.uid);
      setItems(practiceItems);
      
      // Fetch sessions for each item
      const allSessions: PracticeSession[] = [];
      for (const item of practiceItems) {
        const itemSessions = await getItemPracticeSessions(item.id, user.uid);
        allSessions.push(...itemSessions);
      }
      setSessions(allSessions);
      
      // Calculate stats
      const now = new Date();
      const dueItems = practiceItems.filter(item => 
        item.nextDue && new Date(item.nextDue) <= now
      ).length;
      
      const itemsByType: Record<string, number> = {};
      practiceItems.forEach(item => {
        itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;
      });
      
      const completedSessions = allSessions.filter(s => s.status === 'completed').length;
      const struggledSessions = allSessions.filter(s => s.status === 'struggled').length;
      const skippedSessions = allSessions.filter(s => s.status === 'skipped').length;
      
      // Estimate practice time (10 minutes per completed session, 5 minutes per struggled/skipped)
      const totalPracticeTime = (completedSessions * 10) + ((struggledSessions + skippedSessions) * 5);
      
      setStats({
        totalItems: practiceItems.length,
        completedSessions,
        struggledSessions,
        skippedSessions,
        dueItems,
        totalPracticeTime,
        itemsByType
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    sessions,
    stats,
    loading,
    error,
    refreshData: fetchData
  };
}; 