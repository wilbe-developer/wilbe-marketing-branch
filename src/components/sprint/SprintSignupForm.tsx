
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, AlertCircle, Mail } from "lucide-react";
import { useSprintSignup } from "@/hooks/useSprintSignup";
import { windows } from "./SprintSignupWindows";
import { useAuth } from "@/hooks/useAuth";
import { WindowFormFields } from "./WindowFormFields";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface UtmParams {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

interface SprintSignupFormProps {
  utmParams?: UtmParams;
}

const SprintSignupForm: React.FC<SprintSignupFormProps> = ({ utmParams = {} }) => {
  const {
    currentWindow,
    answers,
    isSubmitting,
    uploadedFile,
    hasSprintProfile,
    isCheckingEmail,
    emailExists,
    handleChange,
    toggleMultiSelect,
    handleFileUpload,
    goToNextWindow,
    goToPreviousWindow,
    silentSignup,
    handleSendMagicLink
  } = useSprintSignup();
  
  const { isAuthenticated, user } = useAuth();

  const isCurrentWindowAnswered = () => {
    const currentWindowData = windows[currentWindow];
    if (!currentWindowData) return false;
    
    // Check if all required fields in the current window are answered
    for (const question of currentWindowData.questions) {
      // Skip file type questions
      if (question.type === 'file') continue;
      
      // For conditional questions, check if they should be answered
      if (question.type === 'conditional') {
        if (question.conditional) {
          const conditionMet = question.conditional.some(condition => 
            answers[condition.field] === condition.value
          );
          
          if (conditionMet && !answers[question.id]) {
            return false;
          }
        }
        continue;
      }
      
      // For checkbox type questions, ensure at least one option is selected.
      if (question.type === 'checkbox') {
        if (!Array.isArray(answers[question.id]) || answers[question.id].length === 0) {
          return false;
        }
        continue;
      }
      
      // For all other question types, ensure they have a value
      if (!answers[question.id]) {
        return false;
      }
    }
    
    return true;
  };

  // Validate that we have email before submitting
  const canSubmit = () => {
    // If user is authenticated, they already have an email
    if (isAuthenticated) return isCurrentWindowAnswered();
    
    // For new users, ensure we have an email before allowing submission
    return isCurrentWindowAnswered() && !!answers.email;
  };

  // Handle form submission with UTM parameters
  const handleSubmit = () => {
    silentSignup(answers, utmParams);
  };

  const isLastWindow = currentWindow === windows.length - 1;
  const currentWindowData = currentWindow < windows.length ? windows[currentWindow] : null;
  const isWithinNormalWindowRange = currentWindow < windows.length;

  // Show error if we're on the final window and missing email
  const showEmailRequiredError = isLastWindow && !isAuthenticated && !answers.email;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">⚡ BSF Sign-Up</h1>
        <p className="text-muted-foreground">Turn your breakthrough into a high-performance startup - in 10 days. </p>
        
        {isAuthenticated && user && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
            <p className="font-medium">Welcome back, {user.firstName}!</p>
            <p className="mt-1">
              {hasSprintProfile 
                ? "You can update your sprint profile below." 
                : "Please complete your sprint profile to get started."}
            </p>
          </div>
        )}
      </div>
      
      {/* Email exists alert - only show when on first window and email exists */}
      {currentWindow === 0 && emailExists && !isAuthenticated && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email already registered</AlertTitle>
          <AlertDescription className="mt-2">
            <p>This email is already registered in our system. You need to log in first.</p>
            <Button 
              variant="outline" 
              className="mt-2 flex items-center" 
              onClick={() => handleSendMagicLink(answers.email || '')}
              disabled={!answers.email || isCheckingEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send me a login link
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isWithinNormalWindowRange && (
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Window {currentWindow + 1} of {windows.length}
          </div>
          <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-brand-pink h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${((currentWindow + 1) / windows.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {currentWindowData && (
        <WindowFormFields
          window={currentWindowData}
          values={answers}
          onChange={handleChange}
          onFileUpload={handleFileUpload}
          toggleMultiSelect={toggleMultiSelect}
          uploadedFile={uploadedFile}
        />
      )}
      
      {showEmailRequiredError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="text-sm font-medium">Email is required to create your account.</p>
          <p className="text-xs mt-1">Please navigate to the "Contact Information" window to provide your email.</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousWindow}
          disabled={currentWindow === 0 || isSubmitting || isCheckingEmail}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        {isLastWindow ? (
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit() || isSubmitting || isCheckingEmail || emailExists}
            className="ml-auto"
          >
            {isSubmitting 
              ? (hasSprintProfile ? "Updating your sprint..." : "Creating your sprint...") 
              : (hasSprintProfile ? "Update My Sprint" : "Start My Sprint")} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={goToNextWindow}
            disabled={!isCurrentWindowAnswered() || isCheckingEmail || emailExists}
            className="ml-auto"
          >
            {isCheckingEmail ? "Checking email..." : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SprintSignupForm;
