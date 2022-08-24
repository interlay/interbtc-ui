import { useId } from '@react-aria/utils';
import { HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CTA, TabsItem } from '@/component-library';

import { StyledStack, StyledTableWrapper, StyledTabs, StyledTitle, StyledWrapper } from './TransactionHistory.styles';
import { TransactionTable } from './TransactionTable';

const data = [
  {
    request: 'Issue',
    date: 'Feb 24 2022 17:19:43',
    amount: '0.3234',
    status: 'pending' as any
  },
  {
    request: 'Issue',
    date: 'Feb 24 2022 17:19:43',
    amount: '0.3234',
    status: 'completed'
  },
  {
    request: 'Issue',
    date: 'Feb 24 2022 17:19:43',
    amount: '0.3234',
    status: 'canceled'
  }
];

type NativeAttrs = HTMLAttributes<unknown>;

type TransactionHistoryProps = NativeAttrs;

const tabKeys = ['all', 'pending', 'issue', 'redeem', 'replace'] as const;

const TransactionHistory = (props: TransactionHistoryProps): JSX.Element => {
  const { t } = useTranslation();
  const titleId = useId();
  const [, setTab] = useState<string>('all');

  const table = (
    <StyledTableWrapper>
      <TransactionTable aria-labelledby={titleId} data={data} />
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
