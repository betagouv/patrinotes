import { useEffect, useRef } from "react";
import {
  type FieldValues,
  type UseFormProps,
  useForm,
  type UseFormRegister,
  type FieldPath,
  type RegisterOptions,
  UseFormReturn,
} from "react-hook-form";
import { Report, Service, StateReport } from "../db/AppSchema";

export function useFormWithFocus<TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues, any>,
) {
  const form = useForm<TFieldValues>(props);
  const focusedRef = useRef<string | null>(null);

  const unsafeForm = form as any;

  if (!unsafeForm.done) {
    unsafeForm.oldRegister = form.register;
    unsafeForm.done = true;
  }

  const register: UseFormRegister<TFieldValues> = <
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(
    name: TFieldName,
    options?: RegisterOptions<TFieldValues, TFieldName>,
  ) => {
    const { onBlur, ...registered } = (form as any).oldRegister(name, options);
    return {
      ...registered,
      onFocus: () => {
        focusedRef.current = name;
      },
      onBlur: (e) => {
        focusedRef.current = null;
        return onBlur?.(e);
      },
    };
  };

  form.register = register;

  return [form, () => focusedRef.current] as const;
}

export const useRefreshForm = <FormType extends FieldValues>({
  values,
  getFocused,
  form,
}: {
  form: UseFormReturn<FormType>;
  values: FormType;
  getFocused: () => string | null;
}) => {
  const previousValuesRef = useRef<FormType>(values);

  useEffect(() => {
    if (!values) return;
    const previousValues = previousValuesRef.current;
    const focused = getFocused();

    for (const key in previousValues) {
      if ((previousValues as any)[key] !== (values as any)[key]) {
        const fieldState = form.getFieldState(key as any);
        const hasFocus = key === focused;

        if (!hasFocus || !fieldState.isDirty) {
          form.setValue(key as any, (values as any)[key]);
        }
      }
    }

    previousValuesRef.current = values;
  }, [values]);
};
