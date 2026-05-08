// Validation utilities for forms

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  min?: number;
  max?: number;
  match?: string; // field name to match (for passwords)
  custom?: (value: string | number, formData: Record<string, string | number>) => string | undefined;
}

export interface ValidationRules {
  [field: string]: ValidationRule;
}

export interface ValidationErrors {
  [field: string]: string;
}

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex pattern (international format)
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

// Validate a single field
export function validateField(
  field: string,
  value: string | number | undefined,
  rule: ValidationRule,
  formData: Record<string, string | number>
): string | undefined {
  // Required check
  if (rule.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return undefined;
  }

  const stringValue = value.toString();

  // Min length
  if (rule.minLength !== undefined && stringValue.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  // Max length
  if (rule.maxLength !== undefined && stringValue.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`;
  }

  // Pattern
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return 'Invalid format';
  }

  // Email
  if (rule.email && !EMAIL_REGEX.test(stringValue)) {
    return 'Please enter a valid email address';
  }

  // Phone
  if (rule.phone && !PHONE_REGEX.test(stringValue)) {
    return 'Please enter a valid phone number';
  }

  // Min value (for numbers)
  if (rule.min !== undefined && Number(value) < rule.min) {
    return `Must be at least ${rule.min}`;
  }

  // Max value (for numbers)
  if (rule.max !== undefined && Number(value) > rule.max) {
    return `Must be no more than ${rule.max}`;
  }

  // Match another field
  if (rule.match && formData[rule.match] !== value) {
    return 'Fields do not match';
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value, formData);
  }

  return undefined;
}

// Validate entire form
export function validateForm(
  formData: Record<string, string | number>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const error = validateField(field, formData[field], rule, formData);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Check if form has any errors
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Common validation rules presets
export const validationPresets = {
  email: {
    required: true,
    email: true,
    maxLength: 255,
  } as ValidationRule,

  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, // At least one lowercase, one uppercase, one number
  } as ValidationRule,

  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/, // Letters, spaces, hyphens, apostrophes
  } as ValidationRule,

  phone: {
    required: true,
    phone: true,
  } as ValidationRule,

  date: {
    required: true,
    custom: (value: string | number) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        return 'Date cannot be in the past';
      }
      return undefined;
    },
  } as ValidationRule,
};

// Format phone number for display
export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return value;
}

// Sanitize input (basic XSS prevention)
export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/&/g, '&amp;');
}
