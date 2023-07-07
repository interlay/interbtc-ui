import { Currency, MonetaryAmount } from '@interlay/monetary-js';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Dd, Dl, DlGroup, Dt, Flex, P } from '@/component-library';

type RequestLimitsCardProps = {
  title: ReactNode;
  singleRequestLimit: MonetaryAmount<Currency>;
  maxRequestLimit?: MonetaryAmount<Currency>;
};

const RequestLimitsCard = ({ title, singleRequestLimit, maxRequestLimit }: RequestLimitsCardProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='spacing2'>
      <P size='xs'>{title}</P>
      <Card gap='spacing4' variant='bordered' background='tertiary' rounded='lg' padding='spacing4' shadowed={false}>
        <Dl direction='column' gap='spacing2'>
          <DlGroup justifyContent='space-between' flex='1'>
            <Dt size='xs' color='primary'>
              {t('btc.in_single_request')}
            </Dt>
            <Dd size='xs'>
              {singleRequestLimit.toHuman()} {singleRequestLimit.currency.ticker}
            </Dd>
          </DlGroup>
          {maxRequestLimit && (
            <DlGroup justifyContent='space-between' flex='1'>
              <Dt size='xs' color='primary'>
                {t('btc.in_total')}
              </Dt>
              <Dd size='xs'>
                {maxRequestLimit.toHuman()} {maxRequestLimit.currency.ticker}
              </Dd>
            </DlGroup>
          )}
        </Dl>
      </Card>
    </Flex>
  );
};

export { RequestLimitsCard };
export type { RequestLimitsCardProps };
