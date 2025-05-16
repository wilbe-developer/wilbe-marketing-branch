
import { TaskDefinition, StepNode, ProfileQuestion } from "@/types/task-builder";

export interface ValidationError {
  field: string;
  message: string;
  path?: string[];
}

export const validateStepNode = (step: StepNode, path: string[] = []): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!step.id) {
    errors.push({
      field: 'id',
      message: 'Step ID is required',
      path: [...path, 'id']
    });
  }

  if (!step.type) {
    errors.push({
      field: 'type',
      message: 'Step type is required',
      path: [...path, 'type']
    });
  }

  if (!step.text) {
    errors.push({
      field: 'text',
      message: 'Step text is required',
      path: [...path, 'text']
    });
  }

  if (step.type === 'question' && step.inputType === 'radio' || 
      step.type === 'question' && step.inputType === 'select' || 
      step.type === 'question' && step.inputType === 'multiselect') {
    if (!step.options || step.options.length === 0) {
      errors.push({
        field: 'options',
        message: `Options are required for ${step.inputType} input type`,
        path: [...path, 'options']
      });
    } else {
      step.options.forEach((option, index) => {
        if (!option.label) {
          errors.push({
            field: `options[${index}].label`,
            message: `Option ${index + 1} label is required`,
            path: [...path, 'options', index.toString(), 'label']
          });
        }
        if (!option.value) {
          errors.push({
            field: `options[${index}].value`,
            message: `Option ${index + 1} value is required`,
            path: [...path, 'options', index.toString(), 'value']
          });
        }
      });
    }
  }

  // Validate children recursively
  if (step.children && step.children.length > 0) {
    step.children.forEach((childStep, index) => {
      const childErrors = validateStepNode(childStep, [...path, 'children', index.toString()]);
      errors.push(...childErrors);
    });
  }

  return errors;
};

export const validateProfileQuestion = (question: ProfileQuestion, index: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  const path = ['profileQuestions', index.toString()];

  if (!question.key) {
    errors.push({
      field: `profileQuestions[${index}].key`,
      message: 'Profile question key is required',
      path: [...path, 'key']
    });
  } else if (!/^[a-zA-Z0-9_]+$/.test(question.key)) {
    errors.push({
      field: `profileQuestions[${index}].key`,
      message: 'Profile question key must contain only letters, numbers, and underscores',
      path: [...path, 'key']
    });
  }

  if (!question.text) {
    errors.push({
      field: `profileQuestions[${index}].text`,
      message: 'Profile question text is required',
      path: [...path, 'text']
    });
  }

  if (!question.type) {
    errors.push({
      field: `profileQuestions[${index}].type`,
      message: 'Profile question type is required',
      path: [...path, 'type']
    });
  }

  if ((question.type === 'select' || question.type === 'multiselect') && 
      (!question.options || question.options.length === 0)) {
    errors.push({
      field: `profileQuestions[${index}].options`,
      message: 'Options are required for select/multiselect question types',
      path: [...path, 'options']
    });
  }

  return errors;
};

export const validateTaskDefinition = (definition: TaskDefinition): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!definition.taskName) {
    errors.push({
      field: 'taskName',
      message: 'Task name is required',
      path: ['taskName']
    });
  }

  if (!definition.steps || !Array.isArray(definition.steps)) {
    errors.push({
      field: 'steps',
      message: 'Steps must be a valid array',
      path: ['steps']
    });
  } else if (definition.steps.length === 0) {
    errors.push({
      field: 'steps',
      message: 'At least one step is required',
      path: ['steps']
    });
  } else {
    definition.steps.forEach((step, index) => {
      const stepErrors = validateStepNode(step, ['steps', index.toString()]);
      errors.push(...stepErrors);
    });
  }

  if (!Array.isArray(definition.profileQuestions)) {
    errors.push({
      field: 'profileQuestions',
      message: 'Profile questions must be an array',
      path: ['profileQuestions']
    });
  } else {
    definition.profileQuestions.forEach((question, index) => {
      const questionErrors = validateProfileQuestion(question, index);
      errors.push(...questionErrors);
    });
  }

  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';

  if (errors.length === 1) {
    return errors[0].message;
  }

  return 'Validation errors:\n' + errors.map(err => `- ${err.message}`).join('\n');
};
