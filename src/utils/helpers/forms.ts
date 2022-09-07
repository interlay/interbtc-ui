import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

/**
 * @param {FieldError} error - The error provided by react-hook-forms
 * @return {ReactNode | ReactNode[]} The messsage(s) to be displayed
 */
const getErrorMessage = (error?: FieldError): ReactNode | ReactNode[] =>
  error?.types ? Object.values(error.types).flat() : error?.message;

export { getErrorMessage };
