import React from 'react';
import useFormValidation from './usevalidationhook';

interface FormValues {
  email: string;
  password: string;
  // [key: string]: unknown;
}

export const TryForm: React.FC = () => {
  const MIN_LENGTH: number = 6;
  const { values, handleInputChange, validate, error } =
    useFormValidation<FormValues>(
      {
        email: '',
        password: '',
      },
      {
        email: (value: string) => value.includes('@'),
        password: (value: string) => value.length >= MIN_LENGTH,
      },
    );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { isValid, errors } = validate();

    if (isValid) {
      console.log('Form is valid, submitting...', values);
      // Submit logic here
    } else {
      console.log('Form validation failed', errors);
    }
  };

  // Create an event handler that adapts React's onChange event to your hook's format
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleInputChange(name as keyof FormValues, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {error.email && (
          <p className="mt-1 text-sm text-red-600">{error.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {error.password && (
          <p className="mt-1 text-sm text-red-600">{error.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};
