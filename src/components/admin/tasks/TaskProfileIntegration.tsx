
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InfoCircle } from 'lucide-react';

interface ProfileSetting {
  profile_key: string;
  profile_label: string;
  profile_type: string;
  profile_options: any;
}

interface TaskProfileIntegrationProps {
  profileSettings: ProfileSetting;
  onChange: (settings: ProfileSetting) => void;
  isReadOnly?: boolean;
}

const TaskProfileIntegration: React.FC<TaskProfileIntegrationProps> = ({
  profileSettings,
  onChange,
  isReadOnly = false
}) => {
  const handleChange = (field: string, value: any) => {
    const newSettings = {
      ...profileSettings,
      [field]: value
    };
    onChange(newSettings);
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const options = e.target.value.split('\n').filter(Boolean);
      handleChange('profile_options', options);
    } catch (error) {
      console.error('Error parsing options:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700 mb-6">
        <div className="flex items-start">
          <InfoCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Profile Integration</h3>
            <p className="text-sm">
              Connect task completion to user profile data. When a user completes this task,
              their profile will be automatically updated with the specified information.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profile-key">Profile Key</Label>
            <Input
              id="profile-key"
              placeholder="e.g., has_deck, team_size"
              value={profileSettings.profile_key}
              onChange={(e) => handleChange('profile_key', e.target.value)}
              disabled={isReadOnly}
            />
            <p className="text-xs text-gray-500">
              The database field name that will be updated in the user's profile
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-label">Profile Label</Label>
            <Input
              id="profile-label"
              placeholder="e.g., Has Pitch Deck, Team Size"
              value={profileSettings.profile_label}
              onChange={(e) => handleChange('profile_label', e.target.value)}
              disabled={isReadOnly}
            />
            <p className="text-xs text-gray-500">
              Human-readable label for this profile field
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-type">Field Type</Label>
          <Select
            value={profileSettings.profile_type}
            onValueChange={(value) => handleChange('profile_type', value)}
            disabled={isReadOnly}
          >
            <SelectTrigger id="profile-type">
              <SelectValue placeholder="Select a field type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="select">Select (Single Choice)</SelectItem>
              <SelectItem value="multiselect">MultiSelect (Multiple Choice)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            The type of data that will be stored in the profile field
          </p>
        </div>

        {(profileSettings.profile_type === 'select' || profileSettings.profile_type === 'multiselect') && (
          <div className="space-y-2">
            <Label htmlFor="profile-options">Options (one per line)</Label>
            <Textarea
              id="profile-options"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={5}
              value={profileSettings.profile_options ? profileSettings.profile_options.join('\n') : ''}
              onChange={handleOptionsChange}
              disabled={isReadOnly}
            />
            <p className="text-xs text-gray-500">
              Enter each option on a new line
            </p>
          </div>
        )}
      </div>

      {isReadOnly && (
        <div className="p-4 bg-gray-50 rounded-md text-gray-500 text-sm">
          Profile integration settings can be configured when creating or editing a task definition.
        </div>
      )}
    </div>
  );
};

export default TaskProfileIntegration;
