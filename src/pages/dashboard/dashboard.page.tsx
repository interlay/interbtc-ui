import React, { ReactElement } from 'react';
import TimerIncrement from '../../common/components/timer-increment';
import { useTranslation } from 'react-i18next';

import './dashboard.page.scss';
import Row1 from './rows/row1';
import Row2 from './rows/row2';
import Row3 from './rows/row3';
import TestnetBanner from '../../common/components/testnet-banner';

export default function DashboardPage(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className='main-container'>
      <TestnetBanner></TestnetBanner>
      <div className='title-container'>
        <div className='title-text-container'>
          <h1 className='title-text'>{t('dashboard.dashboard')}</h1>
          <p className='latest-block-text'>
            <TimerIncrement></TimerIncrement>
          </p>
        </div>
      </div>
      <div className='dashboard-items-container'>
        <div className='rows-container'>
          <Row1 />
          <div className='section-div-line'></div>
          <Row2 />
          <div className='section-div-line'></div>
          <Row3 />
        </div>
      </div>
    </div>
  );
}
