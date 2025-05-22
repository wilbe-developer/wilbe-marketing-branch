
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileOption {
  label: string;
  value: string;
}

interface ProfileSettings {
  profile_key: string;
  profile_label: string;
  profile_type: "boolean" | "text" | "select" | "multi-select";
  profile_options: ProfileOption[] | null;
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
    
    // Reset options if type changes away from select/multi-select
    if (field === 'profile_type' && !['select', 'multi-select'].includes(value)) {
      newSettings.profile_options = null;
    }
    
    // Initialize options array if type changes to select/multi-select
    if (field === 'profile_type' && ['select', 'multi-select'].includes(value) && !profileSettings.profile_options) {
      newSettings.profile_options = [{ label: '', value: '' }];
    }
    
    onChange(newSettings);
  };
  
  const handleOptionChange = (index: number, field: 'label' | 'value', value: string) => {
    if (isReadOnly || !profileSettings.profile_options) return;
    
    const newOptions = [...profileSettings.profile_options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    onChange({
      ...profileSettings,
      profile_options: newOptions
    });
  };
  
  const addOption = () => {
    if (isReadOnly) return;
    
    const newOptions = profileSettings.profile_options ? [...profileSettings.profile_options] : [];
    newOptions.push({ label: '', value: '' });
    
    onChange({
      ...profileSettings,
      profile_options: newOptions
    });
  };
  
  const removeOption = (index: number) => {
    if (isReadOnly || !profileSettings.profile_options) return;
    
    const newOptions = [...profileSettings.profile_options];
    newOptions.splice(index, 1);
    
    onChange({
      ...profileSettings,
      profile_options: newOptions.length > 0 ? newOptions : null
    });
  };
  
  const showOptions = ['select', 'multi-select'].includes(profileSettings.profile_type);
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profile_key">Profile Key</Label>
            <Input
              id="profile_key"
              value={profileSettings.profile_key || ''}
              onChange={(e) => handleChange('profile_key', e.target.value)}
              placeholder="e.g., has_ip, team_size"
              disabled={isReadOnly}
            />
            <p className="text-xs text-gray-500">
              This key will be used to store the answer in the user's profile
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile_label">Profile Label</Label>
            <Input
              id="profile_label"
              value={profileSettings.profile_label || ''}
              onChange={(e) => handleChange('profile_label', e.target.value)}
              placeholder="e.g., Has IP, Team Size"
              disabled={isReadOnly}
            />
            <p className="text-xs text-gray-500">
              This label will be displayed in the profile section
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile_type">Answer Type</Label>
          <Select
            value={profileSettings.profile_type}
            onValueChange={(value) => handleChange('profile_type', value)}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select answer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Yes/No (Boolean)</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="select">Single Selection</SelectItem>
              <SelectItem value="multi-select">Multiple Selection</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            The type of answer that will be stored in the profile
          </p>
        </div>
      </div>
      
      {showOptions && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Options</Label>
            {!isReadOnly && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={addOption}
              >
                <Plus size={16} className="mr-2" />
                Add Option
              </Button>
            )}
          </div>
          
          {profileSettings.profile_options && profileSettings.profile_options.length > 0 ? (
            <div className="space-y-2">
              {profileSettings.profile_options.map((option, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          value={option.label}
                          onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                          placeholder="Label"
                          disabled={isReadOnly}
                        />
                        <Input
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                          placeholder="Value"
                          disabled={isReadOnly}
                        />
                      </div>
                      {!isReadOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">No options defined</p>
              {!isReadOnly && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={addOption}
                >
                  <Plus size={16} className="mr-2" />
                  Add Option
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      
      {isReadOnly && (
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-800 text-sm">
            This is a read-only view of the profile integration settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskProfileIntegration;
