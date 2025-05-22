
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Info } from 'lucide-react'; // Changed from InfoCircle to Info

interface ProfileSettings {
  profile_key: string;
  profile_label: string;
  profile_type: 'boolean' | 'select' | 'text' | 'multi-select';
  profile_options: string[] | null;
}

interface TaskProfileIntegrationProps {
  profileSettings: ProfileSettings;
  onChange: (settings: ProfileSettings) => void;
  isReadOnly?: boolean;
}

const TaskProfileIntegration: React.FC<TaskProfileIntegrationProps> = ({
  profileSettings,
  onChange,
  isReadOnly = false
}) => {
  const handleChange = (field: keyof ProfileSettings, value: any) => {
    if (isReadOnly) return;
    
    const newSettings = { ...profileSettings, [field]: value };
    onChange(newSettings);
  };
  
  const hasProfileKey = !!profileSettings.profile_key;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch 
          id="enable-profile"
          checked={hasProfileKey}
          onCheckedChange={(checked) => handleChange('profile_key', checked ? 'profile_field' : '')}
          disabled={isReadOnly}
        />
        <Label htmlFor="enable-profile">Update user profile data</Label>
        <div className="text-sm text-gray-500 flex items-center ml-2">
          <Info size={14} className="mr-1" />
          Tasks can update user profile information
        </div>
      </div>
      
      {hasProfileKey && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-key">Profile Field Key</Label>
                <Input 
                  id="profile-key"
                  value={profileSettings.profile_key}
                  onChange={(e) => handleChange('profile_key', e.target.value)}
                  placeholder="e.g., has_team, industry, etc."
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500">
                  The database field to update (snake_case recommended)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-label">Profile Field Label</Label>
                <Input 
                  id="profile-label"
                  value={profileSettings.profile_label}
                  onChange={(e) => handleChange('profile_label', e.target.value)}
                  placeholder="e.g., Has Team, Industry, etc."
                  disabled={isReadOnly}
                />
                <p className="text-xs text-gray-500">
                  Human-readable label for this field
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-type">Data Type</Label>
              <select
                id="profile-type"
                className="w-full border rounded-md p-2"
                value={profileSettings.profile_type}
                onChange={(e) => handleChange('profile_type', e.target.value)}
                disabled={isReadOnly}
              >
                <option value="boolean">Boolean (Yes/No)</option>
                <option value="text">Text</option>
                <option value="select">Select (Single Option)</option>
                <option value="multi-select">Multi-Select (Multiple Options)</option>
              </select>
            </div>
            
            {(profileSettings.profile_type === 'select' || profileSettings.profile_type === 'multi-select') && (
              <div className="space-y-2">
                <Label htmlFor="profile-options">Options (one per line)</Label>
                <Textarea 
                  id="profile-options"
                  value={profileSettings.profile_options ? profileSettings.profile_options.join('\n') : ''}
                  onChange={(e) => handleChange('profile_options', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  className="min-h-[100px]"
                  disabled={isReadOnly}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskProfileIntegration;
