
import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { ensureValidIdsInObject } from "@/utils/stableId";

/**
 * Parses and validates a task definition from various possible formats
 */
export const parseTaskDefinition = (
  rawDefinition: unknown,
  fallbackName: string = "Unnamed Task"
): TaskDefinition => {
  try {
    // Parse definition if it's a string
    let parsedDefinition: TaskDefinition;
    
    if (typeof rawDefinition === 'string') {
      parsedDefinition = JSON.parse(rawDefinition) as TaskDefinition;
    } else if (rawDefinition && typeof rawDefinition === 'object') {
      // Create a deep clone to avoid reference issues
      const definitionObj = JSON.parse(JSON.stringify(rawDefinition)) as Record<string, any>;
      parsedDefinition = {
        taskName: definitionObj.taskName || fallbackName,
        steps: Array.isArray(definitionObj.steps) ? definitionObj.steps : [],
        profileQuestions: Array.isArray(definitionObj.profileQuestions) 
          ? definitionObj.profileQuestions 
          : [],
        // Copy any other properties
        ...definitionObj
      };
    } else {
      throw new Error("Invalid definition format");
    }
      
    // Ensure required properties exist
    if (!parsedDefinition.taskName) {
      console.warn(`Task missing taskName, adding default: ${fallbackName}`);
      parsedDefinition.taskName = fallbackName;
    }
    
    if (!Array.isArray(parsedDefinition.steps)) {
      console.warn(`Task missing steps array, adding empty array`);
      parsedDefinition.steps = [];
    } else {
      // Ensure valid IDs for steps
      parsedDefinition.steps = parsedDefinition.steps.map(step => ({
        ...step,
        id: ensureValidIdsInObject(step).id
      }));
    }
    
    if (!Array.isArray(parsedDefinition.profileQuestions)) {
      console.warn(`Task missing profileQuestions array, adding empty array`);
      parsedDefinition.profileQuestions = [];
    }
    
    // Process the entire definition to ensure valid IDs
    parsedDefinition = ensureValidIdsInObject(parsedDefinition);
    
    return parsedDefinition;
  } catch (err) {
    console.error("Error processing task definition:", err);
    // Return a minimal valid task definition
    return {
      taskName: fallbackName,
      description: "This task definition has invalid data.",
      profileQuestions: [],
      steps: []
    };
  }
};

/**
 * Processes a raw task definition from the database into a valid SprintTaskDefinition
 */
export const processTaskDefinition = (
  item: any
): SprintTaskDefinition => {
  try {
    const parsedDefinition = parseTaskDefinition(
      item.definition, 
      item.name || "Unnamed Task"
    );
    
    return {
      ...item,
      definition: parsedDefinition
    };
  } catch (err) {
    console.error("Error processing task definition:", err, item);
    // Return a minimal valid task definition
    return {
      ...item,
      definition: {
        taskName: item.name || "Error: Invalid Definition",
        description: "This task definition has invalid JSON data.",
        profileQuestions: [],
        steps: []
      } as TaskDefinition
    };
  }
};
