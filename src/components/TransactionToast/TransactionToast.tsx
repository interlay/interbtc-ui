import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useInterval } from 'react-use';

import { CheckCircle, XCircle } from '@/assets/icons';
import { updateTransactionModal } from '@/common/actions/general.actions';
import { CTA, CTALink, Divider, Flex, FlexProps, LoadingSpinner, P, theme } from '@/component-library';
import { TransactionStatus } from '@/utils/hooks/transaction/types';
import { useWindowFocus } from '@/utils/hooks/use-window-focus';

import { StyledProgressBar, StyledWrapper } from './TransactionToast.styles';

type Props = {
  variant?: TransactionStatus;
  description?: string;
  url?: string;
  errorMessage?: string;
  timeout?: number;
  onDismiss?: () => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type TransactionToastProps = Props & InheritAttrs;

const TransactionToast = ({
  variant = TransactionStatus.SUCCESS,
  timeout = 8000,
  url,
  description,
  onDismiss,
  errorMessage,
  ...props
}: TransactionToastProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const windowFocused = useWindowFocus();

  const [progress, setProgress] = useState(100);
  const [isRunning, setRunning] = useState(false);

  // handles the countdown
  useInterval(
    () => setProgress((prev) => prev - 1),
    isRunning ? timeout / theme.transition.duration.duration100 : null
  );

  const hasProgress = useMemo(() => variant === TransactionStatus.SUCCESS || variant === TransactionStatus.ERROR, [
    variant
  ]);

  const startProgress = useCallback(() => {
    if (!hasProgress || progress === 0) return;

    setRunning(true);
  }, [hasProgress, progress]);

  const stopProgress = () => setRunning(false);

  const { hoverProps } = useHover({
    onHoverStart: stopProgress,
    onHoverEnd: startProgress
  });

  useEffect(() => {
    if (hasProgress && progress === 0) {
      stopProgress();
      onDismiss?.();
    }
  }, [hasProgress, onDismiss, progress]);

  useEffect(() => {
    if (hasProgress) {
      startProgress();
    }
  }, [hasProgress, startProgress]);

  useEffect(() => {
    if (!hasProgress || progress === 0) return;

    if (windowFocused) {
      startProgress();
    } else {
      stopProgress();
    }
  }, [hasProgress, progress, startProgress, windowFocused]);

  const handleViewDetails = () => {
    dispatch(updateTransactionModal(true, { variant: TransactionStatus.ERROR, description, errorMessage }));
    onDismiss?.();
  };

  const icon = useMemo(() => {
    switch (variant) {
      case TransactionStatus.CONFIRM:
      case TransactionStatus.SUBMITTING:
        return <LoadingSpinner thickness={2} diameter={24} variant='indeterminate' />;
      case TransactionStatus.SUCCESS:
        return <CheckCircle color='success' />;
      case TransactionStatus.ERROR:
        return <XCircle color='error' />;
    }
  }, [variant]);

  const content = useMemo(() => {
    switch (variant) {
      case TransactionStatus.CONFIRM:
        return t('transaction.confirm_transaction');
      case TransactionStatus.SUBMITTING:
        return t('transaction.transaction_processing');
      case TransactionStatus.SUCCESS:
        return t('transaction.transaction_successful');
      case TransactionStatus.ERROR:
        return t('transaction.transaction_failed');
    }
  }, [t, variant]);

  return (
    <StyledWrapper direction='column' {...mergeProps(props, hoverProps)}>
      <Flex gap='spacing3'>
        <Flex elementType='span' flex={0}>
          {icon}
        </Flex>
        <Flex direction='column' gap='spacing1' marginY='spacing1'>
          <P weight='bold' size='s'>
            {content}
          </P>
          {description && (
            <P rows={2} size='xs'>
              {description}
            </P>
          )}
        </Flex>
      </Flex>
      {hasProgress && (
        <StyledProgressBar
          aria-label='notification timer'
          value={hasProgress ? progress : 0}
          color={variant === TransactionStatus.ERROR ? 'red' : 'default'}
        />
      )}
      <Flex gap='spacing2' marginTop='spacing4'>
        {(url || errorMessage) && (
          <>
            {url && (
              <CTALink size='small' fullWidth external to={url} variant='text'>
                View Subscan
              </CTALink>
            )}
            {errorMessage && !url && (
              <CTA size='small' fullWidth variant='text' onPress={handleViewDetails}>
                View Details
              </CTA>
            )}
            <Divider orientation='vertical' color='default' />
          </>
        )}
        <CTA size='small' fullWidth variant='text' onPress={onDismiss}>
          Dismiss
        </CTA>
      </Flex>
    </StyledWrapper>
  );
};

export { TransactionToast };
export type { TransactionToastProps };
