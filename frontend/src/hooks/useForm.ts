'use client';

import { useState, useCallback } from 'react';
import { ValidationRules, ValidationErrors, validateForm } from '@/lib/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: ValidationErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: string | number) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<boolean>;
  setFieldValue: (field: keyof T, value: string | number) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearAllErrors: () => void;
  reset: () => void;
  isValid: boolean;
}

export function useForm<T extends Record<string, string | number>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<keyof T, boolean>
    )
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T, value: string | number) => {
      if (!validationRules[field as string]) return;

      const fieldErrors = validateForm(
        { [field]: value } as Record<string, string | number>,
        { [field as string]: validationRules[field as string] }
      );

      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field as string],
      }));
    },
    [validationRules]
  );

  // Handle field change
  const handleChange = useCallback(
    (field: keyof T, value: string | number) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Validate on change if field has been touched
      if (touched[field]) {
        validateField(field, value);
      }
    },
    [touched, validateField]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, values[field]);
    },
    [values, validateField]
  );

  // Set field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Clear error for a field
  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      )
    );
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      setTouched(
        Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Record<keyof T, boolean>
        )
      );

      // Validate all fields
      const formErrors = validateForm(
        values as Record<string, string | number>,
        validationRules
      );
      setErrors(formErrors);

      // Check if there are errors
      if (Object.keys(formErrors).length > 0) {
        return false;
      }

      // Submit form
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
          return true;
        } catch (error) {
          console.error('Form submission error:', error);
          return false;
        } finally {
          setIsSubmitting(false);
        }
      }

      return true;
    },
    [values, validationRules, onSubmit]
  );

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearError,
    clearAllErrors,
    reset,
    isValid,
  };
}
