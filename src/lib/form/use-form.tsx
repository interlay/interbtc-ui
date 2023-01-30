import { FormikConfig, FormikValues, useFormik } from 'formik';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>(args: FormikConfig<Values>) => {
  const { validateForm, values, ...formik } = useFormik<Values>(args);

  useEffect(() => {
    validateForm(values);
  }, [validateForm, values]);

  return { validateForm, values, ...formik };
};

export { useForm };
