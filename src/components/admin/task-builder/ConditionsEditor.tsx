
import React from "react";
import { Condition, ConditionOperator } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ConditionsEditorProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
}

const ConditionsEditor: React.FC<ConditionsEditorProps> = ({
  conditions,
  onChange,
}) => {
  const handleAddCondition = () => {
    const newCondition: Condition = {
      source: { profileKey: "" },
      operator: "equals",
      value: "",
    };
    
    onChange([...conditions, newCondition]);
  };

  const handleDeleteCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    onChange(newConditions);
  };

  const handleConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...conditions];
    
    if (field === "sourceType") {
      // sourceType is "profile" or "step"
      if (value === "profile") {
        newConditions[index].source = { profileKey: "" };
      } else {
        newConditions[index].source = { stepId: "" };
      }
    } else if (field === "profileKey") {
      newConditions[index].source = { profileKey: value };
    } else if (field === "stepId") {
      newConditions[index].source = { stepId: value };
    } else if (field === "operator") {
      newConditions[index].operator = value as ConditionOperator;
    } else if (field === "value") {
      newConditions[index].value = value;
    }
    
    onChange(newConditions);
  };

  const getSourceType = (condition: Condition) => {
    return condition.source.profileKey !== undefined ? "profile" : "step";
  };

  const getSourceValue = (condition: Condition) => {
    return condition.source.profileKey || condition.source.stepId || "";
  };

  if (conditions.length === 0) {
    return (
      <div className="space-y-4">
        <Label>Visibility Conditions</Label>
        <div className="text-center py-6 border rounded-lg border-dashed">
          <p className="text-gray-500 mb-4">
            Add conditions to control when this step is visible
          </p>
          <Button variant="outline" onClick={handleAddCondition}>
            <Plus size={16} className="mr-2" />
            Add Condition
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Visibility Conditions</Label>
        <Button variant="outline" size="sm" onClick={handleAddCondition}>
          <Plus size={16} className="mr-1" />
          Add Condition
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {conditions.map((condition, index) => (
          <AccordionItem
            key={index}
            value={`condition-${index}`}
            className="border rounded-md"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex-1 text-left text-sm">
                {getSourceType(condition) === "profile"
                  ? `Profile: ${condition.source.profileKey || "..."}`
                  : `Step: ${condition.source.stepId || "..."}`}{" "}
                {condition.operator} {String(condition.value)}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`sourceType-${index}`}>Source Type</Label>
                  <Select
                    value={getSourceType(condition)}
                    onValueChange={(value) =>
                      handleConditionChange(index, "sourceType", value)
                    }
                  >
                    <SelectTrigger id={`sourceType-${index}`}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profile">Profile Value</SelectItem>
                      <SelectItem value="step">Step Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {getSourceType(condition) === "profile" ? (
                    <>
                      <Label htmlFor={`profileKey-${index}`}>Profile Key</Label>
                      <Input
                        id={`profileKey-${index}`}
                        value={condition.source.profileKey || ""}
                        onChange={(e) =>
                          handleConditionChange(
                            index,
                            "profileKey",
                            e.target.value
                          )
                        }
                        placeholder="e.g., has_team"
                      />
                    </>
                  ) : (
                    <>
                      <Label htmlFor={`stepId-${index}`}>Step ID</Label>
                      <Input
                        id={`stepId-${index}`}
                        value={condition.source.stepId || ""}
                        onChange={(e) =>
                          handleConditionChange(index, "stepId", e.target.value)
                        }
                        placeholder="e.g., step-uuid"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`operator-${index}`}>Operator</Label>
                  <Select
                    value={condition.operator}
                    onValueChange={(value) =>
                      handleConditionChange(
                        index,
                        "operator",
                        value as ConditionOperator
                      )
                    }
                  >
                    <SelectTrigger id={`operator-${index}`}>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                      <SelectItem value="in">In</SelectItem>
                      <SelectItem value="not_in">Not In</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`value-${index}`}>Value</Label>
                  <Input
                    id={`value-${index}`}
                    value={
                      Array.isArray(condition.value)
                        ? condition.value.join(", ")
                        : String(condition.value)
                    }
                    onChange={(e) =>
                      handleConditionChange(index, "value", e.target.value)
                    }
                    placeholder="Value to compare"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCondition(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ConditionsEditor;
