import { useId } from '@react-aria/utils';
import { HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CTALink, TabsItem } from '@/component-library';
import { PAGES } from '@/utils/constants/links';

import { StyledStack, StyledTableWrapper, StyledTabs, StyledTitle, StyledWrapper } from './TransactionHistory.styles';
import { TransactionTable, TransactionTableData } from './TransactionTable';

type Props = {
  transactions: Array<TransactionTableData>;
};

type NativeAttrs = HTMLAttributes<unknown>;

type TransactionHistoryProps = Props & NativeAttrs;

const tabKeys = ['all', 'pending', 'issue', 'redeem', 'replace'] as const;

const TransactionHistory = (props: TransactionHistoryProps): JSX.Element => {
  const { t } = useTranslation();
  const titleId = useId();

  const [tab, setTab] = useState<string>('all');
  const [filteredTransactionData, setFilteredTransactiondata] = useState<Array<TransactionTableData>>(
    props.transactions
  );

  useEffect(() => {
    if (tab === 'all') {
      setFilteredTransactiondata(props.transactions);
    } else if (tab === 'pending') {
      setFilteredTransactiondata(props.transactions.filter((data) => data.status === 'pending'));
    } else {
      setFilteredTransactiondata(props.transactions.filter((data) => data.request.toLowerCase() === tab));
    }
  }, [tab, props.transactions]);

  const table = (
    <StyledTableWrapper>
      <TransactionTable aria-labelledby={titleId} data={filteredTransactionData} />
    </StyledTableWrapper>
  );

  return props.transactions.length === 0 ? (
    <StyledTitle id={titleId}>No transactions found</StyledTitle>
  ) : (
    <>
      <StyledTitle id={titleId}>Transactions history</StyledTitle>
      <StyledWrapper variant='bordered' {...props}>
        <StyledStack>
          <StyledTabs panel={table} onSelectionChange={(e) => setTab(e as string)}>
            {tabKeys.map((key) => (
              <TabsItem key={key} title={t(key)}>
                {null}
              </TabsItem>
            ))}
          </StyledTabs>
          <CTALink to={PAGES.TRANSACTIONS} variant='outlined' size='small'>
            {'View All >'}
          </CTALink>
        </StyledStack>
      </StyledWrapper>
    </>
  );
};

export { TransactionHistory };
export type { TransactionHistoryProps };
