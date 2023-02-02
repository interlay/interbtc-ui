import { newMonetaryAmount } from '@interlay/interbtc-api';
import { FormikConfig, FormikValues, useFormik, validateYupSchema, yupToFormErrors } from 'formik';
import { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useGetBalances } from '@/utils/hooks/api/tokens/use-get-balances';

import { YupContext } from './yup.custom';

type ChangeDepHandler = (dep: string) => ChangeEventHandler<HTMLInputElement>;

type UseFormAgrs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  params?: YupContext['params'];
  handleChangeDep?: ChangeDepHandler;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({
  validationSchema,
  params,
  ...args
}: UseFormAgrs<Values>) => {
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
