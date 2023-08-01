import { FocusRing, useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { AriaSliderThumbProps, useSliderThumb } from '@react-aria/slider';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { SliderState } from '@react-stately/slider';
import { HTMLAttributes, RefObject, useRef } from 'react';

import { useDOMRef } from '../utils/dom';

type Props = {
  trackRef: RefObject<HTMLElement>;
  inputRef: RefObject<HTMLInputElement>;
  state: SliderState;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSliderThumbProps, keyof Props>;

type SliderThumbProps = Props & NativeAttrs & InheritAttrs;

const Switch = ({ state, trackRef, inputRef, ...props }: SliderThumbProps): JSX.Element => {
  const backupRef = useDOMRef<HTMLInputElement>(inputRef);
  inputRef = inputRef || backupRef;

  const { thumbProps, inputProps, isDragging, isFocused } = useSliderThumb(
    {
      ...props,
      inputRef,
      trackRef
    },
    state
  );

  const { hoverProps, isHovered } = useHover({});

  const { isFocusVisible, focusProps } = useFocusRing({ within: true });

  return (
    <div
      className={classNames(styles, 'spectrum-Slider-handle', {
        'is-hovered': isHovered,
        'is-dragged': isDragging,
        'is-tophandle': isFocused
      })}
      {...mergeProps(thumbProps, hoverProps, focusProps)}
      role='presentation'
    >
      <VisuallyHidden>
        <input className={classNames(styles, 'spectrum-Slider-input')} ref={inputRef} {...inputProps} />
      </VisuallyHidden>
    </div>
  );
};

export { Switch };
export type { SliderThumbProp };
