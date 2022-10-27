import { DeepRequired, FieldError, FieldErrorsImpl } from 'react-hook-form';

/**
 * @param {FieldError} error - The error provided by react-hook-forms
 * @return {undefined | string | string[]} The messsage(s) to be displayed
 */
const getErrorMessage = (error?: FieldError): undefined | string | string[] =>
  error?.types
    ? (Object.values(error.types)
        .flat()
        .filter((message) => typeof message === 'string') as string[])
    : error?.message;

const isValidForm = <T = Record<string, unknown>>(errors: FieldErrorsImpl<DeepRequired<T>> = {}): boolean =>
  !Object.keys(errors).length;

export { getErrorMessage, isValidForm };
