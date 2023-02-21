import { FieldInputProps, FormikConfig, FormikValues, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type GetFieldProps = (
  nameOrOptions: any,
  withErrorMessage?: boolean
) => FieldInputProps<any> & { errorMessage?: string | string[] };

type UseFormArgs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  disableValidation?: boolean;
  // makes error messages display only when field is touched
  validateOnIndividualBlur?: boolean;
  getFieldProps?: GetFieldProps;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({
  validationSchema,
  disableValidation,
  validateOnIndividualBlur = true,
  ...args
}: UseFormArgs<Values>) => {
  const { t } = useTranslation();
  const { validateForm, values, getFieldProps: getFormikFieldProps, touched, ...formik } = useFormik<Values>({
    ...args,
    validate: (values) => {
      if (disableValidation) return;

      try {
        validateYupSchema(values, validationSchema, true, { t });
      } catch (err) {
        return yupToFormErrors(err);
      }
    }
  });

  const getFieldProps: GetFieldProps = useCallback(
    (nameOrOptions, withErrorMessage = true) => {
      if (withErrorMessage) {
        const isOptions = nameOrOptions !== null && typeof nameOrOptions === 'object';
        const fieldName = isOptions ? nameOrOptions.name : nameOrOptions;

        if (validateOnIndividualBlur && !touched[fieldName]) {
          return getFormikFieldProps(nameOrOptions);
        }

        return {
          ...getFormikFieldProps(nameOrOptions),
          errorMessage: formik.errors[fieldName] as string | string[] | undefined
        };
      }

      return getFormikFieldProps(nameOrOptions);
    },
    [formik.errors, getFormikFieldProps, touched, validateOnIndividualBlur]
  );

  return {
    values,
    validateForm,
    getFieldProps,
    touched,
    ...formik
  };
};

export { useForm };
