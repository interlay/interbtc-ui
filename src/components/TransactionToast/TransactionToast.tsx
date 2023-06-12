import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { CheckCircle, XCircle } from '@/assets/icons';
import { updateTransactionModal } from '@/common/actions/general.actions';
import { CTA, CTALink, Divider, Flex, FlexProps, LoadingSpinner, P } from '@/component-library';
import { TransactionStatus } from '@/utils/hooks/transaction/types';
import { useCountdown } from '@/utils/hooks/use-countdown';

import { StyledProgressBar, StyledWrapper } from './TransactionToast.styles';

const loadingSpinner = <LoadingSpinner thickness={2} diameter={24} variant='indeterminate' />;

const getData = (t: TFunction, variant: TransactionStatus) =>
  ({
    [TransactionStatus.CONFIRM]: {
      title: t('transaction.confirm_transaction'),
      icon: loadingSpinner
    },
    [TransactionStatus.SUBMITTING]: {
      title: t('transaction.transaction_processing'),
      icon: loadingSpinner
    },
    [TransactionStatus.SUCCESS]: {
      title: t('transaction.transaction_successful'),
      icon: <CheckCircle color='success' />
    },
    [TransactionStatus.ERROR]: {
      title: t('transaction.transaction_failed'),
      icon: <XCircle color='error' />
    }
  }[variant]);

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

  const showCountdown = variant === TransactionStatus.SUCCESS || variant === TransactionStatus.ERROR;

  const { value: countdown, start, stop } = useCountdown({
    timeout,
    disabled: !showCountdown,
    onEndCountdown: onDismiss
  });

  const { hoverProps } = useHover({
    onHoverStart: stop,
    onHoverEnd: start,
    isDisabled: !showCountdown
  });

  const handleViewDetails = () => {
    dispatch(updateTransactionModal(true, { variant: TransactionStatus.ERROR, description, errorMessage }));
    onDismiss?.();
  };

  const { title, icon } = getData(t, variant);

  return (
    <StyledWrapper direction='column' {...mergeProps(props, hoverProps)}>
      <Flex gap='spacing3'>
        <Flex elementType='span' flex={0}>
          {icon}
        </Flex>
        <Flex direction='column' gap='spacing1' marginY='spacing1'>
          <P weight='bold' size='s'>
            {title}
          </P>
          {description && (
            <P rows={2} size='xs'>
              {description}
            </P>
          )}
        </Flex>
      </Flex>
      {showCountdown && (
        <StyledProgressBar
          aria-label='notification timer'
          value={showCountdown ? countdown : 0}
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
