
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";
import { useSprintAnswers } from "@/hooks/useSprintAnswers";
import { Card } from "@/components/ui/card";
import FileUploader from "../FileUploader";
import UploadedFileView from "../UploadedFileView";

interface IpDetailedTaskLogicProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
  hideMainQuestion?: boolean;
}

// Define the step types and structure
type StepId = 
  | 'check_reliance' 
  | 'uni_ip_path' 
  | 'non_uni_ip_path' 
  | 'patents_filed' 
  | 'content_general' 
  | 'content_uni_specific'
  | 'completion';

interface AnswersState {
  reliesOnUniIp?: string;
  ttoConversation?: string;
  ttoConversationDetails?: string;
  ttoLicensingTerms?: string;
  ttoPlans?: string;
  ownsAllIp?: string;
  ipOwnershipStatus?: string;
  patentsFiled?: string;
  patentPlans?: string;
  patentFileId?: string;
}

const IpDetailedTaskLogic = ({
  task,
  isCompleted,
  onComplete,
  hideMainQuestion = false,
}: IpDetailedTaskLogicProps) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  const [currentStep, setCurrentStep] = useState<StepId>("check_reliance");
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isWorking, setIsWorking] = useState(false);
  
  // Load existing answers if available
  useEffect(() => {
    if (task.progress?.answers) {
      const savedAnswers = task.progress.answers;
      setAnswers(savedAnswers);
      
      // Determine the correct step based on saved answers
      if (savedAnswers.reliesOnUniIp === "yes") {
        if (savedAnswers.ttoConversation) {
          setCurrentStep("content_general");
        } else {
          setCurrentStep("uni_ip_path");
        }
      } else if (savedAnswers.reliesOnUniIp === "no") {
        if (savedAnswers.ownsAllIp) {
          if (savedAnswers.ownsAllIp === "yes" && savedAnswers.patentsFiled) {
            setCurrentStep("content_general");
          } else {
            setCurrentStep("patents_filed");
          }
        } else {
          setCurrentStep("non_uni_ip_path");
        }
      }
    }
  }, [task.progress?.answers]);

  // Handle radio selection
  const handleRadioSelect = (field: keyof AnswersState, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  // Handle text input
  const handleTextChange = (field: keyof AnswersState, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileUploaded = (fileId: string) => {
    setAnswers(prev => ({ ...prev, patentFileId: fileId }));
    navigateToNextStep("content_general");
  };

  // Navigate to next step based on current step and answers
  const navigateToNextStep = (nextStep?: StepId) => {
    if (nextStep) {
      setCurrentStep(nextStep);
      return;
    }

    switch (currentStep) {
      case "check_reliance":
        if (answers.reliesOnUniIp === "yes") {
          setCurrentStep("uni_ip_path");
        } else if (answers.reliesOnUniIp === "no") {
          setCurrentStep("non_uni_ip_path");
        }
        break;
      case "uni_ip_path":
        setCurrentStep("content_general");
        break;
      case "non_uni_ip_path":
        if (answers.ownsAllIp === "yes") {
          setCurrentStep("patents_filed");
        } else {
          setCurrentStep("content_general");
        }
        break;
      case "patents_filed":
        setCurrentStep("content_general");
        break;
      case "content_general":
        if (answers.reliesOnUniIp === "yes") {
          setCurrentStep("content_uni_specific");
        } else {
          setCurrentStep("completion");
        }
        break;
      case "content_uni_specific":
        setCurrentStep("completion");
        break;
      default:
        break;
    }
  };

  // Submit all answers
  const handleSubmit = async () => {
    setIsWorking(true);
    try {
      await onComplete(answers.patentFileId);
      toast.success("IP due diligence completed successfully!");
      setCurrentStep("completion");
    } catch (error) {
      console.error("Error saving IP due diligence:", error);
      toast.error("Failed to save your IP due diligence. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  // If task is already completed, show completion message
  if (isCompleted) {
    return (
      <div className="bg-green-50 p-4 rounded-md text-green-800 space-y-2">
        <h3 className="font-medium">IP Due Diligence Completed</h3>
        <p>You've completed the IP due diligence assessment.</p>
        <Button 
          variant="outline" 
          onClick={() => onComplete()}
          className="mt-2"
        >
          View Saved Assessment
        </Button>
      </div>
    );
  }

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "check_reliance":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">Is the company reliant on IP created at a university?</p>
            <RadioGroup 
              value={answers.reliesOnUniIp} 
              onValueChange={(value) => handleRadioSelect("reliesOnUniIp", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="uni-ip-yes" />
                <Label htmlFor="uni-ip-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="uni-ip-no" />
                <Label htmlFor="uni-ip-no">No</Label>
              </div>
            </RadioGroup>
            <div className="pt-4">
              <Button 
                onClick={() => navigateToNextStep()} 
                disabled={!answers.reliesOnUniIp}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "uni_ip_path":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">Have you begun conversations with the Tech Transfer Office (TTO)?</p>
            <RadioGroup 
              value={answers.ttoConversation} 
              onValueChange={(value) => handleRadioSelect("ttoConversation", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tto-convo-yes" />
                <Label htmlFor="tto-convo-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tto-convo-no" />
                <Label htmlFor="tto-convo-no">No</Label>
              </div>
            </RadioGroup>

            {answers.ttoConversation === "yes" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tto-details">Summarize the conversation with the TTO:</Label>
                  <Textarea 
                    id="tto-details" 
                    value={answers.ttoConversationDetails || ""} 
                    onChange={(e) => handleTextChange("ttoConversationDetails", e.target.value)}
                    placeholder="Describe your interactions with the TTO and the current status of your negotiations..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licensing-terms">
                    List the preliminary licensing terms (especially % equity) the TTO expects:
                    <span className="text-sm text-gray-500 block">Include anything agreed or merely mentioned.</span>
                  </Label>
                  <Textarea 
                    id="licensing-terms" 
                    value={answers.ttoLicensingTerms || ""} 
                    onChange={(e) => handleTextChange("ttoLicensingTerms", e.target.value)}
                    placeholder="Outline any terms that have been discussed such as equity stakes, royalties, etc..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {answers.ttoConversation === "no" && (
              <div className="space-y-2">
                <Label htmlFor="tto-plans">Explain your current plans for engaging with the TTO:</Label>
                <Textarea 
                  id="tto-plans" 
                  value={answers.ttoPlans || ""} 
                  onChange={(e) => handleTextChange("ttoPlans", e.target.value)}
                  placeholder="What is your timeline and strategy for approaching the TTO?"
                  className="min-h-[120px]"
                />
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={() => navigateToNextStep()} 
                disabled={
                  !answers.ttoConversation || 
                  (answers.ttoConversation === "yes" && (!answers.ttoConversationDetails || !answers.ttoLicensingTerms)) ||
                  (answers.ttoConversation === "no" && !answers.ttoPlans)
                }
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "non_uni_ip_path":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">Do you own all the IP?</p>
            <RadioGroup 
              value={answers.ownsAllIp} 
              onValueChange={(value) => handleRadioSelect("ownsAllIp", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="owns-ip-yes" />
                <Label htmlFor="owns-ip-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="owns-ip-no" />
                <Label htmlFor="owns-ip-no">No</Label>
              </div>
            </RadioGroup>

            {answers.ownsAllIp === "no" && (
              <div className="space-y-2">
                <Label htmlFor="ip-ownership-status">Explain the current status of IP ownership:</Label>
                <Textarea 
                  id="ip-ownership-status" 
                  value={answers.ipOwnershipStatus || ""} 
                  onChange={(e) => handleTextChange("ipOwnershipStatus", e.target.value)}
                  placeholder="Who currently owns the IP you need? What steps are you taking to secure rights to use it?"
                  className="min-h-[120px]"
                />
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={() => navigateToNextStep()} 
                disabled={
                  !answers.ownsAllIp ||
                  (answers.ownsAllIp === "no" && !answers.ipOwnershipStatus)
                }
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "patents_filed":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">Have patents been filed?</p>
            <RadioGroup 
              value={answers.patentsFiled} 
              onValueChange={(value) => handleRadioSelect("patentsFiled", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="patents-yes" />
                <Label htmlFor="patents-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="patents-no" />
                <Label htmlFor="patents-no">No</Label>
              </div>
            </RadioGroup>

            {answers.patentsFiled === "yes" && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Upload patent documents:</h3>
                {answers.patentFileId ? (
                  <UploadedFileView
                    fileId={answers.patentFileId}
                    isCompleted={false}
                  />
                ) : (
                  <FileUploader
                    onFileUploaded={handleFileUploaded}
                    isCompleted={false}
                  />
                )}
              </div>
            )}

            {answers.patentsFiled === "no" && (
              <div className="space-y-2">
                <Label htmlFor="patent-plans">Explain your plans for filing patents:</Label>
                <Textarea 
                  id="patent-plans" 
                  value={answers.patentPlans || ""} 
                  onChange={(e) => handleTextChange("patentPlans", e.target.value)}
                  placeholder="What is your timeline and strategy for filing patents?"
                  className="min-h-[120px]"
                />
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={() => navigateToNextStep()} 
                disabled={
                  !answers.patentsFiled ||
                  (answers.patentsFiled === "yes" && !answers.patentFileId) ||
                  (answers.patentsFiled === "no" && !answers.patentPlans)
                }
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "content_general":
        return (
          <div className="space-y-6">
            <Card className="p-4 bg-slate-50">
              <h3 className="text-lg font-semibold mb-2">Content to cover for everyone</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>You are the core asset of the company.</li>
                <li>Role of inventions and why protecting them is crucial.</li>
                <li>Why this IP is relevant to your business strategy.</li>
                <li>Raising funding without foundational IP: risks & challenges.</li>
                <li>How to define an IP strategy that matches market validation.</li>
              </ul>
            </Card>
            
            <div className="pt-4">
              <Button onClick={() => navigateToNextStep()}>
                {answers.reliesOnUniIp === "yes" ? "Next" : "Complete"}
              </Button>
            </div>
          </div>
        );

      case "content_uni_specific":
        return (
          <div className="space-y-6">
            <Card className="p-4 bg-slate-50">
              <h3 className="text-lg font-semibold mb-2">Deep-dive for uni-created IP</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>What is a Tech Transfer Office (TTO)?</li>
                <li>How do they think and evaluate inventions?</li>
                <li>Do you actually own your IP—what does your license say?</li>
                <li>When and how should you approach them?</li>
                <li>Switching from an employee mindset to founder of an independent company.</li>
                <li>Why nobody else (lawyers, investors, advisors) can negotiate on your behalf.</li>
                <li>Why this is the best opportunity to evolve as a founder.</li>
                <li>The mother of all tricks: do not start negotiations until all the ducks are in a row.</li>
                <li>The nuclear option: can you build without this IP?</li>
              </ul>
            </Card>
            
            <div className="pt-4">
              <Button onClick={handleSubmit} disabled={isWorking}>
                {isWorking ? "Saving..." : "Complete"}
              </Button>
            </div>
          </div>
        );

      case "completion":
        return (
          <div className="bg-green-50 p-4 rounded-md text-green-800 space-y-2">
            <h3 className="font-medium">IP Due Diligence Completed</h3>
            <p>You've completed the IP due diligence assessment.</p>
            <Button 
              variant="outline" 
              onClick={handleSubmit}
              className="mt-2"
            >
              Save Assessment
            </Button>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderStepContent()}
    </div>
  );
};

export default IpDetailedTaskLogic;
