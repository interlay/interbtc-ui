import { FormikConfig, FormikValues, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type ChangeDepHandler = (dep: string) => ChangeEventHandler<HTMLInputElement>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({
  validationSchema,
  params,
  ...args
}: FormikConfig<Values> & { params?: any; handleChangeDep?: ChangeDepHandler }) => {
  const { t } = useTranslation();
  const { validateForm, values, ...formik } = useFormik<Values>({
    ...args,
    validate: (values) => {
      try {
        validateYupSchema(values, validationSchema, true, { t, params });
      } catch (err) {
        return yupToFormErrors(err);
      }
    }
  });

  const handleChangeDep: ChangeDepHandler = (dep: string) => (e) => {
    formik.validateField(e.target.name);
    setTimeout(() => formik.setFieldValue(dep, e.target.value || undefined, true), 0);
  };

  return {
    validateForm,
    values,
    handleChangeDep,
    ...formik
  };
};

export { useForm };
