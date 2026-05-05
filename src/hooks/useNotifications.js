import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialFetch = useRef(true);

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!user) return;
    
    try {
      if (!isSilent) setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Get latest 50

      if (error) throw error;
      
      const notifs = data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      if (!isSilent) setLoading(false);
      isInitialFetch.current = false;
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel(`notifications_changes_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch silently when notifications change (e.g. new notification received)
          fetchNotifications(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  return { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead,
    refetch: fetchNotifications 
  };
};
