import { CurrencyExt } from '@interlay/interbtc-api';
import { MonetaryAmount } from '@interlay/monetary-js';
import { useTranslation } from 'react-i18next';

import { formatPercentage, formatUSD } from '@/common/utils/utils';
import { CTA, Flex, Modal, ModalBody, ModalFooter, ModalProps, P } from '@/component-library';
import { SwapPair } from '@/types/swap';

import { StyledModalHeader, StyledPriceImpact } from './PriceImpactModal.style';

type Props = {
  onConfirm?: () => void;
  inputValueUSD: number;
  outputValueUSD: number;
  inputAmount?: MonetaryAmount<CurrencyExt>;
  outputAmount?: MonetaryAmount<CurrencyExt>;
  pair: SwapPair;
  priceImpact: number;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type PriceImpactModalProps = Props & InheritAttrs;

const PriceImpactModal = ({
  onConfirm,
  onClose,
  inputValueUSD,
  outputValueUSD,
  inputAmount,
  outputAmount,
  pair,
  priceImpact,
  ...props
}: PriceImpactModalProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal {...props} onClose={onClose}>
      <StyledModalHeader>External Price Impact Warning</StyledModalHeader>
      <ModalBody alignItems='center' gap='spacing4'>
        <Flex direction='column' alignItems='center' gap='spacing1'>
          <P>{t('amm.swap_has_price_inpact_of')}:</P>
          <StyledPriceImpact size='lg'>{formatPercentage(priceImpact)}</StyledPriceImpact>
        </Flex>
        <P align='center'>
          {t('amm.you_are_swapping_input_for_output', {
            inputAmount: inputAmount?.toHuman(),
            inputTicker: pair.input?.ticker,
            inputAmountUSD: formatUSD(inputValueUSD, { compact: true }),
            outputAmount: outputAmount?.toHuman(),
            outputTicker: pair.output?.ticker,
            outputAmountUSD: formatUSD(outputValueUSD, { compact: true })
          })}
        </P>
      </ModalBody>
      <ModalFooter direction='row'>
        <CTA size='large' fullWidth onPress={onClose}>
          {t('amm.cancel_swap')}
        </CTA>
        <CTA size='large' variant='outlined' fullWidth onPress={onConfirm}>
          {t('amm.confirm_swap')}
        </CTA>
      </ModalFooter>
    </Modal>
  );
};

export { PriceImpactModal };
export type { PriceImpactModalProps };
