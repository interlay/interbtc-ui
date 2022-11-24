import { Overlay, OverlayContainer, PositionAria, useOverlayPosition } from '@react-aria/overlays';
import { useTooltip, useTooltipTrigger } from '@react-aria/tooltip';
import { mergeProps } from '@react-aria/utils';
import { useTooltipTriggerState } from '@react-stately/tooltip';
import { AriaTooltipProps, TooltipTriggerProps as StatelyTooltipTriggerProps } from '@react-types/tooltip';
import React, { Children, cloneElement, HTMLAttributes, ReactElement, ReactNode, useRef } from 'react';

import { Span } from '../Text';
import { theme } from '../theme';
import { Placement } from '../utils/prop-types';
import { StyledTooltip, StyledTooltipLabel, StyledTooltipTip } from './Tooltip.style';

// MEMO: https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/tooltip/src/TooltipTrigger.tsx#L22
const DEFAULT_OFFSET = -1;
const DEFAULT_CROSS_OFFSET = 0;
const DEFAULT_DELAY = Number(theme.transition.default);

type Props = {
  label?: ReactNode;
  placement?: Placement;
};

type AriaOverlaysAttrs = { shouldFlip?: boolean; crossOffset?: number; offset?: number; containerPadding?: number };

type AriaAttrs = AriaTooltipProps & AriaOverlaysAttrs;

type InheritAttrs = Omit<AriaAttrs & StatelyTooltipTriggerProps, keyof Props>;

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props & InheritAttrs>;

type TooltipProps = Props & InheritAttrs & NativeAttrs;

const Tooltip = (props: TooltipProps): JSX.Element => {
  const {
    children,
    label,
    crossOffset = DEFAULT_CROSS_OFFSET,
    isDisabled,
    offset = DEFAULT_OFFSET,
    trigger: triggerAction,
    delay = DEFAULT_DELAY
  } = props;

  const state = useTooltipTriggerState({ delay, ...props });

  const tooltipTriggerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { triggerProps, tooltipProps } = useTooltipTrigger(
    {
      isDisabled,
      trigger: triggerAction
    },
    state,
    tooltipTriggerRef
  );

  const { overlayProps, arrowProps, placement } = useOverlayPosition({
    placement: props.placement || 'top',
    targetRef: tooltipTriggerRef,
    overlayRef,
    offset,
    crossOffset,
    isOpen: state.isOpen,
    shouldFlip: props.shouldFlip,
    containerPadding: props.containerPadding
  }) as PositionAria & { placement: Placement };

  const ariaProps = mergeProps(props, tooltipProps);
  const { tooltipProps: ariaTooltipProps } = useTooltip(ariaProps, state);

  // MEMO: in case there is no label, just return trigger component
  if (!label) {
    return <>{children}</>;
  }

  let trigger: ReactElement;

  const shouldWrap = typeof children === 'string';

  if (shouldWrap) {
    trigger = (
      <Span tabIndex={0} ref={tooltipTriggerRef} {...triggerProps}>
        {children}
      </Span>
    );
  } else {
    // MEMO: Ensure tooltip has only one child node
    const child = Children.only(children) as React.ReactElement & {
      ref?: React.Ref<any>;
    };
    // MEMO: Clones component to adds trigger ref and events that will trigger the tooltip
    trigger = cloneElement(child, mergeProps(child.props, triggerProps, { ref: tooltipTriggerRef }));
  }

  /* TODO: Move OverlayContainer out when new modal added */
  return (
    <>
      {trigger}
      {state.isOpen && (
        <OverlayContainer>
          <Overlay>
            <StyledTooltip
              {...mergeProps(ariaTooltipProps, overlayProps)}
              className={props.className}
              ref={overlayRef}
              $isOpen={state.isOpen}
              $placement={placement}
            >
              <StyledTooltipLabel>{label}</StyledTooltipLabel>
              <StyledTooltipTip $placement={placement} {...arrowProps} />
            </StyledTooltip>
          </Overlay>
        </OverlayContainer>
      )}
    </>
  );
};

export { Tooltip };
export type { TooltipProps };
