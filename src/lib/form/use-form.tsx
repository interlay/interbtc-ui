import { FieldInputProps, FormikConfig, FormikValues, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type GetFieldProps = (
  nameOrOptions: any,
  withErrorMessage?: boolean
) => FieldInputProps<any> & { errorMessage?: string | string[] };

type UseFormArgs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  disableValidation?: boolean;
  getFieldProps?: GetFieldProps;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({
  validationSchema,
  disableValidation,
  ...args
}: UseFormArgs<Values>) => {
  const { t } = useTranslation();
  const { validateForm, values, getFieldProps: getFormikFieldProps, ...formik } = useFormik<Values>({
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
        const errorMessage = isOptions ? formik.errors[nameOrOptions.name] : formik.errors[nameOrOptions];

        return {
          ...getFormikFieldProps(nameOrOptions),
          errorMessage: errorMessage as string | string[] | undefined
        };
      }

      return getFormikFieldProps(nameOrOptions);
    },
    [formik.errors, getFormikFieldProps]
  );

  return {
    values,
    validateForm,
    getFieldProps,
    ...formik
  };
};

export { useForm };
