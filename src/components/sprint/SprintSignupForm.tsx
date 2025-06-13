import React, { useState } from "react";
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [fieldValidation, setFieldValidation] = useState<Record<string, { isValid: boolean; canonicalValue?: string }>>({});
  
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
  
  const { isAuthenticated } = useAuth();

  const handleValidationChange = (field: string, isValid: boolean, canonicalValue?: string) => {
    setFieldValidation(prev => ({
      ...prev,
      [field]: { isValid, canonicalValue }
    }));
    
    // Clear validation error if field becomes valid
    if (isValid && validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const isQuestionRequired = (question: any) => {
    // File uploads remain optional
    if (question.type === 'file') return false;
    
    // Special handling for LinkedIn opt-out checkbox
    if (question.type === 'checkbox' && question.id === 'linkedin_opt_out') {
      // Check if LinkedIn field has a valid value
      const linkedinValue = answers['linkedin'];
      const hasValidLinkedin = linkedinValue && 
        typeof linkedinValue === 'string' && 
        linkedinValue.trim() !== '' &&
        fieldValidation['linkedin']?.isValid;
      
      // If LinkedIn is valid, the checkbox is not required
      if (hasValidLinkedin) {
        return false;
      }
    }
    
    // Check if field is opted out
    const isOptedOut = question.optOutField && answers[question.optOutField];
    if (isOptedOut) return false;
    
    // Return the required status
    return question.required !== false; // Default to required unless explicitly set to false
  };

  const isConditionalQuestionVisible = (question: any) => {
    if (question.type !== 'conditional' || !question.conditional) return false;
    
    return question.conditional.some(condition => 
      answers[condition.field] === condition.value
    );
  };

  const isCurrentWindowAnswered = () => {
    const currentWindowData = windows[currentWindow];
    if (!currentWindowData) return false;
    
    // Check if all required fields in the current window are answered and valid
    for (const question of currentWindowData.questions) {
      // For conditional questions, check if they should be answered
      if (question.type === 'conditional') {
        const shouldShow = isConditionalQuestionVisible(question);
        if (shouldShow && isQuestionRequired(question) && !answers[question.id]) {
          return false;
        }
        continue;
      }
      
      // Check if field is required
      if (!isQuestionRequired(question)) {
        continue;
      }
      
      // Check if the field has an answer
      if (!answers[question.id]) {
        return false;
      }
      
      // For checkbox type questions, ensure at least one option is selected
      if (question.type === 'checkbox' && question.options) {
        if (!Array.isArray(answers[question.id]) || answers[question.id].length === 0) {
          return false;
        }
        continue;
      }
      
      // For select type questions, ensure a valid option is selected
      if (question.type === 'select' && question.options) {
        const selectedValue = answers[question.id];
        const validOptions = question.options.map(opt => opt.value);
        if (!validOptions.includes(selectedValue)) {
          return false;
        }
        continue;
      }
      
      // For text/textarea, ensure non-empty string
      if ((question.type === 'text' || question.type === 'textarea' || question.type === 'email') && question.id !== 'email' && question.id !== 'linkedin') {
        const value = answers[question.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return false;
        }
        continue;
      }
      
      // Special handling for LinkedIn field with opt-out
      if (question.id === 'linkedin' && question.optOutField) {
        const hasValue = answers[question.id] && typeof answers[question.id] === 'string' && answers[question.id].trim() !== '';
        const isOptedOut = answers[question.optOutField];
        
        // Can proceed if: 
        // 1. Has valid LinkedIn URL (regardless of checkbox), OR
        // 2. Opted out and field is empty
        if (hasValue) {
          // If there's a value, it must be valid
          const validation = fieldValidation[question.id];
          if (!validation || !validation.isValid) {
            return false;
          }
        } else if (!isOptedOut) {
          // If no value and not opted out, it's required
          return false;
        }
        continue;
      }
      
      // Check validation for other fields with validation rules
      if (question.validation && answers[question.id]) {
        const validation = fieldValidation[question.id];
        if (!validation || !validation.isValid) {
          return false;
        }
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

  // Handle form submission with UTM parameters and canonical LinkedIn
  const handleSubmit = () => {
    // Use canonical LinkedIn value if available
    const linkedinValidation = fieldValidation['linkedin'];
    const submissionAnswers = { ...answers };
    
    if (linkedinValidation?.canonicalValue) {
      submissionAnswers.linkedin = linkedinValidation.canonicalValue;
    }
    
    silentSignup(submissionAnswers, utmParams);
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
        <p className="text-muted-foreground">Scientists and engineers hold the keys to the solutions we need for this century. Tell us a bit about you and what you are working on so that we can generate a tailored guided path for you to turn your breakthrough into a high-performance company - in 10 days.</p>
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
          validationErrors={validationErrors}
          onValidationChange={handleValidationChange}
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
