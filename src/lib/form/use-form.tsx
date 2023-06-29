import { chain } from '@react-aria/utils';
import { FieldInputProps, FormikConfig, FormikErrors as FormErrors, FormikValues, useFormik } from 'formik';
import { FocusEvent, Key, useCallback } from 'react';
import { useDebounce } from 'react-use';

const getFieldName = (nameOrOptions: any) => {
  const isOptions = nameOrOptions !== null && typeof nameOrOptions === 'object';
  return isOptions ? nameOrOptions.name : nameOrOptions;
};

type GetFieldProps = (
  nameOrOptions: any,
  hideErrorMessage?: boolean,
  hideUntouchedError?: boolean
) => FieldInputProps<any> & {
  errorMessage?: string | string[];
};

type GetSelectFieldProps = (
  nameOrOptions: any,
  hideErrorMessage?: boolean,
  hideUntouchedError?: boolean
) => Omit<ReturnType<GetFieldProps>, 'onChange'> & { onSelectionChange?: (key: Key) => void };

type UseFormArgs<Values extends FormikValues = FormikValues> = FormikConfig<Values> & {
  hideErrorMessages?: boolean;
  onComplete?: (form: Values) => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useForm = <Values extends FormikValues = FormikValues>({
  hideErrorMessages,
  onComplete,
  ...args
}: UseFormArgs<Values>) => {
  const {
    validateForm,
    values,
    getFieldProps: getFormikFieldProps,
    setFieldTouched,
    setFieldValue,
    ...formik
  } = useFormik<Values>(args);

  // emits onComplete event based on debounced values, only if form is modified and valid
  // meaning that it will only check for completeness in 250ms interval of no changes to the values
  useDebounce(
    () => {
      if (!formik.isValid || !formik.dirty) return;

      onComplete?.(values);
    },
    250,
    // do not run debounce if onComplete is not passed
    onComplete ? [values] : []
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
    (
      nameOrOptions: any,
      hideErrorMessage?: boolean,
      hideUntouchedError?: boolean
      // type: 'input' | 'select' = 'input'
    ) => {
      const fieldProps = getFormikFieldProps(nameOrOptions);
      const fieldName = getFieldName(nameOrOptions);

      // Asses if error message is going to be omitted, but validation still takes place (approach used in swap due to custom error messages)
      const hideError = hideErrorMessage || hideErrorMessages;

      if (!hideError) {
        const isTouched = formik.touched[fieldName];

        // Option allows to only show error when input is touched.
        // Input is touched when if focus and blur events are emitted
        const errorMessage = hideUntouchedError
          ? isTouched
            ? formik.errors[fieldName]
            : undefined
          : formik.errors[fieldName];

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

  const getSelectFieldProps: GetSelectFieldProps = useCallback(
    (nameOrOptions: any, hideErrorMessage?: boolean, hideUntouchedError?: boolean) => {
      const props = getFieldProps(nameOrOptions, hideErrorMessage, hideUntouchedError);
      const fieldName = getFieldName(nameOrOptions);

      return {
        ...props,
        onSelectionChange: (key: Key) => {
          setFieldValue(fieldName, key, true);
        },
        onChange: undefined
      };
    },
    [getFieldProps, setFieldValue]
  );

  return {
    values,
    validateForm,
    getFieldProps,
    getSelectFieldProps,
    setFieldTouched,
    setFieldValue,
    ...formik
  };
};

export { useForm };
export type { FormErrors };
