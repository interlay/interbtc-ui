
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import TitleWithUnderline from 'components/TitleWithUnderline';
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';
import InterlayModal, { InterlayModalInnerWrapper } from 'components/UI/InterlayModal';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';

const GetGovernanceTokenUI = (): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const focusRef = React.useRef(null);
  const { t } = useTranslation();

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getGovernanceTokenLabel = t('get_governance_token', {
    governanceTokenSymbol: GOVERNANCE_TOKEN_SYMBOL
  });

  return (
    <>
      <InterlayDefaultOutlinedButton
        className='m-4'
        onClick={handleModalOpen}>
        {getGovernanceTokenLabel}
      </InterlayDefaultOutlinedButton>
      <InterlayModal
        initialFocus={focusRef}
        open={modalOpen}
        onClose={handleModalClose}>
        <InterlayModalInnerWrapper
          className={clsx(
            'p-6',
            'max-w-lg'
          )}>
          <TitleWithUnderline text={getGovernanceTokenLabel} />
        </InterlayModalInnerWrapper>
      </InterlayModal>
    </>
  );
};

export default GetGovernanceTokenUI;
