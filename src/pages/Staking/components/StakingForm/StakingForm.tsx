import { newMonetaryAmount, Trade } from '@interlay/interbtc-api';
import { mergeProps } from '@react-aria/utils';
import { ChangeEventHandler, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardProps, Divider, Flex, H1, TokenInput } from '@/component-library';
import {
  AuthCTA,
  TransactionDetails,
  TransactionDetailsDd,
  TransactionDetailsDt,
  TransactionDetailsGroup,
  TransactionFeeDetails
} from '@/components';
import { GOVERNANCE_TOKEN, TRANSACTION_FEE_AMOUNT, VOTE_GOVERNANCE_TOKEN } from '@/config/relay-chains';
import { useGetBalances } from '@/hooks/api/tokens/use-get-balances';
import { useGetPrices } from '@/hooks/api/use-get-prices';
import { Transaction, useTransaction } from '@/hooks/transaction';
import { isTransactionFormDisabled } from '@/hooks/transaction/utils/form';
import useAccountId from '@/hooks/use-account-id';
import { SWAP_FEE_TOKEN_FIELD, SWAP_INPUT_AMOUNT_FIELD, SwapFormData, swapSchema, useForm } from '@/lib/form';
import { SWAP_PRICE_IMPACT_LIMIT } from '@/utils/constants/swap';
import { getTokenInputProps } from '@/utils/helpers/input';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

type InheritAttrs = CardProps & Props;

type SwapFormProps = Props & InheritAttrs;

const SwapForm = (props: SwapFormProps): JSX.Element | null => {
  const prices = useGetPrices();
  const accountId = useAccountId();
  const { t } = useTranslation();
  const { data: balances, getAvailableBalance } = useGetBalances();

  const transaction = useTransaction(Transaction.AMM_SWAP, {
    // onSigning: () => {
    //   setInputAmount(undefined);
    //   form.setFieldValue(SWAP_INPUT_AMOUNT_FIELD, '', true);
    //   setTrade(undefined);
    // },
  });

  const inputBalance = getAvailableBalance(GOVERNANCE_TOKEN.ticker);

  const minAmount = newMonetaryAmount(1, GOVERNANCE_TOKEN);

  const inputSchemaParams = {
    maxAmount: inputBalance,
    minAmount
  };

  const getTransactionArgs = useCallback(
    async (trade: Trade | null | undefined) => {
      if (!trade || !accountId) return;

      try {
        const minimumAmountOut = trade.getMinimumOutputAmount(slippage);
        const deadline = await window.bridge.system.getFutureBlockNumber(30 * 60);

        return {
          trade,
          minimumAmountOut,
          accountId,
          deadline
        };
      } catch (error: any) {
        transaction.reject(error);
      }
    },
    [accountId, transaction]
  );

  const handleSubmit = async (values: SwapFormData) => {
    const transactionData = await getTransactionArgs(trade);

    if (!transactionData || !transaction.fee.data || !inputBalance) return;

    const { accountId, deadline, minimumAmountOut, trade: tradeData } = transactionData;

    transaction.execute(tradeData, minimumAmountOut, accountId, deadline);
  };

  const form = useForm<SwapFormData>({
    initialValues: {},
    validationSchema: swapSchema({ [SWAP_INPUT_AMOUNT_FIELD]: inputSchemaParams }),
    onSubmit: handleSubmit,
    validateOnMount: true
  });

  // MEMO: re-validate form on balances refetch
  useEffect(() => {
    form.validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances]);

  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => setInputAmount(e.target.value);

  const isBtnDisabled = isTransactionFormDisabled(form, transaction.fee);

  return (
    <Card {...props} gap='spacing2'>
      <H1 size='base' color='secondary' weight='bold' align='center'>
        Stake {GOVERNANCE_TOKEN.ticker}
      </H1>
      <Divider size='medium' orientation='horizontal' color='secondary' />
      <Flex direction='column'>
        <form onSubmit={form.handleSubmit}>
          <Flex direction='column' gap='spacing4'>
            <TokenInput
              placeholder='0.00'
              valueUSD={inputAmountUSD}
              {...mergeProps(form.getFieldProps(SWAP_INPUT_AMOUNT_FIELD, true), getTokenInputProps(inputBalance), {
                onChange: handleChangeInput
              })}
            />
            <List
              aria-label='slippage tolerance'
              direction='row'
              selectionMode='single'
              onSelectionChange={handleSelectionChange}
              defaultSelectedKeys={[value.toString()]}
            >
              <ListItem textValue='0' key='0'>
                0%
              </ListItem>
              <ListItem textValue='0.1' key='0.1'>
                0.1%
              </ListItem>
              <ListItem textValue='0.5' key='0.5'>
                0.5%
              </ListItem>
              <ListItem textValue='1' key='1'>
                1%
              </ListItem>
              <ListItem textValue='3' key='3'>
                3%
              </ListItem>
            </List>
            <Flex direction='column' gap='spacing2'>
              <TransactionDetails>
                <TransactionDetailsGroup>
                  <TransactionDetailsDt>New unlock date</TransactionDetailsDt>
                  <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
                </TransactionDetailsGroup>
                <TransactionDetailsGroup>
                  <TransactionDetailsDt>New {VOTE_GOVERNANCE_TOKEN.ticker} Gained</TransactionDetailsDt>
                  <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
                </TransactionDetailsGroup>
                <TransactionDetailsGroup>
                  <TransactionDetailsDt>New Total Stake</TransactionDetailsDt>
                  <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
                </TransactionDetailsGroup>
                <TransactionDetailsGroup>
                  <TransactionDetailsDt>Estimated APR</TransactionDetailsDt>
                  <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
                </TransactionDetailsGroup>
                <TransactionDetailsGroup>
                  <TransactionDetailsDt>Projected {GOVERNANCE_TOKEN.ticker} Rewards</TransactionDetailsDt>
                  <TransactionDetailsDd>21/09/26</TransactionDetailsDd>
                </TransactionDetailsGroup>
              </TransactionDetails>
              <TransactionFeeDetails
                fee={transaction.fee}
                selectProps={form.getSelectFieldProps(SWAP_FEE_TOKEN_FIELD)}
              />
            </Flex>
            <AuthCTA type='submit' disabled={isBtnDisabled} size='large' loading={transaction.isLoading}>
              {t('issue')}
            </AuthCTA>{' '}
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};

export { SwapForm };
export type { SwapFormProps };
