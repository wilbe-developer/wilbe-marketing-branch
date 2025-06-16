
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LiveEvent {
  id: string;
  title: string;
  speaker?: string;
  speaker_link?: string;
  event_date: string;
  description?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useLiveEvents = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('live_events')
        .select('*')
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching live events:', error);
      toast.error('Failed to load live events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getNextEvent = () => {
    return events.length > 0 ? events[0] : null;
  };

  return {
    events,
    loading,
    nextEvent: getNextEvent(),
    refetch: fetchEvents
  };
};

export const useAdminLiveEvents = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('live_events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching live events:', error);
      toast.error('Failed to load live events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<LiveEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('live_events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      toast.success('Event created successfully');
      await fetchAllEvents();
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<LiveEvent>) => {
    try {
      const { error } = await supabase
        .from('live_events')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Event updated successfully');
      await fetchAllEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('live_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Event deleted successfully');
      await fetchAllEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      throw error;
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchAllEvents
  };
};
