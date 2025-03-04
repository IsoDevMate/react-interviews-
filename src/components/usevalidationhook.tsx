

type ValidationRules<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

export default function useFormValidation<T extends Record<string, any>>(
    initialState: T,
    validationRules: ValidationRules<T>
) {

}
