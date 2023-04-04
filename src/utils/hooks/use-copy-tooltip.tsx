import { HoverProps, useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { DOMAttributes, FocusableElement } from '@react-types/shared';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimeoutFn } from 'react-use';

type CopyTooltipProp = Pick<HoverProps, 'isDisabled'>;

type CopyTooltipResult = {
  buttonProps: DOMAttributes<FocusableElement>;
  tooltipProps: {
    isOpen: boolean;
    label: string;
  };
};

const useCopyTooltip = (props?: CopyTooltipProp): CopyTooltipResult => {
  const { t } = useTranslation();

  const defaultTooltipProps = useMemo(() => ({ isOpen: false, label: t('click_to_copy') }), [t]);

  const [tooltipProps, setTooltipProps] = useState(defaultTooltipProps);
  const [isReadyToDefaultLabel, cancelLabelReset, setToDefaultLabel] = useTimeoutFn(
    () => setTooltipProps((s) => ({ ...s, label: t('click_to_copy') })),
    1000
  );

  const [isReadyToExit, cancelExit, delayExit] = useTimeoutFn(() => {
    setTooltipProps((s) => ({ ...s, isOpen: false }));
  }, 500);

  const defaultHoverProps = {
    onHoverStart: () => {
      // Cancel exit if is still ongoing
      if (!isReadyToExit()) {
        cancelExit();
      }

      setTooltipProps({ label: t('click_to_copy'), isOpen: true });
    },
    onHoverEnd: delayExit
  };

  const { hoverProps } = useHover({ ...props, ...defaultHoverProps });

  const handlePress = () => {
    // Cancel setting label to default if is still ongoing
    if (!isReadyToDefaultLabel()) {
      cancelLabelReset();
    }
    setTooltipProps({ isOpen: true, label: t('copied') });
    setToDefaultLabel();
  };

  return {
    buttonProps: mergeProps(hoverProps, { onPress: handlePress }),
    tooltipProps
  };
};

export { useCopyTooltip };
export type { CopyTooltipResult };
