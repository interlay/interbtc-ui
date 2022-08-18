import { useId } from '@react-aria/utils';
import { useForm } from 'react-hook-form';

import { CTA, Input, Modal, ModalProps, Stack, TokenField } from '@/component-library';

import { HighlightDescriptionItem } from './HighlightDescriptionItem';
import { IssueDescriptionItem } from './IssueDescriptionItem';
import { StyledDescription, StyledDl, StyledHr, StyledInputLabel, StyledTitle } from './IssueRedeemModal.styles';

const ISSUE_AMOUNT = 'issue-amount';
const REDEEM_AMOUNT = 'withdraw-collateral-amount';

type IssueRedeemModalData = {
  [ISSUE_AMOUNT]?: string;
  [REDEEM_AMOUNT]?: string;
};

const collateralInputId: Record<IssueRedeemModalVariants, keyof IssueRedeemModalData> = {
  issue: ISSUE_AMOUNT,
  redeem: REDEEM_AMOUNT
};

type IssueRedeemModalVariants = 'issue' | 'redeem';

type Props = {
  variant?: IssueRedeemModalVariants;
  onSubmit?: () => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type IssueRedeemModalProps = Props & InheritAttrs;

const IssueRedeemModal = ({ variant = 'issue', onSubmit, ...props }: IssueRedeemModalProps): JSX.Element => {
  const btcAddressLabelId = useId();
  const amountLabelId = useId();
  const { register, handleSubmit: h } = useForm<IssueRedeemModalData>({
    mode: 'onChange'
  });

  const isIssueModal = variant === 'issue';
  const title = isIssueModal ? 'Issue kBTC' : 'Redeem kBTC';
  const label = isIssueModal ? 'Issue amount' : 'Reddem amount';
  const highlightTerm = isIssueModal ? 'Maximum vault capacity:' : 'Locked:';

  const handleSubmit = (data: IssueRedeemModalData) => {
    onSubmit?.();
    console.log(data);
  };

  return (
    <Modal {...props}>
      <form onSubmit={h(handleSubmit)}>
        <Stack spacing='single'>
          <StyledTitle>{title}</StyledTitle>
          <StyledDescription color='tertiary'>{`You are requesting to ${variant} with this vault.`}</StyledDescription>
          <StyledDl>
            <Stack>
              <HighlightDescriptionItem
                clickable={!isIssueModal}
                onClick={() => console.log('apply max in input')}
                term={highlightTerm}
                detail='0.46605428 BTC'
              />
              {/* This needs to be in the Input component */}
              <StyledInputLabel id={amountLabelId}>{label}</StyledInputLabel>
              <TokenField
                aria-labelledby={amountLabelId}
                tokenSymbol='KSM'
                valueInUSD={0}
                id={collateralInputId[variant]}
                {...register}
              />

              {isIssueModal && (
                <Stack spacing='half'>
                  <IssueDescriptionItem informative term='Bridge Fee' detail='0.01256767 BTC' subdetail='($2.244129)' />
                  <IssueDescriptionItem
                    informative
                    term='Security Deposit'
                    detail='0.012567 KINT'
                    subdetail='($0.224115)'
                  />
                  <IssueDescriptionItem
                    informative
                    term='Transaction Fee'
                    detail='0.012567 KINT'
                    subdetail='($0.842538)'
                  />
                  <StyledHr />
                  <IssueDescriptionItem term='You will receive' detail='0.012567 BTC' subdetail='($0.244578)' />
                </Stack>
              )}
            </Stack>
          </StyledDl>
          {!isIssueModal && (
            <div>
              {/* This needs to be in the Input component */}
              <StyledInputLabel id={btcAddressLabelId}>BTC address</StyledInputLabel>
              <Input aria-labelledby={btcAddressLabelId} placeholder='Enter your BTC address' />
            </div>
          )}
          <CTA type='submit' fullWidth>
            Confirm
          </CTA>
        </Stack>
      </form>
    </Modal>
  );
};

export { IssueRedeemModal };
export type { IssueRedeemModalProps, IssueRedeemModalVariants };
