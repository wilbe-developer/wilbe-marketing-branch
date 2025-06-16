
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminLiveEvents, LiveEvent } from '@/hooks/useLiveEvents';

const LiveEventsManager = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useAdminLiveEvents();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LiveEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    speaker_link: '',
    event_date: '',
    description: '',
    location: 'Wilbe Live Stream - https://wilbe.com',
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      speaker: '',
      speaker_link: '',
      event_date: '',
      description: '',
      location: 'Wilbe Live Stream - https://wilbe.com',
      is_active: true
    });
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await createEvent(formData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEdit = (event: LiveEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      speaker: event.speaker || '',
      speaker_link: event.speaker_link || '',
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      description: event.description || '',
      location: event.location || 'Wilbe Live Stream - https://wilbe.com',
      is_active: event.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Events Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="speaker">Speaker</Label>
                <Input
                  id="speaker"
                  value={formData.speaker}
                  onChange={(e) => setFormData(prev => ({ ...prev, speaker: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="speaker_link">Speaker Link</Label>
                <Input
                  id="speaker_link"
                  type="url"
                  value={formData.speaker_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, speaker_link: e.target.value }))}
                  placeholder="https://x.com/username"
                />
              </div>
              
              <div>
                <Label htmlFor="event_date">Event Date & Time *</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update' : 'Create'} Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {event.speaker && (
                    <p className="text-sm text-gray-600 mt-1">
                      Speaker: {event.speaker}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Date:</strong> {formatDate(event.event_date)}</p>
                {event.description && (
                  <p><strong>Description:</strong> {event.description}</p>
                )}
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-1 ${event.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {event.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {events.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No events created yet. Add your first event!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiveEventsManager;
