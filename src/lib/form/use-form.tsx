import { FieldInputProps, FormikConfig, FormikErrors as FormErrors, FormikValues, useFormik } from 'formik';
import { useCallback } from 'react';

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
  const { validateForm, values, getFieldProps: getFormikFieldProps, ...formik } = useFormik<Values>({
    ...args
  });

  const getFieldProps: GetFieldProps = useCallback(
    (nameOrOptions, withErrorMessage = true) => {
      if (withErrorMessage || showErrorMessages) {
        const isOptions = nameOrOptions !== null && typeof nameOrOptions === 'object';
        const fieldName = isOptions ? nameOrOptions.name : nameOrOptions;

        const isTouched = formik.touched[fieldName];
        const errorMessage = showOnlyTouchedFieldsErrors && isTouched ? formik.errors[fieldName] : undefined;

        return {
          ...getFormikFieldProps(nameOrOptions),
          errorMessage: errorMessage as string | string[] | undefined
        };
      }

      return getFormikFieldProps(nameOrOptions);
    },
    [formik.errors, formik.touched, getFormikFieldProps, showOnlyTouchedFieldsErrors, showErrorMessages]
  );

  return {
    values,
    validateForm,
    getFieldProps,
    ...formik
  };
};

export { useForm };
export type { FormErrors };
