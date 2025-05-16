
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSettings {
  profile_key: string;
  profile_label: string;
  profile_type: string;
  profile_options: any;
}

interface TaskProfileIntegrationProps {
  profileSettings: ProfileSettings;
  onChange: (settings: ProfileSettings) => void;
}

const TaskProfileIntegration: React.FC<TaskProfileIntegrationProps> = ({
  profileSettings,
  onChange
}) => {
  const handleChange = (field: keyof ProfileSettings, value: any) => {
    onChange({
      ...profileSettings,
      [field]: value
    });

    // If changing type, update options if needed
    if (field === "profile_type") {
      if (value === "boolean") {
        onChange({
          ...profileSettings,
          profile_type: value,
          profile_options: null
        });
      } else if (value === "select" || value === "multi-select") {
        if (!profileSettings.profile_options) {
          onChange({
            ...profileSettings,
            profile_type: value,
            profile_options: [{ label: "", value: "" }]
          });
        }
      }
    }
  };

  const handleAddOption = () => {
    const options = profileSettings.profile_options ? [...profileSettings.profile_options] : [];
    options.push({ label: "", value: "" });
    handleChange("profile_options", options);
  };

  const handleUpdateOption = (index: number, field: "label" | "value", value: string) => {
    if (!profileSettings.profile_options) return;
    
    const options = [...profileSettings.profile_options];
    options[index] = { ...options[index], [field]: value };
    handleChange("profile_options", options);
  };

  const handleRemoveOption = (index: number) => {
    if (!profileSettings.profile_options) return;
    
    const options = [...profileSettings.profile_options];
    options.splice(index, 1);
    handleChange("profile_options", options);
  };

  const needsOptions = profileSettings.profile_type === "select" || profileSettings.profile_type === "multi-select";

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">
        Tasks can integrate with the sprint profile to show questions based on previous answers or collect new profile information.
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-key">Profile Key</Label>
          <Input
            id="profile-key"
            value={profileSettings.profile_key || ""}
            onChange={(e) => handleChange("profile_key", e.target.value)}
            placeholder="e.g., university_ip"
          />
          <p className="text-xs text-gray-500">
            This is the database field name in the sprint_profiles table. Leave empty if this task doesn't need profile integration.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile-label">Profile Question Label</Label>
          <Input
            id="profile-label"
            value={profileSettings.profile_label || ""}
            onChange={(e) => handleChange("profile_label", e.target.value)}
            placeholder="e.g., Is your company reliant on university IP?"
          />
          <p className="text-xs text-gray-500">
            The question shown to users when collecting this profile information.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profile-type">Answer Type</Label>
          <Select 
            value={profileSettings.profile_type || "boolean"} 
            onValueChange={(value) => handleChange("profile_type", value)}
          >
            <SelectTrigger id="profile-type">
              <SelectValue placeholder="Select answer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Yes/No</SelectItem>
              <SelectItem value="string">Text Input</SelectItem>
              <SelectItem value="select">Single Select</SelectItem>
              <SelectItem value="multi-select">Multi Select</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {needsOptions && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Answer Options</Label>
                  <Button size="sm" variant="outline" onClick={handleAddOption}>
                    <Plus size={14} className="mr-1" /> Add Option
                  </Button>
                </div>
                
                {(!profileSettings.profile_options || profileSettings.profile_options.length === 0) && (
                  <p className="text-xs text-gray-500">No options defined yet.</p>
                )}
                
                {profileSettings.profile_options && profileSettings.profile_options.map((option: any, index: number) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={option.label || ""}
                      onChange={(e) => handleUpdateOption(index, "label", e.target.value)}
                      placeholder="Option label"
                      className="flex-1"
                    />
                    <Input
                      value={option.value || ""}
                      onChange={(e) => handleUpdateOption(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-1/3"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskProfileIntegration;
