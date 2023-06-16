import { useForm } from './use-form';

const isFormDisabled = (form: ReturnType<typeof useForm>): boolean => !form.isValid || !form.dirty;

const isFormComplete = (form: ReturnType<typeof useForm>, ingoreKeys: string[]): boolean =>
  !Object.keys(form.errors).filter((errorKey) => !ingoreKeys.includes(errorKey)).length;

export { isFormComplete, isFormDisabled };
