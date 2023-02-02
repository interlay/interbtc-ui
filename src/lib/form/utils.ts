import { useForm } from './use-form';

const isFormDisabled = (form: ReturnType<typeof useForm>): boolean => !form.isValid || !form.dirty;

// const getFormFieldProps = (form: ReturnType<typeof useForm>, )

export { isFormDisabled };
