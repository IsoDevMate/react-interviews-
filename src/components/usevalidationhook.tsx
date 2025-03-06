import React, { useCallback } from 'react';
type ValidationRules<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

type FormErrors<T> = {
  [K in keyof T]?: string; //mapped type to create an object to iterate over keys
};

type FormValues<T> = {
  [K in keyof T]: T[K];
};

export default function useFormValidation<T extends FormValues<T>>(
  initialState: T,
  validationRules: ValidationRules<T>,
) {
  const [error, setError] = React.useState<FormErrors<T>>({});
  const [values, setValues] = React.useState<T>(initialState);

  //validate function that checks the current values against the validation rules and updates the error state acordingly
  const validate = useCallback(() => {
    //nitialization
    const newErrors: FormErrors<T> = {};


    //iteration over validation rules
    (Object.keys(validationRules) as Array<keyof T>).forEach((key) => {
      //check validations
      const rule = validationRules[key];
      const value = values[key];

      // Eror handling
      if (!rule(value)) {
        newErrors[key] = `Invalid ${String(key)}`;
      }
    });

    setError(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [values, validationRules]);

  //handle input change function
 const handleInputChange = useCallback((key: keyof T, value: T[keyof T]) => {
   setValues((prev) => ({ ...prev, [key]: value }));
   setError((prev) => ({ ...prev, [key]: undefined })); // Clear error on change
 }, []);


  return {
    values,
    error,
    validate,
    handleInputChange,
  };
}
