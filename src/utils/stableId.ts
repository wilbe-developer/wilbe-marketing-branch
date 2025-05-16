
/**
 * Utility for generating and validating stable IDs throughout the application
 * Prevents inconsistencies between editor views and database
 */
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a stable UUID with fallback to timestamp-based ID if UUID generation fails
 * @returns A valid UUID string
 */
export const generateStableId = (): string => {
  try {
    return uuidv4();
  } catch (error) {
    console.error("UUID generation failed, using timestamp fallback:", error);
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
};

/**
 * Validates if a string is a valid UUID format
 * @param id The ID string to validate
 * @returns Boolean indicating if the ID is a valid UUID
 */
export const isValidUuid = (id: string): boolean => {
  if (!id) return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Ensures an ID is valid, generating a new one if necessary
 * @param id The ID to validate
 * @returns A valid ID (either the original if valid, or a new one)
 */
export const ensureValidId = (id?: string): string => {
  if (id && isValidUuid(id)) return id;
  return generateStableId();
};

/**
 * Deep processes an object to ensure all IDs are valid
 * @param obj The object to process
 * @param idField The field name that contains IDs (default: 'id')
 * @returns The processed object with valid IDs
 */
export const ensureValidIdsInObject = <T extends Record<string, any>>(
  obj: T, 
  idField: string = 'id'
): T => {
  if (!obj) return obj;
  
  const result = { ...obj } as T;
  
  // Process direct ID on the object
  if (idField in result) {
    const objAny = result as any;
    objAny[idField] = ensureValidId(objAny[idField]);
  }
  
  // Process arrays recursively
  Object.keys(result).forEach(key => {
    const value = (result as any)[key];
    
    if (Array.isArray(value)) {
      (result as any)[key] = value.map(item => {
        if (item && typeof item === 'object') {
          return ensureValidIdsInObject(item, idField);
        }
        return item;
      });
    } else if (value && typeof value === 'object') {
      (result as any)[key] = ensureValidIdsInObject(value, idField);
    }
  });
  
  return result;
};
