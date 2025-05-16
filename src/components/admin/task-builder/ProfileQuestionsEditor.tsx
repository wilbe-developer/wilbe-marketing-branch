
import React from "react";
import { ProfileQuestion, ProfileQuestionType } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ProfileQuestionsEditorProps {
  profileQuestions: ProfileQuestion[];
  onChange: (profileQuestions: ProfileQuestion[]) => void;
}

const ProfileQuestionsEditor: React.FC<ProfileQuestionsEditorProps> = ({
  profileQuestions,
  onChange,
}) => {
  const handleAddQuestion = () => {
    const newQuestion: ProfileQuestion = {
      key: `question_${profileQuestions.length + 1}`,
      text: "New Profile Question",
      type: "boolean",
    };
    
    onChange([...profileQuestions, newQuestion]);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = profileQuestions.filter((_, i) => i !== index);
    onChange(newQuestions);
  };

  const handleQuestionChange = (
    index: number,
    field: keyof ProfileQuestion,
    value: any
  ) => {
    const newQuestions = [...profileQuestions];
    
    if (field === "type") {
      const typedValue = value as ProfileQuestionType;
      newQuestions[index].type = typedValue;
      
      // Initialize options if needed
      if (
        (typedValue === "select" || typedValue === "multiselect") &&
        (!newQuestions[index].options || newQuestions[index].options.length === 0)
      ) {
        newQuestions[index].options = ["Option 1", "Option 2"];
      }
      
      // Remove options if not needed
      if (typedValue === "boolean" || typedValue === "text") {
        newQuestions[index].options = undefined;
      }
    } else if (field === "options" && Array.isArray(value)) {
      newQuestions[index].options = value;
    } else {
      // Use type assertion to handle dynamic property assignment
      (newQuestions[index] as Record<string, any>)[field] = value;
    }
    
    onChange(newQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...profileQuestions];
    const currentOptions = newQuestions[questionIndex].options || [];
    newQuestions[questionIndex].options = [
      ...currentOptions,
      `Option ${currentOptions.length + 1}`,
    ];
    
    onChange(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...profileQuestions];
    if (!newQuestions[questionIndex].options) return;
    
    newQuestions[questionIndex].options[optionIndex] = value;
    onChange(newQuestions);
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...profileQuestions];
    if (!newQuestions[questionIndex].options) return;
    
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    
    onChange(newQuestions);
  };

  if (profileQuestions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No profile questions
        </h3>
        <p className="text-gray-500 mb-4">
          Add profile questions to collect information before starting the task
        </p>
        <Button onClick={handleAddQuestion}>
          <Plus size={16} className="mr-2" />
          Add Profile Question
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Profile Questions</h3>
        <Button onClick={handleAddQuestion} size="sm">
          <Plus size={16} className="mr-2" />
          Add Question
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {profileQuestions.map((question, index) => (
          <AccordionItem
            key={index}
            value={`question-${index}`}
            className="border rounded-md"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex-1 text-left">
                {question.text || `Question ${index + 1}`}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`question-key-${index}`}>Key</Label>
                <Input
                  id={`question-key-${index}`}
                  value={question.key}
                  onChange={(e) =>
                    handleQuestionChange(index, "key", e.target.value)
                  }
                  placeholder="Profile key (e.g., has_team)"
                />
                <p className="text-sm text-gray-500">
                  Must contain only letters, numbers, and underscores
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`question-text-${index}`}>Question Text</Label>
                <Textarea
                  id={`question-text-${index}`}
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(index, "text", e.target.value)
                  }
                  placeholder="Question text"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`question-type-${index}`}>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    handleQuestionChange(
                      index,
                      "type",
                      value as ProfileQuestionType
                    )
                  }
                >
                  <SelectTrigger id={`question-type-${index}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="multiselect">Multi-Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(question.type === "select" || question.type === "multiselect") && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddOption(index)}
                    >
                      <Plus size={16} className="mr-1" />
                      Add Option
                    </Button>
                  </div>

                  {question.options?.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            optionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOption(index, optionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove Question
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProfileQuestionsEditor;
