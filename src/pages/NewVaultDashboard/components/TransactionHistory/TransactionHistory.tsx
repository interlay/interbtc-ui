import { useId } from '@react-aria/utils';
import { HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CTA, TabsItem } from '@/component-library';
import { useGetVaultTransactions } from '@/utils/hooks/api/vaults/use-get-vault-transactions';

import { StyledStack, StyledTableWrapper, StyledTabs, StyledTitle, StyledWrapper } from './TransactionHistory.styles';
import { TransactionTable } from './TransactionTable';

type Props = {
  address: string;
  vaultCollateral: string;
};

type NativeAttrs = HTMLAttributes<unknown>;

type TransactionHistoryProps = Props & NativeAttrs;

const tabKeys = ['all', 'pending', 'issue', 'redeem', 'replace'] as const;

const TransactionHistory = (props: TransactionHistoryProps): JSX.Element => {
  const transactions = useGetVaultTransactions(props.address, props.vaultCollateral);

  const { t } = useTranslation();
  const titleId = useId();
  const [filteredTransactionData, setFilteredTransactiondata] = useState<any>(transactions);
  const [tab, setTab] = useState<string>('all');

  useEffect(() => {
    if (tab === 'all') {
      setFilteredTransactiondata(transactions);
    } else if (tab === 'pending') {
      setFilteredTransactiondata(transactions.filter((data: any) => data.status === 'Pending'));
    } else {
      setFilteredTransactiondata(transactions.filter((data: any) => data.request.toLowerCase() === tab));
    }
  }, [tab, transactions]);

  const table = (
    <StyledTableWrapper>
      <TransactionTable aria-labelledby={titleId} data={filteredTransactionData} />
    </StyledTableWrapper>
  );

  return (
    <>
      <StyledTitle id={titleId}>Transaction History</StyledTitle>
      <StyledWrapper variant='bordered' {...props}>
        <StyledStack>
          <StyledTabs panel={table} onSelectionChange={(e) => setTab(e as string)}>
            {tabKeys.map((key) => (
              <TabsItem key={key} title={t(key)}>
                {null}
              </TabsItem>
            ))}
          </StyledTabs>
          <CTA variant='outlined'>{'View All >'}</CTA>
        </StyledStack>
      </StyledWrapper>
    </>
  );
};

export { TransactionHistory };
export type { TransactionHistoryProps };
