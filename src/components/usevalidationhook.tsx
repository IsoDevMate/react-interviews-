import React, { useCallback } from 'react';
type ValidationRules<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

type FormErrors<T> = {
  [K in keyof T]?: string; //mapped type to create an object to iterate over keys
};

export default function useFormValidation<T extends Record<string, any>>(
  initialState: T,
  validationRules: ValidationRules<T>,
) {
  const [error, setError] = React.useState<FormErrors<T>>({});
  const [values, setValues] = React.useState<T>(initialState);

  //validate function that checks the current values against the validation rules and updates the error state acordingly
  const validate = useCallback(() => {
    //nitialization
    const newErrors: FormErrors<T> = {};


    // Object.keys(validationRules).forEach((key) => {
    //   const value = values[key as keyof T];
    //   const isValid = validationRules[key as keyof T](value);
    //   if (!isValid) {
    //     newErrors[key as keyof T] = `${key} is invalid`;
    //   }
    // });

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
  const handleInputChange=(field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [field]: e.target.value,
    });
  };

  return {
    values,
    error,
    validate,
    handleInputChange,
  };
}
