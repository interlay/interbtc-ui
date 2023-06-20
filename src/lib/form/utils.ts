import { useForm } from './use-form';

const isFormDisabled = (form: ReturnType<typeof useForm>): boolean => !form.isValid || !form.dirty;

export { isFormDisabled };
