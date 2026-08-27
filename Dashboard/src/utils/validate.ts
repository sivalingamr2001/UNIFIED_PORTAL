export type FieldErrors = Record<string, string>;

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any, data: any) => string | undefined;
  message?: string;
}

export type Schema = Record<string, ValidationRule>;

export interface ValidationResult<T> {
  fieldErrors?: FieldErrors;
  data: T;
}

export function validate<T>(schema: Schema, data: any): ValidationResult<T> {
  const fieldErrors: FieldErrors = {};
  const validatedData: any = { ...data };

  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key];

    // Required check
    if (rule.required) {
      if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
        fieldErrors[key] = rule.message ?? `${key} is required`;
        continue;
      }
    }

    // Skip further checks if empty and not required
    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      continue;
    }

    // Min check (for number or string length)
    if (rule.min !== undefined) {
      if (typeof value === "number" && value < rule.min) {
        fieldErrors[key] = rule.message ?? `Must be at least ${rule.min}`;
      } else if (typeof value === "string" && value.length < rule.min) {
        fieldErrors[key] = rule.message ?? `Must be at least ${rule.min} characters`;
      }
    }

    // Max check
    if (rule.max !== undefined) {
      if (typeof value === "number" && value > rule.max) {
        fieldErrors[key] = rule.message ?? `Must be at most ${rule.max}`;
      } else if (typeof value === "string" && value.length > rule.max) {
        fieldErrors[key] = rule.message ?? `Must be at most ${rule.max} characters`;
      }
    }

    // Pattern check
    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      fieldErrors[key] = rule.message ?? `Invalid format`;
    }

    // Custom validator check
    if (rule.custom) {
      const customError = rule.custom(value, data);
      if (customError) {
        fieldErrors[key] = customError;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, data: validatedData };
  }

  return { data: validatedData };
}
