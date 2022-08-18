import { useForm } from 'react-hook-form';

import { formatUSD } from '@/common/utils/utils';
import { CTA, Modal, ModalProps, Span, Stack, TokenField } from '@/component-library';

import { CollateralScore } from '../CollateralScore';
import { StyledDd, StyledDItem, StyledDl, StyledDt, StyledHr, StyledTitle } from './CollateralModal.styles';

const DEPOSIT_COLLATERAL_AMOUNT = 'deposit-collateral-amount';
const WITHDRAW_COLLATERAL_AMOUNT = 'withdraw-collateral-amount';

type CollateralModalData = {
  [DEPOSIT_COLLATERAL_AMOUNT]?: string;
  [WITHDRAW_COLLATERAL_AMOUNT]?: string;
};

const collateralInputId: Record<CollateralModalVariants, keyof CollateralModalData> = {
  deposit: DEPOSIT_COLLATERAL_AMOUNT,
  withdraw: WITHDRAW_COLLATERAL_AMOUNT
};

const ranges = {
  error: { min: 0, max: 150 },
  warning: { min: 150, max: 250 },
  success: { min: 250, max: 300 }
};

type CollateralModalVariants = 'deposit' | 'withdraw';

type Props = {
  variant?: CollateralModalVariants;
  onSubmit?: () => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type CollateralModalProps = Props & InheritAttrs;

const CollateralModal = ({ variant = 'deposit', onSubmit, ...props }: CollateralModalProps): JSX.Element => {
  const title = variant === 'deposit' ? 'Deposit Collateral' : 'Withdraw Collateral';
  const { register, handleSubmit: h } = useForm<CollateralModalData>({
    mode: 'onChange'
  });

  const handleSubmit = (data: CollateralModalData) => {
    onSubmit?.();
    console.log(data);
  };

  return (
    <Modal {...props}>
      <form onSubmit={h(handleSubmit)}>
        <Stack spacing='double'>
          <StyledTitle>{title}</StyledTitle>
          <TokenField tokenSymbol='KSM' valueInUSD={0} id={collateralInputId[variant]} {...register} />
          <StyledDl>
            <StyledDItem color='tertiary'>
              <StyledDt>Current Total Collateral</StyledDt>
              <StyledDd>400.00 KSM ({formatUSD(1050)})</StyledDd>
            </StyledDItem>
            <StyledDItem>
              <StyledDt>Minimum Required Collateral</StyledDt>
              <StyledDd>4.00 KSM ({formatUSD(40)})</StyledDd>
            </StyledDItem>
            <CollateralScore
              label={<StyledDt>New Collateralization</StyledDt>}
              sublabel={<StyledDd>(high risk)</StyledDd>}
              ranges={ranges}
            />
            <StyledDItem>
              <StyledDt>New liquidation Price</StyledDt>
              <StyledDd>
                {formatUSD(12.32)} KSM / {formatUSD(42324.32)} BTC
              </StyledDd>
            </StyledDItem>
            <StyledHr />
            <StyledDItem>
              <StyledDt>Fees</StyledDt>
              <StyledDd>
                <Span color='secondary'>0.01 KINT</Span> ({formatUSD(0.24)})
              </StyledDd>
            </StyledDItem>
          </StyledDl>
          <CTA type='submit' fullWidth>
            {title}
          </CTA>
        </Stack>
      </form>
    </Modal>
  );
};

export { CollateralModal };
export type { CollateralModalProps, CollateralModalVariants };
