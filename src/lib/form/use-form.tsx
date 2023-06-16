import { chain } from '@react-aria/utils';
import { FieldInputProps, FormikConfig, FormikErrors as FormErrors, FormikValues, useFormik } from 'formik';
import { FocusEvent, useCallback } from 'react';

type GetFieldProps = (
  nameOrOptions: any,
  withErrorMessage?: boolean,
  onlyTouchedError?: boolean
) => FieldInputProps<any> & { errorMessage?: string | string[] };

type UseFormArgs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  hideErrorMessages?: boolean;
  getFieldProps?: GetFieldProps;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({ hideErrorMessages, ...args }: UseFormArgs<Values>) => {
  const { validateForm, values, getFieldProps: getFormikFieldProps, setFieldTouched, ...formik } = useFormik<Values>(
    args
  );

  // Handles when field gets forced blur to focus on modal
  // If so, we dont want to consider it as touched if it has not yet been touched on
  const handleBlur = useCallback(
    (e: FocusEvent<unknown>, fieldName: string, isTouched: boolean) => {
      if (!isTouched) {
        const relatedTargetEl = e.relatedTarget as HTMLElement;
        const targetEl = e.target as HTMLElement;

        if (!relatedTargetEl || !targetEl) return;

        const isModal = relatedTargetEl.getAttribute('role') === 'dialog';

        if (!isModal) return;

        const modalId = relatedTargetEl.getAttribute('id');
        const buttonAriaControls = targetEl.getAttribute('aria-controls');

        if (!modalId || !buttonAriaControls) return;

        const isSelect = buttonAriaControls === modalId;

        if (!isSelect) return;

        setFieldTouched(fieldName, false);
      }
    },
    [setFieldTouched]
  );

  const getFieldProps: GetFieldProps = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (nameOrOptions, hideErrorMessage, showUntouchedErrorMessage) => {
      const fieldProps = getFormikFieldProps(nameOrOptions);

      const hideError = hideErrorMessage && hideErrorMessages;

      if (!hideError) {
        const isOptions = nameOrOptions !== null && typeof nameOrOptions === 'object';
        const fieldName = isOptions ? nameOrOptions.name : nameOrOptions;

        const isTouched = formik.touched[fieldName];

        const errorMessage = showUntouchedErrorMessage
          ? formik.errors[fieldName]
          : isTouched
          ? formik.errors[fieldName]
          : undefined;

        return {
          ...fieldProps,
          onBlur: chain(fieldProps.onBlur, (e: FocusEvent<unknown>) => handleBlur(e, fieldName, isTouched as boolean)),
          errorMessage: errorMessage as string | string[] | undefined
        };
      }

      return fieldProps;
    },
    [getFormikFieldProps, hideErrorMessages, formik.touched, formik.errors, handleBlur]
  );

  return {
    values,
    validateForm,
    getFieldProps,
    setFieldTouched,
    ...formik
  };
};

export { useForm };
export type { FormErrors };
