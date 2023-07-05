import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckCircle, XCircle } from '@/assets/icons';
import { CTA, Divider, Flex, FlexProps, LoadingSpinner, P } from '@/component-library';
import { useCountdown } from '@/utils/hooks/use-countdown';

import { StyledProgressBar, StyledWrapper } from './NotificationToast.styles';

type NotificationToastVariant = 'success' | 'error' | 'loading';

const loadingSpinner = <LoadingSpinner thickness={2} diameter={24} variant='indeterminate' />;

const getIcon = (variant: NotificationToastVariant) =>
  ({
    loading: loadingSpinner,
    success: <CheckCircle color='success' />,
    error: <XCircle color='error' />
  }[variant]);

type Props = {
  title?: ReactNode;
  variant?: NotificationToastVariant;
  description?: string;
  timeout?: number;
  action?: ReactNode;
  onDismiss?: () => void;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type NotificationToastProps = Props & InheritAttrs;

const NotificationToast = ({
  variant = 'success',
  title,
  timeout = 8000,
  description,
  onDismiss,
  action,
  ...props
}: NotificationToastProps): JSX.Element => {
  const { t } = useTranslation();

  const showCountdown = variant === 'success' || variant === 'error';

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

  const icon = getIcon(variant);

  return (
    <StyledWrapper direction='column' {...mergeProps(props, hoverProps)}>
      <Flex gap='spacing3'>
        <Flex elementType='span' flex={0} alignItems={description ? 'flex-start' : 'center'}>
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
          color={variant === 'error' ? 'red' : 'default'}
        />
      )}
      <Flex gap='spacing2' marginTop='spacing4'>
        {action && (
          <>
            {action}
            <Divider orientation='vertical' color='default' />
          </>
        )}
        <CTA size='small' fullWidth variant='text' onPress={onDismiss}>
          {t('dismiss')}
        </CTA>
      </Flex>
    </StyledWrapper>
  );
};

export { NotificationToast };
export type { NotificationToastProps, NotificationToastVariant };
