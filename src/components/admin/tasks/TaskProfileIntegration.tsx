
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
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
            profile_options: [{ label: "", value: "option-" + Date.now() }]
          });
        }
      }
    }
  };

  const handleAddOption = () => {
    const options = profileSettings.profile_options ? [...profileSettings.profile_options] : [];
    options.push({ label: "", value: "option-" + Date.now() });
    handleChange("profile_options", options);
  };

  const handleUpdateOption = (index: number, field: "label" | "value", value: string) => {
    if (!profileSettings.profile_options) return;
    
    const options = [...profileSettings.profile_options];
    // Ensure value is never empty
    if (field === "value" && value === "") {
      value = "option-" + Date.now();
    }
    
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span>Sprint Profile Integration</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    <HelpCircle size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Profile integration allows your task to collect or use information that is stored in the user's sprint profile.</p>
                  <p className="mt-2">Common profile fields include: company_incorporated, team_status, university_ip, etc.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Dependency Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p>Common profile dependencies that you can use in steps:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>team_status=solo</code> - Solo founder</li>
              <li><code>team_status=co-founders</code> - Has co-founders</li>
              <li><code>team_status=team</code> - Has a team with employees</li>
              <li><code>company_incorporated=true</code> - Company is incorporated</li>
              <li><code>company_incorporated=false</code> - Company is not incorporated</li>
              <li><code>university_ip=true</code> - Using university IP</li>
              <li><code>received_funding=true</code> - Has received funding</li>
            </ul>
            <p className="mt-4 text-gray-500">Add these dependencies to individual steps to show/hide them based on profile values.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskProfileIntegration;
