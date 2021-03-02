import React from 'react';
import ParachainSecurity from '../components/parachain-security';
import BtcRelay from '../components/btc-relay';
import OracleStatus from '../components/oracle-status';
const Row2 = (): React.ReactElement => {
  return (
    <div className='row-grid section-top-gap section-bottom-gap'>
      <ParachainSecurity linkButton={true} />
      <BtcRelay linkButton={true} />
      <OracleStatus linkButton={true} />
    </div>
  );
};

export default Row2;
