import { chain } from '@react-aria/utils';
import { FieldInputProps, FormikConfig, FormikErrors as FormErrors, FormikValues, useFormik } from 'formik';
import { FocusEvent, useCallback } from 'react';

type GetFieldProps = (
  nameOrOptions: any,
  withErrorMessage?: boolean
) => FieldInputProps<any> & { errorMessage?: string | string[] };

type UseFormArgs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  showErrorMessages?: boolean;
  showOnlyTouchedFieldsErrors?: boolean;
  getFieldProps?: GetFieldProps;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({
  showErrorMessages,
  showOnlyTouchedFieldsErrors = true,
  ...args
}: UseFormArgs<Values>) => {
  const { validateForm, values, getFieldProps: getFormikFieldProps, setFieldTouched, ...formik } = useFormik<Values>({
    ...args
  });

  // Handles when field gets forced blur to focus on modal
  // If so, we dont want to consider it as touched if it has not yet been touched on
  const handleBlur = useCallback(
    (e: FocusEvent<unknown>, fieldName: string, isTouched: boolean) => {
      if (!isTouched && (e.relatedTarget as HTMLElement)?.getAttribute('role') === 'dialog') {
        setFieldTouched(fieldName, false);
      }
    },
    [setFieldTouched]
  );

  const getFieldProps: GetFieldProps = useCallback(
    (nameOrOptions, withErrorMessage = true) => {
      const fieldProps = getFormikFieldProps(nameOrOptions);

      if (withErrorMessage || showErrorMessages) {
        const isOptions = nameOrOptions !== null && typeof nameOrOptions === 'object';
        const fieldName = isOptions ? nameOrOptions.name : nameOrOptions;

        const isTouched = formik.touched[fieldName];
        const errorMessage = showOnlyTouchedFieldsErrors && isTouched ? formik.errors[fieldName] : undefined;

        return {
          ...fieldProps,
          onBlur: chain(fieldProps.onBlur, (e: FocusEvent<unknown>) => handleBlur(e, fieldName, isTouched as boolean)),
          errorMessage: errorMessage as string | string[] | undefined
        };
      }

      return fieldProps;
    },
    [getFormikFieldProps, showErrorMessages, formik.touched, formik.errors, showOnlyTouchedFieldsErrors, handleBlur]
  );

  return {
    values,
    validateForm,
    getFieldProps,
    setFieldTouched,
    ...formik
  };
};

export { useForm };
export type { FormErrors };
