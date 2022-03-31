
import * as React from 'react';
import clsx from 'clsx';

import TitleWithUnderline from 'components/TitleWithUnderline';
import InterlayDefaultOutlinedButton from 'components/buttons/InterlayDefaultOutlinedButton';
import InterlayModal, { InterlayModalInnerWrapper } from 'components/UI/InterlayModal';
import { GOVERNANCE_TOKEN_SYMBOL } from 'config/relay-chains';

const GetGovernanceTokenUI = (): JSX.Element => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const focusRef = React.useRef(null);

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <InterlayDefaultOutlinedButton
        className='m-4'
        onClick={handleModalOpen}>
        Get {GOVERNANCE_TOKEN_SYMBOL}
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
          <TitleWithUnderline text={`Get ${GOVERNANCE_TOKEN_SYMBOL}`} />
        </InterlayModalInnerWrapper>
      </InterlayModal>
    </>
  );
};

export default GetGovernanceTokenUI;
