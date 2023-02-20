import { useLabel } from '@react-aria/label';
import { chain, mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react';

import { Flex, Label } from '@/component-library';
import { HelperText } from '@/component-library/HelperText';
import { SelectTrigger } from '@/component-library/Select';
import { triggerChangeEvent } from '@/component-library/utils/input';

import { ChainIcon } from '../ChainIcon';
import { ChainListModal } from './ChainListModal';
import { StyledChain } from './ChainSelect.style';

type Chain = {
  display: string;
  id: string;
};

type Chains = Chain[];

type Props = {
  value?: string;
  defaultValue?: string;
  chains: Chains;
  label?: ReactNode;
  errorMessage?: any;
};

type NativeAttrs = Omit<InputHTMLAttributes<HTMLInputElement> & { ref?: any }, keyof Props>;

type ChainSelectProps = Props & NativeAttrs;

const ChainSelect = forwardRef<HTMLInputElement, ChainSelectProps>(
  ({
    chains = [],
    value: valueProp,
    defaultValue,
    label,
    className,
    errorMessage,
    disabled,
    ...props
  }): JSX.Element => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [value, setValue] = useState(defaultValue);
    const [isOpen, setOpen] = useState(false);

    const { fieldProps, labelProps } = useLabel({ ...props, label });

    useEffect(() => {
      if (valueProp === undefined) return;

      setValue(valueProp);
    }, [valueProp]);

    const handleClose = () => setOpen(false);

    const handleChainChange = (chain: string) => {
      triggerChangeEvent(inputRef, chain);
      setValue(chain);
    };

    const selectedChain = chains.find((chain) => chain.id === value);

    const isDisabled = !chains?.length || disabled;

    return (
      <>
        <Flex direction='column' flex='1' className={className}>
          {label && <Label {...labelProps}>{label}</Label>}
          <SelectTrigger
            onPress={() => setOpen(true)}
            disabled={isDisabled}
            {...mergeProps(fieldProps, {
              // MEMO: when the button is blurred, a focus and blur is executed on the input
              // so that validation gets triggered.
              onBlur: () => {
                if (!isOpen) {
                  inputRef.current?.focus();
                  inputRef.current?.blur();
                }
              }
            })}
          >
            {selectedChain && (
              <Flex elementType='span' alignItems='center' justifyContent='space-evenly' gap='spacing2'>
                <ChainIcon id={selectedChain.id} />
                <StyledChain>{selectedChain?.display}</StyledChain>
              </Flex>
            )}
          </SelectTrigger>
          <VisuallyHidden>
            <input ref={inputRef} autoComplete='off' tabIndex={-1} value={value} {...props} />
          </VisuallyHidden>
          <HelperText errorMessage={errorMessage} />
        </Flex>
        <ChainListModal
          isOpen={isOpen}
          chains={chains}
          selectedChain={value}
          onClose={handleClose}
          onSelectionChange={chain(handleChainChange, handleClose)}
        />
      </>
    );
  }
);

ChainSelect.displayName = 'ChainSelect';

export { ChainSelect };
export type { Chain, Chains, ChainSelectProps };
