import { FormikConfig, FormikValues, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

type ChangeDepHandler = (dep: string) => ChangeEventHandler<HTMLInputElement>;

type UseFormAgrs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  handleChangeDep?: ChangeDepHandler;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({ validationSchema, ...args }: UseFormAgrs<Values>) => {
  const { t } = useTranslation();
  const { validateForm, values, ...formik } = useFormik<Values>({
    ...args,
    validate: (values) => {
      try {
        validateYupSchema(values, validationSchema, true, { t });
      } catch (err) {
        return yupToFormErrors(err);
      }
    }
  });

  const handleChangeDep: ChangeDepHandler = (dep: string | string[]) => (e) => {
    formik.validateField(e.target.name);

    if (typeof dep === 'string') {
      setTimeout(() => formik.setFieldValue(dep, e.target.value || undefined, true), 0);
    }

    // setTimeout(() => formik.setFieldValue(dep, e.target.value || undefined, true), 0);
  };

  return {
    values,
    validateForm,
    handleChangeDep,
    ...formik
  };
};

export { useForm };
export type { ChangeDepHandler };
